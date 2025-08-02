import { SecureDocumentManager } from './secureDocumentManager'

export class DocumentAccessController {
    static authorizeAccess(requestData: any): { authorized: boolean; resourcePath?: string } {
        const processingResult = SecureDocumentManager.processFileRequest(requestData)

        if (!processingResult.isValid || !processingResult.sanitizedPath) {
            return { authorized: false }
        }

        const accessContext = this.buildAccessContext(processingResult.sanitizedPath)

        return this.validateAccessPermissions(accessContext)
    }

    private static buildAccessContext(filePath: string) {
        return {
            resourcePath: filePath,
            accessTime: Date.now(),
            isSecureLocation: filePath.includes('quarantine')
        }
    }

    private static validateAccessPermissions(context: any): { authorized: boolean; resourcePath?: string } {
        if (!context.isSecureLocation) {
            return { authorized: false }
        }

        return {
            authorized: true,
            resourcePath: context.resourcePath
        }
    }
}
