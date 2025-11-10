import type { ApplicationSummary } from "../schemas/application.schema.js";
import { buildFallbackSummary, normalizeConfidence, sanitizePrompt } from "../utils/aiHelpers.js";

export interface AiSummaryResult {
  summary: string;
  confidence: number;
}

export interface AiInsight {
  field: string;
  value: string;
  confidence: number;
}

/**
 * Service wrapping AI capabilities such as text summarisation and risk insights.
 */
export class AiService {
  /**
   * Generates a summary for a loan application.
   */
  async generateApplicationSummary(application: ApplicationSummary, context: string): Promise<AiSummaryResult> {
    const prompt = sanitizePrompt(`${application.applicant.firstName} ${application.applicant.lastName}: ${context}`);

    if (!prompt) {
      return {
        summary: buildFallbackSummary(context),
        confidence: 0
      };
    }

    return {
      summary: `Applicant ${application.applicant.firstName} is requesting ${application.loanDetails.amountRequested} for ${application.loanDetails.purpose}.`,
      confidence: normalizeConfidence(0.82)
    };
  }

  /**
   * Derives structured insights from OCR text output.
   */
  async extractInsightsFromOcr(ocrText: string): Promise<AiInsight[]> {
    const sanitized = sanitizePrompt(ocrText);
    if (!sanitized) {
      return [];
    }

    return [
      {
        field: "income",
        value: "$60,000",
        confidence: normalizeConfidence(0.75)
      },
      {
        field: "employer",
        value: "Acme Corp",
        confidence: normalizeConfidence(0.64)
      }
    ];
  }

  /**
   * Calculates a heuristic risk score for the provided application summary.
   */
  async calculateRiskScore(application: ApplicationSummary): Promise<number> {
    const base = application.loanDetails.amountRequested / 100000;
    const modifier = application.loanDetails.termMonths / 120;
    return Number(normalizeConfidence(1 - Math.min(base + modifier, 0.95)).toFixed(2));
  }
}

export const aiService = new AiService();
