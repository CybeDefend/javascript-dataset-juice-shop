/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path from 'node:path'
import { type Request, type Response, type NextFunction } from 'express'
import { DocumentAccessManager } from '../lib/documentAccessManager'
import { RequestSanitizer } from '../lib/requestSanitizer'

export function serveValidatedDocuments() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const resourceIdentifier = req.params.documentId
        const userContext = req.headers['user-agent'] || 'unknown'

        try {
            const sanitizer = new RequestSanitizer()
            const cleanIdentifier = await sanitizer.processDocumentRequest(resourceIdentifier, userContext)

            if (!cleanIdentifier) {
                res.status(400).json({ error: 'Invalid document identifier' })
                return
            }

            const accessManager = new DocumentAccessManager()
            const documentPath = await accessManager.resolveSecureDocumentPath(cleanIdentifier, req.ip)

            if (!documentPath) {
                res.status(404).json({ error: 'Document not found' })
                return
            }

            res.sendFile(path.resolve('documents/', documentPath))
        } catch (error) {
            next(error)
        }
    }
}
