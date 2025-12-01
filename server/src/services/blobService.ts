import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob';
import crypto from 'crypto';

let containerClient: ContainerClient | null = null;

export function initAzureBlob(config: { connectionString: string; containerName: string }) {
  const blobService = BlobServiceClient.fromConnectionString(config.connectionString);
  containerClient = blobService.getContainerClient(config.containerName);
  console.log(`📦 Azure Blob initialized → container: ${config.containerName}`);
}

const getContainer = (): ContainerClient => {
  if (!containerClient) {
    throw new Error('Azure Blob Storage not initialized');
  }
  return containerClient;
};

export function buildBlobKey(applicationId: string, documentId: string, fileName: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  return `${applicationId}/${documentId}/${Date.now()}_${safeName}`;
}

export async function sha256(buffer: Buffer): Promise<string> {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export async function uploadToAzureBlob(path: string, buffer: Buffer, mimeType: string) {
  const container = getContainer();
  const blockBlob: BlockBlobClient = container.getBlockBlobClient(path);
  await blockBlob.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
  });
  return path;
}

export function getAzureBlobUrl(path: string) {
  const container = getContainer();
  return container.getBlockBlobClient(path).url;
}

export async function uploadFile(
  applicationId: string,
  documentId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
) {
  const blobKey = buildBlobKey(applicationId, documentId, fileName);
  await uploadToAzureBlob(blobKey, buffer, mimeType);
  const checksum = await sha256(buffer);

  return {
    blobKey,
    checksum,
    sizeBytes: buffer.length,
  };
}

export async function exists(blobKey: string) {
  const container = getContainer();
  const blockBlobClient = container.getBlockBlobClient(blobKey);
  return await blockBlobClient.exists();
}
