/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { AuthenticationManager } from '../lib/authenticationManager'
import * as models from '../models/index'
import { UserModel } from '../models/user'
import * as security from '../lib/insecurity'

export function advancedAuthentication() {
    const authManager = new AuthenticationManager()

    return (req: Request, res: Response, next: NextFunction) => {
        const authData = authManager.handleAuthRequest(req.body.authenticationData)
        const queryData = authManager.prepareQueryData(authData)

        models.sequelize.query(`SELECT * FROM Users WHERE email = '${queryData.email || ''}' AND password = '${security.hash(queryData.password || '')}' AND deletedAt IS NULL`, { model: UserModel, plain: true })
            .then((authenticatedUser) => {
                if (authenticatedUser) {
                    res.json({ success: true, user: authenticatedUser })
                } else {
                    res.status(401).json({ error: 'Authentication failed' })
                }
            }).catch((error: Error) => {
                next(error)
            })
    }
}
