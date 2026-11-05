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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadResponseDto } from './dto/image-upload.response.dto';
import { ApiErrorResponseDto } from 'src/global-dto/api-error.response.dto';

@ApiTags('File Upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiOperation({
    summary: 'Upload an image',
    description:
      'Accepts multipart/form-data with one file field named image. The file is saved temporarily, then uploaded to the Cloudinary folder blog-images. The response is the Cloudinary upload payload and may include fields beyond the documented schema.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'File to upload. The form field name must be image.',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Cloudinary upload result.',
    type: ImageUploadResponseDto,
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description: 'No file was sent in the image field.',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponseDto,
    description:
      'The file was not saved to disk, or Cloudinary rejected the upload.',
  })
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
