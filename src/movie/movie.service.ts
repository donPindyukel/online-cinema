import { Injectable, NotFoundException } from '@nestjs/common'
import { MovieModel } from './movie.model'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateMovieDto } from './update-movie.dto'
import { Types } from 'mongoose'
import { TelegramService } from 'src/telegram/telegram.service'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
		private readonly telegramService: TelegramService
	) {}

	async bySlug(slug: string) {
		const doc = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()
		if (!doc) {
			throw new NotFoundException('Movie not found!')
		}
		return doc
	}

	async byActor(actorId: Types.ObjectId) {
		const docs = await this.MovieModel.find({ actors: actorId }).exec()
		if (!docs) {
			throw new NotFoundException('Movies not found!')
		}
		return docs
	}

	async byGenres(genreIds: Types.ObjectId[]) {
		const docs = await this.MovieModel.find({
			genres: { $in: genreIds },
		}).exec()
		if (!docs) {
			throw new NotFoundException('Movies not found!')
		}
		return docs
	}

	async getMostPopular() {
		const doc = await this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
		return doc
	}

	async updateCountOpened(slug: string) {
		const updateDoc = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{ $inc: { countOpened: 1 } },
			{ new: true }
		).exec()

		if (!updateDoc) {
			throw new NotFoundException('Movie not found!')
		}
		return updateDoc
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [{ title: new RegExp(searchTerm, 'i') }],
			}
		}

		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.populate('actors genres')
			.exec()
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			description: '',
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		}

		const movie = await this.MovieModel.create(defaultValue)

		return movie._id
	}

	async update(_id: string, dto: UpdateMovieDto) {
		if (!dto.isSendTelegram) {
			await this.sendNotification(dto)
			dto.isSendTelegram = true
		}

		const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) {
			throw new NotFoundException('Movie not found!')
		}
		return updateDoc
	}

	async delete(id: string) {
		const deleteDoc = await this.MovieModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) {
			throw new NotFoundException('Movie not found!')
		}
		return deleteDoc
	}

	async byId(_id: string) {
		const actor = await this.MovieModel.findById(_id).exec()

		if (!actor) {
			throw new NotFoundException('Movie not found!')
		}
		return actor
	}

	async updateRatting(id: Types.ObjectId, newRating: number) {
		return this.MovieModel.findByIdAndUpdate(
			id,
			{ rating: newRating },
			{ new: true }
		).exec()
	}

	async sendNotification(dto: UpdateMovieDto) {
		// if (process.env.NODE_ENV !== 'development') {
		await this.telegramService.sendPhoto(
			'https://phonoteka.org/uploads/posts/2022-09/1663745997_11-phonoteka-org-p-dzhon-uik-oboi-na-telefon-vkontakte-14.jpg'
		)
		// }

		const msg = `<b>${dto.title}</b>\n\n` // + `${dto.description}\n\n`

		await this.telegramService.sendMessage(msg, {
			reply_markup: {
				inline_keyboard: [
					[{ url: 'https://okko.tv/movie/free-gay', text: '🍿 Go to watch' }],
				],
			},
		})
	}
}
