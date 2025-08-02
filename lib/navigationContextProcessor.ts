import { DestinationManager } from './destinationManager'

interface ValidationContext {
    url: string
    context: string
    source: string
    trackingId: string | null
    timestamp: string
}

export class NavigationContextProcessor {
    private destinationManager: DestinationManager

    constructor() {
        this.destinationManager = new DestinationManager()
    }

    async validateInContext(url: string, context: string, source: string, trackingId: string | null) {
        const validationMetadata = this.buildValidationMetadata(url, context, source, trackingId)
        const destinationCheck = await this.destinationManager.processDestination(validationMetadata)

        return destinationCheck
    }

    private buildValidationMetadata(url: string, context: string, source: string, trackingId: string | null): ValidationContext {
        return {
            url,
            context,
            source,
            trackingId,
            timestamp: new Date().toISOString()
        }
    }
}
