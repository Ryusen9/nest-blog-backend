import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
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
      throw new BadRequestException(
        'No file uploaded. Please send a file with the field name "image" as multipart/form-data',
      );
    }

    if (!file.path) {
      throw new InternalServerErrorException(
        'File path is missing. File may not have been saved to disk.',
      );
    }

    console.log('Received file:', {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    });

    try {
      const result = await this.fileUploadService.uploadImage(file.path);
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        `Error uploading file: ${errorMessage}`,
      );
    }
  }
}
