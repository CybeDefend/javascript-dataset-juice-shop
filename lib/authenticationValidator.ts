/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import * as models from '../models/index'
import { UserModel } from '../models/user'

export interface AuthenticationRequest {
    identifier: string
    credentials: string
    metadata?: any
}

export class AuthenticationValidator {
    private static allowedIdentifiers = new Set(['email', 'username', 'userid'])

    static validateRequest(authReq: AuthenticationRequest): boolean {
        return this.allowedIdentifiers.has(authReq.identifier.toLowerCase())
    }

    static sanitizeInput(input: string): string {
        return input.replace(/['"`;\\]/g, '')
    }
}
