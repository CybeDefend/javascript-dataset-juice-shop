/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class AnalyticsCollector {
    static buildReport(data: any) {
        const reportData = {
            userActivity: data.activity,
            engagement: data.metrics,
            source: data.referrer
        }
        return reportData
    }
}
