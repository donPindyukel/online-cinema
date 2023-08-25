import { Module } from '@nestjs/common'
import { FileService } from './file.service'
import { FileController } from './file.controller'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path, resolve } from 'app-root-path'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath:  `${resolve('/..')}/uploads`,
			serveRoot: '/uploads',
		}),
		ConfigModule,
	],
	providers: [FileService],
	controllers: [FileController],
})
export class FileModule {}
