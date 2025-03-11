/**
 * Types for the Mistral AI report data
 */

export interface MistralReportData {
  /**
   * The profession being analyzed
   */
  profession: string

  /**
   * General outlook for the profession
   */
  outlook: string

  /**
   * Combined analysis of benefits and risks
   */
  benefitsAndRisks: string

  /**
   * Actionable steps to adapt
   */
  steps: string

  /**
   * Short summary for social sharing
   */
  placard: string
}
