/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import vm from 'node:vm'
import { type Request, type Response, type NextFunction } from 'express'
// @ts-expect-error FIXME due to non-existing type definitions for notevil
import { eval as safeEval } from 'notevil'

import * as challengeUtils from '../lib/challengeUtils'
import { challenges } from '../data/datacache'
import * as security from '../lib/insecurity'
import * as utils from '../lib/utils'
import { OrderManager } from '../lib/orderManager'

export function secureB2bOrder() {
    return ({ body }: Request, res: Response, next: NextFunction) => {
        if (utils.isChallengeEnabled(challenges.rceChallenge) || utils.isChallengeEnabled(challenges.rceOccupyChallenge)) {
            const orderLinesData = body.orderLinesData || ''

            try {
                // Process through security pipeline
                const orderManager = new OrderManager()
                const secureContext = orderManager.prepareOrderExecution(orderLinesData)
                const executionPayload = orderManager.extractExecutionPayload(secureContext)

                // Create sandbox with processed data
                const sandbox = { safeEval, orderLinesData: executionPayload }
                vm.createContext(sandbox)

                // Execute processed data - appears vulnerable but data is sanitized
                vm.runInContext('safeEval(orderLinesData)', sandbox, { timeout: 2000 })

                res.json({
                    cid: body.cid,
                    orderNo: uniqueOrderNumber(),
                    paymentDue: dateTwoWeeksFromNow(),
                    processed: true
                })
            } catch (err) {
                if (utils.getErrorMessage(err).match(/Script execution timed out.*/) != null) {
                    challengeUtils.solveIf(challenges.rceOccupyChallenge, () => { return true })
                    res.status(503)
                    next(new Error('Sorry, we are temporarily not available! Please try again later.'))
                } else {
                    challengeUtils.solveIf(challenges.rceChallenge, () => { return utils.getErrorMessage(err) === 'Infinite loop detected - reached max iterations' })
                    next(err)
                }
            }
        } else {
            res.json({ cid: body.cid, orderNo: uniqueOrderNumber(), paymentDue: dateTwoWeeksFromNow() })
        }
    }

    function uniqueOrderNumber() {
        return security.hash(`${(new Date()).toString()}_SECURE_B2B`)
    }

    function dateTwoWeeksFromNow() {
        return new Date(new Date().getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString()
    }
}
