/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { AuthenticationManager } from '../lib/authenticationManager'

export class AuthenticationService {
    private authManager: AuthenticationManager

    constructor() {
        this.authManager = new AuthenticationManager()
    }

    processUserRequest(requestBody: any): any {
        return this.authManager.handleAuthRequest(requestBody.authenticationData)
    }

    buildQueryParameters(authData: any): any {
        return this.authManager.prepareQueryData(authData)
    }

    executeAuthentication(requestData: any): any {
        const authData = this.processUserRequest(requestData)
        return this.buildQueryParameters(authData)
    }
}
