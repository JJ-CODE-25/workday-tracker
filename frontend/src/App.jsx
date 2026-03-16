import { useState } from "react"
import StartView from "./components/StartView.jsx"
import WorkView from "./components/WorkView.jsx"
import EndView from "./components/EndView.jsx"

function App(){

  const [session,setSession] = useState(null)
  const [finished,setFinished] = useState(null)

  const reset = ()=>{
    setSession(null)
    setFinished(null)
  }

  return(

    <div className="app-container">

{!session && !finished &&
  <StartView onStart={setSession}/>
}

{session && !finished &&
  <WorkView
    session={session}
    onEnd={setFinished}
    onReset={reset}
  />
}

{finished &&
  <EndView
    workerCode={session.workerCode}
    totalSeconds={finished}
    onReset={reset}
  />
}

    </div>

  )

}

export default App