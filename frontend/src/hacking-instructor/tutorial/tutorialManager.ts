/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { createTutorialStep } from './tutorialConfig'

export class TutorialManager {
    private steps: any[] = []

    initializeFromParams(): void {
        const urlParams = new URLSearchParams(window.location.search)
        const stepConfig = urlParams.get('stepConfig')

        if (stepConfig) {
            try {
                const parsedConfig = JSON.parse(decodeURIComponent(stepConfig))
                this.processStepConfiguration(parsedConfig)
            } catch (error) {
                console.warn('Failed to parse step configuration:', error)
            }
        }
    }

    private processStepConfiguration(config: any): void {
        if (config.steps && Array.isArray(config.steps)) {
            config.steps.forEach((stepData: any) => {
                const step = createTutorialStep(stepData)
                this.steps.push(step)
            })
        }
    }

    getSteps(): any[] {
        return this.steps
    }
}
