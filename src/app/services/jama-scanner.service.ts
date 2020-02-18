import { Injectable } from '@angular/core';

import { ProgressData } from '@model';
import { JamaRESTAPISpec, JamaRESTAPIAction, JamaRESTAPIEndpointGroup, JamaRESTAPIEndpoint } from '@model';
import { JamaRESTAPIExample, JamaRESTAPIDataType } from '@model';
import { SpecReportData, SpecEndpointGroupData, SpecEndpointData, SpecEndpointExample } from '@model';
import { SpecModelData } from '@model';
import { ItemsService, ItemDataListWrapper } from '@jama';
import { JAMAEndpointFormatterService } from './jama-endpoint-formatter.service';
import { JAMADataTypeFormatterService } from './jama-data-type-formatter.service';


@Injectable({
	providedIn: 'root'
})
export class JAMAScannerService {

	constructor(private itemsService: ItemsService,
				private jamaEndpointFormatter: JAMAEndpointFormatterService,
				private jamaDataTypeFormatter: JAMADataTypeFormatterService) {
	}

	public async scanProject(specSetId: number, specItemTypeId: number,
							specReport: SpecReportData, progress: ProgressData): Promise<JamaRESTAPISpec> {

		const jamaSpec: JamaRESTAPISpec = await this.scanTopLevelItems(specSetId, specItemTypeId);
		progress = { ...progress, current: 10 };

		await this.scanEndpointGroups(jamaSpec, specReport.endpointGroups);
		progress = { ...progress, current: 50 };

		await this.scanDataTypes(jamaSpec, specReport.models);
		progress = { ...progress, current: 90 };

		this.setEndpointMissingModelIds(jamaSpec);
		this.setDataTypeMissingModelIds(jamaSpec);
		this.detectUnchangedEndpoints(jamaSpec);
		this.detectUnchangedDataTypes(jamaSpec);
		progress = { ...progress, current: 100 };

		return jamaSpec;
	}

	private async scanTopLevelItems(specSetId: number, specItemTypeId: number): Promise<JamaRESTAPISpec> {

		let endpointsFolderId = -1;
		let dataTypesFolderId = -1;

		let totalItems = 1;
		let found = false;
		for (let startIndex = 0; (startIndex < totalItems) && !found; startIndex += 20) {

			const itemsData: ItemDataListWrapper = await this.itemsService.getChildItems(specSetId, startIndex, 20).toPromise();
			totalItems = itemsData.meta.pageInfo.totalResults;

			const nItems = itemsData.data.length;
			for (let i = 0; (i < nItems) && !found; i++) {
				if (itemsData.data[i].itemType === 32) {
					if (itemsData.data[i].fields.name === 'Endpoints') {
						endpointsFolderId = itemsData.data[i].id;
					} else if (itemsData.data[i].fields.name === 'Data Types') {
						dataTypesFolderId = itemsData.data[i].id;
					}
				}

				found = (endpointsFolderId !== -1) && (dataTypesFolderId !== -1);
			}
		}

		const jamaSpec: JamaRESTAPISpec = {
			setId: specSetId,
			specItemTypeId: specItemTypeId,

			endpointsFolderAction: (endpointsFolderId === -1) ? JamaRESTAPIAction.Create : JamaRESTAPIAction.NoAction,
			endpointsFolderId: endpointsFolderId,
			endpointGroups: [],

			dataTypesFolderAction: (dataTypesFolderId === -1) ? JamaRESTAPIAction.Create : JamaRESTAPIAction.NoAction,
			dataTypesFolderId: dataTypesFolderId,
			dataTypes: []
		};

		return jamaSpec;
	}

