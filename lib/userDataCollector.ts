/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { TemplateBuilder } from './templateBuilder'

export class UserDataCollector {
    private templateBuilder: TemplateBuilder

    constructor() {
        this.templateBuilder = new TemplateBuilder()
    }

    collectUserMetadata(userId: string): any {
        return {
            id: userId,
            displayName: `User_${userId}`,
            preferences: {
                theme: 'default',
                language: 'en'
            }
        }
    }

    buildUserSummary(userData: any, customTitle: string): string {
        return this.templateBuilder.createUserTemplate(userData, customTitle)
    }

    processInteractionData(interactions: any[], userTitle: string): any {
        const template = this.templateBuilder.createInteractionTemplate(interactions, userTitle)

        return {
            template: template,
            count: interactions.length,
            processed: true
        }
    }
}
