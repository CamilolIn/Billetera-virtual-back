import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.text({ type: 'application/xml' }));

  const config = new DocumentBuilder()
    .setTitle('Documentación de la API de Billetera')
    .setDescription('API para la gestión de billeteras virtuales')
    .setVersion('1.0')
    .addTag('Billetera')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);
  await app.listen(3000);
}
bootstrap();
