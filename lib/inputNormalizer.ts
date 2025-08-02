/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class InputNormalizer {
    async sanitizeDocumentIdentifier(input: string): Promise<string | null> {
        if (!input || input.length > 100) {
            return null
        }

        let cleaned = input.trim()

        const dangerousPatterns = [
            '../',
            '..\\',
            '%2e%2e%2f',
            '%2e%2e%5c',
            '..%2f',
            '..%5c',
            '%2e%2e/',
            '%2e%2e\\',
            '..../',
            '....\\',
            '...',
            '//',
            '\\\\',
            '%00'
        ]

        for (const pattern of dangerousPatterns) {
            while (cleaned.toLowerCase().includes(pattern.toLowerCase())) {
                cleaned = cleaned.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '')
            }
        }

        cleaned = cleaned.replace(/[<>:"|?*]/g, '')
        cleaned = cleaned.replace(/\s+/g, '_')

        if (cleaned.length === 0 || cleaned === '.' || cleaned === '..') {
            return null
        }

        return cleaned
    }
}
