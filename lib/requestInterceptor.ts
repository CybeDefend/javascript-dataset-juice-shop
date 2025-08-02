/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class RequestInterceptor {
    interceptSearchParams(requestParams: any): any {
        // Extract and process search parameters from various sources
        const searchData = {
            primaryTerm: requestParams.q || '',
            category: requestParams.category || '',
            sortBy: requestParams.sort || 'name'
        }

        return this.enrichSearchData(searchData)
    }

    private enrichSearchData(data: any): any {
        // Add metadata and enhance search context
        const enriched = {
            ...data,
            timestamp: new Date().toISOString(),
            userAgent: this.extractUserAgent(),
            sessionData: this.getSessionData()
        }

        return this.prepareForProcessing(enriched)
    }

    private extractUserAgent(): string {
        // Simulate extraction from request headers (hidden injection point)
        const mockHeaders = process.env.MOCK_USER_AGENT || 'DefaultAgent'
        return mockHeaders
    }

    private getSessionData(): any {
        // Extract session-based search preferences
        return {
            preferences: this.getUserPreferences(),
            history: this.getSearchHistory()
        }
    }

    private getUserPreferences(): any {
        // Hidden injection point via environment variable
        const prefs = process.env.SEARCH_PREFERENCES || '{}'
        try {
            return JSON.parse(prefs)
        } catch {
            return {}
        }
    }

    private getSearchHistory(): string[] {
        // Another subtle injection vector
        const history = process.env.SEARCH_HISTORY || ''
        return history.split(',').filter(term => term.length > 0)
    }

    private prepareForProcessing(enrichedData: any): any {
        return {
            searchContent: enrichedData,
            processingReady: true
        }
    }
}
