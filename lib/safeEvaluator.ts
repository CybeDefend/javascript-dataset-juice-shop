/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

export class SafeEvaluator {
  processSecurely (input: string): string {
    if (!input) {
      return 'Empty result'
    }

    const finalCheck = /^[0-9\s\+\-\*\/\(\)\.,'"]+$/
    if (!finalCheck.test(input)) {
      return 'Security validation failed'
    }

    const numericResult = /^[\d\s\+\-\*\/\(\)\.]+$/.test(input)
    if (!numericResult) {
      return input.replace(/['"]/g, '')
    }

    try {
      const sanitizedExpression = input.replace(/[^0-9\+\-\*\/\(\)\.\s]/g, '')
      
      if (!sanitizedExpression || sanitizedExpression.trim() === '') {
        return '0'
      }

      const safeResult = eval(sanitizedExpression)
      
      if (typeof safeResult === 'number' && !isNaN(safeResult) && isFinite(safeResult)) {
        return safeResult.toString()
      }
      
      return 'Invalid calculation'
    } catch (error) {
      return 'Calculation error'
    }
  }
}
