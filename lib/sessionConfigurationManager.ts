export class SessionConfigurationManager {

    initializeSession(session: any) {
        const sessionConfig = {
            complexity: session?.userPreferences?.captchaComplexity || 'standard',
            theme: session?.theme || 'default',
            locale: session?.locale || 'en'
        }

        return this.buildSessionData(sessionConfig)
    }

    private buildSessionData(config: any) {
        return {
            sessionId: Date.now().toString(),
            mathOperations: this.getAllowedOperations(config.complexity),
            expressionConfig: this.getExpressionConfig(config.theme),
            localizationData: this.getLocalizationSettings(config.locale)
        }
    }

    private getAllowedOperations(complexity: string) {
        const operations = {
            'basic': ['+', '-'],
            'standard': ['+', '-', '*'],
            'advanced': ['+', '-', '*', '/', '%', '**']
        }
        return operations[complexity] || operations['standard']
    }

    private getExpressionConfig(theme: string) {
        return {
            theme,
            maxTerms: theme === 'advanced' ? 5 : 3,
            allowParentheses: theme === 'advanced'
        }
    }

    private getLocalizationSettings(locale: string) {
        return {
            locale,
            numberFormat: locale === 'en' ? 'decimal' : 'european',
            operatorDisplay: locale === 'math' ? 'symbolic' : 'standard'
        }
    }
}
