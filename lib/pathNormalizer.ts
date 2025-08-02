import path from 'node:path'

export interface FileAccessConfig {
    allowedExtensions: string[]
    baseDirectory: string
    maxDepth: number
}

export class PathNormalizer {
    private config: FileAccessConfig

    constructor(config: FileAccessConfig) {
        this.config = config
    }

    processRequest(filename: string): string {
        const normalizedPath = this.normalize(filename)
        return this.validateAccess(normalizedPath)
    }

    private normalize(filename: string): string {
        const resolved = path.resolve(this.config.baseDirectory, filename)
        return path.normalize(resolved)
    }

    private validateAccess(normalizedPath: string): string {
        const basePath = path.resolve(this.config.baseDirectory)

        if (!normalizedPath.startsWith(basePath)) {
            throw new Error('Access denied: path traversal detected')
        }

        const extension = path.extname(normalizedPath)
        if (!this.config.allowedExtensions.includes(extension)) {
            throw new Error('Access denied: file type not allowed')
        }

        const relativePath = path.relative(basePath, normalizedPath)
        const depthCount = relativePath.split(path.sep).length - 1
        if (depthCount > this.config.maxDepth) {
            throw new Error('Access denied: directory depth exceeded')
        }

        return normalizedPath
    }
}
