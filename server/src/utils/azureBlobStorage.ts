import { randomUUID } from "node:crypto";
import { logDebug, logInfo } from "./logger.js";

/**
 * Describes the target location within Azure Blob Storage where an object should be stored.
 */
export interface AzureBlobLocation {
  container: string;
  blobName: string;
  connectionString?: string;
}

/**
 * Metadata returned after a successful upload to Azure Blob Storage.
 */
export interface AzureBlobUploadResult extends AzureBlobLocation {
  url: string;
  contentType: string;
  requestId: string;
}

/**
 * Stub implementation that simulates uploading binary data to Azure Blob Storage.
 * The function logs the request and returns a deterministic blob URL so callers can
 * verify that the integration path is wired correctly without needing an Azure account.
 */
export async function uploadToAzureBlob(
  payload: Buffer,
  location: AzureBlobLocation,
  contentType: string
): Promise<AzureBlobUploadResult> {
  logInfo("uploadToAzureBlob invoked");
  logDebug("uploadToAzureBlob payload", {
    size: payload.byteLength,
    container: location.container,
    blobName: location.blobName,
    contentType
  });

  const accountUrl = process.env.AZURE_STORAGE_ACCOUNT_URL ?? "https://example.blob.core.windows.net";
  const normalizedBlobName = location.blobName.replace(/\\s+/g, "-");

  return {
    ...location,
    contentType,
    requestId: randomUUID(),
    url: `${accountUrl}/${location.container}/${encodeURIComponent(normalizedBlobName)}`
  };
}

/**
 * Generates a short-lived URL that mimics an Azure SAS token for testing purposes.
 */
export function generateBlobSasUrl(location: AzureBlobLocation, expiresInSeconds = 900): string {
  logInfo("generateBlobSasUrl invoked");
  logDebug("generateBlobSasUrl payload", { location, expiresInSeconds });

  const accountUrl = process.env.AZURE_STORAGE_ACCOUNT_URL ?? "https://example.blob.core.windows.net";
  const expiry = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return `${accountUrl}/${location.container}/${encodeURIComponent(location.blobName)}?sig=stub&se=${expiry}`;
}
