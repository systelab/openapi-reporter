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

export interface PickListOption {
	/**
	 * ID of a pick list
	 */
	pickList?: number;

	id: number;

	name: string;

	description: string;

	value?: string;

	default: boolean;

	active: boolean;

	color: string;

	sortOrder: number;

}


