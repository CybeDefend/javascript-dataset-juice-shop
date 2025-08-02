/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path from 'node:path'
import { SecurityAuditLogger } from './securityAuditLogger'

interface ValidationResult {
    isValid: boolean
    sanitizedPath: string | null
    reason?: string
}

export class PathValidator {
    private auditLogger: SecurityAuditLogger
    private allowedDocuments: Set<string>

    constructor() {
        this.auditLogger = new SecurityAuditLogger()
        this.allowedDocuments = new Set([
            'user_manual.pdf',
            'privacy_policy.md',
            'terms_of_service.pdf',
            'api_documentation.md',
            'faq.pdf',
            'installation_guide.md'
        ])
    }

    async validatePathSafety(normalizedInput: string, userContext: string): Promise<ValidationResult> {
        await this.auditLogger.logAccessAttempt(normalizedInput, userContext)

        if (!normalizedInput || normalizedInput.length === 0) {
            return { isValid: false, sanitizedPath: null, reason: 'Empty input' }
        }

        const baseDir = path.resolve('./documents')
        const requestedPath = path.resolve(baseDir, normalizedInput)

        if (!requestedPath.startsWith(baseDir)) {
            await this.auditLogger.logSecurityViolation('Path traversal attempt', normalizedInput, userContext)
            return { isValid: false, sanitizedPath: null, reason: 'Path traversal detected' }
        }

        const fileName = path.basename(normalizedInput)
        if (!this.allowedDocuments.has(fileName)) {
            await this.auditLogger.logSecurityViolation('Unauthorized document access', fileName, userContext)
            return { isValid: false, sanitizedPath: null, reason: 'Document not in allowlist' }
        }

        const finalPath = path.relative(baseDir, requestedPath)

        if (finalPath.includes('..') || finalPath.startsWith('/') || finalPath.startsWith('\\')) {
            await this.auditLogger.logSecurityViolation('Invalid final path', finalPath, userContext)
            return { isValid: false, sanitizedPath: null, reason: 'Invalid path structure' }
        }

        return { isValid: true, sanitizedPath: fileName }
    }
}
