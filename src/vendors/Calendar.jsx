import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Lista de timezones disponíveis
const availableTimezones = [
  { value: 'UTC', label: 'UTC (Tempo Universal Coordenado)', offset: 0 },
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (UTC-3)', offset: -3 },
  { value: 'America/New_York', label: 'America/New_York (UTC-5)', offset: -5 },
  { value: 'America/Chicago', label: 'America/Chicago (UTC-6)', offset: -6 },
  { value: 'America/Denver', label: 'America/Denver (UTC-7)', offset: -7 },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (UTC-8)', offset: -8 },
  { value: 'Europe/London', label: 'Europe/London (UTC+0)', offset: 0 },
  { value: 'Europe/Paris', label: 'Europe/Paris (UTC+1)', offset: 1 },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (UTC+1)', offset: 1 },
  { value: 'Europe/Moscow', label: 'Europe/Moscow (UTC+3)', offset: 3 },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (UTC+4)', offset: 4 },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)', offset: 9 },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (UTC+10)', offset: 10 }
];

// Lista de locales disponíveis
const availableLocales = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (United States)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'it-IT', label: 'Italiano (Italia)' },
  { value: 'ja-JP', label: '日本語 (日本)' },
  { value: 'zh-CN', label: '中文 (中国)' },
  { value: 'ru-RU', label: 'Русский (Россия)' }
];

// Função auxiliar para ajustar o fuso horário
const adjustToTimezone = (dateString, timezone) => {
  if (!dateString) return new Date();
  
  try {
    // Verificar se a string de data termina com Z (UTC)
    const isUTC = dateString.toString().endsWith('Z');
    
    // Criar um objeto de data a partir da string
    const date = new Date(dateString);
    
    // Se a data já está em UTC (termina com Z), precisamos convertê-la para o timezone local
    if (isUTC) {
      // Criar um formatador de data que use o timezone especificado
      const options = { timeZone: timezone || 'America/Sao_Paulo' };
      
      // Obter as partes da data no timezone especificado
      const formatter = new Intl.DateTimeFormat('en-US', {
        ...options,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      });
      
      // Obter as partes da data formatada
      const parts = formatter.formatToParts(date);
      
      // Extrair os valores das partes
      const dateParts = {};
      parts.forEach(part => {
        if (part.type !== 'literal') {
          dateParts[part.type] = parseInt(part.value, 10);
        }
      });
      
      // Criar uma nova data com os valores ajustados
      return new Date(
        dateParts.year,
        dateParts.month - 1, // Meses em JavaScript são 0-indexed
        dateParts.day,
        dateParts.hour,
        dateParts.minute,
        dateParts.second
      );
    }
    
    // Se não é UTC, retornar a data como está
    return date;
  } catch (e) {
    console.error('Erro ao ajustar fuso horário:', e);
    return new Date();
  }
};

