/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { SecurityMiddleware } from './securityMiddleware'

export class OrderManager {
    private security: SecurityMiddleware

    constructor() {
        this.security = new SecurityMiddleware()
    }

    prepareOrderExecution(requestData: any): any {
        const secureData = this.security.validateSecureContent(requestData)
        return this.buildExecutionContext(secureData)
    }

    private buildExecutionContext(data: any): any {
        const context = {
            executionData: data,
            contextType: 'secure_order',
            preparationTime: new Date().toISOString()
        }

        return this.finalizeOrderContext(context)
    }

    private finalizeOrderContext(context: any): any {
        // Final processing step before execution
        if (context.executionData && context.executionData.orderData) {
            const finalized = {
                ...context,
                executionData: this.prepareForSafeExecution(context.executionData)
            }
            return finalized
        }
        return context
    }

    private prepareForSafeExecution(data: any): any {
        // Convert to safe JSON string for evaluation
        const safeData = JSON.stringify(data.orderData)
        return {
            ...data,
            orderData: safeData,
            isSanitized: true
        }
    }

    extractExecutionPayload(context: any): string {
        if (context.executionData && context.executionData.orderData) {
            return context.executionData.orderData
        }
        return '{}'
    }
}
