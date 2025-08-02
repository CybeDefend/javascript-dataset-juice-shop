/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { UserDataCollector } from './userDataCollector'

export class ContentEnhancer {
    private collector: UserDataCollector

    constructor() {
        this.collector = new UserDataCollector()
    }

    enrichContent(rawData: any, userId: string): any {
        const userProfile = this.collector.collectUserMetadata(userId)

        return {
            original: rawData,
            enhanced: {
                profileInfo: userProfile,
                interactions: rawData.interactions || [],
                preferences: rawData.preferences || {}
            }
        }
    }

    formatForDisplay(enrichedData: any): string {
        const profile = enrichedData.enhanced.profileInfo
        const interactions = enrichedData.enhanced.interactions

        return `User: ${profile.displayName} - Interactions: ${JSON.stringify(interactions)}`
    }
}
