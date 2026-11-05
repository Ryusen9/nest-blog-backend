import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Welcome message' })
  @ApiOkResponse({
    description: 'Plain-text greeting.',
    content: {
      'text/html': {
        schema: { type: 'string', example: 'Hello World!' },
      },
    },
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
