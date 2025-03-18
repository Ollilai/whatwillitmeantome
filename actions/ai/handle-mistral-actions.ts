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
 *  - Emphasizing that "Even empathy and creativity might be in jeopardy"
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

import { ActionState, MistralResponse } from "@/types"
import { createUsageLogAction } from "@/actions/db/usage-actions"
import { Mistral } from "@mistralai/mistralai"

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
    console.log("🔍 Starting handleMistralAction with:", { profession, experience, region, skillLevel });
    
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
    const mistralApiKey = process.env.MISTRAL_API_KEY;
    console.log("🔑 Mistral API key exists:", !!mistralApiKey);
    
    if (!mistralApiKey) {
      console.error("❌ Mistral API key not found in environment variables.");
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
- Emphasize that "Even the most human-like aspects such as empathy and creativity might be in jeopardy."
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
      console.log("📝 Attempting to log usage event");
      await createUsageLogAction("mistral-analysis", "system");
      console.log("✅ Usage event logged successfully");
    } catch (logError) {
      console.warn("⚠️ Usage logging failed, but continuing:", logError);
    }

    // Create Mistral client and request
    console.log("🤖 Creating Mistral client");
    const client = new Mistral({ apiKey: mistralApiKey });
    console.log("🚀 Making API request to Mistral");

    const TIMEOUT_MS = 25000; // 25 seconds timeout (Vercel serverless functions have 30s limit)

    try {
      // Create a promise that will reject after the timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Request to Mistral API timed out after " + TIMEOUT_MS + "ms"));
        }, TIMEOUT_MS);
      });
      
      // Race the API call against the timeout
      const response = await Promise.race([
        client.chat.complete({
          model: "mistral-large-latest",
          messages: [{ role: "system", content: systemPrompt }]
        }),
        timeoutPromise
      ]) as any; // TypeScript needs a cast here
      
      console.log("✅ Received response from Mistral API");
      
      if (!response?.choices?.[0]?.message?.content) {
        console.error("❌ Empty or invalid Mistral response:", response);
        return { isSuccess: false, message: "Failed to get a valid AI response." }
      }

      const raw = response.choices[0].message.content.toString();
      console.log("📄 Raw Mistral output received, length:", raw.length);

      // Parse the 4 labeled sections from Mistral's response
      try {
        console.log("🔍 Parsing response sections");
        // First, clean up the raw text by removing any ### markers and normalizing line endings
        const cleanedRaw = raw.replace(/###\s*/g, "").replace(/\r\n/g, "\n");
        
        // Split by lines to handle the content line by line
        const lines = cleanedRaw.split('\n');
        let allSections: Record<string, string> = {};
        
        // Use a more robust approach to extract sections with multiple patterns
        let currentSection: string | null = null;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          // Check for different section header formats
          // Format 1: "1) General Outlook:"
          // Format 2: "General Outlook:"
          // Format 3: "1. General Outlook:"
          const headerMatch = 
            line.match(/^(?:\d+[\.\)]\s*)?(?:(General Outlook|Potential Benefits and Risks|Steps to Adapt|Placard)\s*:)/i);
          
          if (headerMatch) {
            currentSection = headerMatch[1].replace(/\s+/g, ' ').trim();
            // Initialize or reset the section content
            allSections[currentSection.toLowerCase()] = "";
            continue; // Skip the header line
          }
          
          // If we're inside a section, append this line to its content
          if (currentSection) {
            allSections[currentSection.toLowerCase()] = 
              (allSections[currentSection.toLowerCase()] || "") + line + "\n";
          }
        }
        
        // Map the collected sections to our expected structure
        const sections = [
          { name: "General Outlook", content: "" },
          { name: "Potential Benefits and Risks", content: "" },
          { name: "Steps to Adapt", content: "" },
          { name: "Placard", content: "" }
        ];
        
        sections.forEach((section) => {
          const key = section.name.toLowerCase();
          if (allSections[key]) {
            section.content = allSections[key].trim();
          }
        });
        
        // Apply cleanText to each section
        const outlook = cleanText(sections[0].content);
        const benefitsAndRisks = cleanText(sections[1].content);
        const steps = cleanText(sections[2].content);
        const placard = cleanText(sections[3].content);

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
    } catch (apiError) {
      console.error("Error in Mistral API request:", apiError)
      return {
        isSuccess: false,
        message: "An error occurred while communicating with Mistral. Please try again later."
      }
    }
  } catch (error) {
    console.error("❌ Unhandled error in handleMistralAction:", error);
    // Enhanced error reporting
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      if ('cause' in error) {
        console.error("Error cause:", error.cause);
      }
    }
    
    return {
      isSuccess: false,
      message: "An unexpected error occurred. Please try again later."
    }
  }
}

/**
 * @function cleanText
 * Cleans up common Markdown artifacts or repeated whitespace.
 * Enhances formatting for subheadings and numbered lists.
 */
function cleanText(text: string): string {
  if (!text) return ""
  
  // First, normalize line endings and spacing
  let cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
  
  // Format bullet points to ensure proper alignment and each on its own line
  // First, identify bullet points and convert them to list items
  cleanedText = cleanedText.replace(/^-\s+(.*?)$/gm, "<li>$1</li>");
  
  // Then find consecutive list items and wrap them in a ul tag
  // This approach avoids using the 's' flag
  let inList = false;
  let lines = cleanedText.split("\n");
  let result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith("<li>") && !inList) {
      // Start a new list
      result.push('<ul class="pl-5 list-disc">');
      result.push(line);
      inList = true;
    } else if (line.startsWith("<li>") && inList) {
      // Continue the list
      result.push(line);
    } else if (!line.startsWith("<li>") && inList) {
      // End the list
      result.push('</ul>');
      result.push(line);
      inList = false;
    } else {
      // Regular line
      result.push(line);
    }
  }
  
  // Close any open list at the end
  if (inList) {
    result.push('</ul>');
  }
  
  cleanedText = result.join("\n");
  
  // Apply other formatting
  cleanedText = cleanedText
    // Preserve existing formatting
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // keep bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // keep italics
    // Enhance subheadings - make "Benefits:" and "Risks:" larger and bold
    .replace(/^(Benefits|Risks):/gm, '<h4 class="text-base font-semibold mt-4 mb-2">$1:</h4>')
    // Enhance numbered lists - only bold the number part
    .replace(/^(\d+\.)\s+/gm, "<strong>$1</strong> ");
  
  return cleanedText;
}
