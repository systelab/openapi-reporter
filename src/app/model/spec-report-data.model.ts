import { SpecEndpointData } from './spec-endpoint-data.model';
import { SpecModelData } from './spec-model-data.model';
import { SpecSummaryData } from './spec-summary-data.model';

export class SpecReportData {
	title: string;
	version: string;
	summary: SpecSummaryData;
	endpoints: SpecEndpointData[];
	models: SpecModelData[];
}
