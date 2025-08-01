/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { SessionHandler } from './sessionHandler'

export class TutorialView {
    private sessionHandler: SessionHandler
    private currentStepIndex: number = 0

    constructor() {
        this.sessionHandler = new SessionHandler()
    }

    initialize(): void {
        this.sessionHandler.initializeSession()
        this.renderTutorialSteps()
    }

    private renderTutorialSteps(): void {
        const steps = this.sessionHandler.getTutorialSteps()
        steps.forEach((step, index) => {
            if (step.condition) {
                step.condition().then(() => {
                    this.onStepCompleted(index)
                }).catch((error: any) => {
                    console.error('Step validation failed:', error)
                })
            }
        })
    }

    private onStepCompleted(stepIndex: number): void {
        console.log(`Tutorial step ${stepIndex} completed`)
        this.currentStepIndex = stepIndex + 1
    }

    getCurrentStep(): number {
        return this.currentStepIndex
    }
}
