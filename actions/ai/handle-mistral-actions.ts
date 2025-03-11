/**
 * @description
 * This server action file provides functionality to handle calls to Mistral's API
 * in order to generate a realistic, empathetic analysis of how AI might affect
 * a specific profession.
 *
 * It is responsible for:
 *  - Accepting user input (profession, experience, region, skillLevel, details)
 *  - Constructing a system prompt for Mistral that enforces the advanced guidelines
 *  - Calling Mistral's API with proper auth headers
 *  - Parsing the result into a structured object containing (a) outlook, (b) benefits/risks,
 *    (c) actionable steps, (d) short summary placard
 *  - Returning an ActionState containing the final data or an error
 *  - Logging usage or events as needed (although usage logging is mostly in usage-actions)
 *
 * @dependencies
 *  - createUsageLogAction from "@/actions/db/usage-actions" for usage logging
 *  - Mistral from "@mistralai/mistralai"
 *
 * @notes
 *  - We add a system message containing the advanced guidelines specified by the technical specification
 *  - The user prompt is appended with user-provided details about profession, experience, region, skill level, etc.
 *  - We parse out the relevant sections: outlook, benefits (and risks), steps, summary
 *  - The short placard is stored in `summary`
 *  - We are conscious to mention empathy & creativity as threatened, and maintain a balanced perspective
 */

"use server"

import { ActionState } from "@/types"
import { createUsageLogAction } from "@/actions/db/usage-actions"
import { Mistral } from "@mistralai/mistralai"

/**
 * Interface for the structured response from Mistral AI after it formats
 * the analysis. This object captures the key sections we display to the user.
 */
interface MistralResponse {
  /**
   * The profession under analysis
   */
  profession: string

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

/**
 * Handles the interaction with Mistral AI to generate career insights based on the
 * advanced guidelines. This method merges a system message with user details to ensure
 * we get a well-structured and empathetic response about AI's impact on the profession.
 *
 * @param profession - The profession to analyze
 * @param experience - Years of experience
 * @param region - Geographic region
 * @param skillLevel - Self-rated skill level (1-10)
 * @param details - Additional optional details the user may provide
 * @returns Promise<ActionState<MistralResponse>>
 *
 * @notes
 *  - The system content enforces guidelines: big AI impact, empathy, creativity at risk,
 *    structured sections (a/b/c/d), do not continue conversation, etc.
 *  - We parse the final text into the relevant fields or default if missing.
 */
export async function handleMistralAction(
  profession: string,
  experience: number,
  region: string,
  skillLevel: number,
  details?: string
): Promise<ActionState<MistralResponse>> {
  try {
    // ------------------------------------------------------
    // 1. Validate inputs
    // ------------------------------------------------------
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

    // ------------------------------------------------------
    // 2. Get API key from environment
    // ------------------------------------------------------
    const mistralApiKey = process.env.MISTRAL_API_KEY
    if (!mistralApiKey) {
      console.error("Mistral API key not found in environment variables")
      return {
        isSuccess: false,
        message: "API configuration error. Please contact support."
      }
    }

    // ------------------------------------------------------
    // 3. Construct the system + user prompt
    // ------------------------------------------------------

    // The specification states we must provide a system message with advanced guidelines
    const systemMessage = `
You are an AI assistant specializing in analyzing the impact of advanced AI on various professions in a world where humanity has achieved AGI. Your mission is to provide clear, factual, and realistic insights into how AI is likely to transform a given profession.

Please adhere to the following guidelines:
• Offer balanced, honest perspectives—acknowledge both the challenges and opportunities that AI may bring.
• Base your analysis on current trends, reputable research, and expert forecasts.
• When you speculate on future developments, keep in mind that you believe AI will have a huge impact on almost all professions.
• Even the most human-like aspects, like empathy and creativity, are in jeopardy.
• Deliver practical, actionable suggestions for how someone in the given profession might adapt or remain competitive.
• Maintain an engaging and understandable writing style—avoid overly technical jargon unless needed to illustrate key points.
• Emphasize empathy and respect, recognizing user concerns about job security, skill obsolescence, or ethical implications.
• Provide reassurance with facts and strategies, not sugarcoating.

Your response must be structured exactly as follows, with these exact section headers:

Outlook:
[Write a general outlook for the profession in the next 5-10 years]

Impact:
[Provide detailed analysis of how AI will impact this profession]

Opportunities:
[List specific opportunities that may arise]

Challenges:
[List specific challenges to be aware of]

Skills:
[List key skills to develop]

Benefits and Risks:
Benefits:
[List specific benefits]
Risks:
[List specific risks]

Steps to Adapt:
[Provide actionable steps]

Placard:
[Write one sentence summary]

Here is the user scenario to analyze:
Profession: ${profession}
Experience (years): ${experience}
Region: ${region}
Skill Level: ${skillLevel}
${details ? `Additional user details: ${details}` : ""}

Respond using exactly the section headers shown above. Do not add any other text or continue the conversation.
`.trim()

    // ------------------------------------------------------
    // 4. Make the API request to Mistral
    // ------------------------------------------------------
    const client = new Mistral({ apiKey: mistralApiKey })

    // Optionally, log usage event if desired
    try {
      await createUsageLogAction("mistral-analysis", "system")
    } catch (loggingError) {
      console.warn("Logging usage is not critical, continuing:", loggingError)
    }

    // We pass both a system message and user message to the Mistral API. The user message
    // in this scenario is minimal, because we've effectively integrated all logic in systemMessage.
    // Alternatively, we could do system vs user, but for simplicity, we'll do:
    const chatResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        { role: "system", content: systemMessage }
        // We could add a user message role if needed, but not strictly required
      ]
    })

    // Ensure we have a valid response
    if (!chatResponse?.choices?.[0]?.message?.content) {
      console.error("Invalid or empty response from Mistral")
      return {
        isSuccess: false,
        message: "Failed to get a valid Mistral response."
      }
    }

    // The raw text from Mistral
    const responseContent = chatResponse.choices[0].message.content.toString()

    // Add debug logging
    console.log("Raw response from Mistral:", responseContent)

    // ------------------------------------------------------
    // 5. Parse the response into the structured object
    // ------------------------------------------------------
    try {
      /**
       * We attempt to parse the labeled sections from the response
       */
      const outlook = cleanMarkdown(extractSection(responseContent, "Outlook"))
      const impact = cleanMarkdown(extractSection(responseContent, "Impact"))
      const opportunities = cleanMarkdown(extractSection(responseContent, "Opportunities"))
      const challenges = cleanMarkdown(extractSection(responseContent, "Challenges"))
      const skills = cleanMarkdown(extractSection(responseContent, "Skills"))
      const benefitsAndRisks = cleanMarkdown(extractSection(responseContent, "Benefits and Risks"))
      const steps = cleanMarkdown(extractSection(responseContent, "Steps to Adapt"))
      const summary = cleanMarkdown(extractSection(responseContent, "Placard"))

      // Debug logging
      console.log("Extracted sections:", {
        outlook,
        impact,
        opportunities,
        challenges,
        skills,
        benefitsAndRisks,
        steps,
        summary
      })

      // Split benefits and risks into separate fields
      const [benefits, risks] = splitBenefitsAndRisks(benefitsAndRisks)

      // Debug logging
      console.log("Split benefits and risks:", { benefits, risks })

      // Construct final typed object
      const parsed: MistralResponse = {
        profession,
        outlook: outlook || "No outlook found.",
        impact: impact || "No impact analysis found.",
        opportunities: opportunities || "No opportunities found.",
        challenges: challenges || "No challenges found.",
        skills: skills || "No skills found.",
        benefits: benefits || "No benefits found.",
        risks: risks || "No risks found.",
        steps: steps || "No adaptation steps found.",
        summary: summary || "No placard found."
      }

      // Debug logging
      console.log("Final parsed response:", parsed)

      return {
        isSuccess: true,
        message: "Successfully generated advanced career insights",
        data: parsed
      }
    } catch (parseError) {
      console.error("Error extracting structured fields:", parseError)
      return {
        isSuccess: false,
        message: "Failed to parse structured AI response. Try again later."
      }
    }
  } catch (error) {
    // Catch-all for unexpected or network errors
    console.error("Unexpected error in handleMistralAction:", error)
    return {
      isSuccess: false,
      message: "An unexpected error occurred. Please try again later."
    }
  }
}

