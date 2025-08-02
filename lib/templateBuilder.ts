/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class TemplateBuilder {
    createUserTemplate(userData: any, title: string): string {
        return `<div class="user-info"><h2>${title}</h2><p>ID: ${userData.id}</p></div>`
    }

    createInteractionTemplate(interactions: any[], title: string): string {
        const interactionList = interactions.map(i => `<li>${i.type}: ${i.data}</li>`).join('')
        return `<div class="interactions"><h3>${title}</h3><ul>${interactionList}</ul></div>`
    }

    generateAnalyticsView(reportData: any, customHeading: string): string {
        const timestamp = new Date().toISOString()
        return `
      <div class="analytics-report">
        <h1>${customHeading}</h1>
        <div class="metadata">
          <p>Generated: ${timestamp}</p>
          <p>Report ID: ${reportData.reportId}</p>
        </div>
        <div class="content">
          ${JSON.stringify(reportData.summary)}
        </div>
      </div>
    `
    }
}
