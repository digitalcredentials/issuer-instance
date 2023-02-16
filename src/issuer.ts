import vc from '@digitalcredentials/vc'

declare interface IDocumentLoaderResult {
  contextUrl?: string
  documentUrl?: string
  document: any
}

type IDocumentLoader = (url: string) => Promise<IDocumentLoaderResult>

export class IssuerInstance {
  public documentLoader: IDocumentLoader
  public issuerDid: string
  public signingSuite: any

  constructor({
    documentLoader,
    issuerDid,
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
      return vc.issue({
        credential: credCopy,
        suite: this.signingSuite,
        documentLoader: this.documentLoader
      })
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
