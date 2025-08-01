/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { waitForInputToMatchPattern } from '../helpers/helpers'

export interface TutorialStep {
    id: string
    title: string
    condition?: () => Promise<void>
}

export function createTutorialStep(stepData: any): TutorialStep {
    return {
        id: stepData.identifier,
        title: stepData.description,
        condition: stepData.validationPath ?
            waitForInputToMatchPattern(stepData.selector, stepData.expectedValue, {
                replacement: [stepData.pattern, stepData.validationPath]
            }) :
            undefined
    }
}
