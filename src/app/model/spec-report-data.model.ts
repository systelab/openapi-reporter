import { SpecEndpointData } from './spec-endpoint-data.model';
import { SpecModelData } from './spec-model-data.model';
import { SpecSummaryData } from './spec-summary-data.model';


export class SpecReportData {
	title: string;
	version: string;
	summary: SpecSummaryData;
	endpointGroups: SpecEndpointGroupData[];
	models: SpecModelData[];
}

export class SpecEndpointGroupData {
	id?: number;
	name: string;
	endpoints: SpecEndpointData[];
}
