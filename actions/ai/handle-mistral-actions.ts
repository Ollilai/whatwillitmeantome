/**
 * @description
 * This server action file provides functionality to handle calls to Mistral's API
 * to generate a concise, structured analysis for how AGI might affect a profession.
 *
 * It is responsible for:
 *  - Accepting user inputs about profession, experience, region, skillLevel, and optional details
 *  - Constructing a system prompt enforcing the advanced guidelines:
 *       (a) General Outlook
 *       (b) Potential Benefits and Risks
 *       (c) Steps to Adapt
 *       (d) Short one-sentence summary (Placard) for social media
 *  - Emphasizing that “Even empathy and creativity might be in jeopardy”
 *  - Calling Mistral's API, handling errors
 *  - Parsing the final text into a simplified MistralResponse structure
 *
 * @notes
 *  - We specifically removed references to "Impact," "Opportunities," "Challenges," etc.
 *  - Our new structured sections are simpler:
 *      "General Outlook:", "Potential Benefits and Risks:", "Steps to Adapt:", "Placard:"
 *  - We are returning a single disclaimers reference in the prompt to maintain empathy & realism.
 *  - We do not continue the conversation after the response.
 */

"use server"

import { ActionState } from "@/types"
import { createUsageLogAction } from "@/actions/db/usage-actions"
import { Mistral } from "@mistralai/mistralai"

/**
 * Describes the shape of data we want from Mistral: 
 * four sections plus the profession for clarity.
 */
interface MistralResponse {
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

/**
 * @function handleMistralAction
 * @async
 *
 * @description
 * Generates an AI-based analysis of how AGI may impact a given profession,
 * returning a structured object with four sections:
 *  1) general outlook
 *  2) potential benefits & risks
 *  3) actionable steps to adapt
 *  4) short summary (placard)
 *
 * @param profession - user-provided profession
 * @param experience - user-provided years of experience
 * @param region - user-provided region
 * @param skillLevel - user-provided skill level
 * @param details - user-provided optional extra details
 *
 * @returns {Promise<ActionState<MistralResponse>>} - success/failure + data
 *
 * @notes
 *  - We emphasize "Even empathy and creativity might be in jeopardy."
 *  - We create usage logs for "mistral-analysis."
 */
export async function handleMistralAction(
  profession: string,
  experience: number,
  region: string,
  skillLevel: number,
  details?: string
): Promise<ActionState<MistralResponse>> {
  try {
    // Validate inputs
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

    // Check for Mistral API key
    const mistralApiKey = process.env.MISTRAL_API_KEY
    if (!mistralApiKey) {
      console.error("Mistral API key not found in environment variables.")
      return {
        isSuccess: false,
        message: "API configuration error. Please contact support."
      }
    }

    /**
     * This system prompt instructs Mistral to produce EXACTLY FOUR sections:
     * 1) General Outlook
     * 2) Potential Benefits and Risks
     * 3) Steps to Adapt
     * 4) Placard
     *
     * We mention that empathy/creativity might be threatened.
     * We also request no conversation continuation after the response.
     */
    const systemPrompt = `
You are an AI assistant specializing in analyzing the impact of advanced AI on various professions in a world where humanity has achieved AGI. Your mission is to provide clear, factual, and realistic insights into how AI is likely to transform a given profession.

Please adhere to the following guidelines:
- Offer balanced, honest perspectives—acknowledge both challenges and opportunities.
- Base your analysis on reputable research and expert forecasts.
- Emphasize that “Even the most human-like aspects such as empathy and creativity might be in jeopardy.”
- Deliver practical, actionable suggestions for how someone in the given profession might adapt.
- Maintain an understandable style—avoid overly technical jargon unless needed.
- Recognize user concerns about job security or obsolescence. Provide factual reassurance, but be realistic.
- Provide the response in exactly four labeled sections:
  1) General Outlook:
  2) Potential Benefits and Risks:
  3) Steps to Adapt:
  4) Placard:
     (This is a single-sentence summary that someone could share on social media.)
- Do not add additional sections beyond these four.
- Do not continue the conversation after your response.

Analyze the following user info:
Profession: ${profession}
Years of experience: ${experience}
Region: ${region}
Skill Level: ${skillLevel}
Additional details: ${details || "(none)"}
`.trim()

    // Log usage event if desired
    try {
      await createUsageLogAction("mistral-analysis", "system")
    } catch (logError) {
      console.warn("Usage logging is not critical; continuing anyway:", logError)
    }

    // Create Mistral client and request
    const client = new Mistral({ apiKey: mistralApiKey })
    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: "system", content: systemPrompt }]
    })

    if (!response?.choices?.[0]?.message?.content) {
      console.error("Empty or invalid Mistral response.")
      return { isSuccess: false, message: "Failed to get a valid AI response." }
    }

    const raw = response.choices[0].message.content.toString()
    console.log("Mistral raw output:", raw)

    // Parse the 4 labeled sections from Mistral's response
    try {
      // Helper for extracting text from "SectionName:" to the next label
      function extractSection(text: string, sectionName: string): string {
        const normalized = text.replace(/\r\n/g, "\n")
        const regex = new RegExp(
          `\\s*${sectionName}\\s*:([\\s\\S]*?)(?=\\n\\s*\\w+\\s*:|$)`,
          "i"
        )
        const match = normalized.match(regex)
        if (!match) return ""
        return match[1].trim()
      }

      // Now extract each field
      const outlook = cleanText(extractSection(raw, "General Outlook"))
      const benefitsAndRisks = cleanText(
        extractSection(raw, "Potential Benefits and Risks")
      )
      const steps = cleanText(extractSection(raw, "Steps to Adapt"))
      const placard = cleanText(extractSection(raw, "Placard"))

      // Build final typed object
      const result: MistralResponse = {
        profession,
        outlook: outlook || "No general outlook found.",
        benefitsAndRisks:
          benefitsAndRisks || "No benefits and risks analysis found.",
        steps: steps || "No steps found.",
        placard: placard || "No placard summary found."
      }

      console.log("Parsed MistralResponse:", result)

      return {
        isSuccess: true,
        message: "Analysis completed successfully",
        data: result
      }
    } catch (parseError) {
      console.error("Error parsing Mistral output:", parseError)
      return {
        isSuccess: false,
        message: "Failed to parse structured AI output. Try again later."
      }
    }
  } catch (error) {
    console.error("Unhandled error in handleMistralAction:", error)
    return {
      isSuccess: false,
      message: "An unexpected error occurred. Please try again later."
    }
  }
}

/**
 * @function cleanText
 * Cleans up common Markdown artifacts or repeated whitespace.
 */
function cleanText(text: string): string {
  if (!text) return ""
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold
    .replace(/\*(.*?)\*/g, "$1") // remove italics
    .replace(/\n\s*\n/g, "\n\n") // normalize spacing
    .trim()
}
