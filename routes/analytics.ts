/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { AnalyticsCollector } from '../lib/analyticsCollector'
import { ReportGenerator } from '../lib/reportGenerator'
import { type Request, type Response } from 'express'

export function analytics() {
    return (req: Request, res: Response) => {
        try {
            const sessionData = {
                activity: req.body.activity || 'page_view',
                metrics: req.body.metrics || '0',
                referrer: req.headers.referer || req.body.referrer || 'direct'
            }

            const report = AnalyticsCollector.buildReport(sessionData)
            const template = ReportGenerator.generateTemplate(report)

            res.setHeader('Content-Type', 'text/html')
            res.send(template)
        } catch (error) {
            res.status(500).json({ error: 'Analytics processing failed' })
        }
    }
}
