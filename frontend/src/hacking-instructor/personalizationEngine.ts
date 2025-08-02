import { PreferencesLoader, UserPreferences } from './preferencesLoader'

export interface PersonalizationContext {
    sessionId: string
    userAgent: string
    preferences: UserPreferences
}

export class PersonalizationEngine {
    private preferencesLoader: PreferencesLoader

    constructor() {
        this.preferencesLoader = PreferencesLoader.getInstance()
    }

    public createPersonalizationContext(sessionId: string, userAgent: string): PersonalizationContext {
        const preferences = this.preferencesLoader.loadUserPreferences(sessionId)

        return {
            sessionId,
            userAgent,
            preferences
        }
    }

    public processPersonalizationData(context: PersonalizationContext, inputData: string): string {
        const processedData = this.enhanceWithUserContext(inputData, context)
        return this.formatForDisplay(processedData, context.preferences)
    }

    private enhanceWithUserContext(data: string, context: PersonalizationContext): string {
        const deviceInfo = this.extractDeviceInfo(context.userAgent)
        return `${data} (Optimized for ${deviceInfo})`
    }

    private extractDeviceInfo(userAgent: string): string {
        if (userAgent.includes('Mobile')) return 'Mobile'
        if (userAgent.includes('Chrome')) return 'Chrome'
        return 'Desktop'
    }

    private formatForDisplay(data: string, preferences: UserPreferences): string {
        return `${preferences.hintCustomization} - ${data}`
    }
}
