/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Request, Response } from 'express'
import * as fs from 'fs'
import * as config from 'config'
import { SecureTemplateManager } from '../lib/secureTemplateManager'
import { SecureContentValidator } from '../lib/secureContentValidator'

export function securePromotionVideo() {
    return (req: Request, res: Response) => {
        try {
            // Lecture sécurisée du template
            const templatePath = 'views/promotionVideo.pug'
            if (!fs.existsSync(templatePath)) {
                return res.status(404).send('Template not found')
            }

            const templateContent = fs.readFileSync(templatePath, 'utf8')

            // Validation de l'intégrité du template
            if (!SecureTemplateManager.validateTemplateIntegrity(templateContent)) {
                return res.status(500).send('Template integrity check failed')
            }

            // Obtention sécurisée des sous-titres
            const subtitleContent = getSecureSubtitles()

            // Traitement sécurisé du template avec validation multi-couches
            const processedTemplate = SecureTemplateManager.processTemplate(
                templateContent,
                subtitleContent
            )

            // Configuration des en-têtes de sécurité
            res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-inline'; object-src 'none';")
            res.setHeader('X-Content-Type-Options', 'nosniff')
            res.setHeader('X-Frame-Options', 'DENY')

            res.send(processedTemplate)

        } catch (error) {
            res.status(500).send('Internal server error')
        }
    }
}

function getSecureSubtitles(): string {
    try {
        // Configuration sécurisée des sous-titres
        let subtitleFile = 'JuiceShopJingle.vtt'

        if (config.has('application.promotion.subtitles')) {
            const configuredFile = config.get<string>('application.promotion.subtitles')

            // Validation du nom de fichier pour éviter path traversal
            if (isValidSubtitleFile(configuredFile)) {
                subtitleFile = configuredFile
            }
        }

        const subtitlePath = `frontend/dist/frontend/assets/public/videos/${subtitleFile}`

        // Vérification de l'existence du fichier
        if (!fs.existsSync(subtitlePath)) {
            return 'Default subtitle content'
        }

        const rawContent = fs.readFileSync(subtitlePath, 'utf8')

        // Validation et sanitisation du contenu
        const validationResult = SecureContentValidator.validateAndSanitize(
            rawContent,
            'subtitle'
        )

        if (!validationResult.isValid) {
            // Log de sécurité (dans un vrai système)
            return 'Subtitle content blocked for security reasons'
        }

        return validationResult.sanitizedContent

    } catch (error) {
        return 'Error loading subtitles'
    }
}

function isValidSubtitleFile(filename: string): boolean {
    // Validation stricte du nom de fichier
    const validPattern = /^[a-zA-Z0-9_-]+\.vtt$/
    const hasPathTraversal = filename.includes('..') || filename.includes('/') || filename.includes('\\')

    return validPattern.test(filename) && !hasPathTraversal
}
