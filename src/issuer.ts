import {issue} from '@digitalcredentials/vc'

declare interface IDocumentLoaderResult {
  contextUrl?: string
  documentUrl?: string
  document: any
}

type IDocumentLoader = (url: string) => Promise<IDocumentLoaderResult>

export class IssuerInstance {
  public documentLoader: IDocumentLoader
  public signingSuite: any

  constructor({
    documentLoader,
    signingSuite
  }: {
    documentLoader: IDocumentLoader
    signingSuite: any
  }) {
    this.documentLoader = documentLoader
    this.signingSuite = signingSuite
  }

  async issueCredential({
    credential,
    options
  }: {
    credential: any
    options: any
  }): Promise<any> {
    // this library attaches the signature on the original object, so make a copy
    const credCopy = JSON.parse(JSON.stringify(credential))
    try {
      return issue({
        credential: credCopy,
        suite: this.signingSuite,
        documentLoader: this.documentLoader,
        ...options
      })
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
