import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { faker } from '@faker-js/faker';
declare global {
	var faker: any;
}
globalThis.faker = faker as any;

export class ExampleNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Faker Node',
		name: 'fakerNode',
		group: ['transform'],
		version: 1,
		description: 'Generates mock data using faker.js',
		defaults: {
			name: 'Faker Node',
			color: '#772244',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'JSON Input',
				name: 'jsonInput',
				type: 'json',
				default: '',
				placeholder: '[{"name": "email", "rule":"faker.internet.email"}]',
				description: 'The JSON input to define the mock data rules.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const jsonInput = this.getNodeParameter('jsonInput', i) as string;
			const rules = JSON.parse(jsonInput);
			const generatedData: { [key: string]: any } = {};
			for (const rule of rules) {
				// const fakerFunction = rule.rule.split('.').reduce((o: any, i: any) => o[i], faker);
				generatedData[rule.name] = eval(rule.rule);
			}

			returnData.push({ json: generatedData });
		}

		return [returnData];
	}
}
