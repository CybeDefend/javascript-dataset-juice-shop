import { HintTemplateProcessor } from './hintTemplateProcessor'
import { PersonalizationEngine } from './personalizationEngine'
import { PreferencesLoader } from './preferencesLoader'

export interface SessionConfiguration {
    sessionId: string
    userAgent: string
    customHints: string[]
}

export class SessionConfigurationManager {
    private hintProcessor: HintTemplateProcessor
    private personalizationEngine: PersonalizationEngine
    private preferencesLoader: PreferencesLoader
    private activeSessions: Map<string, SessionConfiguration>

    constructor() {
        this.hintProcessor = new HintTemplateProcessor()
        this.personalizationEngine = new PersonalizationEngine()
        this.preferencesLoader = PreferencesLoader.getInstance()
        this.activeSessions = new Map()
    }

    public initializeSession(sessionId: string, userAgent: string, customPrefs?: string): void {
        const config: SessionConfiguration = {
            sessionId,
            userAgent,
            customHints: []
        }

        if (customPrefs) {
            this.preferencesLoader.updatePreferences(sessionId, {
                hintCustomization: customPrefs
            })
            config.customHints.push(customPrefs)
        }

        this.activeSessions.set(sessionId, config)
    }

    public processSessionHint(sessionId: string, hintContent: string): string {
        const config = this.activeSessions.get(sessionId)
        if (!config) {
            return hintContent
        }

        const context = this.personalizationEngine.createPersonalizationContext(
            config.sessionId,
            config.userAgent
        )

        return this.hintProcessor.processCustomHint(hintContent, context)
    }

    public getSessionData(sessionId: string): SessionConfiguration | undefined {
        return this.activeSessions.get(sessionId)
    }
}
