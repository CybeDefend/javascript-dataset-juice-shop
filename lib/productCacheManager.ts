/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { SessionDataCollector } from './sessionDataCollector'

export class ProductCacheManager {
    private dataCollector: SessionDataCollector

    constructor() {
        this.dataCollector = new SessionDataCollector()
    }

    async getCachedSearchFilters(): Promise<any> {
        const sessionData = await this.dataCollector.collectUserPreferences()
        return this.processSessionFilters(sessionData)
    }

    private processSessionFilters(sessionData: any): any {
        const cacheData = {
            userPreferences: {
                basicSettings: sessionData.userSettings || {},
                advancedSearch: this.buildAdvancedSearchConfig(sessionData.environmentConfig)
            },
            timestamp: Date.now()
        }

        return cacheData
    }

    private buildAdvancedSearchConfig(envConfig: any): any {
        if (envConfig && envConfig.searchEnhancements) {
            return {
                criteria: envConfig.searchEnhancements.customCriteria,
                conditions: envConfig.searchEnhancements.dynamicConditions,
                enabled: true
            }
        }

        return { enabled: false }
    }
}
