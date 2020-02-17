import { Injectable } from '@angular/core';

import { JamaRESTAPISpec, SpecReportData, ProgressData, SpecEndpointData, SpecModelData, SpecEndpointGroupData } from '@model';
import { ItemsService, ItemDataListWrapper } from '@jama';


@Injectable({
	providedIn: 'root'
})
export class JAMAScannerService {

	constructor(private itemsService: ItemsService) {
	}

	public async scanProject(specSetId: number, specReport: SpecReportData, progress: ProgressData): Promise<JamaRESTAPISpec> {

		const jamaRESTAPISpec: JamaRESTAPISpec = await this.scanTopLevelItems(specSetId);

		await this.scanEndpointGroups(specSetId, jamaRESTAPISpec, specReport.endpointGroups);
		await this.scanDataTypes(specSetId, jamaRESTAPISpec, specReport.models);

		return jamaRESTAPISpec;
	}

	private async scanTopLevelItems(specSetId: number): Promise<JamaRESTAPISpec> {

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

		const jamaRESTAPISpec: JamaRESTAPISpec = {
			setId: specSetId,
			endpointsFolderId: endpointsFolderId,
			endpointGroups: [],
			dataTypesFolderId: dataTypesFolderId,
			dataTypes: []
		};

		return jamaRESTAPISpec;
	}

	private async scanEndpointGroups(specSetId: number, jamaRESTAPISpec: JamaRESTAPISpec,
									endpointGroups: SpecEndpointGroupData[]): Promise<void> {

	}

	private async scanDataTypes(specSetId: number, jamaRESTAPISpec: JamaRESTAPISpec,
								models: SpecModelData[]): Promise<void> {

	}

}
