import { storage, ref, uploadBytesResumable, getDownloadURL } from '../config/firebaseConfig';

interface UploadProgressCallback {
  (progress: number): void;
}

interface UploadFileResult {
  url: string;
  path: string;
}

class UploadFileService {
  private static generateFileName(file: File): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  }

  static async uploadFile(
    file: File,
    folder: string = 'uploads',
    onProgress?: UploadProgressCallback
  ): Promise<UploadFileResult> {
    try {
      const fileName = this.generateFileName(file);
      const filePath = `${folder}/${fileName}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) {
              onProgress(progress);
            }
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                url: downloadUrl,
                path: filePath
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async uploadMultipleFiles(
    files: File[],
    folder: string = 'uploads',
    onProgress?: (progress: number, index: number) => void
  ): Promise<UploadFileResult[]> {
    try {
      const uploadPromises = files.map((file, index) =>
        this.uploadFile(
          file,
          folder,
          (progress) => onProgress && onProgress(progress, index)
        )
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(`Failed to upload multiple files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default UploadFileService;
