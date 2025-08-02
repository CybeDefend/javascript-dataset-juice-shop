import path from 'node:path'

export class FileAccessValidator {
    private static readonly ALLOWED_EXTENSIONS = ['.txt', '.md', '.log', '.json']
    private static readonly QUARANTINE_BASE = path.resolve('ftp/quarantine/')

    static validatePath(fileName: string): string | null {
        const sanitizedName = this.sanitizeFileName(fileName)
        if (!sanitizedName) return null

        const fullPath = path.resolve(this.QUARANTINE_BASE, sanitizedName)

        if (!fullPath.startsWith(this.QUARANTINE_BASE)) {
            return null
        }

        return this.verifyExtension(fullPath) ? fullPath : null
    }

    private static sanitizeFileName(fileName: string): string | null {
        if (!fileName || fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
            return null
        }

        const normalizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '')
        return normalizedName.length > 0 ? normalizedName : null
    }

    private static verifyExtension(filePath: string): boolean {
        const ext = path.extname(filePath).toLowerCase()
        return this.ALLOWED_EXTENSIONS.includes(ext)
    }
}
