[![Build Status](https://travis-ci.org/systelab/openapi-reporter.svg?branch=master)](https://travis-ci.org/systelab/openapi-reporter)
[![Known Vulnerabilities](https://snyk.io/test/github/systelab/openapi-reporter/badge.svg?targetFile=package.json)](https://snyk.io/test/github/systelab/openapi-reporter?targetFile=package.json)

# OpenAPI Reporter

OpenAPI reporter will speed up your REST API development by generating documentation from the source code following an Specifications format, as well as JAMA Contour integration to upload the specifications.
[OpenAPI initiative](https://www.openapis.org/) is a broadly adopted industry standard for describing modern APIs based on a programming language-agnostic interface [specifications](https://github.com/OAI/OpenAPI-Specification).

Only supports OpenAPI 3.0 JSON format.

You can find the validated application deployed by Travis at https://systelab.github.io/openapi-reporter/

The test environment is at https://systelab.github.io/openapi-reporter-test/

## Getting Started

To get you started you can simply clone the `openapi-reporter` repository and install the dependencies:

### Prerequisites

You need [git][git] to clone the `openapi-reporter` repository.

You will need [Node.js][node] and [npm][npm].

### Clone `openapi-reporter`

Clone the `openapi-reporter` repository using git:

```bash
git clone https://github.com/systelab/openapi-reporter.git
cd openapi-reporter
```

### Install Dependencies

To install the dependencies, execute:

```bash
npm install
```

### Run

To run the application, execute the following command:

```bash
ng serve
```

### Generate

To generate the application, execute the following command:

```bash
ng build
```

[git]: https://git-scm.com/
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[Angular]: https://angular.io/
