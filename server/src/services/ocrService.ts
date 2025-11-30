// server/src/services/ocrService.ts
import { db } from '../db/db.js';
import { documents } from '../db/schema/documents.js';
import { ocrResults } from '../db/schema/ocr.js';
import { eq, inArray } from 'drizzle-orm';
import axios from 'axios';
import * as documentService from './documentService.js';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//
// ======================================================
//  OCR Field Schema
// ======================================================
//
const GROUPS = {
  balanceSheet: [
    "Assets",
    "Liabilities",
    "Equity",
    "Accounts Receivable",
    "Accounts Payable",
    "Inventory",
  ],
  incomeStatement: [
    "Revenue",
    "COGS",
    "Operating Expenses",
    "Net Income",
    "Gross Profit",
  ],
  cashFlow: [
    "Operating Cash Flow",
    "Investing Cash Flow",
    "Financing Cash Flow",
    "Ending Cash Balance",
  ],
  taxes: [
    "Tax Year",
    "Total Taxes Owed",
    "Total Taxes Paid",
    "CRA Balance",
  ],
  contracts: [
    "Contract Value",
    "Start Date",
    "End Date",
    "Client Name",
  ],
  invoices: [
    "Invoice Number",
    "Invoice Date",
    "Invoice Total",
  ],
};

//
// These fields must ALWAYS be scanned across ALL documents
//
const ITEMS_REQUIRED = [
  "SIN",
  "Business Number",
  "Corporation Number",
  "Website",
  "Business Phone",
  "Owner Address",
  "Business Address",
  "Driver License Number",
];

//
// ======================================================
//  Run OCR on a Document
// ======================================================
//
export async function runOCR(documentId: string) {
  const doc = await documentService.getDocument(documentId);

  // Download the file using SAS URL
  const response = await axios.get(doc.sasUrl, {
    responseType: 'arraybuffer',
  });

  const buffer = Buffer.from(response.data);

  const base64 = buffer.toString('base64');

  // Call GPT-4 Vision OCR
  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: `
        You are an OCR extraction engine. 
        Output ONLY valid JSON.

        Extract fields from the document. 
        Group fields under:

        - balanceSheet
        - incomeStatement
        - cashFlow
        - taxes
        - contracts
        - invoices
        - itemsRequired

        The itemsRequired group MUST contain values for:
        ${ITEMS_REQUIRED.join(", ")}
        `
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract all possible financial fields."
          },
          {
            type: "image_url",
            image_url: { url: `data:${doc.mimeType};base64,${base64}` },
          },
        ],
      },
    ],
    max_tokens: 4000,
    temperature: 0,
  });

  let parsed: any;
  try {
    parsed = JSON.parse(completion.choices[0].message.content || '{}');
  } catch {
    throw new Error("OCR output was not valid JSON.");
  }

  // Store in DB
  const [saved] = await db.insert(ocrResults).values({
    documentId,
    fields: parsed,
    docType: (parsed as any).documentType || null,
  }).returning();

  return saved;
}

//
// ======================================================
//  Get OCR Results for a Single Document
// ======================================================
//
export async function getOCR(documentId: string) {
  const [result] = await db
    .select()
    .from(ocrResults)
    .where(eq(ocrResults.documentId, documentId));

  return result || {};
}

//
// ======================================================
//  List OCR for Application
// ======================================================
//
export async function listOCR(applicationId: string) {
  const docs = await db
    .select()
    .from(documents)
    .where(eq(documents.applicationId, applicationId));

  const docIds = docs.map((d) => d.id);

  if (!docIds.length) {
    return [];
  }

  const list = await db
    .select()
    .from(ocrResults)
    .where(inArray(ocrResults.documentId, docIds));

  return list;
}
