import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';


const corsOptions: CorsOptions = {
	origin: 'http://localhost:3000',
	methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
};

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(helmet());
	app.use(cookieParser());
	app.enableCors(corsOptions);
	app.setGlobalPrefix('api');

	await app.listen(8000);
}

bootstrap();
