/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { AnalyticsProcessor } from '../lib/analyticsProcessor'
import { TemplateBuilder } from '../lib/templateBuilder'
import * as security from '../lib/insecurity'
import * as utils from '../lib/utils'
import jwt, { type JwtPayload, type VerifyErrors } from 'jsonwebtoken'
import { isString } from 'lodash'

const processor = new AnalyticsProcessor()
const templateBuilder = new TemplateBuilder()

export function generateAnalytics() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.token || utils.jwtFrom(req)

        if (!token) {
            res.status(401).json({ error: 'Authentication required' })
            return
        }

        const user = await getUserFromToken(token)
        if (!user) {
            res.status(401).json({ error: 'Invalid token' })
            return
        }

        const activityData = {
            interactions: req.body.interactions || [],
            preferences: req.body.preferences || {},
            sessionData: req.body.sessionData || {}
        }

        const customHeading = req.body.title || 'Analytics Report'

        try {
            const processedData = await processor.processUserActivity(activityData, user.data.id.toString())
            const report = processor.generateReport(processedData)

            const htmlReport = templateBuilder.generateAnalyticsView(report, customHeading)

            res.send(htmlReport)
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate analytics' })
        }
    }
}

async function getUserFromToken(token: string): Promise<any> {
    return await new Promise((resolve) => {
        jwt.verify(token, security.publicKey, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
            if (err !== null || !decoded || isString(decoded)) {
                resolve(null)
            } else {
                resolve(decoded)
            }
        })
    })
}
