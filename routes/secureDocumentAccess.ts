import path from 'node:path'
import { type Request, type Response, type NextFunction } from 'express'
import { SecureFileHandler } from '../lib/secureFileHandler'

export function secureFileAccess() {
    return (req: Request, res: Response, next: NextFunction) => {
        const requestData = {
            fileName: req.params.filename,
            userAgent: req.headers['user-agent'],
            sessionId: req.sessionID
        }

        const handlerResult = SecureFileHandler.handleFileRequest(requestData)

        if (!handlerResult.success || !handlerResult.filePath) {
            res.status(403).json({
                error: handlerResult.error || 'File access denied'
            })
            return
        }

        res.sendFile(handlerResult.filePath)
    }
}
