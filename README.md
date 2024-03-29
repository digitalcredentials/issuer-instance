# Issuer Service Helper Library _(@digitalcredentials/issuer-core)_

[![Build status](https://img.shields.io/github/actions/workflow/status/digitalcredentials/issuer-core/main.yml?branch=main)](https://github.com/digitalcredentials/issuer-core/actions?query=workflow%3A%22Node.js+CI%22)
[![NPM Version](https://img.shields.io/npm/v/@digitalcredentials/issuer-core.svg)](https://npm.im/@digitalcredentials/issuer-core)

> VC API issuer service helper library (for Node.js / Typescript).

## Table of Contents

- [Background](#background)
- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Background

A VC-API Issuer service can host one or more issuer _instances_. 

An instance is a per-usecase logical unit that configures several key properties:
- A set of cryptographic suites to be supported for this usecase (for example, `Ed25519Signature2020` suite).
- An issuing DID and corresponding signing keys (that match the appropriate crypto suite above)
- A set of `@contexts` supported by this usecase (this can be loosely or strictly filtered by the credential type you intend to issue)
- (For advanced VC API endpoints such as the Exchange endpoints) A set of business rules appropriate to your use case (rules for refreshing/re-issuing, rules for exchanging credentials, etc).

See also VC API [issuing spec](https://w3c-ccg.github.io/vc-api/#issuing) reference.

## Install

- Node.js 18+ is recommended.

### NPM

To install via NPM:

```
npm install @digitalcredentials/issuer-core
```

### Development

To install locally (for development):

```
git clone https://github.com/digitalcredentials/issuer-core.git
cd issuer-core
npm install
```

## Usage

You can use `issuer-core` to help build a standalone VC-API issuer service.
For example:

```js
import { IssuerInstance } from '@digitalcredentials/issuer-core'
import { securityLoader } from '@digitalcredentials/security-document-loader'
import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020'
import fastify from 'fastify'
import * as didKey from '@digitalcredentials/did-method-key'

const documentLoader = securityLoader({ fetchRemoteContexts: true }).build()

// load secret key seed from config file, to generate issuer DID
const didKeyDriver = didKey.driver()
const {methodFor} = await didKeyDriver.generate({ seed })
const signingKeyPair = methodFor({ purpose: 'assertionMethod' })

const signingSuite = new Ed25519Signature2020({ key: signingKeyPair })

const issuerInstance = new IssuerInstance({ documentLoader, signingSuite })

const server = fastify(serverOptions)

server.post('/credentials/issue', async (req, res) => {
  // parse the incoming body according to VC-API specs, validate via JSON Schema ...
  const {credential, options} = parseBody(req)
  
  const signedCredential = await issuerInstance.issueCredential({ credential, options })
  // return it in the response etc
})
```

## Contribute

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT License](LICENSE.md) © 2023 Digital Credentials Consortium.
