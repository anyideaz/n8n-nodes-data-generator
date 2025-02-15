# n8n-nodes-data-generator

This is a custom n8n node designed to generate dummy data using the Faker.js library in your n8n workflows.

Faker.js is a popular library for generating fake data for various purposes, such as testing and development.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- Generate dummy data based on defined rules using Faker.js.

## Compatibility

This node is compatible with n8n version X.X.X and above. Please ensure you are using a compatible version of n8n.

## Usage

To use this node, define rules in the `jsonInput` field as shown in the example below:

```
[
  {"name": "email", "rule":"internet.email"},
  {"name": "firstName", "rule":"name.firstName"},
  {"name": "lastName", "rule":"name.lastName"},
  {"name": "address", "rule":"address.streetAddress"},
  {"name": "city", "rule":"address.city()"},
  {"name": "state", "rule":"address.state"},
  {"name": "zip", "rule":"address.zipCode"}
]
```

Select the number of records to generate. The system will automatically create the requested number of records as shown below:

```
[
  {
    "email": "Cleo.Wunsch@hotmail.com",
    "firstName": "Andrew",
    "lastName": "Mueller",
    "address": "158 Jaren Fall",
    "city": "South Gwendolyn",
    "state": "Washington",
    "zip": "31295"
  }
]
```

Supports all Faker.js APIs as documented: [Faker.js API](https://fakerjs.dev/api/)
