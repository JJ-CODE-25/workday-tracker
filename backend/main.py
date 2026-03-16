from fastapi import FastAPI, HTTPException, Query, Depends
from datetime import datetime
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend.models import Base, WorkSession
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # permitir frontend local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Iniciar jornada
@app.post("/start")
def start_jornada(worker_code: str, db: Session = Depends(get_db)):

    # Verificar si la jornada ya está iniciada
    abierta = db.query(WorkSession).filter(
        WorkSession.worker_code == worker_code,
        WorkSession.end_time.is_(None)
    ).first()

    if abierta:
        raise HTTPException(status_code=409, detail="Jornada ya iniciada")

    session = WorkSession(worker_code=worker_code)
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "session_id": session.id,
        "worker_code": session.worker_code,
        "start_time": session.start_time
    }

# Obtener jornada activa
@app.get("/active")
def get_active_session(worker_code: str = Query(...), db: Session = Depends(get_db)):
    db: Session = get_db()

    abierta = db.query(WorkSession).filter(
        WorkSession.worker_code == worker_code,
        WorkSession.end_time.is_(None)
    ).first()

    if not abierta:
        return {"active": False}

    return {
        "active": True,
        "session_id": abierta.id,
        "worker_code": abierta.worker_code,
        "start_time": abierta.start_time
    }

# Terminar jornada
@app.post("/end/{session_id}")
def end_jornada(session_id: int, db: Session = Depends(get_db)):

    session = db.query(WorkSession).filter(
        WorkSession.id == session_id
    ).first()

    if not session or session.end_time:
        raise HTTPException(status_code=404, detail="Jornada no válida")

    session.end_time = datetime.utcnow()
    diff = session.end_time - session.start_time
    session.total_seconds = int(diff.total_seconds())

    db.commit()

    return {
        "worker_code": session.worker_code,
        "total_seconds": session.total_seconds
    }
