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

import { BaselineDataListWrapper } from '../model/baselineDataListWrapper';
import { BaselineDataWrapper } from '../model/baselineDataWrapper';
import { BaselineItemDataListWrapper } from '../model/baselineItemDataListWrapper';
import { BaselineItemDataWrapper } from '../model/baselineItemDataWrapper';
import { VersionedRelationshipDataListWrapper } from '../model/versionedRelationshipDataListWrapper';

import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class BaselinesService {

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
	 * Get the baseline with the specified ID
	 *
	 * @param baselineId
	 * @param include Links to include as full objects in the linked map
	 */
	public getBaseline(baselineId: number, include?: Array<string>): Observable<BaselineDataWrapper> {
		if (baselineId === null || baselineId === undefined) {
			throw new Error('Required parameter baselineId was null or undefined when calling getBaseline.');
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

		return this.httpClient.get<any>(`${this.basePath}/baselines/${encodeURIComponent(String(baselineId))}`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get all baselines in the project with the specified ID
	 *
	 * @param project
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getBaselines(project: number, startAt?: number, maxResults?: number, include?: Array<string>): Observable<BaselineDataListWrapper> {
		if (project === null || project === undefined) {
			throw new Error('Required parameter project was null or undefined when calling getBaselines.');
		}

		let queryParameters = new HttpParams();
		if (project !== undefined) {
			queryParameters = queryParameters.set('project', <any>project);
		}
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

		return this.httpClient.get<any>(`${this.basePath}/baselines`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get all versioned relationships for the item in the baseline
	 *
	 * @param itemId
	 * @param baselineId
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getRelationshipsForVersion(itemId: number, baselineId: number, startAt?: number, maxResults?: number, include?: Array<string>): Observable<VersionedRelationshipDataListWrapper> {
		if (itemId === null || itemId === undefined) {
			throw new Error('Required parameter itemId was null or undefined when calling getRelationshipsForVersion.');
		}
		if (baselineId === null || baselineId === undefined) {
			throw new Error('Required parameter baselineId was null or undefined when calling getRelationshipsForVersion.');
		}

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

		return this.httpClient.get<any>(`${this.basePath}/baselines/${encodeURIComponent(String(baselineId))}/versioneditems/${encodeURIComponent(String(itemId))}/versionedrelationships`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get the baseline item with the specified ID in a baseline with the specified ID
	 *
	 * @param itemId
	 * @param baselineId
	 * @param include Links to include as full objects in the linked map
	 */
	public getVersionedItem(itemId: number, baselineId: number, include?: Array<string>): Observable<BaselineItemDataWrapper> {
		if (itemId === null || itemId === undefined) {
			throw new Error('Required parameter itemId was null or undefined when calling getVersionedItem.');
		}
		if (baselineId === null || baselineId === undefined) {
			throw new Error('Required parameter baselineId was null or undefined when calling getVersionedItem.');
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

		return this.httpClient.get<any>(`${this.basePath}/baselines/${encodeURIComponent(String(baselineId))}/versioneditems/${encodeURIComponent(String(itemId))}`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get all baseline items in a baseline with the specified ID
	 *
	 * @param baselineId
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getVersionedItems(baselineId: number, startAt?: number, maxResults?: number, include?: Array<string>): Observable<BaselineItemDataListWrapper> {
		if (baselineId === null || baselineId === undefined) {
			throw new Error('Required parameter baselineId was null or undefined when calling getVersionedItems.');
		}

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

		return this.httpClient.get<any>(`${this.basePath}/baselines/${encodeURIComponent(String(baselineId))}/versioneditems`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

}
