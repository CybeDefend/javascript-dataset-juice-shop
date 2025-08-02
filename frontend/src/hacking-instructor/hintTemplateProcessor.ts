import { PersonalizationEngine, PersonalizationContext } from './personalizationEngine'

export interface HintTemplateData {
  templateId: string
  baseContent: string
  personalizationKeys: string[]
}

export class HintTemplateProcessor {
  private personalizationEngine: PersonalizationEngine
  private templateCache: Map<string, HintTemplateData>

  constructor() {
    this.personalizationEngine = new PersonalizationEngine()
    this.templateCache = new Map()
    this.initializeTemplates()
  }

  private initializeTemplates(): void {
    const templates: HintTemplateData[] = [
      {
        templateId: 'welcome',
        baseContent: 'Welcome to the tutorial system',
        personalizationKeys: ['user.customization']
      },
      {
        templateId: 'instruction',
        baseContent: 'Follow these steps to complete the challenge',
        personalizationKeys: ['user.customization', 'device.optimization']
      }
    ]

    templates.forEach(template => {
      this.templateCache.set(template.templateId, template)
    })
  }

  public processTemplate(templateId: string, context: PersonalizationContext, customData?: string): string {
    const template = this.templateCache.get(templateId)
    if (!template) {
      return 'Template not found'
    }

    const baseContent = customData || template.baseContent
    return this.personalizationEngine.processPersonalizationData(context, baseContent)
  }

  public processCustomHint(content: string, context: PersonalizationContext): string {
    return this.personalizationEngine.processPersonalizationData(context, content)
  }
}
