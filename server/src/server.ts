import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { convertHourStringToMinutes } from "./utils/convert-hour-string-to-minutes";
import { convertMinutesToHourString } from "./utils/convert-minutes-to-hour-string";

const app = express();

app.use(express.json());
// app.use(cors());

//! cors => em produção o ideal é que o domínio seja setado, conforme abaixo:
app.use(cors({
	origin: 'https://nlw-e-sports-web-ipjv.vercel.app/'
})) 


const prisma = new PrismaClient({
	log: ['query']
})

//* LISTAGEM DOS GAMES
app.get("/games", async (request, response) => {
	const games = await prisma.game.findMany({
		include: {
			_count: {
				select: {
					ads: true
				}
			}
		}
	})

	return response.json(games)
})

//* CRIAÇÃO DE ANÚNCIO
app.post("/games/:id/ads", async (request, response) => {
	const gameId = request.params.id;
	const body: any = request.body; //! o ideal seria usar validação, pode-se usar o `zod javascript`

	const ad = await prisma.ad.create({
		data: {
			gameId,
			name: body.name,
			yearsPlaying: body.yearsPlaying,
			discord: body.discord,
			weekDays: body.weekDays.join(','),
			hourStart: convertHourStringToMinutes(body.hourStart),
			hourEnd: convertHourStringToMinutes(body.hourEnd),
			useVoiceChannel: body.useVoiceChannel,
		}
	})

	return response.status(201).json(ad)
})


//* LISTAGEM DOS ANÚNCIOS POR GAME
app.get("/games/:id/ads", async (request, response) => {
	const gameId = request.params.id;

	const ads = await prisma.ad.findMany({
		select: {
			id: true,
			name: true,
			weekDays: true,
			useVoiceChannel: true,
			yearsPlaying: true,
			hourStart: true,
			hourEnd: true,
		},
		where: {
			gameId,
		},
		orderBy: {
			createdAt: 'desc'
		}
	})

	return response.json(ads.map(ad => {
		return {
			...ad,
			weekDays: ad.weekDays.split(','),
			hourStart: convertMinutesToHourString(ad.hourStart),
			hourEnd: convertMinutesToHourString(ad.hourEnd)
		}
	}));
});

//* GETTING DISCORD
app.get('/ads/:id/discord', async (request, response) => {
	const adId = request.params.id

	const ad = await prisma.ad.findUniqueOrThrow({
		select: {
			discord: true,
		},
		where: {
			id: adId,
		}
	})

	return response.json({
		discord: ad.discord
	});
})

app.listen(2424);

/** //* HTTP status code
 * 
 * response.status(201) indica a criação de algo
 */

 /** //*.get()
	* O primeiro parâmetro deve ser a 'rota' (www.api.com/rota) da aplicação
	* O segundo parâmetro deve ser uma função a ser executada coso o usuário acesse essa roa
	* 	Esse segundo parâmetro aceita outros dois parâmetros: //* request response
	* 		//* request
	* 		faz a requisição e captura as informações que a rota traz
	*
	* 		//* response
	* 		envia para a rota alguma informação
	*/