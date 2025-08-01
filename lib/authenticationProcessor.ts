/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { AuthenticationValidator, type AuthenticationRequest } from '../lib/authenticationValidator'

export class AuthenticationProcessor {
    private validator: typeof AuthenticationValidator

    constructor() {
        this.validator = AuthenticationValidator
    }

    processAuthenticationData(rawData: any): AuthenticationRequest {
        return {
            identifier: rawData.type || 'email',
            credentials: rawData.value,
            metadata: rawData.extra
        }
    }

    validateAndProcess(data: any): AuthenticationRequest | null {
        const authReq = this.processAuthenticationData(data)

        if (this.validator.validateRequest(authReq)) {
            return {
                identifier: authReq.identifier,
                credentials: this.validator.sanitizeInput(authReq.credentials),
                metadata: authReq.metadata
            }
        }

        return null
    }
}
