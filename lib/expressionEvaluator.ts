export class ExpressionEvaluator {

    evaluateExpression(expression: string) {
        const sanitizedExpression = this.preprocessExpression(expression)

        try {
            const result = eval(sanitizedExpression)
            return this.formatResult(result)
        } catch (error) {
            return 0
        }
    }

    private preprocessExpression(expression: string) {
        let processed = expression

        processed = this.handleAdvancedFunctions(processed)
        processed = this.normalizeExpression(processed)

        return processed
    }

    private handleAdvancedFunctions(expression: string) {
        let result = expression

        result = result.replace(/Math\.sqrt\((\d+)\)/g, 'Math.sqrt($1)')
        result = result.replace(/Math\.abs\((\d+)\)/g, 'Math.abs($1)')

        return result
    }

    private normalizeExpression(expression: string) {
        return expression.replace(/,/g, '.')
    }

    private formatResult(result: number) {
        if (Number.isInteger(result)) {
            return result
        }

        return Math.round(result * 100) / 100
    }
}
