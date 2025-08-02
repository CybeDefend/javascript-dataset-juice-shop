/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import * as DOMPurify from 'isomorphic-dompurify'

export class XssSanitizer {
    private static readonly SCRIPT_PATTERNS = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /</g,
        />/g,
        /"/g,
        /'/g,
        /&/g
    ]

    private static readonly SCRIPT_REPLACEMENTS = [
        '',
        '',
        '',
        '&lt;',
        '&gt;',
        '&quot;',
        '&#x27;',
        '&amp;'
    ]

    public static sanitizeForScript(input: string): string {
        if (!input || typeof input !== 'string') {
            return ''
        }

        // Première couche: Nettoyage DOMPurify
        let cleaned = DOMPurify.sanitize(input, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        })

        // Deuxième couche: Suppression patterns JavaScript
        for (let i = 0; i < this.SCRIPT_PATTERNS.length; i++) {
            cleaned = cleaned.replace(this.SCRIPT_PATTERNS[i], this.SCRIPT_REPLACEMENTS[i])
        }

        // Troisième couche: Validation finale
        if (this.containsExecutableContent(cleaned)) {
            return ''
        }

        return cleaned
    }

    private static containsExecutableContent(content: string): boolean {
        const dangerousPatterns = [
            /eval\s*\(/i,
            /function\s*\(/i,
            /\(\s*\)/i,
            /=>/i,
            /\${/i,
            /`/i
        ]

        return dangerousPatterns.some(pattern => pattern.test(content))
    }

    public static escapeForJavaScript(input: string): string {
        return JSON.stringify(input).slice(1, -1) // Remove outer quotes
    }
}
