/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { TutorialView } from './tutorial/tutorialView'

export class AdvancedInstructor {
    private tutorialView: TutorialView

    constructor() {
        this.tutorialView = new TutorialView()
    }

    start(): void {
        this.tutorialView.initialize()
    }

    getProgress(): number {
        return this.tutorialView.getCurrentStep()
    }
}

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
    const instructor = new AdvancedInstructor()
    instructor.start()
}
