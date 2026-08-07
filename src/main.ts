import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './infrastructure/modules/app.module'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable request payload validation globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Enable CORS for mobile and web frontends
  app.enableCors({ origin: '*' });

  await app.listen(3000, '0.0.0.0');
  console.log(`Backend running on http://localhost:3000`);
}
bootstrap();