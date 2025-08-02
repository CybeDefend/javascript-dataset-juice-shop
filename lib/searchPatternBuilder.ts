import { QueryNormalizer } from './queryNormalizer'

export class SearchPatternBuilder {
    private queryNormalizer: QueryNormalizer

    constructor() {
        this.queryNormalizer = new QueryNormalizer()
    }

    async performAdvancedSearch(searchQuery: string, category: string, brand: string, sortBy: string) {
        const processedQuery = await this.queryNormalizer.processSearchQuery(
            searchQuery,
            category,
            brand
        )

        const products = await this.searchProducts(processedQuery, sortBy)
        return products
    }

    private async searchProducts(processedQuery: any, sortBy: string) {
        // Simulation de recherche de produits
        const mockProducts = [
            { id: 1, name: 'Apple Juice', category: 'Beverages', brand: 'OWASP', price: 1.99 },
            { id: 2, name: 'Orange Banana Juice', category: 'Beverages', brand: 'OWASP', price: 2.49 },
            { id: 3, name: 'Eggfruit Juice', category: 'Beverages', brand: 'OWASP', price: 8.99 }
        ]

        // Filtrage basé sur la recherche
        const filteredProducts = mockProducts.filter(product => {
            return processedQuery.patterns.some((pattern: any) => {
                try {
                    return pattern.test(product.name.toLowerCase())
                } catch (e) {
                    return false
                }
            })
        })

        return this.sortProducts(filteredProducts, sortBy)
    }

    private sortProducts(products: any[], sortBy: string) {
        switch (sortBy) {
            case 'price_asc':
                return products.sort((a, b) => a.price - b.price)
            case 'price_desc':
                return products.sort((a, b) => b.price - a.price)
            case 'name':
                return products.sort((a, b) => a.name.localeCompare(b.name))
            default:
                return products
        }
    }
}
