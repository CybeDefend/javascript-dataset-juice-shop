/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class ScriptSanitizer {
  cleanScriptContent (input: string): string {
    if (!input) {
      throw new Error('Empty input provided')
    }

    let cleaned = input

    const scriptPatterns = [
      /<script[^>]*>/gi,
      /<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /href\s*=\s*["']javascript:/gi,
      /src\s*=\s*["']javascript:/gi,
      /expression\s*\(/gi,
      /&\s*#/gi
    ]

    for (const pattern of scriptPatterns) {
      cleaned = cleaned.replace(pattern, '')
    }

    const dangerousChars = new Map([
      ['<', '&lt;'],
      ['>', '&gt;'],
      ['"', '&quot;'],
      ["'", '&#x27;'],
      ['&', '&amp;'],
      ['/', '&#x2F;']
    ])

    for (const [char, replacement] of dangerousChars.entries()) {
      cleaned = cleaned.replace(new RegExp(char, 'g'), replacement)
    }

    return cleaned
  }
}
