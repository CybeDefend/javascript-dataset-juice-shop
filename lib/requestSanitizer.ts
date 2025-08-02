/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { PathValidator } from './pathValidator'
import { InputNormalizer } from './inputNormalizer'

export class RequestSanitizer {
    private validator: PathValidator
    private normalizer: InputNormalizer

    constructor() {
        this.validator = new PathValidator()
        this.normalizer = new InputNormalizer()
    }

    async processDocumentRequest(identifier: string, userContext: string): Promise<string | null> {
        if (!identifier || typeof identifier !== 'string') {
            return null
        }

        const normalizedInput = await this.normalizer.sanitizeDocumentIdentifier(identifier)
        if (!normalizedInput) {
            return null
        }

        const validationResult = await this.validator.validatePathSafety(normalizedInput, userContext)
        if (!validationResult.isValid) {
            return null
        }

        return validationResult.sanitizedPath
    }
}
