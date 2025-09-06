import calendar
from datetime import datetime, timedelta
import json

ano = 2025
mes = 9
cor = "#3788d8"

# quantidade de dias do mês
_, qtd_dias = calendar.monthrange(ano, mes)

# Formato 1: Eventos no formato local (sem Z)
eventos_local = []

# Formato 2: Eventos em UTC (com Z)
eventos_utc = []

# Formato 3: Eventos com timezone explícito
eventos_timezone = []

id_counter = 1

# Offset para São Paulo (UTC-3)
sp_offset = "-03:00"

for dia in range(1, qtd_dias + 1):
    # Gerar apenas alguns eventos para exemplo (não todos os 24 por dia)
    for hora in [9, 12, 16, 18]:  # Horários comuns de eventos
        inicio = datetime(ano, mes, dia, hora, 0, 0)
        fim = inicio + timedelta(hours=1)

        # Formato 1: Local (sem Z)
        eventos_local.append({
            "id": str(id_counter),
            "title": f"Evento Local {hora:02d}h - {dia:02d}/{mes:02d}",
            "start": inicio.isoformat(),  # Sem Z
            "end": fim.isoformat(),       # Sem Z
            "color": cor
        })
        id_counter += 1
        
        # Formato 2: UTC (com Z)
        # Para exibir às 16h em São Paulo, precisamos adicionar 3h ao horário UTC
        inicio_utc = datetime(ano, mes, dia, hora, 0, 0) + timedelta(hours=3)
        fim_utc = inicio_utc + timedelta(hours=1)
        
        eventos_utc.append({
            "id": str(id_counter),
            "title": f"Evento UTC {hora:02d}h - {dia:02d}/{mes:02d}",
            "start": inicio_utc.isoformat() + "Z",  # Com Z
            "end": fim_utc.isoformat() + "Z",       # Com Z
            "color": "#FF5733"  # Cor diferente para distinguir
        })
        id_counter += 1
        
        # Formato 3: Com timezone explícito
        eventos_timezone.append({
            "id": str(id_counter),
            "title": f"Evento TZ {hora:02d}h - {dia:02d}/{mes:02d}",
            "start": f"{inicio.isoformat()}{sp_offset}",  # Com offset explícito
            "end": f"{fim.isoformat()}{sp_offset}",       # Com offset explícito
            "color": "#4CAF50"  # Cor verde para distinguir
        })
        id_counter += 1

# Exemplo de evento às 16h em formato local
evento_16h_local = {
    "id": "exemplo-local",
    "title": "Evento 16h (Formato Local)",
    "start": "2025-09-04T16:00:00.000",  # Sem Z - será exibido às 16h
    "end": "2025-09-04T17:00:00.000",    # Sem Z
    "color": "#4CAF50"
}

# Exemplo de evento às 16h em formato UTC ajustado para São Paulo
evento_16h_utc = {
    "id": "exemplo-utc",
    "title": "Evento 16h (Formato UTC)",
    "start": "2025-09-04T19:00:00.000Z",  # Com Z - 19h UTC = 16h em São Paulo
    "end": "2025-09-04T20:00:00.000Z",    # Com Z
    "color": "#9C27B0"
}

# Exemplo de evento às 16h com timezone explícito
evento_16h_timezone = {
    "id": "exemplo-timezone",
    "title": "Evento 16h (Com Timezone)",
    "start": "2025-09-04T16:00:00.000-03:00",  # Com offset explícito
    "end": "2025-09-04T17:00:00.000-03:00",    # Com offset explícito
    "color": "#2196F3"
}

# Adicionar os exemplos às listas
eventos_local.append(evento_16h_local)
eventos_utc.append(evento_16h_utc)
eventos_timezone.append(evento_16h_timezone)

# Salvar em arquivos JSON para uso fácil
with open('eventos_local.json', 'w') as f:
    json.dump(eventos_local, f, indent=2)

with open('eventos_utc.json', 'w') as f:
    json.dump(eventos_utc, f, indent=2)

with open('eventos_timezone.json', 'w') as f:
    json.dump(eventos_timezone, f, indent=2)

print("\nEXEMPLO DE EVENTO LOCAL (sem Z):")
print(json.dumps(evento_16h_local, indent=2))

print("\nEXEMPLO DE EVENTO UTC (com Z):")
print(json.dumps(evento_16h_utc, indent=2))

print("\nEXEMPLO DE EVENTO COM TIMEZONE EXPLÍCITO:")
print(json.dumps(evento_16h_timezone, indent=2))

print(f"\nArquivos 'eventos_local.json', 'eventos_utc.json' e 'eventos_timezone.json' gerados com {len(eventos_local)}, {len(eventos_utc)} e {len(eventos_timezone)} eventos respectivamente.")
