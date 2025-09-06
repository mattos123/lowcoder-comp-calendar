import {
  UICompBuilder,
  NameConfig,
  Section,
  withDefault,
  withExposingConfigs,
  withMethodExposing,
  eventHandlerControl,
  styleControl,
  jsonControl,
  toJSONObjectArray,
  AutoHeightControl,
} from "lowcoder-sdk";
import { stringExposingStateControl } from "lowcoder-sdk";
import { dropdownControl as selectControl } from "lowcoder-sdk";
import { useResizeDetector } from "react-resize-detector";

import styles from "./styles.module.css";

import { i18nObjs, trans } from "./i18n/comps";

import { Calendar } from './vendors'
import React, { useState, useEffect } from "react";


export const CompStyles = [
  {	
    name: "margin",	
    label: trans("style.margin"),
    margin: "margin",	
  },
  {	
    name: "padding",	
    label: trans("style.padding"),
    padding: "padding",	
  },
  {	
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",	
  },
  {	
    name: "backgroundColor",
    label: trans("style.backgroundColor"),
    backgroundColor: "backgroundColor",	
  },
  {	
    name: "border",
    label: trans("style.border"),
    border: "border",	
  },
  {
    name : "radius",
    label : trans("style.borderRadius"),
    radius : "radius",
  },
  {
    name : "borderWidth",
    label : trans("style.borderWidth"),
    borderWidth : "borderWidth",
  },
  {
    name : "headerColor",
    label : trans("style.headerColor"),
    headerColor : "headerColor",
  },
  {
    name : "todayColor",
    label : trans("style.todayColor"),
    todayColor : "todayColor",
  },
  {
    name : "selectedColor",
    label : trans("style.selectedColor"),
    selectedColor : "selectedColor",
  }
] as const;

interface Event {
  id: string,
  title: string,
  start: string,
  end?: string,
  allDay?: boolean,
  color?: string,
  description?: string,
}

let CalendarCompBase = (function () {

  const childrenMap = {
    styles: styleControl(CompStyles),
    autoHeight: withDefault(AutoHeightControl, "auto"),
    events: jsonControl(toJSONObjectArray, []),
    // Adicionar estado para armazenar o ID do evento diretamente como string
    eventId: withDefault(stringExposingStateControl(""), ""),
    view: selectControl(
      [
        { label: trans("calendar.dayGridMonth"), value: "dayGridMonth" },
        { label: trans("calendar.timeGridWeek"), value: "timeGridWeek" },
        { label: trans("calendar.timeGridDay"), value: "timeGridDay" },
        { label: trans("calendar.listWeek"), value: "listWeek" },
      ],
      "dayGridMonth"
    ),
    locale: selectControl(
      [
        { label: "Português (Brasil)", value: "pt-BR" },
        { label: "English (United States)", value: "en-US" },
        { label: "Español (España)", value: "es-ES" },
        { label: "Français (France)", value: "fr-FR" },
        { label: "Deutsch (Deutschland)", value: "de-DE" },
        { label: "Italiano (Italia)", value: "it-IT" },
        { label: "日本語 (日本)", value: "ja-JP" },
        { label: "中文 (中国)", value: "zh-CN" },
        { label: "Русский (Россия)", value: "ru-RU" }
      ],
      "pt-BR"
    ),
    timezone: selectControl(
      [
        { label: "UTC (Tempo Universal Coordenado)", value: "UTC" },
        { label: "America/Sao_Paulo (UTC-3)", value: "America/Sao_Paulo" },
        { label: "America/New_York (UTC-5)", value: "America/New_York" },
        { label: "America/Chicago (UTC-6)", value: "America/Chicago" },
        { label: "America/Denver (UTC-7)", value: "America/Denver" },
        { label: "America/Los_Angeles (UTC-8)", value: "America/Los_Angeles" },
        { label: "Europe/London (UTC+0)", value: "Europe/London" },
        { label: "Europe/Paris (UTC+1)", value: "Europe/Paris" },
        { label: "Europe/Berlin (UTC+1)", value: "Europe/Berlin" },
        { label: "Europe/Moscow (UTC+3)", value: "Europe/Moscow" },
        { label: "Asia/Dubai (UTC+4)", value: "Asia/Dubai" },
        { label: "Asia/Tokyo (UTC+9)", value: "Asia/Tokyo" },
        { label: "Australia/Sydney (UTC+10)", value: "Australia/Sydney" }
      ],
      "America/Sao_Paulo"
    ),
    onEvent: eventHandlerControl([
      {
        label: "onChange",
        value: "change",
        description: "Triggers when Calendar data changes",
      },
      {
        label: "onEventClick",
        value: "eventClick",
        description: "Triggers when an event is clicked",
      },
      {
        label: "onDateClick",
        value: "dateClick",
        description: "Triggers when a date is clicked",
      },
    ] as const),
  };
  
  return new UICompBuilder(childrenMap, (props: {
    onEvent: any;
    styles: { 
      backgroundColor: any; 
      border: any; 
      radius: any; 
      borderWidth: any; 
      margin: any; 
      padding: any; 
      textSize: any;
      headerColor: any;
      todayColor: any;
      selectedColor: any;
    };
    events: any[] | null | undefined;
    view: string;
    locale: string;
    autoHeight: boolean;
    timezone: string;
    eventId: {
      value: string;
      onChange: (value: string) => void;
    };
  }) => {
  const handleDataChange = () => {
    props.onEvent("change");
  };

  // Inicializar o eventId com um valor padrão
  React.useEffect(() => {
    // Definir um valor inicial para eventId
    props.eventId.onChange("0");
  }, []);

  const handleEventClick = (eventInfo: any) => {
    // Extrair todos os dados do evento para enviar para outro componente
    const event = eventInfo.event || {};
    
    // Obter o ID do evento
    const eventId = event.id || '';
    
    // Atualizar o estado eventId com o ID do evento diretamente como string
    props.eventId.onChange(eventId);
    
    // Enviar o ID do evento para o Lowcoder
    props.onEvent("eventClick", eventId);
    
    console.log('Evento clicado:', event);
    console.log('ID do evento:', eventId);
  };

  const handleDateClick = (dateInfo: any) => {
    props.onEvent("dateClick", { date: dateInfo.date });
  };

  // Usar ref para o container principal e detectar redimensionamento
  const { width, height, ref: conRef } = useResizeDetector();
  
  // Determinar a classe CSS com base na configuração de altura
  const heightClass = props.autoHeight ? styles['auto-height'] : styles['fixed-height'];
  
  // Definir variável CSS personalizada para altura fixa quando necessário
  const customStyle = props.autoHeight ? {} : { 
    '--calendar-height': '100%' // Altura fixa quando não for automático
  };

  return (
    <div 
      ref={conRef} 
      className={`${styles.wrapper} ${heightClass}`} 
      style={{
        backgroundColor: `${props.styles.backgroundColor}`,
        borderColor: `${props.styles.border}`,
        borderRadius: `${props.styles.radius}`,
        borderWidth: `${props.styles.borderWidth}`,
        margin: `${props.styles.margin}`,
        padding: `${props.styles.padding}`,
        fontSize: `${props.styles.textSize}`,
        minWidth: '500px',
        minHeight: '500px',
        height: '500px',
        ...customStyle
      }}
    >
      <div className={styles['calendar-container']}>
        <Calendar
          events={props.events}
          height="100%"
          width="100%"
          view={props.view}
          locale={typeof props.locale === 'string' ? props.locale : 'pt-BR'}
          timezone={typeof props.timezone === 'string' ? props.timezone : 'America/Sao_Paulo'}
          headerColor={props.styles.headerColor}
          todayColor={props.styles.todayColor}
          selectedColor={props.styles.selectedColor}
          onDataChange={handleDataChange}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      </div>
    </div>
  );
})
.setPropertyViewFn((children: any) => {
  return (
    <>
      <Section name="Basic">
        {children.events.propertyView({ label: "Events" })}
        {children.view.propertyView({ label: "Default View" })}
        {children.locale.propertyView({ label: "Locale" })}
        {children.timezone.propertyView({ label: "Timezone" })}
      </Section>
      <Section name="Interaction">
        {children.onEvent.propertyView()}
      </Section>
      <Section name="Styles">
        {children.autoHeight.getPropertyView()}
        {children.styles.getPropertyView()}
      </Section>
    </>
  );
})
.build();
})();

