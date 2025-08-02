/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { InputNormalizer } from './inputNormalizer'

export class PathBuilder {
    private normalizer: InputNormalizer

    constructor() {
        this.normalizer = new InputNormalizer()
    }

    async buildSecurePath(documentId: string): Promise<string> {
        if (!documentId) {
            throw new Error('Document ID required')
        }

        const normalizedId = await this.normalizer.sanitizeDocumentIdentifier(documentId)

        if (!normalizedId) {
            throw new Error('Document ID validation failed')
        }

        const allowedDocuments = [
            'manual1', 'manual2', 'manual3', 'guide1', 'guide2', 'guide3',
            'readme', 'changelog', 'license', 'terms', 'privacy', 'help',
            'faq', 'support', 'contact', 'about', 'news', 'updates'
        ]

        if (!allowedDocuments.includes(normalizedId)) {
            throw new Error('Document not found in whitelist')
        }

        return `${normalizedId}.pdf`
    }
}
