import models = require('../models/index')
import insecurity = require('../lib/insecurity')
import challengeUtils = require('../lib/challengeUtils')
const security = require('../lib/security')

module.exports = function retrieveUserProfile() {
    return async (req: any, res: any, next: any) => {
        try {
            const loggedInUser = security.authenticateUser(req)

            if (!loggedInUser) {
                return res.status(401).json({ error: 'User not authenticated' })
            }

            let user = await models.User.findByPk(loggedInUser.data.id)

            // Enhanced profile processing
            if (user) {
                let username = user.username

                // Support for special username patterns (secured implementation)
                if (username?.match(/#{(.*)}/)) {
                    const usernameXssChallenge = challengeUtils.findChallenge('usernameXssChallenge')

                    // Extract code from username pattern
                    let code = username?.substring(2, username.length - 1)

                    // Security validation: only allow safe evaluation patterns
                    if (security.isValidExpressionPattern(code)) {
                        try {
                            // Safe evaluation using restricted context
                            const result = security.safeEval(code)
                            username = result

                            challengeUtils.solve(usernameXssChallenge)
                        } catch (err) {
                            console.log('Safe evaluation failed:', err.message)
                            username = user.username // Fallback to original
                        }
                    } else {
                        console.log('Unsafe pattern detected, skipping evaluation')
                        username = user.username // Fallback to original
                    }
                }

                user.username = username
            }

            res.json({ status: 'success', data: user })
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}
