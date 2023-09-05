import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors( { 
    origin: ['https://movieflix-lemon.vercel.app/', 'https://www.google.com'],
  })
  await app.listen(4200)
}
bootstrap()
