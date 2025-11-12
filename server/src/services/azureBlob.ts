import { BlobServiceClient, type ContainerClient } from "@azure/storage-blob";
import type { Response } from "express";
import { pipeline } from "stream/promises";

let containerClientPromise: Promise<ContainerClient> | null = null;

const getConnectionString = (): string => {
  const value = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!value) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not configured");
  }
  return value;
};

const getContainerName = (): string => {
  const value = process.env.AZURE_STORAGE_CONTAINER;
  if (!value) {
    throw new Error("AZURE_STORAGE_CONTAINER is not configured");
  }
  return value;
};

const getContainerClient = async (): Promise<ContainerClient> => {
  if (!containerClientPromise) {
    const client = BlobServiceClient.fromConnectionString(getConnectionString());
    const container = client.getContainerClient(getContainerName());
    containerClientPromise = (async () => {
      await container.createIfNotExists();
      return container;
    })();
  }
  return containerClientPromise;
};

export const uploadBuffer = async (
  buffer: Buffer,
  blobName: string,
  mimeType?: string,
): Promise<void> => {
  const container = await getContainerClient();
  const blobClient = container.getBlockBlobClient(blobName);
  await blobClient.uploadData(buffer, {
    blobHTTPHeaders: mimeType ? { blobContentType: mimeType } : undefined,
  });
};

export const downloadBuffer = async (blobName: string): Promise<Buffer> => {
  const container = await getContainerClient();
  const blobClient = container.getBlockBlobClient(blobName);
  const download = await blobClient.download();
  const stream = download.readableStreamBody;
  if (!stream) {
    return Buffer.alloc(0);
  }
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

export const streamBlob = async (blobName: string, res: Response): Promise<void> => {
  const container = await getContainerClient();
  const blobClient = container.getBlockBlobClient(blobName);
  const download = await blobClient.download();
  const stream = download.readableStreamBody;
  if (!stream) {
    throw new Error(`Unable to stream blob ${blobName}`);
  }
  await pipeline(stream, res);
};

export const blobExists = async (blobName: string): Promise<boolean> => {
  const container = await getContainerClient();
  const blobClient = container.getBlockBlobClient(blobName);
  return blobClient.exists();
};
