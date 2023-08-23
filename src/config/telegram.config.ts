import { ConfigService } from '@nestjs/config'
import { Telegram } from 'src/telegram/telegram.interface'

export const getTelegramConfig = (configService: ConfigService): Telegram => ({
	chatId: '-1001917511133',
	token: configService.get('TELEGRAM')
})
