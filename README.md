# Workday Tracker

Aplicación web para el registro de **inicio y fin de jornada laboral**.
Permite almacenar el identificador del trabajador, hora de entrada, hora de salida
y el tiempo total laborado.

## Stack tecnológico
- **Backend:** Python + FastAPI
- **Base de datos:** SQLite + SQLAlchemy
- **Frontend:** React + Vite + CSS
- **Control de versiones:** Git + GitHub

## Flujo de la aplicación
1. El usuario ingresa su **ID numérico** y presiona **Iniciar jornada**
2. El sistema valida si existe una jornada activa para ese trabajador
3. Si la jornada inicia correctamente se muestra un **cronómetro en tiempo real**
4. Al pulsar **Terminar jornada**, se registra la hora de salida y el tiempo total trabajado
5. Se muestra un **resumen de la jornada**

## Manejo de errores
- **Campo vacío:** se solicita ingresar un ID
- **ID no numérico:** solo se permiten números
- **Jornada duplicada:** el backend evita iniciar una jornada si existe una activa

## Ejecución del proyecto

### Backend
Instalar dependencias:
```bash
pip install fastapi uvicorn sqlalchemy
```

### Ejecutar servidor
```bash
python -m uvicorn backend.main:app --reload
```

### Frontend
Instalar dependencias:
```bash
cd frontend
npm install
```

### Ejecutar aplicación
npm run dev

### Abrir en el navegador
http://localhost:5173

## Estructura del proyecto
```
workday-tracker
│
├── backend
│   ├── database.py
│   ├── models.py
│   └── main.py
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   └── styles
│   ├── App.jsx
│   └── main.jsx
│   └── package.json
│
└── workday.db
```