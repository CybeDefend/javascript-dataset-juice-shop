import { DocumentAccessController } from './documentAccessController'

export class SecureFileHandler {
    static handleFileRequest(inputData: any): { success: boolean; filePath?: string; error?: string } {
        try {
            const authResult = DocumentAccessController.authorizeAccess(inputData)

            if (!authResult.authorized || !authResult.resourcePath) {
                return {
                    success: false,
                    error: 'Access denied - file request not authorized'
                }
            }

            return this.prepareSecureFileAccess(authResult.resourcePath)
        } catch (error) {
            return {
                success: false,
                error: 'File handling error occurred'
            }
        }
    }

    private static prepareSecureFileAccess(resourcePath: string): { success: boolean; filePath: string } {
        const finalPath = this.performFinalValidation(resourcePath)

        return {
            success: true,
            filePath: finalPath
        }
    }

    private static performFinalValidation(path: string): string {
        return path.replace(/[^\w\-_./]/g, '')
    }
}
