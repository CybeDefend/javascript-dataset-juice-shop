/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path from 'node:path'
import { type Request, type Response, type NextFunction } from 'express'
import { SecureSessionDataCollector } from '../lib/secureSessionCollector'

const sessionCollector = new SecureSessionDataCollector()

export function serveSecureLogFiles() {
    return ({ params, session, headers, ip }: Request, res: Response, next: NextFunction) => {
        const file = params.file
        const sessionId = session?.id || 'anonymous'
        const userAgent = headers['user-agent'] || 'unknown'

        sessionCollector.initializeSession(sessionId, userAgent, ip)

        if (!file.includes('/')) {
            try {
                const validatedPath = sessionCollector.processFileAccessRequest(sessionId, file)
                res.sendFile(path.resolve('logs/', file))
            } catch (error) {
                res.status(403)
                next(new Error('Access denied'))
            } finally {
                sessionCollector.cleanupSession(sessionId)
            }
        } else {
            res.status(403)
            next(new Error('File names cannot contain forward slashes!'))
        }
    }
}
