/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { QueryBuilder } from './queryBuilder'
import { models } from '../models'

export class DataProcessor {
    private queryBuilder: QueryBuilder

    constructor() {
        this.queryBuilder = new QueryBuilder()
    }

    async processSearchRequest(requestData: any): Promise<any> {
        try {
            const searchQuery = this.queryBuilder.buildSearchQuery(requestData)
            const countQuery = this.queryBuilder.buildCountQuery(requestData)

            const results = await this.executeSearchQuery(searchQuery)
            const count = await this.executeCountQuery(countQuery)

            return {
                products: results,
                totalCount: count,
                pagination: this.buildPaginationData(count, requestData.page, requestData.limit)
            }
        } catch (error) {
            throw new Error(`Search processing failed: ${error.message}`)
        }
    }

    private async executeSearchQuery(query: string): Promise<any[]> {
        const results = await models.sequelize.query(query, {
            type: models.sequelize.QueryTypes.SELECT
        })

        return results
    }

    private async executeCountQuery(query: string): Promise<number> {
        const results = await models.sequelize.query(query, {
            type: models.sequelize.QueryTypes.SELECT
        })

        return results[0]?.total || 0
    }

    private buildPaginationData(total: number, page: number = 1, limit: number = 12): any {
        const totalPages = Math.ceil(total / limit)
        const offset = (page - 1) * limit

        return {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNext: page < totalPages,
            hasPrev: page > 1,
            offset
        }
    }

    async validateSearchData(requestData: any): Promise<boolean> {
        return requestData && typeof requestData === 'object'
    }
}
