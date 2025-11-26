/**
 * Wavestk Audio Upload Client
 * Handles chunked uploads to wavestk service
 */

const WAVESTK_API_BASE = 'https://wave.be2nd.com/api';
const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
const MAX_RETRIES = 3;

interface UploadChunkParams {
  uploadId: string;
  chunkIndex: number;
  totalChunks: number;
  chunkData: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface UploadResult {
  id: string;
  filename: string;
  url: string;
  originalFilename: string;
}

interface ProgressCallback {
  (progress: number, message: string): void;
}

/**
 * Generate unique upload ID
 */
function generateUploadId(): string {
  return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Split file into chunks and convert to Base64
 */
async function splitFileIntoChunks(file: File): Promise<Array<{ index: number; data: string; size: number }>> {
  const chunks = [];
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    // Convert chunk to Base64
    const base64Chunk = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(chunk);
    });

    chunks.push({
      index: i,
      data: base64Chunk,
      size: chunk.size,
    });
  }

  return chunks;
}

/**
 * Upload a single chunk with retry logic
 */
async function uploadChunk(params: UploadChunkParams): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${WAVESTK_API_BASE}/upload/chunk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Chunk upload failed' }));
        throw new Error(errorData.error || 'Chunk upload failed');
      }

      return;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Chunk ${params.chunkIndex} upload attempt ${attempt + 1} failed:`, (error as Error).message);

      // Wait before retry (exponential backoff)
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw new Error(`Failed to upload chunk ${params.chunkIndex} after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

/**
 * Complete the chunked upload
 */
async function completeUpload(
  uploadId: string,
  totalChunks: number,
  fileName: string,
  fileType: string,
  fileSize: number
): Promise<UploadResult> {
  const response = await fetch(`${WAVESTK_API_BASE}/upload/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uploadId,
      totalChunks,
      fileName,
      fileType,
      fileSize,
    }),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Upload completion failed' }));
    throw new Error(errorData.error || 'Upload completion failed');
  }

  return await response.json();
}

/**
 * Upload a file to wavestk using chunked upload
 */
export async function uploadFileToWavestk(
  file: File,
  onProgress?: ProgressCallback
): Promise<UploadResult> {
  try {
    onProgress?.(0, `ファイルを分割中: ${file.name}`);

    // Split file into chunks
    const chunks = await splitFileIntoChunks(file);
    const uploadId = generateUploadId();
    const totalChunks = chunks.length;

    console.log(`Uploading ${file.name} in ${totalChunks} chunks (${CHUNK_SIZE / 1024 / 1024}MB each)`);

    // Upload each chunk sequentially
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const progress = ((i + 1) / totalChunks) * 95; // Reserve 5% for completion
      onProgress?.(progress, `アップロード中: ${file.name} - チャンク ${i + 1}/${totalChunks}`);

      await uploadChunk({
        uploadId,
        chunkIndex: chunk.index,
        totalChunks,
        chunkData: chunk.data,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
    }

    // Complete the upload
    onProgress?.(95, `ファイルを結合中: ${file.name}`);
    const result = await completeUpload(uploadId, totalChunks, file.name, file.type, file.size);

    onProgress?.(100, 'アップロード完了!');
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
