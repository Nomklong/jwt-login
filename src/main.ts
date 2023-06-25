import { NestFactory } from '@nestjs/core';
import { AppModule } from '@module/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  await app.listen(process.env.APP_PORT);
  app.enableCors();
}
bootstrap();
