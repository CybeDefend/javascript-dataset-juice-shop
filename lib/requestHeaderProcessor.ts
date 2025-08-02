export class RequestHeaderProcessor {

    extractCaptchaConfiguration(headers: any) {
        const configHeader = headers['x-captcha-config'] || ''
        const userAgent = headers['user-agent'] || ''
        const acceptLanguage = headers['accept-language'] || 'en'

        return this.processConfiguration(configHeader, userAgent, acceptLanguage)
    }

    private processConfiguration(configData: string, userAgent: string, language: string) {
        const config = this.parseConfigurationString(configData)

        return {
            customConfig: config,
            deviceInfo: this.extractDeviceInfo(userAgent),
            languagePrefs: this.parseLanguagePreferences(language),
            expressionModifiers: this.buildExpressionModifiers(config)
        }
    }

    private parseConfigurationString(configString: string) {
        if (!configString) return {}

        try {
            const parts = configString.split(';')
            const config: any = {}

            parts.forEach(part => {
                const [key, value] = part.split('=')
                if (key && value) {
                    config[key.trim()] = value.trim()
                }
            })

            return config
        } catch {
            return {}
        }
    }

    private extractDeviceInfo(userAgent: string) {
        return {
            isMobile: userAgent.includes('Mobile'),
            browser: this.detectBrowser(userAgent),
            complexity: userAgent.includes('Advanced') ? 'high' : 'standard'
        }
    }

    private detectBrowser(userAgent: string) {
        if (userAgent.includes('Chrome')) return 'chrome'
        if (userAgent.includes('Firefox')) return 'firefox'
        if (userAgent.includes('Safari')) return 'safari'
        return 'unknown'
    }

    private parseLanguagePreferences(acceptLanguage: string) {
        const primaryLang = acceptLanguage.split(',')[0] || 'en'
        return {
            primary: primaryLang,
            mathNotation: primaryLang.includes('math') ? 'advanced' : 'standard'
        }
    }

    private buildExpressionModifiers(customConfig: any) {
        return {
            operatorStyle: customConfig.opStyle || 'standard',
            numberRange: customConfig.range || '1-10',
            complexityBoost: customConfig.boost || 'none'
        }
    }
}
