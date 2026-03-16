import { useState } from "react"
import { startWork, getActive } from "../services/api"

export default function StartView({ onStart }) {

  const [workerCode, setWorkerCode] = useState("")

  const handleStart = async () => {

    if (!workerCode) {
      alert("Ingrese un ID")
      return
    }

    if (!/^\d+$/.test(workerCode)) {
      alert("Solo se permiten números")
      return
    }

    try {

      const data = await startWork(workerCode)

      const serverStart = new Date(data.start_time).getTime()
      const offset = Date.now() - serverStart

      onStart({
        sessionId: data.session_id,
        workerCode,
        startTime: new Date(data.start_time + "Z").getTime()
      })

    } catch(error) {

        if(error.message === "JORNADA_ACTIVA"){
      
          try{
      
            const active = await getActive(workerCode)
      
            console.log("Active session:", active)
      
            if(active.active){
      
              onStart({
                sessionId: active.session_id,
                workerCode,
                startTime: new Date(active.start_time + "Z").getTime()
              })
      
            }
      
          }catch(e){
      
            console.error(e)
            alert("Error recuperando jornada")
      
          }
      
        }else{
      
          alert("Error iniciando jornada")
      
        }
      
      }

  }

  return (

    <div className="card">

      <div className="header">
        ⏱️
        <h2>Control de Jornada Laboral</h2>
      </div>

      <div className="content">

        <label style={{display:"block", textAlign:"left", marginBottom:"8px"}}>
          DOCUMENTO / CÉDULA
        </label>

        <input
          placeholder="Ingresa tu ID único"
          value={workerCode}
          onChange={(e)=>setWorkerCode(e.target.value)}
        />

        <button className="start" onClick={handleStart}>
          ▶ INICIAR JORNADA
        </button>

      </div>

    </div>

  )
}