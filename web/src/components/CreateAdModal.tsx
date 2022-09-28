import { FormEvent, useEffect, useState } from "react";
import axios from "axios";

import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { Check, GameController } from "phosphor-react";

import { Input } from "./Form/Input";

interface Game {
  id: string;
  title: string;
}

export function CreateAdModal() {

  const [ games, setGames ] = useState<Game[]>([]);
  const [ weekDays, setWeekDays ] = useState<string[]>([]);
  const [ useVoiceChannel, setUseVoiceChannel ] = useState(false)

  const weekDaysArray = [
    {weekDay: "0", firstLetter: "D", clicked: "bg-violet-500", notClicked: "bg-zinc-900" },
    {weekDay: "1", firstLetter: "S", clicked: "bg-violet-500", notClicked: "bg-zinc-900" },
    {weekDay: "2", firstLetter: "T", clicked: "bg-violet-500", notClicked: "bg-zinc-900" },
    {weekDay: "3", firstLetter: "Q", clicked: "bg-violet-500", notClicked: "bg-zinc-900" },
    {weekDay: "4", firstLetter: "Q", clicked: "bg-violet-500", notClicked: "bg-zinc-900" },
    {weekDay: "5", firstLetter: "S", clicked: "bg-violet-500", notClicked: "bg-zinc-900" },
    {weekDay: "6", firstLetter: "S", clicked: "bg-violet-500", notClicked: "bg-zinc-900" },
  ];

  useEffect(() => {
    axios('http://localhost:2424/games')
      .then(response => {
        setGames(response.data)
      })
  }, [])

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    console.log(data)

    if(!data.name) {
      return
    }

    try {
      const response = await axios.post(`http://localhost:2424/games/${data.game}/ads`,{
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel: useVoiceChannel,
      })

      alert("Anúncio criado com sucesso!")
    } catch(err) {
      console.log(err)
      alert("Erro ao criar o anúncio!")
    }
  }

  return(
    <Dialog.Portal>
      <Dialog.Overlay
        className="bg-black/60 inset-0 fixed"
      />

      <Dialog.Content
        className="
          w-[480px] fixed py-8 px-10 rounded-lg
          bg-[#2a2634]  text-white shadow-lg shadow-black/25
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        "
      >
        <Dialog.Title
          className="text-3xl font-black"
        >
          Publique um anúncio
        </Dialog.Title>

        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="game" className="font-semibold">
              Qual o game?
            </label>
            <select 
              name="game" id="game" 
              className="bg-zinc-900 py-3 px-4 rounded text-sm text-zinc-500 appearance-none"
              defaultValue=""
            >
              <option disabled value="">Selecione o game que deseja jogar</option>
              {
                games.map(game => <option key={game.id} value={game.id}> {game.title} </option>)
              }
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name">Seu nome (ou nickname)</label>
            <Input name="name" id="name" placeholder="Como te chamam dentro do game?" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
              <Input name="yearsPlaying" id="yearsPlaying" type="number" placeholder="Tudo bem ser ZERO" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="discord">Qual seu Discord?</label>
              <Input name="discord" id="discord" type="text" placeholder="Usuario#0000" />
            </div>
          </div>

            <div className="flex gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="weekDays">Quando costuma jogar?</label>

                <ToggleGroup.Root 
                  type="multiple" 
                  className="grid grid-cols-4 gap-2"
                  value={weekDays}
                  onValueChange={setWeekDays}
                >
                {
                  weekDaysArray.map(day => {
                    return (
                      <ToggleGroup.Item 
                        key={day.weekDay}
                        value={day.weekDay}
                        className={
                          `w-8 h-8 rounded 
                          ${!weekDays.includes(day.weekDay) ? day.notClicked : day.clicked }`
                        }
                      >{day.firstLetter}
                      </ToggleGroup.Item>  
                    )
                  })
                }
                </ToggleGroup.Root>

              </div>
              <div className="flex flex-col gap-2 flex-1">

                <label htmlFor="hourStart">Qual horário do dia?</label>

                <div className="grid grid-cols-2 gap-2">
                  <Input type="time" name="hourStart" id="hourStart" placeholder="De"/>
                  <Input type="time" name="hourEnd" id="hourEnd" placeholder="Até"/>
                </div>

              </div>
            </div>

            <div className="mt-2 flex gap-2 text-sm">
              <Checkbox.Root 
                checked={useVoiceChannel}
                onCheckedChange={(checked) => {
                  checked ? setUseVoiceChannel(true) : setUseVoiceChannel(false)
                }}
                id="useVoiceChannel"
                className="w-6 rounded bg-zinc-900 flex items-center justify-center" 
              >
                <Checkbox.Indicator>
                  <Check className="w-4 h-4 text-emerald-400"/>
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label htmlFor="useVoiceChannel">Costumo me conectar ao chat de voz</label>
            </div>

            <footer className="mt-4 flex justify-end gap-4">
              <Dialog.Close 
                type="button"
                className="h-12 px-5 font-semibold rounded-md bg-zinc-500 hover:bg-zinc-600"
              >
                Cancelar
              </Dialog.Close>
              <button 
                type="submit"
                className="flex gap-3 items-center justify-center h-12 px-5 font-semibold rounded-md bg-violet-500 hover:bg-violet-600"
              >
                <GameController size={24}/>
                Encontrar duo
              </button>
            </footer>

        </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}