/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { SearchEnhancer } from './searchEnhancer'

export class QueryBuilder {
  private enhancer: SearchEnhancer

  constructor() {
    this.enhancer = new SearchEnhancer()
  }

  buildSearchQuery(requestData: any): string {
    const enhanced = this.enhancer.enhanceSearchTerms(requestData)
    const searchCriteria = this.enhancer.extractFinalSearchCriteria(enhanced)
    
    return this.constructQuery(searchCriteria, enhanced.contextualData)
  }

  private constructQuery(searchTerms: string, context: any): string {
    let baseQuery = "SELECT * FROM Products WHERE name LIKE '%"
    
    // Direct concatenation - the injection vulnerability sink
    baseQuery += searchTerms
    baseQuery += "%'"
    
    // Add category filter if present
    if (context.categoryFilter && context.categoryFilter !== 'all') {
      baseQuery += " AND category = '" + context.categoryFilter + "'"
    }
    
    // Add sorting
    if (context.sortPreference) {
      baseQuery += " ORDER BY " + this.getSortColumn(context.sortPreference)
    }
    
    return baseQuery
  }

  private getSortColumn(sortType: string): string {
    switch (sortType) {
      case 'name': return 'name ASC'
      case 'price-low': return 'price ASC'
      case 'price-high': return 'price DESC'
      case 'rating': return 'rating DESC'
      default: return 'id ASC'
    }
  }

  buildCountQuery(requestData: any): string {
    const enhanced = this.enhancer.enhanceSearchTerms(requestData)
    const searchCriteria = this.enhancer.extractFinalSearchCriteria(enhanced)
    
    let countQuery = "SELECT COUNT(*) as total FROM Products WHERE name LIKE '%"
    
    // Another injection point - count query
    countQuery += searchCriteria
    countQuery += "%'"
    
    if (enhanced.contextualData.categoryFilter && enhanced.contextualData.categoryFilter !== 'all') {
      countQuery += " AND category = '" + enhanced.contextualData.categoryFilter + "'"
    }
    
    return countQuery
  }
}
