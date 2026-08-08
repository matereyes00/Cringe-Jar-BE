import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './infrastructure/modules/app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Build the configuration
  const config = new DocumentBuilder()
    .setTitle('Cringe Jar Backend API Documentation')
    .setDescription('This contains the API documentation for the Cringe Jar backend service.')
    .setVersion('1.0')
    .addTag('cringe-jar')
    .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('cringe-jar-BE-api', app, document);

  // Enable request payload validation globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Enable CORS for mobile and web frontends
  app.enableCors({ origin: '*' });

  await app.listen(3000, '0.0.0.0');
  console.log(`Backend running on http://localhost:3000`);
}
bootstrap();