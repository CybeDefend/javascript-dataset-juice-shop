/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { XssSanitizer } from './xssSanitizer'

export interface ContentValidationResult {
    isValid: boolean
    sanitizedContent: string
    riskLevel: 'low' | 'medium' | 'high'
    blockedPatterns: string[]
}

export class SecureContentValidator {
    private static readonly HIGH_RISK_PATTERNS = [
        /script/i,
        /javascript/i,
        /vbscript/i,
        /onload/i,
        /onerror/i,
        /onclick/i
    ]

    public static validateAndSanitize(content: string, context: 'subtitle' | 'template' | 'general'): ContentValidationResult {
        const result: ContentValidationResult = {
            isValid: true,
            sanitizedContent: content,
            riskLevel: 'low',
            blockedPatterns: []
        }

        if (!content || typeof content !== 'string') {
            result.sanitizedContent = ''
            return result
        }

        // Analyse des patterns à risque
        const detectedPatterns = this.detectRiskyPatterns(content)
        result.blockedPatterns = detectedPatterns

        if (detectedPatterns.length > 0) {
            result.riskLevel = 'high'
            result.isValid = false
        }

        // Sanitisation selon le contexte
        switch (context) {
            case 'subtitle':
                result.sanitizedContent = this.sanitizeSubtitleContent(content)
                break
            case 'template':
                result.sanitizedContent = this.sanitizeTemplateContent(content)
                break
            default:
                result.sanitizedContent = XssSanitizer.sanitizeForScript(content)
        }

        // Validation finale
        if (this.containsExecutableAfterSanitization(result.sanitizedContent)) {
            result.isValid = false
            result.sanitizedContent = ''
            result.riskLevel = 'high'
        }

        return result
    }

    private static detectRiskyPatterns(content: string): string[] {
        const detected: string[] = []

        this.HIGH_RISK_PATTERNS.forEach(pattern => {
            if (pattern.test(content)) {
                detected.push(pattern.source)
            }
        })

        return detected
    }

    private static sanitizeSubtitleContent(content: string): string {
        // Nettoyage spécifique pour les sous-titres
        let cleaned = content
            .replace(/<[^>]*>/g, '') // Supprime toutes les balises HTML
            .replace(/[<>"'&]/g, match => {
                const entities: { [key: string]: string } = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    '&': '&amp;'
                }
                return entities[match] || match
            })

        return XssSanitizer.sanitizeForScript(cleaned)
    }

    private static sanitizeTemplateContent(content: string): string {
        return XssSanitizer.sanitizeForScript(content)
    }

    private static containsExecutableAfterSanitization(content: string): boolean {
        // Vérification finale après sanitisation
        const suspiciousPatterns = [
            /javascript/i,
            /eval/i,
            /function/i,
            /<script/i,
            /on\w+=/i
        ]

        return suspiciousPatterns.some(pattern => pattern.test(content))
    }
}
