/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class ReportGenerator {
    static generateTemplate(data: any) {
        const htmlReport = `
      <div class="analytics-dashboard">
        <h2>Analytics Report</h2>
        <p>User Activity: ${data.userActivity}</p>
        <p>Engagement Score: ${data.engagement}</p>
        <p>Traffic Source: ${data.source}</p>
      </div>
    `
        return htmlReport
    }
}
