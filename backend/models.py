from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from backend.database import Base

class WorkSession(Base):
    __tablename__ = "work_sessions"

    id = Column(Integer, primary_key=True)
    worker_code = Column(String(50), nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    total_seconds = Column(Integer, nullable=True)