CalendarCompBase = class extends CalendarCompBase {
  autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }
};

CalendarCompBase = withMethodExposing(CalendarCompBase, [
  {
    method: {
      name: "addEvent",
      description: trans("methods.addEvent"),
      params: [{
        name: "event",
        type: "JSON",
        description: "Event data"
      }],
    },
    execute: (comp: any, values: any[]) => {
      const event = values[0] as Event;
      if(typeof event !== 'object') {
        return Promise.reject(trans("methods.invalidInput"))
      }
      if(!event.id) {
        return Promise.reject(trans("methods.requiredField", { field: 'ID' }));
      }
      if(!event.title) {
        return Promise.reject(trans("methods.requiredField", { field: 'Title' }));
      }
      if(!event.start) {
        return Promise.reject(trans("methods.requiredField", { field: 'Start date' }));
      }
      const events = comp.children.events.getView(); 
      const newEvents = [
        ...events,
        event,
      ];
      // Não precisamos expor os estados aqui, pois já estão expostos no componente principal
      comp.children.events.dispatchChangeValueAction(JSON.stringify(newEvents, null, 2));
      return comp;
    }
  },
  {
    method: {
      name: "removeEvent",
      description: trans("methods.removeEvent"),
      params: [{
        name: "eventId",
        type: "string",
        description: "Event ID"
      }],
    },
    execute: (comp: any, values: any[]) => {
      const eventId = values[0];
      if(!eventId) {
        return Promise.reject(trans("methods.requiredField", { field: 'Event ID' }));
      }
      const events = comp.children.events.getView();
      const newEvents = events.filter((event: Event) => event.id !== eventId);
      comp.children.events.dispatchChangeValueAction(JSON.stringify(newEvents, null, 2));
    }
  },
  {
    method: {
      name: "changeView",
      description: trans("methods.changeView"),
      params: [{
        name: "view",
        type: "string",
        description: "Calendar view (dayGridMonth, timeGridWeek, timeGridDay, listWeek)"
      }],
    },
    execute: (comp: any, values: any[]) => {
      const view = values[0];
      const validViews = ["dayGridMonth", "timeGridWeek", "timeGridDay", "listWeek"];
      if(!view || !validViews.includes(view)) {
        return Promise.reject(trans("methods.invalidView"));
      }
      comp.children.view.dispatchChangeValueAction(view);
    }
  },
]);

export default withExposingConfigs(CalendarCompBase, [
  new NameConfig("events", trans("component.events")),
  new NameConfig("view", trans("component.view")),
  new NameConfig("eventId", trans("component.eventId")),
]);
