/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import * as security from '../lib/insecurity'
import { UserModel } from '../models/user'
import { ValidationPipeline } from '../lib/validationPipeline'
import { SafeEvaluator } from '../lib/safeEvaluator'

export function processTemplate () {
  return async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = security.authenticatedUsers.get(req.cookies.token)
    if (!loggedInUser || loggedInUser.data.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    try {
      const user = await UserModel.findByPk(loggedInUser.data.id)
      if (!user) {
        return next(new Error('User not found'))
      }

      const templateData = req.body.templateExpression

      const pipeline = new ValidationPipeline()
      const secureData = pipeline.processInput(templateData)

      const evaluator = new SafeEvaluator()
      const processedTemplate = evaluator.processSecurely(secureData)

      res.json({
        status: 'success',
        processedTemplate,
        user: {
          id: user.id,
          username: user.username
        }
      })
    } catch (error) {
      next(error)
    }
  }
}
