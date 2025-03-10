/**
 * Types for the Mistral AI report data
 */

export interface MistralReportData {
  /**
   * One-sentence summary of the AI's analysis
   */
  summary: string

  /**
   * Detailed analysis of how AI will impact the profession
   */
  impact: string

  /**
   * Opportunities that may arise from AI adoption
   */
  opportunities: string

  /**
   * Challenges that may arise from AI adoption
   */
  challenges: string

  /**
   * Recommended skills to develop
   */
  skills: string

  /**
   * Outlook for the profession in the next 5-10 years
   */
  outlook: string

  /**
   * Potential benefits of AI in this profession
   */
  benefits: string

  /**
   * Potential risks of AI in this profession
   */
  risks: string

  /**
   * Actionable steps to prepare for AI changes
   */
  steps: string
}
