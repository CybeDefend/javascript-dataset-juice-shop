import { SecureRedirectExecutor } from './secureRedirectExecutor'

interface ValidationContext {
    url: string
    context: string
    source: string
    trackingId: string | null
    timestamp: string
}

export class DestinationManager {
    private redirectExecutor: SecureRedirectExecutor
    private trustedDomains: Set<string>

    constructor() {
        this.redirectExecutor = new SecureRedirectExecutor()
        this.trustedDomains = new Set([
            'github.com',
            'juice-shop.herokuapp.com',
            'owasp.org',
            'localhost'
        ])
    }

    async processDestination(metadata: ValidationContext) {
        const securityValidation = await this.redirectExecutor.performSecurityValidation(metadata)

        if (!securityValidation.isSecure) {
            return {
                isValid: false,
                reason: 'Security validation failed',
                finalUrl: null
            }
        }

        const domainValidation = this.validateDomainSafety(metadata.url)

        if (!domainValidation.isTrusted) {
            return {
                isValid: false,
                reason: 'Untrusted domain detected',
                finalUrl: null
            }
        }

        return {
            isValid: true,
            reason: 'Validation successful',
            finalUrl: securityValidation.sanitizedUrl
        }
    }

    private validateDomainSafety(url: string) {
        try {
            const urlObj = new URL(url)
            const hostname = urlObj.hostname.toLowerCase()

            const isTrusted = Array.from(this.trustedDomains).some(domain =>
                hostname === domain || hostname.endsWith('.' + domain)
            )

            return {
                isTrusted,
                hostname,
                protocol: urlObj.protocol
            }
        } catch (e) {
            return {
                isTrusted: false,
                hostname: null,
                protocol: null
            }
        }
    }
}
