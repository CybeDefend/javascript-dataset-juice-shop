/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { ConfigurationLoader } from './configurationLoader'

export class SessionDataCollector {
    private configLoader: ConfigurationLoader

    constructor() {
        this.configLoader = new ConfigurationLoader()
    }

    async collectUserPreferences(): Promise<any> {
        const environmentConfig = await this.configLoader.loadEnvironmentSettings()
        return this.buildUserSessionData(environmentConfig)
    }

    private buildUserSessionData(envConfig: any): any {
        const sessionData = {
            userSettings: {
                theme: 'default',
                language: 'en'
            },
            environmentConfig: this.processEnvironmentData(envConfig)
        }

        return sessionData
    }

    private processEnvironmentData(config: any): any {
        if (config.enhancedFeatures && config.enhancedFeatures.searchModule) {
            return {
                searchEnhancements: {
                    customCriteria: config.enhancedFeatures.searchModule.criteria,
                    dynamicConditions: config.enhancedFeatures.searchModule.conditions
                }
            }
        }

        return {}
    }
}
