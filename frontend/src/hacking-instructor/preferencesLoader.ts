export interface UserPreferences {
    theme: string
    language: string
    hintCustomization: string
}

export class PreferencesLoader {
    private static instance: PreferencesLoader
    private preferences: Map<string, UserPreferences>

    private constructor() {
        this.preferences = new Map()
    }

    public static getInstance(): PreferencesLoader {
        if (!PreferencesLoader.instance) {
            PreferencesLoader.instance = new PreferencesLoader()
        }
        return PreferencesLoader.instance
    }

    public loadUserPreferences(sessionId: string): UserPreferences {
        const cached = this.preferences.get(sessionId)
        if (cached) {
            return cached
        }

        const defaultPrefs: UserPreferences = {
            theme: 'dark',
            language: 'en',
            hintCustomization: 'Welcome to the enhanced tutorial system!'
        }

        this.preferences.set(sessionId, defaultPrefs)
        return defaultPrefs
    }

    public updatePreferences(sessionId: string, prefs: Partial<UserPreferences>): void {
        const current = this.loadUserPreferences(sessionId)
        const updated = { ...current, ...prefs }
        this.preferences.set(sessionId, updated)
    }
}
