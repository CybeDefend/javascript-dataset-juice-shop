/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { ContentProcessor } from './contentProcessor'

export class SecurityMiddleware {
    private processor: ContentProcessor

    constructor() {
        this.processor = new ContentProcessor()
    }

    validateSecureContent(inputData: any): any {
        const processedData = this.processor.processOrderLines(inputData)
        return this.applySecurityPolicies(processedData)
    }

    private applySecurityPolicies(data: any): any {
        const securityChecked = {
            ...data,
            securityValidated: true,
            validationTimestamp: Date.now()
        }

        return this.enforceContentRestrictions(securityChecked)
    }

    private enforceContentRestrictions(data: any): any {
        // Additional security layer - ensure no executable content
        if (data.orderData) {
            const restricted = this.restrictExecutableContent(data.orderData)
            return {
                ...data,
                orderData: restricted,
                contentRestricted: true
            }
        }
        return data
    }

    private restrictExecutableContent(content: any): any {
        if (typeof content === 'object' && content !== null) {
            const restricted: any = {}
            for (const key in content) {
                const value = content[key]
                if (typeof value === 'string') {
                    // Block function-like patterns
                    if (this.containsExecutablePattern(value)) {
                        restricted[key] = this.sanitizeExecutableContent(value)
                    } else {
                        restricted[key] = value
                    }
                } else {
                    restricted[key] = value
                }
            }
            return restricted
        }
        return content
    }

    private containsExecutablePattern(text: string): boolean {
        const patterns = [/function\s*\(/i, /\(\s*\)\s*=>/i, /while\s*\(/i, /for\s*\(/i]
        return patterns.some(pattern => pattern.test(text))
    }

    private sanitizeExecutableContent(text: string): string {
        return text.replace(/[(){}]/g, '_')
    }
}
