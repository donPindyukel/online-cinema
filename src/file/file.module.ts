import { Module } from '@nestjs/common'
import { FileService } from './file.service'
import { FileController } from './file.controller'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path';

console.log("etert", path,join(__dirname, '/../../../', 'uploads'));

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		}),
		ConfigModule,
	],
	providers: [FileService],
	controllers: [FileController],
})
export class FileModule {}
