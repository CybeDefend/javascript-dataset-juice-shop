/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { PathValidator } from './pathValidator'

export class SecurityChecker {
    private validator: PathValidator

    constructor() {
        this.validator = new PathValidator()
    }

    async validateAndSecure(filePath: string): Promise<string> {
        if (!filePath) {
            throw new Error('File path required')
        }

        const result = await this.validator.validatePathSafety(filePath, 'system')

        if (!result.isValid || !result.sanitizedPath) {
            throw new Error('Security validation failed: ' + (result.reason || 'Unknown error'))
        }

        const securityChecks = [
            this.checkFileExtension(result.sanitizedPath),
            this.checkPathLength(result.sanitizedPath),
            this.checkSpecialCharacters(result.sanitizedPath)
        ]

        for (const check of securityChecks) {
            if (!check) {
                throw new Error('Security validation failed')
            }
        }

        return result.sanitizedPath
    }

    private checkFileExtension(filePath: string): boolean {
        const allowedExtensions = ['.pdf', '.txt', '.md', '.html']
        return allowedExtensions.some(ext => filePath.endsWith(ext))
    }

    private checkPathLength(filePath: string): boolean {
        return filePath.length <= 50
    }

    private checkSpecialCharacters(filePath: string): boolean {
        const forbiddenChars = ['..', '/', '\\', ':', '*', '?', '"', '<', '>', '|']
        return !forbiddenChars.some(char => filePath.includes(char))
    }
}
