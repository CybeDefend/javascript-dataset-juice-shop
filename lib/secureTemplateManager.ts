/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { SecureContentValidator } from './secureContentValidator'

export class SecureTemplateManager {
    private static readonly TEMPLATE_PATTERNS = {
        SCRIPT_TAG: /<script\s+id="([^"]+)"\s*><\/script>/g,
        SUBTITLE_PLACEHOLDER: '{{SECURE_SUBTITLES}}',
        SAFE_ATTRIBUTES: ['id', 'type', 'data-label', 'data-lang']
    }

    public static processTemplate(template: string, subtitleContent: string): string {
        // Validation du contenu des sous-titres
        const validationResult = SecureContentValidator.validateAndSanitize(
            subtitleContent,
            'subtitle'
        )

        if (!validationResult.isValid) {
            console.warn('[SecureTemplateManager] Blocked potentially dangerous subtitle content:',
                validationResult.blockedPatterns)
            return template.replace(
                this.TEMPLATE_PATTERNS.SCRIPT_TAG,
                '<script id="$1" type="text/vtt" data-label="English" data-lang="en"><!-- Content blocked for security --></script>'
            )
        }

        // Injection sécurisée du contenu validé
        return this.injectSecureContent(template, validationResult.sanitizedContent)
    }

    private static injectSecureContent(template: string, secureContent: string): string {
        // Remplacement sécurisé dans les balises script
        return template.replace(
            this.TEMPLATE_PATTERNS.SCRIPT_TAG,
            (match, scriptId) => {
                // Double échappement pour contexte JavaScript
                const doubleEscaped = this.doubleEscapeForScript(secureContent)

                return `<script id="${scriptId}" type="text/vtt" data-label="English" data-lang="en">${doubleEscaped}</script>`
            }
        )
    }

    private static doubleEscapeForScript(content: string): string {
        // Premier niveau d'échappement
        let escaped = content
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')

        // Deuxième niveau pour contexte HTML
        escaped = escaped
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/&/g, '&amp;')

        return escaped
    }

    public static validateTemplateIntegrity(template: string): boolean {
        // Vérification que le template ne contient pas de code malicieux
        const dangerousPatterns = [
            /eval\s*\(/i,
            /Function\s*\(/i,
            /setTimeout\s*\(/i,
            /setInterval\s*\(/i,
            /document\.write/i,
            /innerHTML/i
        ]

        return !dangerousPatterns.some(pattern => pattern.test(template))
    }
}
