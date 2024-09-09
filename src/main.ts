import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptor/transform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //config PORT
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 8081;
  //config version
  app.setGlobalPrefix('/api/v1')
  //Config validate
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  //config interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(port);
}
bootstrap();
