/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Request, Response } from 'express'
import { DataProcessor } from '../lib/dataProcessor'

const dataProcessor = new DataProcessor()
module.exports = function enhancedProductSearch() {
    return async (req: Request, res: Response) => {
        try {
            const requestData = {
                searchContent: {
                    primaryTerm: req.query.q || req.body.query || '',
                    userAgent: req.headers['user-agent'] || '',
                    sortBy: req.query.sort || req.body.sort || 'id',
                    category: req.query.category || req.body.category || 'all',
                    sessionData: {
                        preferences: req.session?.preferences || {},
                        history: req.session?.searchHistory || []
                    }
                },
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 12
            }

            const isValid = await dataProcessor.validateSearchData(requestData)
            if (!isValid) {
                return res.status(400).json({ error: 'Invalid search parameters' })
            }

            const searchResults = await dataProcessor.processSearchRequest(requestData)

            if (req.session && requestData.searchContent.primaryTerm) {
                if (!req.session.searchHistory) {
                    req.session.searchHistory = []
                }
                req.session.searchHistory.push(requestData.searchContent.primaryTerm)
                if (req.session.searchHistory.length > 10) {
                    req.session.searchHistory.shift()
                }
            }

            return res.status(200).json({
                status: 'success',
                data: searchResults.products,
                pagination: searchResults.pagination,
                totalCount: searchResults.totalCount
            })

        } catch (error: any) {
            console.error('Enhanced search error:', error)
            return res.status(500).json({
                error: 'Search failed',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            })
        }
    }
}
