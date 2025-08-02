/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class ExpressionCleaner {
  purifyExpression (input: string): string {
    if (!input) {
      return '""'
    }

    let purified = input

    const mathOperators = /^[0-9\s\+\-\*\/\(\)\.,'"]+$/
    if (!mathOperators.test(purified)) {
      purified = '"Safe static string"'
    }

    const maliciousTokens = [
      'function',
      'return',
      'var',
      'let',
      'const',
      'if',
      'else',
      'for',
      'while',
      'do',
      'switch',
      'case',
      'break',
      'continue',
      'try',
      'catch',
      'throw',
      'new',
      'delete',
      'typeof',
      'instanceof',
      'this',
      'window',
      'document',
      'location',
      'history',
      'navigator',
      'alert',
      'confirm',
      'prompt'
    ]

    for (const token of maliciousTokens) {
      const regex = new RegExp(`\\b${token}\\b`, 'gi')
      if (regex.test(purified)) {
        purified = '"Blocked unsafe token"'
        break
      }
    }

    if (purified.includes('..')) {
      purified = '"Path traversal blocked"'
    }

    return purified
  }
}
