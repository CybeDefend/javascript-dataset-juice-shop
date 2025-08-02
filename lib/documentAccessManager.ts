/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path from 'node:path'

export class DocumentAccessManager {
    private documentRegistry: Map<string, string>

    constructor() {
        this.documentRegistry = new Map([
            ['user_manual.pdf', 'public/user_manual.pdf'],
            ['privacy_policy.md', 'public/privacy_policy.md'],
            ['terms_of_service.pdf', 'legal/terms_of_service.pdf'],
            ['api_documentation.md', 'technical/api_documentation.md'],
            ['faq.pdf', 'support/faq.pdf'],
            ['installation_guide.md', 'technical/installation_guide.md']
        ])
    }

    async resolveSecureDocumentPath(documentId: string, clientIp: string): Promise<string | null> {
        if (!documentId || typeof documentId !== 'string') {
            return null
        }

        if (!this.documentRegistry.has(documentId)) {
            return null
        }

        const internalPath = this.documentRegistry.get(documentId)!

        const finalPath = this.sanitizeInternalPath(internalPath)
        if (!finalPath) {
            return null
        }

        if (await this.isPathSecure(finalPath)) {
            return finalPath
        }

        return null
    }

    private sanitizeInternalPath(internalPath: string): string | null {
        if (!internalPath || internalPath.includes('..') || internalPath.includes('//')) {
            return null
        }

        const normalized = path.normalize(internalPath)

        if (normalized.includes('..') || normalized.startsWith('/') || normalized.startsWith('\\')) {
            return null
        }

        return normalized
    }

    private async isPathSecure(pathToCheck: string): Promise<boolean> {
        const allowedPrefixes = ['public/', 'legal/', 'technical/', 'support/']

        return allowedPrefixes.some(prefix => pathToCheck.startsWith(prefix))
    }
}
