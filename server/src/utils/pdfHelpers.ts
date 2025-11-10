import path from "node:path";

/**
 * Normalizes a PDF file path to reside within the application's temporary directory.
 */
export function normalizePdfPath(fileName: string): string {
  const sanitized = fileName.replace(/[^a-zA-Z0-9-_\.]/g, "_");
  const tmpDir = process.env.PDF_TMP_DIR ?? "/tmp";
  return path.join(tmpDir, sanitized);
}

/**
 * Provides a timestamped filename for generated PDFs.
 */
export function generateTimestampedPdfName(baseName: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${baseName}-${timestamp}.pdf`;
}
