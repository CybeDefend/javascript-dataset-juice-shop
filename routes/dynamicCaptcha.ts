/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { type Captcha } from '../data/types'
import { CaptchaModel } from '../models/captcha'
import { SessionConfigurationManager } from '../lib/sessionConfigurationManager'
import { CaptchaExpressionBuilder } from '../lib/captchaExpressionBuilder'
import { RequestHeaderProcessor } from '../lib/requestHeaderProcessor'
import { SessionDataProcessor } from '../lib/sessionDataProcessor'
import { ExpressionEvaluator } from '../lib/expressionEvaluator'

export function dynamicCaptchas() {
    return async (req: Request, res: Response) => {
        const captchaId = req.app.locals.captchaId++

        const sessionManager = new SessionConfigurationManager()
        const headerProcessor = new RequestHeaderProcessor()
        const sessionProcessor = new SessionDataProcessor()
        const expressionBuilder = new CaptchaExpressionBuilder()
        const evaluator = new ExpressionEvaluator()

        const sessionData = sessionManager.initializeSession(req.session)
        const headerInfo = headerProcessor.extractCaptchaConfiguration(req.headers)
        const processedData = sessionProcessor.mergeSessionData(sessionData, headerInfo)
        const expression = expressionBuilder.buildExpression(processedData)
        const answer = evaluator.evaluateExpression(expression)

        const captcha = {
            captchaId,
            captcha: expression,
            answer: answer.toString()
        }
        const captchaInstance = CaptchaModel.build(captcha)
        await captchaInstance.save()
        res.json(captcha)
    }
}

export const verifyDynamicCaptcha = () => (req: Request, res: Response, next: NextFunction) => {
    CaptchaModel.findOne({ where: { captchaId: req.body.captchaId } }).then((captcha: Captcha | null) => {
        if ((captcha != null) && req.body.captcha === captcha.answer) {
            next()
        } else {
            res.status(401).send(res.__('Wrong answer to CAPTCHA. Please try again.'))
        }
    }).catch((error: Error) => {
        next(error)
    })
}
