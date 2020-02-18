import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ProgressData } from '@model';
import { JamaRESTAPISpec, JamaRESTAPIAction, JamaRESTAPIEndpointGroup, JamaRESTAPIEndpoint } from '@model';
import { JamaRESTAPIExample, JamaRESTAPIDataType } from '@model';
import { SpecReportData, SpecEndpointGroupData, SpecEndpointData, SpecEndpointExample } from '@model';
import { SpecModelData } from '@model';
import { ItemsService, RequestItem, CreatedResponse } from '@jama';
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

		await this.createMissingItems(jamaSpec);

		this.setEndpointMissingModelIds(jamaSpec);
		this.setDataTypeMissingModelIds(jamaSpec);

		await this.uploadEndpoints(jamaSpec);
		await this.uploadDataTypes(jamaSpec);

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

	private async createMissingItems(jamaSpec: JamaRESTAPISpec): Promise<void> {

		if (jamaSpec.endpointsFolderAction === JamaRESTAPIAction.Create) {
			jamaSpec.endpointsFolderId = await this.createFolder(jamaSpec.projectId, jamaSpec.setId, 'Endpoints');
			jamaSpec.endpointsFolderAction = JamaRESTAPIAction.NoAction;
			this.addProgressStep();
		}

		// TODO: Create missing endpoint items

		if (jamaSpec.dataTypesFolderAction === JamaRESTAPIAction.Create) {
			jamaSpec.dataTypesFolderId = await this.createFolder(jamaSpec.projectId, jamaSpec.setId, 'Data Types');
			jamaSpec.dataTypesFolderAction = JamaRESTAPIAction.NoAction;
			this.addProgressStep();
		}

		// TODO: Create missing data type items
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

	private uploadEndpoints(jamaSpec: JamaRESTAPISpec) {

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

	private uploadDataTypes(jamaSpec: JamaRESTAPISpec) {

		// for (const jamaDataType of jamaSpec.dataTypes) {
		// 	if (jamaDataType.action === JamaRESTAPIAction.Update) {
		// 		const newDescription = this.jamaDataTypeFormatter.formatDescription(jamaDataType);
		// 		if (jamaDataType.description === newDescription) {
		// 			jamaDataType.action = JamaRESTAPIAction.NoAction;
		// 		}
		// 	}
		// }
	}

	private async createFolder(projectId: number, parentItemId: number, folderName: string): Promise<number> {

		const body: RequestItem = {
			project: projectId,
			itemType: 32, // Folder
			childItemType: undefined,
			location: {
				parent: {
					project: projectId,
					item: parentItemId
				}
			},
			fields: {
				name: folderName,
				description: folderName
			}
		}

		const createItemResponse: CreatedResponse = await this.itemsService.addItem(body).toPromise();
		if (createItemResponse) {
			return createItemResponse.id;
		}
	}

	private addProgressStep(): void {
		const newProgress = this.uploadProgress.value;
		newProgress.current = Math.min(this.uploadProgress.value.current + 1, this.uploadProgress.value.total);
		this.uploadProgress.next(newProgress);
	}
}
