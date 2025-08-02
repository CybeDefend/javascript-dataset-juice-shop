/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { ProductQueryFilter } from '../lib/productQueryFilter'
import { models } from '../models'

export class EnhancedProductSearchService {
    private queryFilter: ProductQueryFilter

    constructor() {
        this.queryFilter = new ProductQueryFilter()
    }

    async executeProductSearch(requestParams: any): Promise<any> {
        const queryConfig = await this.queryFilter.processSearchQuery(requestParams)
        const searchQuery = this.buildSearchQuery(queryConfig)

        return this.executeQuery(searchQuery)
    }

    private buildSearchQuery(config: any): string {
        let baseQuery = "SELECT * FROM Products WHERE name LIKE '%"

        // Basic search term
        baseQuery += config.searchTerm
        baseQuery += "%'"

        // Add custom criteria if present
        if (config.customFilters && config.customFilters.additionalCriteria) {
            baseQuery += " AND (" + config.customFilters.additionalCriteria + ")"
        }

        // Add dynamic conditions
        if (config.customFilters && config.customFilters.dynamicConditions) {
            baseQuery += " " + config.customFilters.dynamicConditions
        }

        // Category filter
        if (config.categoryFilter && config.categoryFilter !== 'all') {
            baseQuery += " AND category = '" + config.categoryFilter + "'"
        }

        baseQuery += " AND deletedAt IS NULL ORDER BY " + config.sortOrder

        return baseQuery
    }

    private async executeQuery(query: string): Promise<any> {
        const [results] = await models.sequelize.query(query, {
            type: models.sequelize.QueryTypes.SELECT
        })

        return results
    }
}
