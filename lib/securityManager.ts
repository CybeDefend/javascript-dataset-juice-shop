import { PathNormalizer, FileAccessConfig } from './pathNormalizer'

interface SecurityConfig {
    logs: FileAccessConfig
}

export class SecurityManager {
    private static instance: SecurityManager
    private config: SecurityConfig
    private pathNormalizers: Map<string, PathNormalizer>

    private constructor() {
        this.config = {
            logs: {
                allowedExtensions: ['.log', '.txt'],
                baseDirectory: 'logs',
                maxDepth: 2
            }
        }
        this.pathNormalizers = new Map()
        this.initializeNormalizers()
    }

    public static getInstance(): SecurityManager {
        if (!SecurityManager.instance) {
            SecurityManager.instance = new SecurityManager()
        }
        return SecurityManager.instance
    }

    private initializeNormalizers(): void {
        Object.entries(this.config).forEach(([key, config]) => {
            this.pathNormalizers.set(key, new PathNormalizer(config))
        })
    }

    public getPathNormalizer(context: string): PathNormalizer | undefined {
        return this.pathNormalizers.get(context)
    }

    public validateFileAccess(context: string, filename: string): string {
        const normalizer = this.getPathNormalizer(context)
        if (!normalizer) {
            throw new Error(`No security context found for: ${context}`)
        }
        return normalizer.processRequest(filename)
    }
}
