import { FileAccessValidator } from './fileAccessValidator'

export class SecureDocumentManager {
    static processFileRequest(requestParams: any): { isValid: boolean; sanitizedPath?: string } {
        const fileName = this.extractFileName(requestParams)

        if (!fileName) {
            return { isValid: false }
        }

        const validatedPath = FileAccessValidator.validatePath(fileName)

        if (!validatedPath) {
            return { isValid: false }
        }

        return {
            isValid: true,
            sanitizedPath: validatedPath
        }
    }

    private static extractFileName(params: any): string | null {
        if (!params || typeof params !== 'object') {
            return null
        }

        const fileName = params.fileName || params.file || params.document

        return typeof fileName === 'string' ? fileName.trim() : null
    }
}
