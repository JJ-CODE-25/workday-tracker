# Workday Tracker

Aplicación web para el registro de **inicio y fin de jornada laboral**.
Permite almacenar el identificador del trabajador, hora de entrada, hora de salida
y el tiempo total laborado.

## Stack tecnológico
- **Backend:** Python + FastAPI
- **Base de datos:** SQLite + SQLAlchemy
- **Frontend:** HTML, CSS y JavaScript
- **Control de versiones:** Git + GitHub

## Flujo de la aplicación
1. El usuario ingresa su **ID numérico** y pulsa **Iniciar jornada**
2. Se muestra un **cronómetro** con el tiempo trabajado
3. Al pulsar **Terminar jornada**, se guarda la información y se muestra un resumen

## Manejo de errores
- **Campo vacío:** se solicita ingresar un ID
- **ID no numérico:** solo se permiten números
- **Jornada duplicada:** el backend evita iniciar una jornada si existe una activa

## Ejecución del proyecto

### Backend
Instalar dependencias:
```bash
pip install fastapi uvicorn sqlalchemy

Ejecutar servidor
python -m uvicorn backend.main:app --reload

abrir el archivo 
frontend/index.html
en el navegador



