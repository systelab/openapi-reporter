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

/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import '../rxjs-operators';

import { ItemTypeDataListWrapper } from '../model/itemTypeDataListWrapper';
import { ItemTypeDataWrapper } from '../model/itemTypeDataWrapper';

import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class ItemtypesService {

	protected basePath = 'https://snowjamaserver.systelab.net/rest/latest';
	public defaultHeaders = new HttpHeaders();
	public configuration = new Configuration();

	constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
		if (basePath) {
			this.basePath = basePath;
		}
		if (configuration) {
			this.configuration = configuration;
			this.basePath = basePath || configuration.basePath || this.basePath;
		}
	}

	/**
	 * @param consumes string[] mime-types
	 * @return true: consumes contains 'multipart/form-data', false: otherwise
	 */
	private canConsumeForm(consumes: string[]): boolean {
		const form = 'multipart/form-data';
		for (let consume of consumes) {
			if (form === consume) {
				return true;
			}
		}
		return false;
	}

	public isJsonMime(mime: string): boolean {
		const jsonMime: RegExp = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
		return mime != null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
	}

	/**
	 * Get the item type with the specified ID
	 *
	 * @param itemTypeId
	 * @param include Links to include as full objects in the linked map
	 */
	public getItem(itemTypeId: number, include?: Array<string>): Observable<ItemTypeDataWrapper> {
		if (itemTypeId === null || itemTypeId === undefined) {
			throw new Error('Required parameter itemTypeId was null or undefined when calling getItem.');
		}

		let queryParameters = new HttpParams();
		if (include) {
			include.forEach((element) => {
				queryParameters = queryParameters.append('include', <any>element);
			})
		}

		let headers = this.defaultHeaders;

		// authentication (basic) required
		if (this.configuration.username || this.configuration.password) {
			headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
		}

		// authentication (oauth2) required
		if (this.configuration.accessToken) {
			let accessToken = typeof this.configuration.accessToken === 'function'
				? this.configuration.accessToken()
				: this.configuration.accessToken;
			headers = headers.set('Authorization', 'Bearer ' + accessToken);
		}

		return this.httpClient.get<any>(`${this.basePath}/itemtypes/${encodeURIComponent(String(itemTypeId))}`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get all item types
	 *
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getItemTypes(startAt?: number, maxResults?: number, include?: Array<string>): Observable<ItemTypeDataListWrapper> {

		let queryParameters = new HttpParams();
		if (startAt !== undefined) {
			queryParameters = queryParameters.set('startAt', <any>startAt);
		}
		if (maxResults !== undefined) {
			queryParameters = queryParameters.set('maxResults', <any>maxResults);
		}
		if (include) {
			include.forEach((element) => {
				queryParameters = queryParameters.append('include', <any>element);
			})
		}

		let headers = this.defaultHeaders;

		// authentication (basic) required
		if (this.configuration.username || this.configuration.password) {
			headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
		}

		// authentication (oauth2) required
		if (this.configuration.accessToken) {
			let accessToken = typeof this.configuration.accessToken === 'function'
				? this.configuration.accessToken()
				: this.configuration.accessToken;
			headers = headers.set('Authorization', 'Bearer ' + accessToken);
		}

		return this.httpClient.get<any>(`${this.basePath}/itemtypes`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

}