	private async scanEndpointGroups(jamaSpec: JamaRESTAPISpec,
									endpointGroups: SpecEndpointGroupData[]): Promise<void> {

		const endpointsFolderId = jamaSpec.endpointsFolderId;
		const specItemTypeId = jamaSpec.specItemTypeId;

		const pageSize = 20;
		let totalItems = (endpointsFolderId > 0) ? 1 : 0;
		for (let startIndex = 0; startIndex < totalItems; startIndex += pageSize) {

			const itemsData: ItemDataListWrapper = await this.itemsService.getChildItems(endpointsFolderId, startIndex, pageSize).toPromise();
			totalItems = itemsData.meta.pageInfo.totalResults;

			const nItems = itemsData.data.length;
			for (let i = 0; i < nItems; i++) {
				if (itemsData.data[i].itemType === 32) {
					const groupName = itemsData.data[i].fields.name;
					const endpointGroup: SpecEndpointGroupData = endpointGroups.find((eg) => eg.name === groupName);
					if (endpointGroup) {
						// Group found, keep it
						endpointGroup.id = itemsData.data[i].id;
						const jamaEndpointGroupToKeep: JamaRESTAPIEndpointGroup = {
							action: JamaRESTAPIAction.NoAction,
							folderId: endpointGroup.id,
							name: itemsData.data[i].fields.name,
							endpoints: []
						};

						this.scanEndpoints(specItemTypeId, jamaEndpointGroupToKeep, endpointGroup);
						jamaSpec.endpointGroups.push(jamaEndpointGroupToKeep);

					} else {
						// Group not found in spec, delete it
						const jamaEndpointGroupToDelete: JamaRESTAPIEndpointGroup = {
							action: JamaRESTAPIAction.Delete,
							folderId: itemsData.data[i].id,
							name: itemsData.data[i].fields.name,
							endpoints: []
						};
						jamaSpec.endpointGroups.push(jamaEndpointGroupToDelete);
					}
				} else {
					// Not a folder, delete it
					const itemToDelete: JamaRESTAPIEndpointGroup = {
						action: JamaRESTAPIAction.Delete,
						folderId: itemsData.data[i].id,
						name: itemsData.data[i].fields.name,
						endpoints: []
					};
					jamaSpec.endpointGroups.push(itemToDelete);
				}
			}
		}

		for (let j = 0; j < endpointGroups.length; j++) {
			if (!endpointGroups[j].id) {
				const groupName = endpointGroups[j].name;
				const jamaEndpointGroupToCreate: JamaRESTAPIEndpointGroup = {
					action: JamaRESTAPIAction.Create,
					folderId: -1,
					name: groupName,
					endpoints: []
				};
				this.scanEndpoints(specItemTypeId, jamaEndpointGroupToCreate, endpointGroups[j]);
				jamaSpec.endpointGroups.push(jamaEndpointGroupToCreate);
			}
		}
	}

	private async scanEndpoints(specItemType: number,
								jamaEndpointGroup: JamaRESTAPIEndpointGroup,
								endpointGroup: SpecEndpointGroupData): Promise<void> {
		const pageSize = 20;
		const groupFolderId = jamaEndpointGroup.folderId;
		let totalItems = (groupFolderId > 0) ? 1 : 0;
		for (let startIndex = 0; startIndex < totalItems; startIndex += pageSize) {

			const itemsData: ItemDataListWrapper =
				await this.itemsService.getChildItems(groupFolderId, startIndex, pageSize).toPromise();
			totalItems = itemsData.meta.pageInfo.totalResults;

			const nItems = itemsData.data.length;
			for (let i = 0; i < nItems; i++) {
				if (itemsData.data[i].itemType === specItemType) {
					const endpointSpecName = itemsData.data[i].fields.name;
					const endpoint: SpecEndpointData = endpointGroup.endpoints
						.find((e) => (e.method.toUpperCase() + ' ' + e.url) === endpointSpecName);
					if (endpoint) {
						// Endpoint found, update it
						endpoint.id = itemsData.data[i].id;
						const jamaEndpointToUpdate: JamaRESTAPIEndpoint = {
							action: JamaRESTAPIAction.Update,
							specItemId: endpoint.id,
							title: endpointSpecName,
							description: itemsData.data[i].fields.description,
							data: endpoint,
							examples: []
						};
						this.scanEndpointExamples(jamaEndpointToUpdate, endpoint);
						jamaEndpointGroup.endpoints.push(jamaEndpointToUpdate);
					} else {
						// Endpoint not found in spec, delete it
						const jamaEndpointToDelete: JamaRESTAPIEndpoint = {
							action: JamaRESTAPIAction.Delete,
							specItemId: itemsData.data[i].id,
							title: endpointSpecName,
							description: itemsData.data[i].fields.description,
							data: null,
							examples: []
						};
						jamaEndpointGroup.endpoints.push(jamaEndpointToDelete);
					}
				} else {
					// Not an specification, delete it
					const itemToDelete: JamaRESTAPIEndpoint = {
						action: JamaRESTAPIAction.Delete,
						specItemId: itemsData.data[i].id,
						title: itemsData.data[i].fields.name,
						data: null,
						examples: []
					};
					jamaEndpointGroup.endpoints.push(itemToDelete);
				}
			}
		}

		for (let j = 0; j < endpointGroup.endpoints.length; j++) {
			if (!endpointGroup.endpoints[j].id) {
				const endpointTitle = endpointGroup.endpoints[j].method.toUpperCase() + ' ' +
										endpointGroup.endpoints[j].url;
				const jamaEndpointToCreate: JamaRESTAPIEndpoint = {
					action: JamaRESTAPIAction.Create,
					specItemId: -1,
					title: endpointTitle,
					data: endpointGroup.endpoints[j],
					examples: []
				};
				this.scanEndpointExamples(jamaEndpointToCreate, endpointGroup.endpoints[j]);
				jamaEndpointGroup.endpoints.push(jamaEndpointToCreate);
			}
		}
	}

