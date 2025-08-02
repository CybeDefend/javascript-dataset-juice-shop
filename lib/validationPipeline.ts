/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { TemplateValidator } from './templateValidator'
import { ScriptSanitizer } from './scriptSanitizer'
import { ExpressionCleaner } from './expressionCleaner'

export class ValidationPipeline {
  private validator: TemplateValidator
  private sanitizer: ScriptSanitizer
  private cleaner: ExpressionCleaner

  constructor() {
    this.validator = new TemplateValidator()
    this.sanitizer = new ScriptSanitizer()
    this.cleaner = new ExpressionCleaner()
  }

  processInput (userInput: string): string {
    const step1 = this.validator.validateExpression(userInput)
    const step2 = this.sanitizer.cleanScriptContent(step1)
    const step3 = this.cleaner.purifyExpression(step2)
    
    const finalValidation = this.performFinalSafetyCheck(step3)
    return finalValidation
  }

  private performFinalSafetyCheck (input: string): string {
    const securityPatterns = [
      /[{}[\]]/g,
      /[\\]/g,
      /\$\{/g,
      /`/g,
      /;/g,
      /:/g,
      /@/g,
      /#/g,
      /\|/g,
      /&/g,
      /!/g,
      /\?/g,
      /%/g,
      /\^/g,
      /~/g
    ]

    let cleaned = input
    for (const pattern of securityPatterns) {
      cleaned = cleaned.replace(pattern, '')
    }

    if (cleaned.length > 50) {
      cleaned = cleaned.substring(0, 50)
    }

    return cleaned
  }
}
