/**
 * Configuration object describing the storage location for uploaded documents.
 */
export interface StorageLocation {
  bucket: string;
  key: string;
  region: string;
}

/**
 * Result returned after an upload has been persisted to S3.
 */
export interface StorageUploadResult extends StorageLocation {
  url: string;
}

/**
 * Uploads the provided payload to S3. This is a stub implementation that simulates a successful upload.
 */
export async function uploadToS3(
  payload: Buffer,
  location: StorageLocation,
  contentType: string
): Promise<StorageUploadResult> {
  void payload; // Prevent unused variable warnings in stub implementation.
  const baseUrl = process.env.AWS_PUBLIC_BASE_URL ?? "https://example-bucket.s3.amazonaws.com";
  return {
    ...location,
    url: `${baseUrl}/${location.key}`
  };
}

/**
 * Generates a presigned URL for a stored object. This is safe to call without AWS credentials in this stub.
 */
export function generatePresignedUrl(location: StorageLocation, expiresInSeconds = 900): string {
  const baseUrl = process.env.AWS_PUBLIC_BASE_URL ?? "https://example-bucket.s3.amazonaws.com";
  return `${baseUrl}/${location.key}?expiresIn=${expiresInSeconds}`;
}
