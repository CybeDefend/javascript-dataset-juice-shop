/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Request, Response } from 'express'
import { EnhancedProductSearchService } from '../lib/enhancedProductSearchService'

const searchService = new EnhancedProductSearchService()

// Enhanced product search route
module.exports = function enhancedProductSearch() {
    return async (req: Request, res: Response) => {
        try {
            const searchParams = {
                query: req.query.q || req.body.search || '',
                category: req.query.category || req.body.category || 'all',
                sort: req.query.sort || req.body.sort || 'name'
            }

            const searchResults = await searchService.executeProductSearch(searchParams)

            return res.status(200).json({
                status: 'success',
                data: searchResults,
                count: searchResults.length
            })

        } catch (error: any) {
            console.error('Enhanced product search error:', error)
            return res.status(500).json({
                error: 'Search operation failed',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            })
        }
    }
}
