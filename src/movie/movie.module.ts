import { Module } from '@nestjs/common'
import { MovieService } from './movie.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { MovieModel } from './movie.model'
import { MovieController } from './movie.controller'
import { TelegramModule } from 'src/telegram/telegram.module'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: MovieModel,
				schemaOptions: {
					collection: 'Movie',
				},
			},
		]),
		TelegramModule,
	],
	controllers: [MovieController],
	providers: [MovieService],
	exports: [MovieService],
})
export class MovieModule {}
