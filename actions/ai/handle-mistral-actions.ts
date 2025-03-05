/**
 * @description
 * This server action file provides functionality to handle calls to Mistral's API.
 *
 * It is responsible for:
 * - Accepting user input (profession, experience, region, skillLevel, details)
 * - Constructing a prompt for Mistral
 * - Calling Mistral's API with proper auth headers
 * - Parsing the result into a structured object
 * - Returning an ActionState containing the final data or an error
 * - Logging usage with createUsageLogAction
 *
 * Key features:
 * - Detailed error handling to ensure graceful failures
 * - Rate limiting placeholder for future expansions if needed
 * - Safe retrieval of environment variables for Mistral
 *
 * @dependencies
 * - createUsageLogAction from "@/actions/db/usage-actions" for usage logging
 * - process.env.MISTRAL_API_KEY for Mistral API key
 *
 * @notes
 * - If Mistral's API returns JSON, parse it carefully
 * - This is a sample/stub endpoint; adjust the URL/payload to match your real Mistral integration
 * - The rate limiter is omitted in this MVP but can be integrated in future steps
 */

"use server"

import { ActionState } from "@/types"
import { createUsageLogAction } from "@/actions/db/usage-actions"
import { Mistral } from '@mistralai/mistralai'

/**
 * Interface for the structured response from Mistral AI
 */
interface MistralResponse {
  outlook: string
  benefits: string
  risks: string
  steps: string
  summary: string
}

/**
 * Handles the interaction with Mistral AI to generate career insights
 * 
 * @param profession - The profession to analyze
 * @param experience - Years of experience
 * @param region - Geographic region
 * @param skillLevel - Skill level from 1-10
 * @param details - Additional details (optional)
 * @returns Promise with ActionState containing the structured response
 */
export async function handleMistralAction(
  profession: string,
  experience: number,
  region: string,
  skillLevel: number,
  details?: string
): Promise<ActionState<MistralResponse>> {
  try {
    // --------------------------------------------------------------------------
    // 1. Validate inputs
    // --------------------------------------------------------------------------
    if (!profession) {
      return { isSuccess: false, message: "Profession is required." }
    }

    if (experience < 0 || experience > 50) {
      return {
        isSuccess: false,
        message: "Experience must be between 0 and 50 years."
      }
    }

    if (!region) {
      return { isSuccess: false, message: "Region is required." }
    }

    if (skillLevel < 1 || skillLevel > 10) {
      return {
        isSuccess: false,
        message: "Skill level must be between 1 and 10."
      }
    }

    // --------------------------------------------------------------------------
    // 2. Get API key from environment
    // --------------------------------------------------------------------------
    const mistralApiKey = process.env.MISTRAL_API_KEY

    if (!mistralApiKey) {
      console.error("Mistral API key not found in environment variables")
      return {
        isSuccess: false,
        message: "API configuration error. Please contact support."
      }
    }

    // --------------------------------------------------------------------------
    // 3. Construct the prompt
    // --------------------------------------------------------------------------
    const prompt = `
    I need a detailed career analysis for someone in the following situation:
    
    Profession: ${profession}
    Years of Experience: ${experience}
    Region: ${region}
    Skill Level (1-10): ${skillLevel}
    ${details ? `Additional Details: ${details}` : ""}
    
    Please provide a structured analysis with the following sections:
    
    Career Outlook: Analyze the job market and future prospects for this profession in the specified region.
    
    Benefits: List the key advantages and opportunities in this career path.
    
    Risks: Identify potential challenges and downsides.
    
    Next Steps: Recommend specific actions to advance in this career.
    
    Summary: A brief overview of the career prospects.
    
    Format each section with the section name followed by a colon, then the content.
    `

    // --------------------------------------------------------------------------
    // 4. Make the API request to Mistral
    // --------------------------------------------------------------------------
    const client = new Mistral({ apiKey: mistralApiKey })

    try {
      // Log usage before making the API call
      await createUsageLogAction(
        "career-analysis",
        "system" // You might want to pass the actual userId if available
      )

      const chatResponse = await client.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
      })

      // Ensure we have a valid response with choices
      if (!chatResponse?.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from Mistral API")
      }

      const responseContent = chatResponse.choices[0].message.content.toString()

      // --------------------------------------------------------------------------
      // 5. Parse the response
      // --------------------------------------------------------------------------
      try {
        // Extract structured data from the text response
        const parsedResponse: MistralResponse = {
          outlook: extractSection(responseContent, "Career Outlook"),
          benefits: extractSection(responseContent, "Benefits"),
          risks: extractSection(responseContent, "Risks"),
          steps: extractSection(responseContent, "Next Steps"),
          summary: extractSection(responseContent, "Summary")
        }

        return {
          isSuccess: true,
          message: "Successfully generated career insights",
          data: parsedResponse
        }
      } catch (parseError) {
        console.error("Error parsing Mistral response:", parseError)
        return {
          isSuccess: false,
          message: "Failed to parse the AI response into the expected format."
        }
      }
    } catch (error) {
      console.error("Error calling Mistral API:", error)
      return {
        isSuccess: false,
        message: "Failed to communicate with the Mistral AI service."
      }
    }
  } catch (error) {
    // Catch-all for network or unexpected errors
    console.error("Unexpected error in handleMistralAction:", error)
    return {
      isSuccess: false,
      message: "An unexpected error occurred. Please try again later."
    }
  }
}

/**
 * Helper function to extract sections from the response text
 * 
 * @param text - The full response text
 * @param sectionName - The name of the section to extract
 * @returns The extracted section content or a fallback message
 */
function extractSection(text: string, sectionName: string): string {
  // This regex looks for the section name followed by a colon,
  // then captures all text until the next section or end of text
  const regex = new RegExp(`${sectionName}:\\s*(.+?)(?=\\n\\n[A-Za-z]+ *:|$)`, 's')
  const match = text.match(regex)
  return match ? match[1].trim() : `No ${sectionName} information available`
}
