export default function EndView({ workerCode, totalSeconds, onReset }) {

    function formatWorkedTime(totalSeconds) {

        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
      
        let parts = []
      
        if (hours > 0) parts.push(`${hours} hora${hours > 1 ? "s" : ""}`)
        if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? "s" : ""}`)
        if (seconds > 0 || parts.length === 0)
          parts.push(`${seconds} segundo${seconds !== 1 ? "s" : ""}`)
      
        return parts.join(", ")
      }

    const format = (s) => {
  
      const h = String(Math.floor(s / 3600)).padStart(2, "0")
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0")
      const sec = String(s % 60).padStart(2, "0")
  
      return `${h}:${m}:${sec}`
    }
  
    const time = format(totalSeconds)
  
    return (
  
      <div className="card">
  
        <div className="header">
          ⏱️
          <h2>Control de Jornada Laboral</h2>
        </div>
  
        <div className="content">
  
          <div className="success">
            ✅ <strong>¡Buen trabajo!</strong><br/>
            JORNADA FINALIZADA CON ÉXITO
          </div>
  
          <p>
            <strong>USUARIO:</strong>
            <span style={{color:"#4f46e5"}}> {workerCode}</span>
          </p>
  
          <p>
            <strong>DURACIÓN DE LA JORNADA:</strong>
            <span style={{color:"#4f46e5"}}> {time}</span>
          </p>
  
          <p style={{color:"#666"}}>
            Usted ha laborado {formatWorkedTime(totalSeconds)}, muchas gracias.
          </p>
  
          <button className="start" onClick={onReset}>
            VOLVER AL INICIO
          </button>
  
        </div>
  
      </div>
  
    )
  }