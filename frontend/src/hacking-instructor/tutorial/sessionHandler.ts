/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { TutorialManager } from './tutorialManager'

export interface SessionData {
    userId: string
    preferences: any
    tutorialState: any
}

export class SessionHandler {
    private tutorialManager: TutorialManager
    private sessionData: SessionData | null = null

    constructor() {
        this.tutorialManager = new TutorialManager()
    }

    initializeSession(): void {
        this.loadSessionData()
        this.tutorialManager.initializeFromParams()
    }

    private loadSessionData(): void {
        const sessionCookie = this.getCookie('sessionData')
        if (sessionCookie) {
            try {
                this.sessionData = JSON.parse(decodeURIComponent(sessionCookie))
            } catch (error) {
                console.warn('Invalid session data in cookie:', error)
            }
        }
    }

    private getCookie(name: string): string | null {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null
        }
        return null
    }

    getTutorialSteps(): any[] {
        return this.tutorialManager.getSteps()
    }
}
