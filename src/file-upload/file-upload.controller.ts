import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error(
        'No file uploaded or file key is incorrect (expected "image")',
      );
    }
    console.log('Received file:', {
      ...file,
      buffer: file.buffer ? '[Buffer]' : undefined,
    });

    try {
      const result = await this.fileUploadService.uploadImage(file.path);
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Error uploading file: ${error.message || error}`);
    }
  }
}
