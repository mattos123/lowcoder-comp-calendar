import { I18nObjects } from "./types";

export const ptObj: I18nObjects = {
  defaultEvents: [
    {
      id: '1',
      title: 'Reunião com a equipe',
      start: new Date(new Date().setHours(9, 0)).toISOString(),
      end: new Date(new Date().setHours(10, 0)).toISOString(),
      color: '#3788d8'
    },
    {
      id: '2',
      title: 'Pausa para almoço',
      start: new Date(new Date().setHours(12, 0)).toISOString(),
      end: new Date(new Date().setHours(13, 0)).toISOString(),
      color: '#38b000'
    },
    {
      id: '3',
      title: 'Prazo do projeto',
      start: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      allDay: true,
      color: '#e63946'
    }
  ]
};
