/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class ContentValidator {
    validateOrderData(data: any): any {
        if (typeof data !== 'string') {
            throw new Error('Invalid data format')
        }

        // Parse and validate JSON structure
        try {
            const parsed = JSON.parse(data)
            return this.sanitizeOrderContent(parsed)
        } catch (error) {
            // Only allow valid JSON - blocks JS code injection
            throw new Error('Invalid JSON format')
        }
    }

    private sanitizeOrderContent(content: any): any {
        if (typeof content === 'object' && content !== null) {
            const sanitized: any = {}
            for (const key in content) {
                if (this.isValidOrderField(key)) {
                    sanitized[key] = this.sanitizeValue(content[key])
                }
            }
            return sanitized
        }
        return this.sanitizeValue(content)
    }

    private isValidOrderField(field: string): boolean {
        const allowedFields = ['productId', 'quantity', 'customerReference', 'couponCode', 'notes']
        return allowedFields.includes(field)
    }

    private sanitizeValue(value: any): any {
        if (typeof value === 'string') {
            // Remove potential JavaScript patterns
            return value.replace(/[\(\)\{\}\[\]]/g, '')
        }
        if (Array.isArray(value)) {
            return value.map(item => this.sanitizeValue(item))
        }
        return value
    }
}