// Implementação simplificada usando div para debug
function Calendar(props) {
  const {
    events = [],
    view: initialView = 'dayGridMonth',
    locale: initialLocale = 'pt-BR',
    timezone: initialTimezone = 'America/Sao_Paulo',
    height = 400,
    width = '100%',
    headerColor = '#f0f0f0',
    todayColor = '#e8f4f8',
    selectedColor = '#e0e0e0',
    onDataChange,
    onEventClick,
    onDateClick
  } = props;
  
  // Estado para controlar o locale selecionado
  const [locale, setLocale] = useState(initialLocale);
  
  // Estado para controlar o timezone selecionado
  const [timezone, setTimezone] = useState(initialTimezone);
  
  // Estado interno para controlar a visualização atual
  const [currentView, setCurrentView] = useState(initialView);
  
  // Estado para controlar a data atual do calendário
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Atualizar a visualização quando as props mudarem
  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);
  

  // Função para renderizar eventos como elementos simples para debug
  const renderEvents = () => {
    if (!Array.isArray(events)) {
      return <div>Nenhum evento para exibir</div>;
    }
    
    return events.map((event, index) => {
      // Garantir que temos valores string para exibir
      const title = event && event.title ? String(event.title) : 'Sem título';
      const start = event && event.start ? String(event.start) : 'Sem data';
      
      return (
        <div 
          key={event && event.id ? event.id : index}
          style={{
            backgroundColor: event && event.color ? event.color : '#3788d8',
            padding: '5px',
            margin: '5px',
            borderRadius: '3px',
            color: 'white'
          }}
          onClick={() => handleEventClick(event)}
        >
          {title} - {start}
        </div>
      );
    });
  };


  // Função auxiliar para processar o clique em eventos
  const handleEventClick = (event, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (onEventClick) {
      // Extrair todos os dados do evento para enviar para outro componente
      const eventData = {
        id: event?.id,
        title: event?.title,
        start: event?.start,
        end: event?.end,
        color: event?.color,
        // Incluir todos os dados adicionais que possam existir no evento
        ...event
      };
      
      onEventClick({ event: eventData });
    }
  };

  // Função para renderizar o cabeçalho do calendário
  const renderHeader = () => {
    // Usar a data do estado interno
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    
    // Formatar mês e ano para exibição
    const monthName = currentDate.toLocaleString(locale || 'pt-BR', { month: 'long' });
    
    // Determinar o título com base na visualização atual
    let headerTitle = `${monthName} ${year}`;
    if (currentView === 'timeGridWeek') {
      const firstDayOfWeek = new Date(year, month, day - currentDate.getDay());
      const lastDayOfWeek = new Date(year, month, day + (6 - currentDate.getDay()));
      const formattedFirstDay = firstDayOfWeek.toLocaleDateString(locale || 'pt-BR', { day: 'numeric' });
      const formattedLastDay = lastDayOfWeek.toLocaleDateString(locale || 'pt-BR', { day: 'numeric', month: 'short' });
      headerTitle = `${formattedFirstDay} - ${formattedLastDay}`;  
    } else if (currentView === 'timeGridDay') {
      headerTitle = currentDate.toLocaleDateString(locale || 'pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    } else if (currentView === 'listWeek') {
      headerTitle = `Semana de ${monthName}`;  
    }
    
    return (
      <div style={{ 
        backgroundColor: headerColor, 
        padding: '10px', 
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: '5px 0', width: '100%' }}>Calendário ({getViewName(currentView)})</h3>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button 
            onClick={() => {
              // Navegar para o mês/semana/dia anterior
              const newDate = new Date(currentDate);
              if (currentView === 'dayGridMonth') {
                newDate.setMonth(newDate.getMonth() - 1);
              } else if (currentView === 'timeGridWeek' || currentView === 'listWeek') {
                newDate.setDate(newDate.getDate() - 7);
              } else {
                newDate.setDate(newDate.getDate() - 1);
              }
              setCurrentDate(newDate);
              onDataChange && onDataChange({ action: 'prev', date: newDate });
            }}
            style={{ 
              padding: '3px 8px', 
              margin: '0 5px',
              whiteSpace: 'nowrap',
              minWidth: '80px',
              cursor: 'pointer'
            }}
          >
            &laquo; Anterior
          </button>
          <span style={{ 
            margin: '0 10px', 
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: '1 1 auto',
            textAlign: 'center'
          }}>{headerTitle}</span>
          <button 
            onClick={() => {
              // Navegar para o mês/semana/dia seguinte
              const newDate = new Date(currentDate);
              if (currentView === 'dayGridMonth') {
                newDate.setMonth(newDate.getMonth() + 1);
              } else if (currentView === 'timeGridWeek' || currentView === 'listWeek') {
                newDate.setDate(newDate.getDate() + 7);
              } else {
                newDate.setDate(newDate.getDate() + 1);
              }
              setCurrentDate(newDate);
              onDataChange && onDataChange({ action: 'next', date: newDate });
            }}
            style={{ 
              padding: '3px 8px', 
              margin: '0 5px',
              whiteSpace: 'nowrap',
              minWidth: '80px',
              cursor: 'pointer'
            }}
          >
            Próximo &raquo;
          </button>
        </div>
        <div style={{ 
          marginTop: '10px', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '5px',
          flexWrap: 'wrap',
          width: '100%'
        }}>
          <button 
            onClick={() => {
              // Ir para a data atual
              setCurrentDate(new Date());
              onDateClick && onDateClick({ date: new Date() });
            }}
            style={{ 
              padding: '3px 8px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '3px',
              margin: '2px',
              minWidth: '60px',
              flex: '0 1 auto',
              cursor: 'pointer'
            }}
          >
            Hoje
          </button>
          <button 
            onClick={() => {
              setCurrentView('dayGridMonth');
              onDataChange && onDataChange({ view: 'dayGridMonth' });
            }}
            style={{ 
              padding: '3px 8px', 
              backgroundColor: currentView === 'dayGridMonth' ? '#007bff' : '#f8f9fa',
              color: currentView === 'dayGridMonth' ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '3px',
              margin: '2px',
              minWidth: '60px',
              flex: '0 1 auto',
              cursor: 'pointer'
            }}
          >
            Mês
          </button>
          <button 
            onClick={() => {
              setCurrentView('timeGridWeek');
              onDataChange && onDataChange({ view: 'timeGridWeek' });
            }}
            style={{ 
              padding: '3px 8px', 
              backgroundColor: currentView === 'timeGridWeek' ? '#007bff' : '#f8f9fa',
              color: currentView === 'timeGridWeek' ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '3px',
              margin: '2px',
              minWidth: '60px',
              flex: '0 1 auto',
              cursor: 'pointer'
            }}
          >
            Semana
          </button>
          <button 
            onClick={() => {
              setCurrentView('timeGridDay');
              onDataChange && onDataChange({ view: 'timeGridDay' });
            }}
            style={{ 
              padding: '3px 8px', 
              backgroundColor: currentView === 'timeGridDay' ? '#007bff' : '#f8f9fa',
              color: currentView === 'timeGridDay' ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '3px',
              margin: '2px',
              minWidth: '60px',
              flex: '0 1 auto',
              cursor: 'pointer'
            }}
          >
            Dia
          </button>
          <button 
            onClick={() => {
              setCurrentView('listWeek');
              onDataChange && onDataChange({ view: 'listWeek' });
            }}
            style={{ 
              padding: '3px 8px', 
              backgroundColor: currentView === 'listWeek' ? '#007bff' : '#f8f9fa',
              color: currentView === 'listWeek' ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '3px',
              margin: '2px',
              minWidth: '60px',
              flex: '0 1 auto',
              cursor: 'pointer'
            }}
          >
            Lista
          </button>
        </div>
      </div>
    );
  };

  // Função para obter o nome da visualização
  const getViewName = (viewType) => {
    const viewMap = {
      'dayGridMonth': 'Mês',
      'timeGridWeek': 'Semana',
      'timeGridDay': 'Dia',
      'listWeek': 'Lista'
    };
    return viewMap[viewType] || viewType;
  };

  // Função para renderizar o conteúdo da visualização
  const renderViewContent = () => {
    return (
      <div style={{ 
        flex: '1 1 auto', 
        overflow: 'auto', 
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%', // Altura 100%
        minHeight: '400px'
      }}>
        {(() => {
          // Renderizar conteúdo com base na visualização atual
          switch(currentView) {
            case 'timeGridWeek':
              return renderWeekView();
            case 'timeGridDay':
              return renderDayView();
            case 'listWeek':
              return renderListView();
            case 'dayGridMonth':
            default:
              return renderMonthView();
          }
        })()}
      </div>
    );
  };

  // Renderizar visualização mensal
  const renderMonthView = () => {
    // Usar a data do estado interno
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    
    // Primeiro dia do mês atual
    const firstDay = new Date(year, month, 1);
    // Último dia do mês atual
    const lastDay = new Date(year, month + 1, 0);
    
    // Dia da semana do primeiro dia (0 = Domingo, 6 = Sábado)
    const firstDayOfWeek = firstDay.getDay();
    // Total de dias no mês
    const daysInMonth = lastDay.getDate();
    
    // Dias do mês anterior para preencher a primeira semana
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Total de células do calendário (máximo 5 ou 6 semanas * 7 dias)
    // Calcular o número exato de semanas necessárias
    const weeksNeeded = Math.ceil((firstDayOfWeek + daysInMonth) / 7);
    // Limitar a 5 semanas se possível, 6 semanas apenas se necessário
    const totalCells = weeksNeeded * 7;
    
    // Dia atual
    const today = new Date().getDate();
    
    // Nome do mês atual
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    
    return (
      <div style={{ padding: '10px' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px',
        marginBottom: '10px'
      }}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} style={{ 
            padding: '5px', 
            textAlign: 'center', 
            backgroundColor: '#f0f0f0',
            fontWeight: 'bold'
          }}>
            {day}
          </div>
        ))}
        
        {/* Gerar todas as células do calendário */}
        {Array(totalCells).fill(null).map((_, i) => {
          // Calcular o dia a ser exibido
          let cellDay, cellMonth, cellYear, isNextMonth = false, isPrevMonth = false;
          const cellIndex = i;
          
          // Dias do mês anterior
          if (cellIndex < firstDayOfWeek) {
            cellDay = prevMonthLastDay - (firstDayOfWeek - cellIndex - 1);
            cellMonth = month - 1;
            cellYear = year;
            isPrevMonth = true;
            if (cellMonth < 0) {
              cellMonth = 11;
              cellYear--;
            }
          } 
          // Dias do mês atual
          else if (cellIndex < firstDayOfWeek + daysInMonth) {
            cellDay = cellIndex - firstDayOfWeek + 1;
            cellMonth = month;
            cellYear = year;
          } 
          // Dias do próximo mês
          else {
            // Resetar para começar do dia 1 do próximo mês
            cellDay = cellIndex - (firstDayOfWeek + daysInMonth) + 1;
            cellMonth = month + 1;
            cellYear = year;
            isNextMonth = true;
            if (cellMonth > 11) {
              cellMonth = 0;
              cellYear++;
            }
          }
            
            // Verificar se é o dia atual
            const isCurrentMonth = cellMonth === month;
            const isToday = isCurrentMonth && cellDay === today && cellMonth === new Date().getMonth() && cellYear === new Date().getFullYear();
            
            // Data completa para este dia
            const cellDate = new Date(cellYear, cellMonth, cellDay);
            
            // Filtrar eventos para este dia específico
            const dayEvents = Array.isArray(events) ? events.filter(event => {
              if (!event || !event.start) return false;
              
              // Converter a data de início do evento para objeto Date
              let eventDate;
              try {
                eventDate = adjustToTimezone(event.start, timezone);
                
                // Comparar ano, mês e dia para garantir correspondência exata
                const eventYear = eventDate.getFullYear();
                const eventMonth = eventDate.getMonth();
                const eventDay = eventDate.getDate();
                
                return eventDay === cellDay && eventMonth === cellMonth && eventYear === cellYear;
              } catch (e) {
                return false;
              }
            }) : [];
            
            return (
              <div 
                key={`cell-${cellIndex}`} 
                style={{ 
                  padding: '5px', 
                  minHeight: '70px',
                  border: '1px solid #ddd',
                  backgroundColor: isToday ? todayColor : (isCurrentMonth ? 'white' : '#f9f9f9'),
                  position: 'relative',
                  color: isCurrentMonth ? 'black' : '#aaa'
                }}
                onClick={() => onDateClick && onDateClick({ date: cellDate })}
              >
                <div style={{ 
                  fontWeight: isToday ? 'bold' : 'normal',
                  textAlign: 'right',
                  marginBottom: '2px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: isToday ? todayColor : 'transparent',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  marginLeft: 'auto'
                }}>
                  {/* Mostrar o número do mês apenas para dias de outros meses */}
                  {isNextMonth && <span style={{fontSize: '0.7em', marginRight: '2px', color: '#888'}}>{cellMonth + 1}/</span>}
                  {isPrevMonth && <span style={{fontSize: '0.7em', marginRight: '2px', color: '#888'}}>{cellMonth + 1}/</span>}
                  <span style={{margin: 'auto'}}>{cellDay}</span>
                </div>
                
                {/* Renderizar eventos deste dia */}
                {dayEvents.slice(0, 3).map((event, idx) => {
                  const title = event && event.title ? String(event.title) : 'Sem título';
                  
                  return (
                    <div 
                      key={`${cellIndex}-event-${idx}`}
                      style={{
                        backgroundColor: event.color || '#3788d8',
                        padding: '2px 4px',
                        margin: '2px 0',
                        borderRadius: '2px',
                        color: 'white',
                        fontSize: '0.8em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick && onEventClick({ event });
                      }}
                    >
                      {title}
                    </div>
                  );
                })}
                
                {/* Indicador de mais eventos */}
                {dayEvents.length > 3 && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation(); // Impedir propagação do evento
                      
                      // Usar a data da célula atual (dia específico que foi clicado)
                      const clickedDate = new Date(cellDate);
                      
                      // Atualizar a visualização para o dia específico
                      setCurrentView('timeGridDay');
                      setCurrentDate(clickedDate);
                      
                      // Notificar sobre a mudança
                      onDataChange && onDataChange({ 
                        view: 'timeGridDay', 
                        date: clickedDate 
                      });
                    }}
                    style={{ 
                      fontSize: '0.8em', 
                      textAlign: 'center',
                      color: '#0066cc',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: '2px'
                    }}
                  >
                    +{dayEvents.length - 3} mais
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar visualização semanal
  const renderWeekView = () => {
    // Usar a data do estado interno
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    
    // Primeiro dia da semana (domingo)
    const firstDayOfWeek = new Date(year, month, day - currentDate.getDay());
    
    // Gerar array com os 7 dias da semana
    const weekDays = Array(7).fill(null).map((_, i) => {
      const weekDay = new Date(firstDayOfWeek);
      weekDay.setDate(firstDayOfWeek.getDate() + i);
      return weekDay;
    });
    
    // Formatar dias da semana para exibição
    const formattedWeekDays = weekDays.map(weekDay => {
      return {
        date: weekDay,
        dayName: weekDay.toLocaleDateString(locale || 'pt-BR', { weekday: 'short' }),
        dayNumber: weekDay.getDate(),
        isToday: weekDay.toDateString() === new Date().toDateString()
      };
    });
    
    return (
      <div style={{ padding: '10px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '50px repeat(7, 1fr)',
          gap: '2px'
        }}>
          <div style={{ padding: '5px' }}></div>
          {formattedWeekDays.map(day => (
            <div 
              key={day.date.toISOString()} 
              style={{ 
                padding: '5px', 
                textAlign: 'center', 
                backgroundColor: day.isToday ? todayColor : '#f0f0f0',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div>{day.dayName}</div>
              <div>{day.dayNumber}</div>
            </div>
          ))}
          
          {Array(12).fill(null).map((_, hour) => {
            const displayHour = hour + 8; // Começando às 8h
            return [
              // Célula da hora
              <div 
                key={`hour-${displayHour}`} 
                style={{ 
                  padding: '5px', 
                  borderTop: '1px solid #ddd',
                  textAlign: 'right',
                  fontSize: '0.8em',
                  color: '#666'
                }}
              >
                {displayHour}:00
              </div>,
              // Células dos dias
              ...weekDays.map((date, dayIndex) => {
                // Criar uma data para esta hora específica
                const cellDateTime = new Date(date);
                cellDateTime.setHours(displayHour, 0, 0, 0);
                
                // Filtrar eventos para este dia e hora
                const hourEvents = Array.isArray(events) ? events.filter(event => {
                  if (!event || !event.start) return false;
                  
                  try {
                    const eventDate = adjustToTimezone(event.start, timezone);
                    const eventHour = eventDate.getHours();
                    
                    return eventDate.getDate() === date.getDate() && 
                           eventDate.getMonth() === date.getMonth() && 
                           eventDate.getFullYear() === date.getFullYear() &&
                           eventHour === displayHour;
                  } catch (e) {
                    return false;
                  }
                }) : [];
                
                return (
                  <div 
                    key={`${displayHour}-${dayIndex}`} 
                    style={{ 
                      padding: '2px', 
                      borderTop: '1px solid #ddd',
                      borderLeft: '1px solid #ddd',
                      minHeight: '30px',
                      position: 'relative',
                      backgroundColor: formattedWeekDays[dayIndex].isToday ? 'rgba(232, 244, 248, 0.3)' : 'transparent'
                    }}
                    onClick={() => onDateClick && onDateClick({ date: cellDateTime })}
                  >
                    {/* Eventos para esta hora e dia */}
                    {hourEvents.map((event, idx) => {
                      const title = event && event.title ? String(event.title) : 'Sem título';
                      
                      return (
                        <div 
                          key={`${displayHour}-${dayIndex}-${idx}`}
                          style={{
                            backgroundColor: event.color || '#3788d8',
                            padding: '2px 4px',
                            margin: '1px 0',
                            borderRadius: '2px',
                            color: 'white',
                            fontSize: '0.8em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick && onEventClick({ event });
                          }}
                        >
                          {title}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ];
          }).flat()}
        </div>
      </div>
    );
  };

  // Renderizar visualização diária
  const renderDayView = () => {
    // Usar a data do estado interno
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    
    // Formatar data atual para exibição
    const formattedDate = currentDate.toLocaleDateString(locale || 'pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return (
      <div style={{ padding: '10px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '50px 1fr',
          gap: '2px'
        }}>
          <div style={{ padding: '5px' }}></div>
          <div style={{ 
            padding: '5px', 
            textAlign: 'center', 
            backgroundColor: '#f0f0f0',
            fontWeight: 'bold'
          }}>
            Agenda do Dia
          </div>
          
          {Array(24).fill(null).map((_, hour) => {
            // Criar uma data para esta hora específica
            const cellDateTime = new Date(year, month, day);
            cellDateTime.setHours(hour, 0, 0, 0);
            
            // Filtrar eventos para este dia e hora
            const hourEvents = Array.isArray(events) ? events.filter(event => {
              if (!event || !event.start) return false;
              
              try {
                const eventDate = adjustToTimezone(event.start, timezone);
                const eventHour = eventDate.getHours();
                
                return eventDate.getDate() === day && 
                       eventDate.getMonth() === month && 
                       eventDate.getFullYear() === year &&
                       eventHour === hour;
              } catch (e) {
                return false;
              }
            }) : [];
            
            return [
              // Célula da hora
              <div 
                key={`hour-${hour}`} 
                style={{ 
                  padding: '5px', 
                  borderTop: '1px solid #ddd',
                  textAlign: 'right',
                  fontSize: '0.8em',
                  color: '#666'
                }}
              >
                {hour}:00
              </div>,
              // Célula do dia
              <div 
                key={`day-${hour}`} 
                style={{ 
                  padding: '2px', 
                  borderTop: '1px solid #ddd',
                  borderLeft: '1px solid #ddd',
                  minHeight: '30px',
                  position: 'relative',
                  backgroundColor: (new Date().getHours() === hour) ? 'rgba(232, 244, 248, 0.3)' : 'transparent'
                }}
                onClick={() => onDateClick && onDateClick({ date: cellDateTime })}
              >
                {/* Eventos para esta hora */}
                {hourEvents.map((event, idx) => {
                  const title = event && event.title ? String(event.title) : 'Sem título';
                  
                  return (
                    <div 
                      key={`${hour}-${idx}`}
                      style={{
                        backgroundColor: event.color || '#3788d8',
                        padding: '2px 4px',
                        margin: '1px 0',
                        borderRadius: '2px',
                        color: 'white',
                        fontSize: '0.8em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick && onEventClick({ event });
                      }}
                    >
                      {title}
                    </div>
                  );
                })}
              </div>
            ];
          }).flat()}
        </div>
      </div>
    );
  };

  // Renderizar visualização em lista
  const renderListView = () => {
    // Usar a data do estado interno
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    
    // Calcular o primeiro e último dia da semana atual
    const firstDayOfWeek = new Date(year, month, day - currentDate.getDay());
    const lastDayOfWeek = new Date(year, month, day + (6 - currentDate.getDay()));
    
    // Formatar datas para exibição
    const formattedFirstDay = firstDayOfWeek.toLocaleDateString(locale || 'pt-BR', { day: 'numeric', month: 'short' });
    const formattedLastDay = lastDayOfWeek.toLocaleDateString(locale || 'pt-BR', { day: 'numeric', month: 'short' });
    
    // Filtrar eventos para a semana atual
    const weekEvents = Array.isArray(events) ? events.filter(event => {
      if (!event || !event.start) return false;
      
      try {
        const eventDate = adjustToTimezone(event.start, timezone);
        
        // Verificar se o evento está dentro da semana atual
        return eventDate >= firstDayOfWeek && eventDate <= lastDayOfWeek;
      } catch (e) {
        return false;
      }
    }) : [];
    
    // Agrupar eventos por dia
    const eventsByDay = {};
    weekEvents.forEach(event => {
      const eventDate = adjustToTimezone(event.start, timezone);
      const dateKey = eventDate.toDateString();
      
      if (!eventsByDay[dateKey]) {
        eventsByDay[dateKey] = {
          date: eventDate,
          events: []
        };
      }
      
      eventsByDay[dateKey].events.push(event);
    });
    
    // Ordenar dias
    const sortedDays = Object.values(eventsByDay).sort((a, b) => a.date - b.date);
    
    return (
      <div style={{ padding: '10px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>
          Eventos da Semana ({formattedFirstDay} - {formattedLastDay})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedDays.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              Nenhum evento nesta semana
            </div>
          ) : (
            sortedDays.map(dayData => {
              const dayDate = dayData.date;
              const isToday = dayDate.getDate() === new Date().getDate() && 
                             dayDate.getMonth() === new Date().getMonth() && 
                             dayDate.getFullYear() === new Date().getFullYear();
              const dayEvents = dayData.events;
              const dateKey = dayDate.toDateString();
              const formattedDayDate = dayDate.toLocaleDateString(locale || 'pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              });
              
              return (
                <div key={dateKey} style={{ marginBottom: '15px' }}>
                  <div style={{
                    backgroundColor: isToday ? todayColor : '#f0f0f0',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}>
                    {formattedDayDate}
                  </div>
                  
                  {dayEvents.map((event, index) => {
                    // Formatar hora do evento
                    let eventTime = '';
                    
                    try {
                      const date = adjustToTimezone(event.start, timezone);
                      eventTime = date.toLocaleTimeString(locale || 'pt-BR', { hour: '2-digit', minute: '2-digit' });
                      
                      // Se tiver horário de fim
                      if (event.end) {
                        const endDate = adjustToTimezone(event.end, timezone);
                        eventTime += ` - ${endDate.toLocaleTimeString(locale || 'pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
                      }
                    } catch (e) {
                      eventTime = 'Horário inválido';
                    }
                    
                    return (
                      <div 
                        key={`${dateKey}-${event.id || index}`}
                        style={{
                          display: 'flex',
                          padding: '8px 12px',
                          borderLeft: `4px solid ${event.color || '#3788d8'}`,
                          backgroundColor: '#f9f9f9',
                          borderRadius: '3px',
                          marginBottom: '4px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          cursor: 'pointer'
                        }}
                        onClick={() => onEventClick && onEventClick({ event })}
                      >
                        <div style={{ flex: '0 0 100px', color: '#666' }}>
                          {eventTime}
                        </div>
                        <div style={{ flex: '1', fontWeight: event.important ? 'bold' : 'normal' }}>
                          {event.title ? String(event.title) : 'Sem título'}
                          {event.description && (
                            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                              {String(event.description)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Renderizar o componente completo
  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {renderHeader()}
      {renderViewContent()}
    </div>
  );
}

Calendar.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  events: PropTypes.array,
  view: PropTypes.string,
  locale: PropTypes.string,
  timezone: PropTypes.string,
  headerColor: PropTypes.string,
  todayColor: PropTypes.string,
  selectedColor: PropTypes.string,
  onDataChange: PropTypes.func,
  onEventClick: PropTypes.func,
  onDateClick: PropTypes.func
};

export default Calendar;
