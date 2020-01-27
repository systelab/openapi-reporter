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

import { Attachment } from './attachment';
import { Link } from './link';
import { MetaWrapper } from './metaWrapper';

export interface AttachmentDataWrapper {
	data?: Attachment;

	links?: { [key: string]: Link; };

	linked?: { [key: string]: { [key: string]: any; }; };

	meta?: MetaWrapper;

}


