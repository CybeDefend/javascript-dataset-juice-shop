/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class DocumentValidator {
    processDocumentId(input: string): string {
        if (!input || typeof input !== 'string') {
            throw new Error('Invalid document ID')
        }

        const sanitized = input.trim()

        const forbiddenChars = ['.', '/', '\\', ':', '*', '?', '"', '<', '>', '|']
        for (const char of forbiddenChars) {
            if (sanitized.includes(char)) {
                throw new Error('Document ID contains forbidden characters')
            }
        }

        const forbiddenPatterns = [
            /\.\./g,
            /\//g,
            /\\/g,
            /~/g,
            /\$/g,
            /%/g,
            /&/g,
            /;/g,
            /\|/g,
            /`/g,
            /'/g,
            /"/g
        ]

        for (const pattern of forbiddenPatterns) {
            if (pattern.test(sanitized)) {
                throw new Error('Document ID contains forbidden patterns')
            }
        }

        if (sanitized.length > 20) {
            throw new Error('Document ID too long')
        }

        const alphanumericRegex = /^[a-zA-Z0-9]+$/
        if (!alphanumericRegex.test(sanitized)) {
            throw new Error('Document ID must be alphanumeric')
        }

        return sanitized
    }
}
