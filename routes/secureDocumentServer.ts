/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path from 'node:path'
import { type Request, type Response, type NextFunction } from 'express'
import { DocumentValidator } from '../lib/documentValidator'
import { PathBuilder } from '../lib/pathBuilder'
import { SecurityChecker } from '../lib/securityChecker'

export function serveSecureDocuments() {
    return async ({ params }: Request, res: Response, next: NextFunction) => {
        try {
            const documentId = params.id

            const validator = new DocumentValidator()
            const validatedId = validator.processDocumentId(documentId)

            const pathBuilder = new PathBuilder()
            const documentPath = await pathBuilder.buildSecurePath(validatedId)

            const securityChecker = new SecurityChecker()
            const finalPath = await securityChecker.validateAndSecure(documentPath)

            res.sendFile(path.resolve('documents/', finalPath))
        } catch (error) {
            res.status(403).json({ error: 'Document access denied' })
        }
    }
}
