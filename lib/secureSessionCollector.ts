import { RequestProcessor, RequestContext } from './requestProcessor'

export interface SessionData {
    requestProcessor: RequestProcessor
    contextInfo: RequestContext
}

export class SecureSessionDataCollector {
    private activeContexts: Map<string, SessionData>

    constructor() {
        this.activeContexts = new Map()
    }

    public initializeSession(sessionId: string, userAgent: string, remoteAddress: string): void {
        const context: RequestContext = {
            sessionId,
            userAgent,
            remoteAddress
        }

        const sessionData: SessionData = {
            requestProcessor: new RequestProcessor(),
            contextInfo: context
        }

        this.activeContexts.set(sessionId, sessionData)
    }

    public getSessionData(sessionId: string): SessionData | undefined {
        return this.activeContexts.get(sessionId)
    }

    public processFileAccessRequest(sessionId: string, filename: string): string {
        const sessionData = this.getSessionData(sessionId)
        if (!sessionData) {
            throw new Error('Session not found')
        }

        return sessionData.requestProcessor.processFileRequest(filename, sessionData.contextInfo)
    }

    public cleanupSession(sessionId: string): void {
        this.activeContexts.delete(sessionId)
    }
}
