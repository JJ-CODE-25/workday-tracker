const API = import.meta.env.VITE_API_URL

export async function startWork(workerCode){

    const response = await fetch(
        `${API}/start?worker_code=${workerCode}`,
        { method: "POST" }
      )
    
      if(response.status === 409){
        throw new Error("JORNADA_ACTIVA")
      }
    
      if(!response.ok){
        throw new Error("ERROR_START")
      }
    
      return response.json()
    }

export async function endWork(sessionId){

    const res = await fetch(
      `${API}/end/${sessionId}`,
      { method:"POST" }
    )
  
    if(!res.ok){
      throw new Error("Error terminando jornada")
    }
  
    return res.json()
  }

  export async function getActive(workerCode){

    const res = await fetch(
      `${API}/active?worker_code=${workerCode}`
    )
  
    if(!res.ok){
      throw new Error("Error consultando jornada activa")
    }
  
    return res.json()
  }