/**
 * Helper function that looks for a line like "SectionName:" and extracts
 * all text until the next section header or end of content.
 */
function extractSection(text: string, sectionName: string): string {
  // First, normalize line endings and trim the text
  const normalizedText = text.replace(/\r\n/g, '\n').trim()
  
  // Create a more flexible regex that:
  // 1. Allows for optional whitespace before the section name
  // 2. Matches the section name case-insensitively
  // 3. Captures everything until the next section header or end of text
  const regex = new RegExp(
    `\\s*${sectionName}\\s*:([\\s\\S]*?)(?=\\s*\\w+\\s*:|$)`,
    'i'
  )
  
  const match = normalizedText.match(regex)
  if (!match) {
    console.log(`No match found for section: ${sectionName}`)
    return ""
  }
  
  const result = match[1].trim()
  console.log(`Extracted ${sectionName}:`, result || "(empty)")
  return result
}

/**
 * Helper function to split the combined benefits and risks section into separate fields
 */
function splitBenefitsAndRisks(text: string): [string, string] {
  if (!text) {
    console.log("Benefits and Risks text is empty")
    return ["No benefits found.", "No risks found."]
  }

  // Normalize line endings and trim
  const normalizedText = text.replace(/\r\n/g, '\n').trim()
  
  // More flexible regex patterns
  const benefitsMatch = normalizedText.match(/(?:Benefits\s*:)([\s\S]*?)(?=(?:\s*Risks\s*:|$))/i)
  const risksMatch = normalizedText.match(/(?:Risks\s*:)([\s\S]*?)$/i)
  
  const benefits = benefitsMatch ? benefitsMatch[1].trim() : "No benefits found."
  const risks = risksMatch ? risksMatch[1].trim() : "No risks found."
  
  console.log("Split Benefits and Risks:", { benefits, risks })
  
  return [benefits, risks]
}

/**
 * Helper function to clean up markdown formatting from text
 */
function cleanMarkdown(text: string): string {
  if (!text) return ""
  
  return text
    // Remove markdown bold/italic
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1')      // Remove *italic*
    // Remove markdown lists
    .replace(/^\s*[-*]\s+/gm, '• ')   // Convert - or * to bullet points
    .replace(/^\s*\d+\.\s+/gm, '')    // Remove numbered lists
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n\n')      // Normalize multiple newlines
    .trim()
}
