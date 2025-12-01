import {
  BlobSASPermissions,
  BlobServiceClient,
  BlockBlobClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import crypto from 'crypto';
import { lookup } from 'mime-types';

let blobServiceClient: BlobServiceClient;
let containerClient: any;
let containerName = '';

export function initAzureBlob(config: {
  accountName: string;
  accountKey: string;
  containerName: string;
}) {
  const { accountName, accountKey } = config;
  containerName = config.containerName;

  const credential = new StorageSharedKeyCredential(accountName, accountKey);

  blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    credential
  );

  containerClient = blobServiceClient.getContainerClient(containerName);
  containerClient.createIfNotExists();

  console.log(`📦 Azure Blob initialized → container: ${containerName}`);
}

export async function sha256(buffer: Buffer): Promise<string> {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export async function uploadBuffer(buffer: Buffer, key: string) {
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(key);
  const contentType = lookup(key) || 'application/octet-stream';

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: contentType as string,
    },
    tier: 'Hot',
  });

  const checksum = await sha256(buffer);

  return {
    key,
    checksum,
    sizeBytes: buffer.length,
  };
}

export async function getBuffer(key: string) {
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(key);
  const response = await blockBlobClient.download();
  const chunks: Buffer[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    response.readableStreamBody
      ?.on('data', (d) => chunks.push(d))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject);
  });
}

export async function deleteBlob(key: string) {
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(key);
  await blockBlobClient.deleteIfExists();
}

export { deleteBlob as delete };

export async function getDownloadUrl(key: string) {
  const now = new Date();
  const expiresOn = new Date(now.valueOf() + 10 * 60 * 1000);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName: key,
      permissions: BlobSASPermissions.parse('r'),
      startsOn: now,
      expiresOn,
    },
    (blobServiceClient as any).credential
  ).toString();

  return `${containerClient.getBlockBlobClient(key).url}?${sasToken}`;
}
