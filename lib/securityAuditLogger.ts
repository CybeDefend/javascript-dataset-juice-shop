/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class SecurityAuditLogger {
    async logAccessAttempt(documentId: string, userContext: string): Promise<void> {
        const timestamp = new Date().toISOString()
        const logEntry = {
            timestamp,
            event: 'document_access_attempt',
            documentId,
            userContext: this.sanitizeUserContext(userContext),
            ip: 'hidden_for_privacy'
        }

        console.log('[AUDIT]', JSON.stringify(logEntry))
    }

    async logSecurityViolation(violation: string, attemptedPath: string, userContext: string): Promise<void> {
        const timestamp = new Date().toISOString()
        const logEntry = {
            timestamp,
            event: 'security_violation',
            violation,
            attemptedPath,
            userContext: this.sanitizeUserContext(userContext),
            severity: 'HIGH'
        }

        console.log('[SECURITY_ALERT]', JSON.stringify(logEntry))
    }

    private sanitizeUserContext(userContext: string): string {
        if (!userContext || userContext.length > 200) {
            return 'unknown'
        }

        return userContext.replace(/[<>"/\\&]/g, '_').substring(0, 100)
    }
}
