import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ProgressData } from '@model';
import { JamaRESTAPISpec, JamaRESTAPIAction, JamaRESTAPIEndpointGroup, JamaRESTAPIEndpoint } from '@model';
import { JamaRESTAPIExample, JamaRESTAPIDataType } from '@model';
import { SpecReportData, SpecEndpointGroupData, SpecEndpointData, SpecEndpointExample } from '@model';
import { SpecModelData } from '@model';
import { ItemsService, RequestItem, CreatedResponse, AbstractRestResponse } from '@jama';
import { JAMAEndpointFormatterService } from './jama-endpoint-formatter.service';
import { JAMADataTypeFormatterService } from './jama-data-type-formatter.service';


@Injectable({
	providedIn: 'root'
})
export class JAMAUploaderService {

	private uploadProgress = new BehaviorSubject<ProgressData>(null);
	public uploadProgress$ = this.uploadProgress.asObservable();

	constructor(private itemsService: ItemsService,
				private jamaEndpointFormatter: JAMAEndpointFormatterService,
				private jamaDataTypeFormatter: JAMADataTypeFormatterService) {
	}

	public async uploadProject(jamaSpec: JamaRESTAPISpec): Promise<void> {

		this.uploadProgress.next({running: true, current: 0, total: this.getAPIStepsCount(jamaSpec)});
		console.log(this.uploadProgress.value);

		await this.updateTreeStructure(jamaSpec);

		this.setEndpointMissingModelIds(jamaSpec);
		this.setDataTypeMissingModelIds(jamaSpec);

		await this.updateEndpointDescriptions(jamaSpec);
		await this.updateDataTypeDescriptions(jamaSpec);

		this.uploadProgress.next({running: true, current: 100, total: 100});
		this.uploadProgress.next(null);
	}

	private getAPIStepsCount(jamaSpec: JamaRESTAPISpec): number {

		let nSteps = 0;

		if (jamaSpec.endpointsFolderAction === JamaRESTAPIAction.Create) {
			nSteps++;
		}

		for (const endpointGroup of jamaSpec.endpointGroups) {

			if (endpointGroup.action !== JamaRESTAPIAction.NoAction) {
				nSteps++;
			}

			for (const endpoint of endpointGroup.endpoints) {

				if (endpoint.action !== JamaRESTAPIAction.NoAction) {
					nSteps++;
					if (endpoint.action === JamaRESTAPIAction.Create) {
						nSteps++;
					}
				}

				for (const example of endpoint.examples) {
					if (example.action !== JamaRESTAPIAction.NoAction) {
						nSteps++;
					}
				}
			}
		}

		if (jamaSpec.dataTypesFolderAction === JamaRESTAPIAction.Create) {
			nSteps++;
		}

		for (const dataType of jamaSpec.dataTypes) {

			if (dataType.action !== JamaRESTAPIAction.NoAction) {
				nSteps++;
				if (dataType.action === JamaRESTAPIAction.Create) {
					nSteps++;
				}
			}
		}

		return nSteps;
	}

	private async updateTreeStructure(jamaSpec: JamaRESTAPISpec): Promise<void> {

		if (jamaSpec.endpointsFolderAction === JamaRESTAPIAction.Create) {
			jamaSpec.endpointsFolderId = await this.createFolder(jamaSpec.projectId, jamaSpec.specItemTypeId, jamaSpec.setId, 'Endpoints');
			jamaSpec.endpointsFolderAction = JamaRESTAPIAction.NoAction;
			this.addProgressStep();
		}

		for (const jamaEndpointGroup of jamaSpec.endpointGroups) {
			await this.updateEndpointGroupFolder(jamaSpec, jamaEndpointGroup);

			for (const jamaEndpoint of jamaEndpointGroup.endpoints) {
				await this.updateEndpointSpecification(jamaSpec, jamaEndpoint, jamaEndpointGroup.folderId);
			}
		}

		if (jamaSpec.dataTypesFolderAction === JamaRESTAPIAction.Create) {
			jamaSpec.dataTypesFolderId = await this.createFolder(jamaSpec.projectId, jamaSpec.specItemTypeId, jamaSpec.setId, 'Data Types');
			jamaSpec.dataTypesFolderAction = JamaRESTAPIAction.NoAction;
			this.addProgressStep();
		}

		// TODO: Create missing data type items
	}

