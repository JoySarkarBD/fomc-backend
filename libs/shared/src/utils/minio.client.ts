import config from "@shared/config/app.config";
import { Client } from "minio";
import * as path from "path";

const endpoint = config.MINIO_ENDPOINT || "127.0.0.1";
const port = parseInt(String(config.MINIO_PORT || "9000"), 10);
const useSSL = String(config.MINIO_USE_SSL || "false") === "true";
const accessKey = config.MINIO_ACCESS_KEY || "minioadmin";
const secretKey = config.MINIO_SECRET_KEY || "minioadmin";
const defaultBucket = config.MINIO_BUCKET || "avatars";

/**
 * MinIO client for handling file uploads, deletions, and signed URL generation.
 * This client abstracts the interaction with MinIO, allowing for easy file management within the application.
 * It supports uploading files to a specified bucket, removing files based on their path, and generating signed URLs for secure access.
 */
const client = new Client({
  endPoint: endpoint,
  port,
  useSSL,
  accessKey,
  secretKey,
});

/**
 * Ensures that the specified bucket exists in MinIO. If the bucket does not exist, it attempts to create it.
 *
 * @param bucket - The name of the bucket to ensure existence for. Defaults to the configured default bucket if not provided.
 */
async function ensureBucket(bucket = defaultBucket) {
  try {
    const exists = await client.bucketExists(bucket);
    if (!exists) {
      await client.makeBucket(bucket);
    }
  } catch (err) {
    // If bucketExists/makeBucket not supported or fails, allow putObject to fail normally
  }
}

/**
 * Uploads a file to MinIO and returns the file path. The file is stored in the specified bucket with a unique name.
 *
 * @param buffer - The file data as a Buffer to be uploaded.
 * @param originalName - The original name of the file, used to determine the file extension.
 * @param contentType - Optional MIME type of the file; defaults to "application/octet-stream" if not provided.
 * @returns A promise that resolves to the file path in MinIO (e.g., "minio://bucket/unique-file-name.ext").
 */
export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  contentType?: string,
): Promise<string> {
  const bucket = defaultBucket;
  await ensureBucket(bucket);
  const ext = path.extname(originalName) || "";
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  await client.putObject(bucket, unique, buffer, buffer.length, {
    "Content-Type": contentType || "application/octet-stream",
  } as any);
  return `minio://${bucket}/${unique}`;
}

/**
 * Removes a file from MinIO based on the provided file path. The file path should be in the format "minio://bucket/objectName".
 * If the file path is invalid or if an error occurs during removal, the function will silently ignore the error.
 *
 * @param filePath - The path of the file to be removed, expected to be in the format "minio://bucket/objectName".
 * @return A promise that resolves when the file removal is complete. If the file path is invalid or if an error occurs, the promise will still resolve without throwing an error.
 */
export async function removeFile(filePath: string): Promise<void> {
  if (!filePath) return;
  const match = filePath.match(/^minio:\/\/([^\/]+)\/(.+)$/);
  if (!match) return;
  const bucket = match[1];
  const objectName = match[2];
  try {
    await client.removeObject(bucket, objectName);
  } catch (err) {
    // ignore removal errors
  }
}

/**
 * Generates a signed URL for accessing a file stored in MinIO. The file path should be in the format "minio://bucket/objectName".
 *
 * @param filePath - The path of the file for which to generate a signed URL, expected to be in the format "minio://bucket/objectName".
 * @param expiresInSeconds - Optional expiration time for the signed URL in seconds. If not provided, a default value from configuration will be used. The maximum allowed expiration time is 7 days (604800 seconds).
 * @returns A promise that resolves to the signed URL for accessing the file, or null if the file path is invalid or if an error occurs during URL generation.
 */
export async function getSignedUrl(
  filePath: string,
  expiresInSeconds?: number,
): Promise<string | null> {
  if (!filePath) return null;

  const match = filePath.match(/^minio:\/\/([^\/]+)\/(.+)$/);
  if (!match) return null;

  const bucket = match[1];
  const objectName = match[2];

  try {
    // MinIO/Minio-js enforces a maximum expiry of 7 days (in seconds).
    const MAX_EXPIRES = 7 * 24 * 60 * 60; // 7 days in seconds

    const expires = Math.min(MAX_EXPIRES);

    if (expiresInSeconds && expiresInSeconds > MAX_EXPIRES) {
      console.warn(
        `Requested expiresInSeconds=${expiresInSeconds} exceeds max; capping to ${MAX_EXPIRES}`,
      );
    }

    const url = await client.presignedGetObject(bucket, objectName, expires);
    return url;
  } catch (err) {
    console.error("Failed to generate signed URL", err);
    return null;
  }
}

export { client as minioClient };
