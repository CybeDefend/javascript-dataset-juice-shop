import { type NextFunction, type Request, type Response } from 'express'
import { SearchPatternBuilder } from '../lib/searchPatternBuilder'
import * as utils from '../lib/utils'

interface SearchRequestQuery {
    query: string
    category?: string
    brand?: string
    sortBy?: string
}

export const advancedProductSearch = () => async (req: Request<any, any, any, SearchRequestQuery>, res: Response, next: NextFunction) => {
    try {
        const searchQuery = req.query.query
        const category = req.query.category || 'all'
        const brand = req.query.brand || 'any'
        const sortBy = req.query.sortBy || 'relevance'

        if (!searchQuery) {
            return res.status(400).json({
                status: 'error',
                error: 'Missing required search query parameter'
            })
        }

        const searchBuilder = new SearchPatternBuilder()
        const searchResults = await searchBuilder.performAdvancedSearch(
            searchQuery,
            category,
            brand,
            sortBy
        )

        res.status(200).json({
            status: 'success',
            results: searchResults,
            total: searchResults.length,
            query: searchQuery,
            filters: { category, brand, sortBy }
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: utils.getErrorMessage(error)
        })
    }
}
