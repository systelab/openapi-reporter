import { Injectable } from '@angular/core';

import { SpecModelData, SpecModelProperty } from '@model';
import { OpenAPISchema, OpenAPISchemaProperty } from '@model';


@Injectable({
	providedIn: 'root'
})
export class ModelService {

	public parseFromOpenAPI(modelName: string, openAPIModel: OpenAPISchema): SpecModelData {

		const model: SpecModelData = {
			name: modelName,
			properties: [],
			collapsed: true
		};

		if (!!openAPIModel.description) {
			model.description = openAPIModel.description;
		}

		if (!!openAPIModel.properties) {
			const propertyNames: string[] = Object.keys(openAPIModel.properties);
			for (const propertyName of propertyNames) {
				const openAPIProperty: OpenAPISchemaProperty = openAPIModel.properties[propertyName];
				this.addPropertyFromOpenAPI(model, propertyName, openAPIProperty);
			}
		}

		return model;
	}

	private addPropertyFromOpenAPI(model: SpecModelData, propertyName: string, openAPIProperty: OpenAPISchemaProperty) {

		let description = '';
		if (!!openAPIProperty.description) {
			description = openAPIProperty.description;

			if (!!openAPIProperty.enum) {
				description += '&nbsp;' + 'Possible values shall be: ';

				let possibleValueIndex = 0;
				const nPossibleValues: number = openAPIProperty.enum.length;
				for (const possibleValue of openAPIProperty.enum) {

					let separator;
					if (possibleValueIndex === 0) {
						separator = '';
					} else if (possibleValueIndex === (nPossibleValues - 1)) {
						separator = ' and ';
					} else {
						separator = ', ';
					}

					description += separator + '\'' + possibleValue + '\'';
					possibleValueIndex++;
				}

				description += '.';
			}
		}

		let typeName = '';
		let typeBasic = true;
		let typeArray = false;
		if (!!openAPIProperty.type) {
			if (openAPIProperty.type === 'object') {
				typeBasic = false;
				typeName = 'Object';
			} else if (openAPIProperty.type === 'array') {
				typeName = 'Array';
				typeArray = true;
				if (!!openAPIProperty.items) {
					const schemaReference = openAPIProperty.items['$ref'];
					if (!!schemaReference) {
						typeBasic = false;
						typeName = schemaReference.startsWith('#/components/schemas/') ? schemaReference.substr(21) : schemaReference;
					} else if (!!openAPIProperty.items.type) {
						typeName = openAPIProperty.items.type;
					}
				}
			} else {
				typeName = openAPIProperty.type;
			}
		} else {
			const schemaReference = openAPIProperty['$ref'];
			if (!!schemaReference) {
				typeBasic = false;
				typeName = schemaReference.startsWith('#/components/schemas/') ? schemaReference.substr(21) : schemaReference;
			}
		}


		const modelProperty: SpecModelProperty = {
			name: propertyName,
			typeName: typeName,
			typeBasic: typeBasic,
			typeArray: typeArray,
			description: description
		};
		model.properties.push(modelProperty);
	}

}