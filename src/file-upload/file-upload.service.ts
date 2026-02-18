import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
@Injectable()
export class FileUploadService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  async uploadImage(
    filePath: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!filePath) {
      throw new InternalServerErrorException('File path is required');
    }

    try {
      const result = await v2.uploader.upload(filePath, {
        folder: 'blog-images',
      });
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof (error as { message: unknown }).message === 'string'
            ? (error as { message: string }).message
            : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Cloudinary upload failed: ${errorMessage}`,
      );
    }
  }
}