	private async updateEndpointGroupFolder(jamaSpec: JamaRESTAPISpec, jamaEndpointGroup: JamaRESTAPIEndpointGroup): Promise<void> {

		if (jamaEndpointGroup.action === JamaRESTAPIAction.Create) {
			// Create folder for endpoint group
			const projectId = jamaSpec.projectId;
			const specItemTypeId = jamaSpec.specItemTypeId;
			const parentItemId = jamaSpec.endpointsFolderId;
			const folderName = jamaEndpointGroup.name;
			jamaEndpointGroup.folderId = await this.createFolder(projectId, specItemTypeId, parentItemId, folderName);
			jamaSpec.endpointsFolderAction = JamaRESTAPIAction.NoAction;
			this.addProgressStep();

		} else if (jamaEndpointGroup.action === JamaRESTAPIAction.Delete) {
			// Delete folder for endpoint group
			await this.deleteItem(jamaEndpointGroup.folderId);
			jamaEndpointGroup.action = JamaRESTAPIAction.NoAction;
			this.addProgressStep();
		}
	}

	private async updateEndpointSpecification(jamaSpec: JamaRESTAPISpec, jamaEndpoint: JamaRESTAPIEndpoint,
												endpointGroupFolderId: number): Promise<void> {

		if (jamaEndpoint.action === JamaRESTAPIAction.Create) {
			// Create specification for endpoint
			const projectId = jamaSpec.projectId;
			const specItemTypeId = jamaSpec.specItemTypeId;
			const specName = jamaEndpoint.title;
			jamaEndpoint.specItemId = await this.createSpecification(projectId, specItemTypeId, endpointGroupFolderId, specName);
			jamaSpec.endpointsFolderAction = JamaRESTAPIAction.Update;
			this.addProgressStep();

		} else if (jamaEndpoint.action === JamaRESTAPIAction.Delete) {
			// Delete specification for endpoint
			await this.deleteItem(jamaEndpoint.specItemId);
			jamaEndpoint.action = JamaRESTAPIAction.NoAction;
			this.addProgressStep();
		}
	}

	private async updateEndpointExampleText(jamaSpec: JamaRESTAPISpec, jamaExample: JamaRESTAPIExample): Promise<void> {
		// TODO
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

	private updateEndpointDescriptions(jamaSpec: JamaRESTAPISpec) {

		// for (const jamaEndpointGroup of jamaSpec.endpointGroups) {
		// 	for (const jamaEndpoint of jamaEndpointGroup.endpoints) {
		// 		if (jamaEndpoint.action === JamaRESTAPIAction.Update) {
		// 			const newDescription = this.jamaEndpointFormatter.formatDescription(jamaEndpoint);
		// 			if (jamaEndpoint.description === newDescription) {
		// 				jamaEndpoint.action = JamaRESTAPIAction.NoAction;
		// 			}
		// 		}
		// 	}
		// }
	}

	private updateDataTypeDescriptions(jamaSpec: JamaRESTAPISpec) {

		// for (const jamaDataType of jamaSpec.dataTypes) {
		// 	if (jamaDataType.action === JamaRESTAPIAction.Update) {
		// 		const newDescription = this.jamaDataTypeFormatter.formatDescription(jamaDataType);
		// 		if (jamaDataType.description === newDescription) {
		// 			jamaDataType.action = JamaRESTAPIAction.NoAction;
		// 		}
		// 	}
		// }
	}

	private async createFolder(projectId: number, specItemTypeId: number, parentItemId: number, folderName: string): Promise<number> {

		const body: RequestItem = {
			project: projectId,
			itemType: 32, // Folder
			childItemType: specItemTypeId,
			location: {
				parent: {
					item: parentItemId
				}
			},
			fields: {
				name: folderName,
				description: folderName
			}
		};

		const createItemResponse: CreatedResponse = await this.itemsService.addItem(body).toPromise();
		if (createItemResponse) {
			return createItemResponse.id;
		}
	}

	private async createSpecification(projectId: number, specItemTypeId: number, parentItemId: number, specName: string): Promise<number> {

		const body: RequestItem = {
			project: projectId,
			itemType: specItemTypeId,
			childItemType: undefined,
			location: {
				parent: {
					item: parentItemId
				}
			},
			fields: {
				name: specName,
				description: ''
			}
		};

		const createItemResponse: CreatedResponse = await this.itemsService.addItem(body).toPromise();
		if (createItemResponse) {
			return createItemResponse.id;
		}
	}

	private async deleteItem(itemId: number): Promise<void> {

		await this.itemsService.deleteItem(itemId).toPromise();
	}

	private addProgressStep(): void {
		const newProgress = this.uploadProgress.value;
		newProgress.current = Math.min(this.uploadProgress.value.current + 1, this.uploadProgress.value.total);
		this.uploadProgress.next(newProgress);
	}
}
