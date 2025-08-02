interface ValidationContext {
    url: string
    context: string
    source: string
    trackingId: string | null
    timestamp: string
}

export class SecureRedirectExecutor {

    async performSecurityValidation(metadata: ValidationContext) {
        const sanitizedUrl = this.sanitizeUrl(metadata.url)
        const protocolCheck = this.validateProtocol(sanitizedUrl)
        const maliciousPatternCheck = this.checkMaliciousPatterns(sanitizedUrl)
        const lengthCheck = this.validateUrlLength(sanitizedUrl)

        const isSecure = protocolCheck && maliciousPatternCheck && lengthCheck

        return {
            isSecure,
            sanitizedUrl: isSecure ? sanitizedUrl : null,
            checks: {
                protocol: protocolCheck,
                patterns: maliciousPatternCheck,
                length: lengthCheck
            }
        }
    }

    private sanitizeUrl(url: string): string {
        const cleaned = url.replace(/[<>'"]/g, '')
        const normalized = cleaned.replace(/\s+/g, '')
        return normalized
    }

    private validateProtocol(url: string): boolean {
        const allowedProtocols = ['http:', 'https:']
        try {
            const urlObj = new URL(url)
            return allowedProtocols.includes(urlObj.protocol)
        } catch (e) {
            return false
        }
    }

    private checkMaliciousPatterns(url: string): boolean {
        const maliciousPatterns = [
            /javascript:/i,
            /data:/i,
            /vbscript:/i,
            /file:/i,
            /\.\.\/\.\.\/\.\.\//,
            /@/
        ]

        return !maliciousPatterns.some(pattern => pattern.test(url))
    }

    private validateUrlLength(url: string): boolean {
        return url.length <= 2000
    }
}
