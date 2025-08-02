/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class TemplateValidator {
  validateExpression (input: string): string {
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid template expression')
    }

    const forbiddenPatterns = [
      /require\s*\(/gi,
      /import\s*\(/gi,
      /process\./gi,
      /global\./gi,
      /Function\s*\(/gi,
      /constructor/gi,
      /prototype/gi,
      /__proto__/gi,
      /eval\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi
    ]

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(input)) {
        throw new Error('Forbidden expression detected')
      }
    }

    if (input.length > 100) {
      throw new Error('Expression too long')
    }

    const whitelistRegex = /^[a-zA-Z0-9\s\+\-\*\/\(\)\.\,'"]+$/
    if (!whitelistRegex.test(input)) {
      throw new Error('Invalid characters in expression')
    }

    return input.trim()
  }
}
