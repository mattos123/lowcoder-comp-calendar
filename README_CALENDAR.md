# Componente de Calendário para Lowcoder

Este é um plugin de componente de calendário para o Lowcoder, que permite adicionar um calendário interativo às suas aplicações.

## Recursos

- Visualização de calendário em diferentes formatos (mês, semana, dia, lista)
- Eventos personalizáveis com cores
- Suporte a eventos de dia inteiro
- Arrastar e soltar eventos
- Redimensionar eventos
- Localização (suporte para português e inglês)
- Personalização de cores e estilos

## Como usar

### Instalação

1. No editor Lowcoder, clique em "Insert > Extensions > Add npm plugin"
2. Digite o nome do pacote: `lowcoder-comp-calendar`
3. Clique em "Add"

### Configuração

O componente de calendário possui as seguintes propriedades configuráveis:

#### Básico
- **Events**: Lista de eventos do calendário
- **Default View**: Visualização padrão do calendário (Mês, Semana, Dia, Lista)
- **Locale**: Localização do calendário (pt-br, en-gb)

#### Interação
- **onChange**: Acionado quando os dados do calendário mudam
- **onEventClick**: Acionado quando um evento é clicado
- **onDateClick**: Acionado quando uma data é clicada

#### Estilos
- **Auto Height**: Ajusta automaticamente a altura do componente
- **Margin**: Margem externa do componente
- **Padding**: Preenchimento interno do componente
- **Text Size**: Tamanho do texto
- **Background Color**: Cor de fundo do componente
- **Border Color**: Cor da borda
- **Border Radius**: Raio da borda
- **Border Width**: Largura da borda
- **Header Color**: Cor do cabeçalho do calendário
- **Today Color**: Cor do dia atual
- **Selected Color**: Cor da seleção

### Métodos

O componente de calendário expõe os seguintes métodos:

#### addEvent
Adiciona um novo evento ao calendário.

Parâmetros:
```json
{
  "id": "string",
  "title": "string",
  "start": "2025-09-02T10:00:00",
  "end": "2025-09-02T11:00:00",
  "allDay": false,
  "color": "#3788d8",
  "description": "string"
}
```

#### removeEvent
Remove um evento do calendário pelo ID.

Parâmetros:
```
"event-id"
```

#### changeView
Altera a visualização do calendário.

Parâmetros:
```
"dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek"
```

### Exemplo de Eventos

```json
[
  {
    "id": "1",
    "title": "Reunião com a equipe",
    "start": "2025-09-02T09:00:00",
    "end": "2025-09-02T10:00:00",
    "color": "#3788d8"
  },
  {
    "id": "2",
    "title": "Pausa para almoço",
    "start": "2025-09-02T12:00:00",
    "end": "2025-09-02T13:00:00",
    "color": "#38b000"
  },
  {
    "id": "3",
    "title": "Prazo do projeto",
    "start": "2025-09-07T00:00:00",
    "allDay": true,
    "color": "#e63946"
  }
]
```

## Desenvolvimento

Para desenvolver e testar o componente localmente:

1. Clone o repositório
2. Navegue até a pasta do projeto
3. Execute `yarn install` para instalar as dependências
4. Execute `yarn start` para iniciar o servidor de desenvolvimento
5. Acesse http://localhost:9000 para visualizar o componente no playground

## Publicação

Para publicar o componente:

1. Execute `yarn build --publish` para construir e publicar o componente no NPM
