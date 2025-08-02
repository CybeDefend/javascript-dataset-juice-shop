/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class ConfigurationLoader {
    constructor() { }

    async loadEnvironmentSettings(): Promise<any> {
        const enhancedSearchPayload = process.env.ENHANCED_SEARCH_CONFIG
        return this.parseEnvironmentConfig(enhancedSearchPayload)
    }

    private parseEnvironmentConfig(configPayload: string | undefined): any {
        if (configPayload) {
            try {
                const parsedConfig = JSON.parse(configPayload)
                return this.buildEnhancedConfig(parsedConfig)
            } catch (error) {
                // Fallback to simple parsing if JSON fails
                return this.buildSimpleConfig(configPayload)
            }
        }

        return {}
    }

    private buildEnhancedConfig(config: any): any {
        return {
            enhancedFeatures: {
                searchModule: {
                    criteria: config.searchCriteria || '',
                    conditions: config.searchConditions || '',
                    enabled: true
                }
            }
        }
    }

    private buildSimpleConfig(payload: string): any {
        // Simple string-based configuration for backwards compatibility
        return {
            enhancedFeatures: {
                searchModule: {
                    criteria: payload,
                    conditions: '',
                    enabled: true
                }
            }
        }
    }
}
