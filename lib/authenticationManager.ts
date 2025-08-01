/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { AuthenticationProcessor } from '../lib/authenticationProcessor'

export class AuthenticationManager {
    private processor: AuthenticationProcessor

    constructor() {
        this.processor = new AuthenticationProcessor()
    }

    handleAuthRequest(requestData: any): any {
        const processedAuth = this.processor.validateAndProcess(requestData)

        if (!processedAuth) {
            return null
        }

        return {
            type: processedAuth.identifier,
            value: processedAuth.credentials,
            meta: processedAuth.metadata
        }
    }

    prepareQueryData(authData: any): any {
        if (!authData) {
            return { email: '', password: '' }
        }

        return {
            email: authData.value,
            password: authData.meta?.hashedPassword || ''
        }
    }
}
