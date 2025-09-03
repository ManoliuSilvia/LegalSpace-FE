import { commonTerms, legalTerms, mediumKeywords, urgentKeywords } from "./keywords";
import { CaseUrgency } from "./models";

/* eslint-disable no-useless-escape */
export interface ExtractedInfo {
  extractedItems: string[];
  sanitizedText: string;
  urgency?: CaseUrgency;
}

export const defaultExtractedInfo: ExtractedInfo = {
  extractedItems: [],
  sanitizedText: "",
};

export class TextProcessor {
  static extractPersonalInfo(text: string): ExtractedInfo {
    let workingText = text;
    const allExtractedItems: string[] = [];

    // Initialize result
    const result: ExtractedInfo = {
      extractedItems: [],
      sanitizedText: "",
    };

    // Extract emails
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emailMatches = workingText.match(emailRegex) || [];
    allExtractedItems.push(...emailMatches);
    workingText = workingText.replace(emailRegex, "[EMAIL]");

    // Extract CNP (Romanian Personal Numerical Code)
    const cnpRegex = /\b[1256]\d{12}\b/g;
    const cnpMatches = workingText.match(cnpRegex) || [];
    allExtractedItems.push(...cnpMatches);
    workingText = workingText.replace(cnpRegex, "[CNP]");

    // Extract Romanian phone numbers
    const phoneRegex = /(?:\+?40|0040|0)\s?7\d{2}\s?\d{3}\s?\d{3}\b/g;
    const phoneMatches = workingText.match(phoneRegex) || [];
    allExtractedItems.push(...phoneMatches);
    workingText = workingText.replace(phoneRegex, "[TELEFON]");

    // Extract age references
    const ageRegex1 = /\b(\d+)\s+(ani|an)\b/gi;
    const ageRegex3 = /\b(\d+)\s+de\s+(ani|an)\b/gi;

    const ageMatches1 = [...workingText.matchAll(ageRegex1)].map((match) => match[0]);
    const ageMatches3 = [...workingText.matchAll(ageRegex3)].map((match) => match[0]);
    allExtractedItems.push(...ageMatches1, ...ageMatches3);

    workingText = workingText.replace(ageRegex1, (_match, _number, unit) => {
      return `[VÂRSTĂ] ${unit}`;
    });
    workingText = workingText.replace(ageRegex3, (_match, _number, unit) => {
      return `[VÂRSTĂ] de ${unit}`;
    });

    // Extract monetary amounts
    const amountRegex = /\d+(?:[.,]\d{1,2})?\s?(?:RON|lei|euro|EUR|€|\$|USD|£)/gi;
    const amountMatches = workingText.match(amountRegex) || [];
    allExtractedItems.push(...amountMatches);
    workingText = workingText.replace(amountRegex, "[SUMĂ]");

    // Extract dates
    const dateRegex =
      /\b(0?[1-9]|[12][0-9]|3[01])[\/\-.](0?[1-9]|1[0-2])[\/\-.](19|20)?\d{2}\b|\b(0?[1-9]|1[0-2])[\/\-.](0?[1-9]|[12][0-9]|3[01])[\/\-.](19|20)?\d{2}\b|\b(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+\d{1,2},?\s+\d{4}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi;
    const dateMatches = workingText.match(dateRegex) || [];
    allExtractedItems.push(...dateMatches);
    workingText = workingText.replace(dateRegex, "[DATĂ]");

    // Extract organizations
    const orgRegex = /\b[A-Z][A-Za-z0-9\s&]*\b(SRL|SA|Inc|LLC|Ltd|Corp|Corporation|Company|Co)\b/g;
    const orgMatches: string[] = workingText.match(orgRegex) || [];
    allExtractedItems.push(...orgMatches);
    workingText = workingText.replace(orgRegex, "[ORGANIZAȚIE]");

    // Identify sentence starts to avoid false positives
    const sentenceStarts = this.findSentenceStarts(workingText);

    // Extract names
    const fullNameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g;
    const fullNameMatches = workingText.match(fullNameRegex) || [];

    const processedNames = new Set<string>();
    const nameWords = new Set<string>();

    for (const fullName of fullNameMatches) {
      if (!this.isCommonLegalTerm(fullName) && !orgMatches.includes(fullName)) {
        processedNames.add(fullName);

        const words = fullName.split(/\s+/);
        for (const word of words) {
          nameWords.add(word);
        }
      }
    }

    const singleWordNameRegex = /\b[A-Z][a-z]{2,}\b/g;
    const singleWordMatches = workingText.match(singleWordNameRegex) || [];

    for (const name of singleWordMatches) {
      if (
        !nameWords.has(name) &&
        !sentenceStarts.has(name) &&
        !this.isCommonLegalTerm(name) &&
        !orgMatches.includes(name)
      ) {
        processedNames.add(name);
      }
    }

    // Add names to the extracted items
    allExtractedItems.push(...Array.from(processedNames));

    // Replace all identified names with [NUME]
    for (const name of processedNames) {
      const escapedName = this.escapeRegExp(name);
      const nameRegex = new RegExp(`\\b${escapedName}\\b`, "g");
      workingText = workingText.replace(nameRegex, "[NUME]");
    }

    result.sanitizedText = workingText;
    result.extractedItems = allExtractedItems;
    result.urgency = this.assessUrgency(text);

    return result;
  }

  // Helper method to escape special regex characters in strings
  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Helper method to identify words at the start of sentences
  private static findSentenceStarts(text: string): Set<string> {
    const sentenceStartRegex = /(?:^|[.!?]\s+)([A-Z][a-z]+)\b/g;
    const matches = [...text.matchAll(sentenceStartRegex)];
    const sentenceStarts = new Set<string>();

    for (const match of matches) {
      sentenceStarts.add(match[1]);
    }

    return sentenceStarts;
  }

  private static isCommonLegalTerm(word: string): boolean {
    return commonTerms.includes(word.toLowerCase());
  }

  static extractLegalConcepts(text: string): string[] {
    const cleanText = text.toLowerCase().replace(/<[^>]*>/g, " ");

    const foundTerms = legalTerms.filter((term) => cleanText.includes(term));

    return foundTerms;
  }

  static assessUrgency(text: string): CaseUrgency {
    const cleanText = text.toLowerCase();

    const urgentMatches = urgentKeywords.some((keyword) => cleanText.includes(keyword));
    const mediumMatches = mediumKeywords.some((keyword) => cleanText.includes(keyword));

    if (urgentMatches) return CaseUrgency.HIGH;
    if (mediumMatches) return CaseUrgency.MEDIUM;
    return CaseUrgency.LOW;
  }
}
