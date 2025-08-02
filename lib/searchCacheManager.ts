import { PatternExecutor } from './patternExecutor'

interface SearchMetadata {
    originalQuery: string
    normalized: string
    category: string
    brand: string
    timestamp: string
}

export class SearchCacheManager {
    private patternExecutor: PatternExecutor
    private cache: Map<string, any> = new Map()

    constructor() {
        this.patternExecutor = new PatternExecutor()
    }

    async getCachedSearch(normalizedQuery: string, category: string, brand: string) {
        const cacheKey = this.generateCacheKey(normalizedQuery, category, brand)
        return this.cache.get(cacheKey) || null
    }

    async processAndCache(metadata: SearchMetadata) {
        const searchKey = this.generateSearchKey(metadata)
        const patterns = await this.patternExecutor.buildSearchPatterns(metadata)

        const result = {
            patterns,
            metadata,
            generatedAt: new Date().toISOString()
        }

        const cacheKey = this.generateCacheKey(metadata.normalized, metadata.category, metadata.brand)
        this.cache.set(cacheKey, result)

        return result
    }

    private generateCacheKey(query: string, category: string, brand: string): string {
        return `${query}_${category}_${brand}`.replace(/\s/g, '_')
    }

    private generateSearchKey(metadata: SearchMetadata): string {
        return `search_${metadata.normalized}_${Date.now()}`
    }
}
