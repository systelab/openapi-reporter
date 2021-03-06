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

import { RequestParent } from './requestParent';

export interface RequestLocation {
	/**
	 * This can point to either a project or a parent item at which this item is located, not both.
	 */
	parent: RequestParent;

}


