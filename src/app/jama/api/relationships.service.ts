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

import { AbstractRestResponse } from '../model/abstractRestResponse';
import { CreatedResponse } from '../model/createdResponse';
import { RelationshipDataListWrapper } from '../model/relationshipDataListWrapper';
import { RelationshipDataWrapper } from '../model/relationshipDataWrapper';
import { RequestRelationship } from '../model/requestRelationship';

import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class RelationshipsService {

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
	 * Remove an existing suspect link for the relationship with the specified ID
	 *
	 * @param relationshipId
	 */
	public clearSuspectLink(relationshipId: number): Observable<AbstractRestResponse> {
		if (relationshipId === null || relationshipId === undefined) {
			throw new Error('Required parameter relationshipId was null or undefined when calling clearSuspectLink.');
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

		return this.httpClient.delete<any>(`${this.basePath}/relationships/${encodeURIComponent(String(relationshipId))}/suspect`, {
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Create a new relationship
	 *
	 * @param body
	 */
	public createRelationship(body: RequestRelationship): Observable<CreatedResponse> {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling createRelationship.');
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

		return this.httpClient.post<any>(`${this.basePath}/relationships`, body, {
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Delete the relationship with the specified ID
	 *
	 * @param relationshipId
	 */
	public deleteRelationship(relationshipId: number): Observable<AbstractRestResponse> {
		if (relationshipId === null || relationshipId === undefined) {
			throw new Error('Required parameter relationshipId was null or undefined when calling deleteRelationship.');
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

		return this.httpClient.delete<any>(`${this.basePath}/relationships/${encodeURIComponent(String(relationshipId))}`, {
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get the relationship with the specified ID
	 *
	 * @param relationshipId
	 * @param include Links to include as full objects in the linked map
	 */
	public getRelationship(relationshipId: number, include?: Array<string>): Observable<RelationshipDataWrapper> {
		if (relationshipId === null || relationshipId === undefined) {
			throw new Error('Required parameter relationshipId was null or undefined when calling getRelationship.');
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

		return this.httpClient.get<any>(`${this.basePath}/relationships/${encodeURIComponent(String(relationshipId))}`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get all relationships in the project with the specified ID
	 *
	 * @param project
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getRelationships(project: number, startAt?: number, maxResults?: number, include?: Array<string>): Observable<RelationshipDataListWrapper> {
		if (project === null || project === undefined) {
			throw new Error('Required parameter project was null or undefined when calling getRelationships.');
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

		return this.httpClient.get<any>(`${this.basePath}/relationships`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Update the relationship with the specified ID
	 *
	 * @param body
	 * @param relationshipId
	 */
	public updateRelationship(body: RequestRelationship, relationshipId: number): Observable<AbstractRestResponse> {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling updateRelationship.');
		}
		if (relationshipId === null || relationshipId === undefined) {
			throw new Error('Required parameter relationshipId was null or undefined when calling updateRelationship.');
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

		return this.httpClient.put<any>(`${this.basePath}/relationships/${encodeURIComponent(String(relationshipId))}`, body, {
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

}
