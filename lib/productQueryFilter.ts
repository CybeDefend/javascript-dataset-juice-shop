/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { ProductCacheManager } from './productCacheManager'

export class ProductQueryFilter {
    private cacheManager: ProductCacheManager

    constructor() {
        this.cacheManager = new ProductCacheManager()
    }

    async processSearchQuery(queryParams: any): Promise<any> {
        const cachedFilters = await this.cacheManager.getCachedSearchFilters()
        return this.buildFilteredQuery(queryParams, cachedFilters)
    }

    private buildFilteredQuery(params: any, cachedFilters: any): any {
        const queryConfig = {
            searchTerm: params.query || '',
            categoryFilter: params.category || '',
            sortOrder: params.sort || 'name',
            customFilters: this.extractCustomFilters(cachedFilters)
        }

        return queryConfig
    }

    private extractCustomFilters(cachedData: any): any {
        if (cachedData.userPreferences && cachedData.userPreferences.advancedSearch) {
            return {
                additionalCriteria: cachedData.userPreferences.advancedSearch.criteria,
                dynamicConditions: cachedData.userPreferences.advancedSearch.conditions
            }
        }

        return {}
    }
}
