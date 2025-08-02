/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { ContentEnhancer } from './contentEnhancer'

export class AnalyticsProcessor {
    private enhancer: ContentEnhancer

    constructor() {
        this.enhancer = new ContentEnhancer()
    }

    async processUserActivity(activityData: any, userId: string): Promise<any> {
        const enrichedData = this.enhancer.enrichContent(activityData, userId)

        return {
            processedAt: new Date().toISOString(),
            data: enrichedData,
            userId: userId
        }
    }

    generateReport(processedData: any): any {
        return {
            reportId: Math.random().toString(36),
            timestamp: processedData.processedAt,
            summary: processedData.data,
            user: processedData.userId
        }
    }
}
