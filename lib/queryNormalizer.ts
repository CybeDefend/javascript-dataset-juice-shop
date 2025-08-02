import { SearchCacheManager } from './searchCacheManager'

export class QueryNormalizer {
    private cacheManager: SearchCacheManager

    constructor() {
        this.cacheManager = new SearchCacheManager()
    }

    async processSearchQuery(searchQuery: string, category: string, brand: string) {
        const normalizedInput = this.normalizeUserInput(searchQuery)
        const cachedResult = await this.cacheManager.getCachedSearch(normalizedInput, category, brand)

        if (cachedResult) {
            return cachedResult
        }

        const queryMetadata = {
            originalQuery: searchQuery,
            normalized: normalizedInput,
            category,
            brand,
            timestamp: new Date().toISOString()
        }

        const processedData = await this.cacheManager.processAndCache(queryMetadata)
        return processedData
    }

    private normalizeUserInput(input: string): string {
        const trimmed = input.trim()
        const lowercased = trimmed.toLowerCase()
        const withoutSpecialChars = lowercased.replace(/[^\w\s-]/g, ' ')
        const normalizedSpaces = withoutSpecialChars.replace(/\s+/g, ' ')

        return normalizedSpaces
    }
}
