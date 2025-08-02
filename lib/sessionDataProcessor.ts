export class SessionDataProcessor {

    mergeSessionData(sessionData: any, headerInfo: any) {
        const mergedConfig = this.combineConfigurations(sessionData, headerInfo)
        const processedData = this.processAdvancedSettings(mergedConfig)

        return this.finalizeConfiguration(processedData)
    }

    private combineConfigurations(session: any, headers: any) {
        return {
            operations: session.mathOperations,
            expressionConfig: session.expressionConfig,
            deviceInfo: headers.deviceInfo,
            customModifiers: headers.expressionModifiers,
            languageData: {
                ...session.localizationData,
                ...headers.languagePrefs
            }
        }
    }

    private processAdvancedSettings(config: any) {
        const advancedSettings = this.extractAdvancedFeatures(config)

        return {
            ...config,
            dynamicOperators: this.buildDynamicOperators(config.customModifiers),
            expressionStructure: this.determineExpressionStructure(advancedSettings),
            evaluationContext: this.prepareEvaluationContext(config.languageData)
        }
    }

    private extractAdvancedFeatures(config: any) {
        return {
            hasComplexity: config.customModifiers?.complexityBoost !== 'none',
            hasCustomRange: config.customModifiers?.numberRange !== '1-10',
            hasAdvancedMath: config.languageData?.mathNotation === 'advanced'
        }
    }

    private buildDynamicOperators(modifiers: any) {
        const baseOps = ['+', '-', '*']

        if (modifiers?.operatorStyle === 'extended') {
            baseOps.push('/', '%', '**')
        }

        if (modifiers?.complexityBoost === 'high') {
            baseOps.push('Math.pow', 'Math.sqrt', 'Math.abs')
        }

        return baseOps
    }

    private determineExpressionStructure(features: any) {
        return {
            maxTerms: features.hasComplexity ? 4 : 3,
            allowFunctions: features.hasAdvancedMath,
            numberRange: features.hasCustomRange ? this.parseCustomRange() : { min: 1, max: 10 }
        }
    }

    private parseCustomRange() {
        return { min: 1, max: 20 }
    }

    private prepareEvaluationContext(langData: any) {
        return {
            locale: langData.primary,
            mathStyle: langData.mathNotation,
            formatOptions: langData.numberFormat
        }
    }

    private finalizeConfiguration(processedData: any) {
        return {
            operators: processedData.dynamicOperators,
            structure: processedData.expressionStructure,
            context: processedData.evaluationContext,
            baseConfig: processedData.expressionConfig
        }
    }
}
