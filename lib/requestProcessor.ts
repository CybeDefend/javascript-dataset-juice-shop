import { SecurityManager } from './securityManager'

export interface RequestContext {
    sessionId: string
    userAgent: string
    remoteAddress: string
}

export class RequestProcessor {
    private securityManager: SecurityManager

    constructor() {
        this.securityManager = SecurityManager.getInstance()
    }

    public processFileRequest(filename: string, context: RequestContext): string {
        this.logAccess(filename, context)
        const sanitizedInput = this.preprocessInput(filename)
        return this.securityManager.validateFileAccess('logs', sanitizedInput)
    }

    private preprocessInput(filename: string): string {
        return filename.trim().replace(/['"<>]/g, '')
    }

    private logAccess(filename: string, context: RequestContext): void {
        console.log(`File access request: ${filename} from ${context.remoteAddress}`)
    }
}
