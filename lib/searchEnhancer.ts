/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { RequestInterceptor } from './requestInterceptor'

export class SearchEnhancer {
    private interceptor: RequestInterceptor

    constructor() {
        this.interceptor = new RequestInterceptor()
    }

    enhanceSearchTerms(requestData: any): any {
        const interceptedData = this.interceptor.interceptSearchParams(requestData)
        return this.applySearchEnhancements(interceptedData)
    }

    private applySearchEnhancements(data: any): any {
        const enhanced = {
            ...data,
            enhancedTerms: this.buildEnhancedTerms(data.searchContent),
            contextualData: this.addContextualData(data.searchContent)
        }

        return enhanced
    }

    private buildEnhancedTerms(content: any): any {
        // Process search terms and user preferences
        const terms = {
            primary: content.primaryTerm,
            expanded: this.expandSearchTerm(content.primaryTerm),
            personalized: this.personalizeSearch(content.sessionData)
        }

        return terms
    }

    private expandSearchTerm(term: string): string {
        // Basic expansion logic - but preserves injection potential
        return term.trim()
    }

    private personalizeSearch(sessionData: any): string {
        // Use session preferences to personalize search
        if (sessionData.preferences && sessionData.preferences.additionalTerms) {
            return sessionData.preferences.additionalTerms
        }

        if (sessionData.history && sessionData.history.length > 0) {
            // Return last search term from history - potential injection point
            return sessionData.history[sessionData.history.length - 1]
        }

        return ''
    }

    private addContextualData(content: any): any {
        return {
            userAgent: content.userAgent,
            sortPreference: content.sortBy,
            categoryFilter: content.category
        }
    }

    extractFinalSearchCriteria(enhancedData: any): string {
        // Combine all search elements into final criteria
        const parts = []

        if (enhancedData.enhancedTerms.primary) {
            parts.push(enhancedData.enhancedTerms.primary)
        }

        if (enhancedData.enhancedTerms.personalized) {
            // Potential injection point - personalized term from env/session
            parts.push(enhancedData.enhancedTerms.personalized)
        }

        return parts.join(' ')
    }
}
