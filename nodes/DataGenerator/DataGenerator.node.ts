import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { faker as fakerEn } from '@faker-js/faker/locale/en';
import { faker as fakerDe } from '@faker-js/faker/locale/de';
import { faker as fakerFr } from '@faker-js/faker/locale/fr';
import { faker as fakerEs } from '@faker-js/faker/locale/es';
import { faker as fakerIt } from '@faker-js/faker/locale/it';
import { faker as fakerZh } from '@faker-js/faker/locale/zh_CN';
import { faker as fakerJa } from '@faker-js/faker/locale/ja';
import { faker as fakerVi } from '@faker-js/faker/locale/vi';
import { faker as fakerKo } from '@faker-js/faker/locale/ko';
import mocker from '@coderzz/mocker-data-generator';
import { fakerRulesMapping } from './RuleMapping';
declare global {
	var faker: any;
}
globalThis.faker = fakerEn as any;

export class DataGenerator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Data Generator',
		name: 'dataGenerator',
		icon: 'file:DataGenerator.node.svg',
		group: ['transform'],
		version: 1,
		description: 'Generates mock data using faker.js',
		subtitle: '={{$parameter.mode}}',
		defaults: {
			name: 'Data Generator',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName:
					'Save time with <a href="https://www.npmjs.com/package/n8n-nodes-data-generator" target="_blank">documentation</a> on how this node works.',
				name: 'notice',
				type: 'notice',
				default: '',
				// displayOptions: {
				// 	show: {
				// 		mode: ['simple'],
				// 	},
				// },
			},
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{
						name: 'Simple',
						value: 'simple',
					},
					{
						name: 'UI Mode',
						value: 'ui',
					},
					{
						name: 'Advanced',
						value: 'advanced',
					},
				],
				default: 'simple',
				description: 'Select the mode for data generation',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'fixedCollection',
				placeholder: 'Add Field',
				typeOptions: {
					multipleValues: true,
				},
				required: true,
				displayOptions: {
					show: {
						mode: ['ui'],
					},
				},
				options: [
					{
						name: 'fieldValues',
						displayName: 'Field',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								required: true,
								description: 'Enter the name of the field',
								placeholder: 'Enter the name of the field',
								default: '',
							},
							{
								displayName: 'Rule',
								name: 'rule',
								type: 'options',
								required: true,
								description: 'Select the rule to use for the field',
								placeholder: 'Select the rule to use for the field',
								options: [
									{
										name: 'Address',
										value: 'location.streetAddress()',
									},
									{
										name: 'Alphabetical Text',
										value: 'random.alpha(10)',
									},
									{
										name: 'City',
										value: 'location.city',
									},
									{
										name: 'Currency',
										value: 'finance.currencyCode',
									},
									{
										name: 'Date',
										value: 'date.recent',
									},
									{
										name: 'Email',
										value: 'internet.email',
									},
									{
										name: 'Name',
										value: 'person.fullName',
									},
									{
										name: 'Number',
										value: 'number.int',
									},
									{
										name: 'Phone',
										value: 'phone.number()',
									},
									{
										name: 'UUID',
										value: 'string.uuid',
									},
									{
										name: 'Word',
										value: 'lorem.words(10)',
									},
								],
								default: 'person.fullName',
							},
						],
					},
				],
				default: {},
			},
			{
				displayName: 'JSON Input',
				name: 'jsonInput',
				type: 'json',
				default: `[{"name": "email", "rule":"internet.email"}]`,
				placeholder: `[{"name": "email", "rule":"internet.email"}]`,
				description:
					'The JSON input to define the mock data rules. Visit https://v7.fakerjs.dev/api/ to learn how to create API rules.',
				displayOptions: {
					show: {
						mode: ['advanced'],
					},
				},
			},
			{
				displayName: 'Simple Input',
				name: 'simpleInput',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				placeholder: `Enter field names, one per line. \nlastName\nfirstName:name.firstName\nemail:internet.email`,
				displayOptions: {
					show: {
						mode: ['simple'],
					},
				},
				default: '',
			},
			// 			{
			// 				displayName: `Enter a list of fields, one per line. The system will automatically select rules for you.\n
			// The value can be a field name or a field name combined with the rules you want to prioritize.`,
			// 				name: 'notice',
			// 				type: 'notice',
			// 				default: '',
			// 				displayOptions: {
			// 					show: {
			// 						mode: ['simple'],
			// 					},
			// 				},
			// 			},
			{
				displayName: 'Total Record',
				name: 'totalRecord',
				type: 'number',
				default: 10,
				description: 'The total number of records to generate',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'options',
				options: [
					{ name: 'Chinese', value: 'zh' },
					{ name: 'English', value: 'en' },
					{ name: 'French', value: 'fr' },
					{ name: 'German', value: 'de' },
					{ name: 'Italian', value: 'it' },
					{ name: 'Japanese', value: 'ja' },
					{ name: 'Korean', value: 'ko' },
					{ name: 'Spanish', value: 'es' },
					{ name: 'Vietnamese', value: 'vi' },
					// Add more locales as needed
				],
				default: 'en',
				description: 'Select the locale for data generation',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const totalRecord = this.getNodeParameter('totalRecord', i) as number;
			const mode = this.getNodeParameter('mode', i) as string;
			const locale = this.getNodeParameter('locale', i) as string;
			// Set the locale for faker
			let fakerInstance;
			switch (locale) {
				case 'de':
					fakerInstance = fakerDe;
					break;
				case 'fr':
					fakerInstance = fakerFr;
					break;
				case 'es':
					fakerInstance = fakerEs;
					break;
				case 'it':
					fakerInstance = fakerIt;
					break;
				case 'zh':
					fakerInstance = fakerZh;
					break;
				case 'ja':
					fakerInstance = fakerJa;
					break;
				case 'vi':
					fakerInstance = fakerVi;
					break;
				case 'ko':
					fakerInstance = fakerKo;
					break;
				default:
					fakerInstance = fakerEn;
			}

			let schema: any = {};

			if (mode === 'ui') {
				const fields = this.getNodeParameter('fields.fieldValues', i, []) as Array<{
					name: string;
					rule: string;
				}>;
				for (const field of fields) {
					schema[field.name] = {
						faker: field.rule,
					};
				}
			} else if (mode === 'advanced') {
				const jsonInput = this.getNodeParameter('jsonInput', i) as string;
				const rules = JSON.parse(jsonInput);
				for (const rule of rules) {
					schema[rule.name] = {
						faker: rule.rule,
					};
				}
			} else if (mode === 'simple') {
				const simpleInput = this.getNodeParameter('simpleInput', i) as string;
				const originalFieldNames = simpleInput.split('\n').map((name) => name.trim());
				const normalizedFieldNames = originalFieldNames.map((name) => {
					const [fieldName, rule] = name.split(':');
					return {
						fieldName: fieldName.trim(),
						rule: rule ? rule.trim().replace('()', '') : null,
						normalized: fieldName.toLowerCase().replace(/[^a-z]/g, ''),
					};
				});

				for (const { fieldName, rule, normalized } of normalizedFieldNames) {
					let matchedRule = rule || 'random.alpha(10)'; // Default rule if no match is found
					if (!rule) {
						for (const [fakerRule, fields] of Object.entries(fakerRulesMapping)) {
							if (fields.map((f) => f.toLowerCase()).includes(normalized)) {
								matchedRule = fakerRule;
								break;
							}
						}
					}
					schema[fieldName] = {
						faker: matchedRule,
					};
				}
			}

			let data: any = mocker()
				.addGenerator('faker', fakerInstance)
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
