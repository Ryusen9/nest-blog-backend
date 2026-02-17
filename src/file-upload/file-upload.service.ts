import { Injectable } from '@nestjs/common';
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
    try {
      return new Promise((resolve, reject) => {
        v2.uploader.upload(
          filePath,
          { folder: 'blog-images' },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Cloudinary upload failed'));
            resolve(result);
          },
        );
      });
    } catch (error) {
      throw error;
    }
  }
}
