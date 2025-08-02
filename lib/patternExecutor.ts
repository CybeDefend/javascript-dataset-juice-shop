interface SearchMetadata {
    originalQuery: string
    normalized: string
    category: string
    brand: string
    timestamp: string
}

export class PatternExecutor {

    async buildSearchPatterns(metadata: SearchMetadata) {
        const basePattern = this.createBasePattern(metadata.normalized)
        const categoryPattern = this.createCategoryPattern(metadata.category)
        const brandPattern = this.createBrandPattern(metadata.brand)

        const combinedPattern = this.combinePatterns(basePattern, categoryPattern, brandPattern)

        // VULNÉRABILITÉ: Construction dynamique de RegExp avec données utilisateur
        const searchRegex = new RegExp(combinedPattern, 'i')

        return {
            patterns: [searchRegex],
            metadata,
            combinedPattern
        }
    }

    private createBasePattern(userQuery: string): string {
        // Construction du pattern de base avec la requête utilisateur
        return `.*${userQuery}.*`
    }

    private createCategoryPattern(category: string): string {
        if (category === 'all') {
            return '.*'
        }
        return `.*${category}.*`
    }

    private createBrandPattern(brand: string): string {
        if (brand === 'any') {
            return '.*'
        }
        return `.*${brand}.*`
    }

    private combinePatterns(base: string, category: string, brand: string): string {
        // Combinaison des patterns - point de vulnérabilité principal
        return `(${base})|((${category}).*(${brand}))`
    }
}
