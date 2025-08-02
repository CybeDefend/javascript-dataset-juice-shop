import { NavigationContextProcessor } from './navigationContextProcessor'

export class UrlValidationService {
    private contextProcessor: NavigationContextProcessor

    constructor() {
        this.contextProcessor = new NavigationContextProcessor()
    }

    async processNavigationRequest(targetUrl: string, context: string, source: string, trackingId: string | null) {
        const processedInput = this.preprocessUserInput(targetUrl)
        const contextualValidation = await this.contextProcessor.validateInContext(
            processedInput,
            context,
            source,
            trackingId
        )

        return contextualValidation
    }

    private preprocessUserInput(rawUrl: string): string {
        const trimmed = rawUrl.trim()
        const normalized = trimmed.toLowerCase()
        const decodedUrl = decodeURIComponent(normalized)

        return decodedUrl
    }
}