	private async scanEndpointExamples(jamaEndpoint: JamaRESTAPIEndpoint,
										endpoint: SpecEndpointData): Promise<void> {

		const pageSize = 20;
		const endpointSpecId = jamaEndpoint.specItemId;
		let totalItems = (endpointSpecId > 0) ? 1 : 0;
		for (let startIndex = 0; startIndex < totalItems; startIndex += pageSize) {

			const itemsData: ItemDataListWrapper =
				await this.itemsService.getChildItems(endpointSpecId, startIndex, pageSize).toPromise();
			totalItems = itemsData.meta.pageInfo.totalResults;

			const nItems = itemsData.data.length;
			for (let i = 0; i < nItems; i++) {
				if (itemsData.data[i].itemType === 33) {
					const exampleName = itemsData.data[i].fields.name;
					const example: SpecEndpointExample = endpoint.examples.find((e) => e.title === exampleName);
					if (example) {
						// Example found, update it
						example.id = itemsData.data[i].id;
						const jamaExampleToUpdate: JamaRESTAPIExample = {
							action: JamaRESTAPIAction.Update,
							textItemId: example.id,
							title: exampleName,
							description: itemsData.data[i].fields.description
						};
						jamaEndpoint.examples.push(jamaExampleToUpdate);
					} else {
						// Example not found in spec, delete it
						const jamaExampleToDelete: JamaRESTAPIExample = {
							action: JamaRESTAPIAction.Delete,
							textItemId: itemsData.data[i].id,
							title: exampleName,
							description: itemsData.data[i].fields.description
						};
						jamaEndpoint.examples.push(jamaExampleToDelete);
					}
				} else {
					// Not a text, delete it
					const itemToDelete: JamaRESTAPIExample = {
						action: JamaRESTAPIAction.Delete,
						textItemId: itemsData.data[i].id,
						title: itemsData.data[i].fields.name,
						description: null
					};
					jamaEndpoint.examples.push(itemToDelete);
				}
			}
		}

		for (let j = 0; j < endpoint.examples.length; j++) {
			if (!endpoint.examples[j].id) {
				const exampleTitle = endpoint.examples[j].title;
				const jamaExampleToCreate: JamaRESTAPIExample = {
					action: JamaRESTAPIAction.Create,
					textItemId: -1,
					title: exampleTitle,
					description: endpoint.examples[j].description
				};
				jamaEndpoint.examples.push(jamaExampleToCreate);
			}
		}
	}

