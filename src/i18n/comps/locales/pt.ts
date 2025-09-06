import {en} from "./en"
export const pt: typeof en = {
  ...en,
  "style": {
    "textColor": "Cor do Texto",
    "contrastText": "Cor de Contraste do Texto",
    "accent": "Acento",
    "border": "Cor da Borda",
    "borderRadius": "Raio da Borda",
    "borderWidth": "Grossura da Borda",
    "backgroundColor": "Cor de Fundo",
    "headerBackground": "Cor do Header",
    "footerBackground": "Cor do Footer",
    "checkedBackground": "Cor com Seleção",
    "uncheckedBackground": "Cor sem Seleção",
    "uncheckedBorder": "Borda sem Seleção",
    "indicatorBackground": "Cor de Indicação",
    "toolbarBackground": "Cor de Fundo da Barra de Informações",
    "margin": "Margem",
    "padding": "Preenchimento",
    "marginLeft": "Margem Esquerda",
    "marginRight": "Margem Direita",
    "marginTop": "Margem Superior",
    "marginBottom": "Margem Inferior",
    "minWidth": "Largura Mínima",
    "aspectRatio": "Proporção de Tela",
    "textSize": "Tamanho do Texto",
    "headerColor": "Cor do Cabeçalho",
    "todayColor": "Cor do Dia Atual",
    "selectedColor": "Cor da Seleção"
  },
  "component": {
    "data": "Dados Hillchart",
    "events": "Eventos do Calendário",
    "view": "Visualização do Calendário"
  },
  "calendar": {
    "dayGridMonth": "Mês",
    "timeGridWeek": "Semana",
    "timeGridDay": "Dia",
    "listWeek": "Lista"
  },
  "methods": {
    "setPoint": "Definir Ponto",
    "addEvent": "Adicionar Evento",
    "removeEvent": "Remover Evento",
    "changeView": "Alterar Visualização",
    "invalidInput": "Entrada Inválida",
    "invalidView": "Visualização inválida. Deve ser uma das seguintes: dayGridMonth, timeGridWeek, timeGridDay, listWeek",
    "requiredField": "{field} é obrigatório"
  }
};
