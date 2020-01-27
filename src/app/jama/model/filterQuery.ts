/**
 * Jama REST API
 * This is the documentation for the Jama REST API.
 *
 * OpenAPI spec version: latest
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { FilterOrderRule } from './filterOrderRule';
import { FilterRule } from './filterRule';

export interface FilterQuery {
	name: string;

	rule: FilterRule;

	orderRules: Array<FilterOrderRule>;

}