	private async scanDataTypes(jamaSpec: JamaRESTAPISpec,
								models: SpecModelData[]): Promise<void> {

		const dataTypesFolderId = jamaSpec.dataTypesFolderId;
		const specItemTypeId = jamaSpec.specItemTypeId;

		const pageSize = 20;
		let totalItems = (dataTypesFolderId > 0) ? 1 : 0;
		for (let startIndex = 0; startIndex < totalItems; startIndex += pageSize) {

			const itemsData: ItemDataListWrapper = await this.itemsService.getChildItems(dataTypesFolderId, startIndex, pageSize).toPromise();
			totalItems = itemsData.meta.pageInfo.totalResults;

			const nItems = itemsData.data.length;
			for (let i = 0; i < nItems; i++) {
				if (itemsData.data[i].itemType === specItemTypeId) {
					const dataTypeName = itemsData.data[i].fields.name;
					const model: SpecModelData = models.find((m) => (m.name + ' data type') === dataTypeName);
					if (model) {
						// Data type found, update it
						model.id = itemsData.data[i].id;
						const jamaDataTypeToUpdate: JamaRESTAPIDataType = {
							action: JamaRESTAPIAction.Update,
							specItemId: model.id,
							title: dataTypeName,
							data: model,
							examples: []
						};
						jamaSpec.dataTypes.push(jamaDataTypeToUpdate);

					} else {
						// Data type not found in spec, delete it
						const jamaDataTypeToDelete: JamaRESTAPIDataType = {
							action: JamaRESTAPIAction.Delete,
							specItemId: itemsData.data[i].id,
							title: itemsData.data[i].fields.name,
							data: null,
							description: itemsData.data[i].fields.description,
							examples: []
						};
						jamaSpec.dataTypes.push(jamaDataTypeToDelete);
					}
				} else {
					// Not an specification, delete it
					const itemToDelete: JamaRESTAPIDataType = {
						action: JamaRESTAPIAction.Delete,
						specItemId: itemsData.data[i].id,
						title: itemsData.data[i].fields.name,
						data: null,
						examples: []
					};
					jamaSpec.dataTypes.push(itemToDelete);
				}
			}
		}

		for (let j = 0; j < models.length; j++) {
			if (!models[j].id) {
				const dataTypeName = models[j].name + ' data type';
				const jamaDataTypeToCreate: JamaRESTAPIDataType = {
					action: JamaRESTAPIAction.Create,
					specItemId: -1,
					title: dataTypeName,
					data: models[j],
					examples: []
				};
				jamaSpec.dataTypes.push(jamaDataTypeToCreate);
			}
		}
	}

	private setEndpointMissingModelIds(jamaSpec: JamaRESTAPISpec) {

		for (const jamaEndpointGroup of jamaSpec.endpointGroups) {
			for (const jamaEndpoint of jamaEndpointGroup.endpoints) {
				if (!!jamaEndpoint.data) {
					// Request body data type
					if (!!jamaEndpoint.data.requestBody) {
						if (!!jamaEndpoint.data.requestBody.modelName) {
							const modelId = this.getModelIdByName(jamaSpec, jamaEndpoint.data.requestBody.modelName);
							if (!!modelId) {
								jamaEndpoint.data.requestBody.modelId = modelId;
							}
						}
					}

					// Responses
					for (const response of jamaEndpoint.data.responses) {
						if (!!response.modelName) {
							const modelId = this.getModelIdByName(jamaSpec, response.modelName);
							if (!!modelId) {
								response.modelId = modelId;
							}
						}
					}
				}
			}
		}
	}

	private setDataTypeMissingModelIds(jamaSpec: JamaRESTAPISpec) {

		for (const jamaDataType of jamaSpec.dataTypes) {
			if (!!jamaDataType.data) {
				for (const dataTypeProperty of jamaDataType.data.properties) {
					if (!dataTypeProperty.typeBasic && !!dataTypeProperty.typeName) {
						const modelId = this.getModelIdByName(jamaSpec, dataTypeProperty.typeName);
						if (!!modelId) {
							dataTypeProperty.typeId = modelId;
						}
					}
				}
			}
		}
	}

	private getModelIdByName(jamaSpec: JamaRESTAPISpec, modelName: string): number {

		const dataType: JamaRESTAPIDataType = jamaSpec.dataTypes.find((dt: JamaRESTAPIDataType) => dt.data.name === modelName);
		if (dataType) {
			return dataType.specItemId;
		}
	}

	private detectUnchangedEndpoints(jamaSpec: JamaRESTAPISpec) {

		for (const jamaEndpointGroup of jamaSpec.endpointGroups) {
			for (const jamaEndpoint of jamaEndpointGroup.endpoints) {
				if (jamaEndpoint.action === JamaRESTAPIAction.Update) {
					const newDescription = this.jamaEndpointFormatter.formatDescription(jamaEndpoint);
					if (jamaEndpoint.description === newDescription) {
						jamaEndpoint.action = JamaRESTAPIAction.NoAction;
					}
				}
			}
		}
	}

	private detectUnchangedDataTypes(jamaSpec: JamaRESTAPISpec) {

		for (const jamaDataType of jamaSpec.dataTypes) {
			if (jamaDataType.action === JamaRESTAPIAction.Update) {
				const newDescription = this.jamaDataTypeFormatter.formatDescription(jamaDataType);
				if (jamaDataType.description === newDescription) {
					jamaDataType.action = JamaRESTAPIAction.NoAction;
				}
			}
		}
	}
}
