/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { ContentValidator } from './contentValidator'

export class ContentProcessor {
    private validator: ContentValidator

    constructor() {
        this.validator = new ContentValidator()
    }

    processOrderLines(rawData: any): any {
        const validatedData = this.validator.validateOrderData(rawData)
        return this.transformOrderData(validatedData)
    }

    private transformOrderData(data: any): any {
        const processed = {
            orderData: data,
            processedAt: new Date().toISOString(),
            status: 'validated'
        }

        return this.applyBusinessRules(processed)
    }

    private applyBusinessRules(orderData: any): any {
        // Apply business validation and transformation
        if (orderData.orderData && typeof orderData.orderData === 'object') {
            const transformed = {
                ...orderData,
                orderData: this.normalizeOrderFields(orderData.orderData)
            }
            return transformed
        }
        return orderData
    }

    private normalizeOrderFields(fields: any): any {
        const normalized: any = {}
        for (const key in fields) {
            normalized[key] = this.normalizeFieldValue(fields[key])
        }
        return normalized
    }

    private normalizeFieldValue(value: any): any {
        if (typeof value === 'string') {
            return value.trim().toLowerCase()
        }
        return value
    }
}
