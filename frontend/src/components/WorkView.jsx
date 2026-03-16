import { useEffect, useState } from "react"
import { endWork } from "../services/api"

export default function WorkView({ session, onEnd, onReset }) {

  const [seconds, setSeconds] = useState(0)

  useEffect(() => {

    const updateTime = () => {
      const diff = Math.max(
        0,
        Math.floor((Date.now() - session.startTime) / 1000)
      )
      setSeconds(diff)
    }

    updateTime()

    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)

  }, [session.startTime])

  const format = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0")
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0")
    const sec = String(s % 60).padStart(2, "0")
    return `${h}:${m}:${sec}`
  }

  const handleEnd = async () => {
    const data = await endWork(session.sessionId)
    onEnd(data.total_seconds)
  }

  return (

    <div className="card">

      <div className="header">
        ⏱️
        <h2>Control de Jornada Laboral</h2>
      </div>

      <div className="content">

        <div className="badge">
          🟢 LABORANDO: {session.workerCode}
        </div>

        <div className="timer">
          {format(seconds)}
        </div>

        <button className="end" onClick={handleEnd}>
          ⬛ TERMINAR JORNADA
        </button>

        <button className="back" onClick={onReset}>
         VOLVER AL INICIO
        </button>

      </div>

    </div>

  )
}