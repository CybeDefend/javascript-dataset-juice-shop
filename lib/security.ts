const insecurity = require('./insecurity')

/**
 * Authenticate user from request
 */
function authenticateUser(req: any) {
    return insecurity.authenticatedUsers.from(req)
}

/**
 * Validates if an expression pattern is safe for evaluation
 * Only allows simple mathematical expressions and string operations
 */
function isValidExpressionPattern(code: string): boolean {
    if (!code || typeof code !== 'string') {
        return false
    }

    // Whitelist approach: only allow safe patterns
    const safePattern = /^[a-zA-Z0-9\s\+\-\*\/\(\)\.\,\'\"]+$/

    // Block dangerous keywords and functions
    const dangerousKeywords = [
        'eval', 'Function', 'require', 'process', 'global', 'Buffer',
        'setTimeout', 'setInterval', 'setImmediate', 'clearTimeout',
        'clearInterval', 'clearImmediate', '__dirname', '__filename',
        'module', 'exports', 'console', 'fs', 'child_process'
    ]

    // Check against whitelist pattern
    if (!safePattern.test(code)) {
        return false
    }

    // Check for dangerous keywords
    for (const keyword of dangerousKeywords) {
        if (code.includes(keyword)) {
            return false
        }
    }

    return true
}

/**
 * Safe evaluation with restricted context
 * Only evaluates simple mathematical expressions
 */
function safeEval(code: string): string {
    // Additional safety check
    if (!isValidExpressionPattern(code)) {
        throw new Error('Invalid expression pattern')
    }

    try {
        // Create a restricted context for evaluation
        const restrictedContext = {
            Math: Math,
            parseInt: parseInt,
            parseFloat: parseFloat,
            String: String,
            Number: Number
        }

        // Use Function constructor with restricted context instead of eval
        // This is still not perfectly safe but better than direct eval
        const func = new Function('context', `with(context) { return ${code} }`)
        const result = func(restrictedContext)

        // Convert result to string and limit length
        return String(result).substring(0, 100)
    } catch (error) {
        throw new Error('Evaluation failed')
    }
}

module.exports = {
    authenticateUser,
    isValidExpressionPattern,
    safeEval
}
