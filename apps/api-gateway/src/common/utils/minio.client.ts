import { Client } from "minio";
import * as path from "path";

const endpoint = process.env.MINIO_ENDPOINT || "127.0.0.1";
const port = parseInt(process.env.MINIO_PORT || "9000", 10);
const useSSL = (process.env.MINIO_USE_SSL || "false") === "true";
const accessKey = process.env.MINIO_ACCESS_KEY || "minioadmin";
const secretKey = process.env.MINIO_SECRET_KEY || "minioadmin";
const defaultBucket = process.env.MINIO_BUCKET || "avatars";

const client = new Client({
  endPoint: endpoint,
  port,
  useSSL,
  accessKey,
  secretKey,
});

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

export { client as minioClient };
