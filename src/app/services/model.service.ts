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
			properties: []
		};

		if (!!openAPIModel.description) {
			model.description = openAPIModel.description;
		}

		if (!!openAPIModel.properties) {
			const propertyNames: string[] = Object.keys(openAPIModel.properties);
			for (const propertyName of propertyNames)
			{
				const openAPIProperty: OpenAPISchemaProperty = openAPIModel.properties[propertyName];
				this.addPropertyFromOpenAPI(model, propertyName, openAPIProperty);
			}
		}

		return model;
	}

	private addPropertyFromOpenAPI(model: SpecModelData, propertyName: string, openAPIProperty: OpenAPISchemaProperty) {

		let description: string = "";
		if (!!openAPIProperty.description) {
			description = openAPIProperty.description;
		}

		let typeName = "";
		let typeBasic = true;
		let typeArray = false;
		if (!!openAPIProperty.type) {
			if (typeName === "object") {
				typeBasic = false;
				typeName = "Object";
			}
			else if (typeName === "array") {
				typeBasic = false;
				typeName = "Array";
				typeArray = true;
				if (!!openAPIProperty.items) {
					const schemaReference = openAPIProperty.items["$ref"];
					if (!!schemaReference) {
						typeName = schemaReference.startsWith("#/components/schemas/") ? schemaReference.substr(21) : schemaReference;
					}
				}
			}
			else {
				typeName = openAPIProperty.type;
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