export class CaptchaExpressionBuilder {

    buildExpression(configData: any) {
        const terms = this.generateTerms(configData.structure)
        const operators = this.selectOperators(configData.operators, terms.length - 1)

        return this.constructExpression(terms, operators, configData.context)
    }

    private generateTerms(structure: any) {
        const count = structure.maxTerms || 3
        const range = structure.numberRange || { min: 1, max: 10 }

        const terms = []
        for (let i = 0; i < count; i++) {
            terms.push(Math.floor(Math.random() * (range.max - range.min + 1)) + range.min)
        }

        return terms
    }

    private selectOperators(availableOps: string[], count: number) {
        const selectedOps = []

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * availableOps.length)
            selectedOps.push(availableOps[randomIndex])
        }

        return selectedOps
    }

    private constructExpression(terms: number[], operators: string[], context: any) {
        let expression = terms[0].toString()

        for (let i = 0; i < operators.length; i++) {
            const operator = this.formatOperator(operators[i], context)
            expression += operator + terms[i + 1].toString()
        }

        return this.applyContextualFormatting(expression, context)
    }

    private formatOperator(operator: string, context: any) {
        if (context.mathStyle === 'advanced') {
            const advancedOps: { [key: string]: string } = {
                'Math.pow': '**',
                'Math.sqrt': 'Math.sqrt',
                'Math.abs': 'Math.abs'
            }
            return advancedOps[operator] || operator
        }

        return operator
    }

    private applyContextualFormatting(expression: string, context: any) {
        if (context.formatOptions === 'european') {
            return expression.replace(/\./g, ',')
        }

        return expression
    }
}
