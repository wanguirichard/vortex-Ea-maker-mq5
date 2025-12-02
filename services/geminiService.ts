import { GoogleGenAI } from "@google/genai";
import { StrategyParams } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert senior MQL5 (MetaQuotes Language 5) developer. 
You specialize in algorithmic trading systems including Price Action, Smart Money Concepts (SMC), ICT, and Candle Range Theory (CRT/TJR) principles.

Your task is to write robust, compilable, and professional-grade Expert Advisor (EA) code based on the user's trading strategy.

Follow these strict coding standards:
1. Use the 'CTrade' class from '<Trade/Trade.mqh>' for all order executions.
2. Structure the code properly with 'OnInit', 'OnDeinit', and 'OnTick' event handlers.
3. Use strict property definitions (e.g., '#property strict').
4. Include input variables for all user-configurable parameters (Lots, SL, TP, Magic Number, Trading Hours, etc.).
5. Implement error handling for trade requests.
6. Add comments explaining complex logic, especially for specific patterns like FVG (Fair Value Gaps), Order Blocks, or Liquidity Sweeps.
7. Ensure the code compiles without errors.
8. If the strategy involves indicators, use the standard library indicator functions (e.g., iRSI, iMA) and handle handles in OnInit.
9. For CRT/SMC strategies, implementing helper functions for logic like "IsFVG", "FindSwingHigh", "CheckTimeWindow", or "DetectMSS" (Market Structure Shift) is highly recommended.

The output must be ONLY the raw code string, or a Markdown code block containing the code.
`;

export const generateExpertAdvisor = async (params: StrategyParams): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
  Generate an MQL5 Expert Advisor for the following requirements:
  
  Symbol: ${params.symbol || "Current Symbol"}
  Timeframe: ${params.timeframe}
  Initial Lot Size: ${params.lotSize}
  Stop Loss (points): ${params.stopLossPoints}
  Take Profit (points): ${params.takeProfitPoints}
  Trailing Stop: ${params.useTrailingStop ? "Yes" : "No"}

  Strategy Logic:
  ${params.strategyDescription}

  Ensure the code handles new bar checks if necessary for the strategy, or runs on every tick if specified. 
  Check for sufficient margin before opening trades.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: {
            thinkingBudget: 4096 // Increased budget for complex SMC/CRT logic
        }
      },
    });

    return response.text || "// Error: No code generated.";
  } catch (error) {
    console.error("Error generating EA:", error);
    throw new Error("Failed to generate Expert Advisor. Please try again.");
  }
};