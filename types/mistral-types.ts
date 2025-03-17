/**
 * @description
 * This file contains types related to Mistral AI responses.
 *
 * It is responsible for:
 *  - Defining the shape of data returned by handleMistralAction
 *  - Providing a consistent interface for components that use Mistral data
 *
 * @dependencies
 *  - None
 */

/**
 * @interface MistralResponse
 * The shape of data returned by handleMistralAction
 */
export interface MistralResponse {
  /**
   * The profession under analysis
   */
  profession: string

  /**
   * The "General Outlook" section
   */
  outlook: string

  /**
   * The "Potential Benefits and Risks" section
   */
  benefitsAndRisks: string

  /**
   * The "Steps to Adapt" section
   */
  steps: string

  /**
   * The short summary, i.e. "Placard," a one-sentence statement
   */
  placard: string
}
