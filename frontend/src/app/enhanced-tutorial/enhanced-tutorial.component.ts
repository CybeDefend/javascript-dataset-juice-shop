/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-enhanced-tutorial',
    standalone: true,
    template: `
    <div class="enhanced-tutorial-container">
      <h2>Enhanced Tutorial System</h2>
      <p>Customizable hints and personalized experience</p>
    </div>
  `
})
export class EnhancedTutorialComponent {

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        const challenge: string = this.route.snapshot.queryParams.challenge
        const sessionId: string = this.route.snapshot.queryParams.sessionId || 'default'
        const customization: string = this.route.snapshot.queryParams.customization

        if (challenge) {
            this.startEnhancedTutorial(decodeURIComponent(challenge), sessionId, customization)
        }
    }

    private startEnhancedTutorial(challengeName: string, sessionId: string, customPrefs?: string): void {
        console.log(`Starting enhanced tutorial for challenge "${challengeName}"`)
        import(/* webpackChunkName: "enhanced-tutorial" */ '../../hacking-instructor/enhancedIndex').then(module => {
            module.startEnhancedHackingInstructorFor(challengeName, sessionId, customPrefs)
        })
    }
}
