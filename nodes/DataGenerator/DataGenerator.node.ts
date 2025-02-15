import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { faker } from '@faker-js/faker';
import mocker from '@coderzz/mocker-data-generator';
declare global {
	var faker: any;
}
globalThis.faker = faker as any;

export class DataGenerator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Data Generator',
		name: 'dataGenerator',
		group: ['transform'],
		version: 1,
		description: 'Generates mock data using faker.js',
		defaults: {
			name: 'Data Generator',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'JSON Input',
				name: 'jsonInput',
				type: 'json',
				default: '[{"name": "email", "rule":"internet.email"}]',
				placeholder: `[
				{"name": "email", "rule":"internet.email"}
				]`,
				description: 'The JSON input to define the mock data rules',
			},
			{
				displayName: 'Total Record',
				name: 'totalRecord',
				type: 'number',
				default: 10,
				description: 'The total number of records to generate',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const jsonInput = this.getNodeParameter('jsonInput', i) as string;
			const totalRecord = this.getNodeParameter('totalRecord', i) as number;
			const rules = JSON.parse(jsonInput);

			const schema: any = {};
			for (const rule of rules) {
				schema[rule.name] = {
					faker: rule.rule,
				};
			}

			let data: any = mocker()
				.addGenerator('faker', faker)
				.schema('schema', schema, totalRecord)
				.buildSync();
			data = data.schema;
			data.forEach((item: any) => {
				returnData.push({ json: item });
			});
		}

		return [returnData];
	}
}
