let startTime;
let interval;
let sessionId;
let workerCode;
let isStarting = false;
let isEnding = false;
let currentView = "view-start";

// Inicializar cuando la página carga
window.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById("btnStart");
    const btnEnd = document.getElementById("btnEnd");
  
    if (btnStart) btnStart.addEventListener("click", handleStartWork);
    if (btnEnd) btnEnd.addEventListener("click", handleEndWork);
  });

function handleStartWork(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  startWork();
  return false;
}

function handleEndWork(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  endWork();
  return false;
}

function startWork() {
  // Evitar múltiples ejecuciones
  if (isStarting) {
    console.log("Ya se está iniciando una jornada");
    return;
  }

  workerCode = document.getElementById("code").value.trim();

  // Validación: vacío
    if (!workerCode) {
        alert("Ingrese un ID");
        return;
   }

    // Validación: solo números

    if (!/^\d+$/.test(workerCode)) {
            alert("Solo se permiten números en el ID");
            return;
        }
  isStarting = true;
  const btn = document.getElementById("btnStart");
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = "0.6";
  }

  console.log("Iniciando jornada para:", workerCode);

  fetch(`http://localhost:8000/start?worker_code=${workerCode}`, {
    method: "POST"
  })
  .then(r => {
    console.log("Respuesta del servidor:", r.status);
    if (!r.ok) {
      return r.json().then(err => {
        throw new Error(err.detail || "Jornada ya iniciada");
      }).catch(() => {
        throw new Error("Jornada ya iniciada");
      });
    }
    return r.json();
  })
  .then(data => {
    console.log("Datos recibidos:", data);
    sessionId = data.session_id;
    
    // Actualizar el código de usuario en la vista de trabajo
    const userCodeElement = document.getElementById("user-code");
    if (userCodeElement) {
      userCodeElement.innerText = workerCode;
    }

    // Cambiar a la vista de trabajo ANTES de iniciar el cronómetro
    console.log("Cambiando a vista de trabajo...");
    show("view-work");
    
    // Esperar un momento para asegurar que el DOM se actualizó
    setTimeout(() => {
      // Verificar que la vista esté visible
      const viewWork = document.getElementById("view-work");
      if (viewWork) {
        const style = window.getComputedStyle(viewWork);
        console.log("Estado de view-work:", {
          display: style.display,
          visibility: style.visibility,
          hasHidden: viewWork.classList.contains("hidden")
        });
        
        // Si no está visible, forzarla
        if (style.display === "none" || viewWork.classList.contains("hidden")) {
          console.warn("Vista no visible, forzando...");
          viewWork.classList.remove("hidden");
          viewWork.classList.add("view-visible");
          viewWork.style.setProperty("display", "block", "important");
        }
      }
      
      // Iniciar el cronómetro
      startClock();
      console.log("Cronómetro iniciado");
    }, 50);
    
    isStarting = false;
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  })
  .catch(e => {
    console.error("Error al iniciar jornada:", e);
    alert("Error: " + e.message);
    isStarting = false;
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  });
}

function startClock() {
  // Limpiar intervalo anterior si existe
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  
  startTime = new Date();
  const timerElement = document.getElementById("timer");
  
  if (!timerElement) {
    console.error("Elemento timer no encontrado");
    return;
  }
  
  // Actualizar inmediatamente
  timerElement.innerText = "00:00:00";
  
  // Actualizar cada segundo
  interval = setInterval(() => {
    try {
      const now = new Date();
      const secs = Math.floor((now - startTime) / 1000);
      timerElement.innerText = format(secs);
    } catch (error) {
      console.error("Error en cronómetro:", error);
      clearInterval(interval);
      interval = null;
    }
  }, 1000);
}

function endWork() {
  // Evitar múltiples ejecuciones
  if (isEnding || !sessionId) {
    console.log("No se puede terminar: isEnding=", isEnding, "sessionId=", sessionId);
    return;
  }

  isEnding = true;
  const btn = document.getElementById("btnEnd");
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = "0.6";
  }

  console.log("Terminando jornada para sesión:", sessionId);

  fetch(`http://localhost:8000/end/${sessionId}`, { 
    method: "POST" 
  })
  .then(r => {
    if (!r.ok) {
      throw new Error("Error al terminar jornada");
    }
    return r.json();
  })
  .then(data => {
    console.log("Jornada terminada, datos:", data);
    
    // Detener el cronómetro
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    
    const time = format(data.total_seconds);

    // Actualizar los elementos de la vista final
    const finalUserElement = document.getElementById("final-user");
    const finalTimeElement = document.getElementById("final-time");
    const finalTimeTextElement = document.getElementById("final-time-text");
    
    if (finalUserElement) {
      finalUserElement.innerText = workerCode;
    }
    if (finalTimeElement) {
      finalTimeElement.innerText = time;
    }
    if (finalTimeTextElement) {
      finalTimeTextElement.innerText = time;
    }

    // Cambiar a la vista final
    show("view-end");
    
    isEnding = false;
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  })
  .catch(e => {
    console.error("Error al terminar jornada:", e);
    alert("Error: " + e.message);
    isEnding = false;
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  });
}

function show(view) {
  console.log("Mostrando vista:", view);
  
  // Lista de todas las vistas
  const views = ["view-start", "view-work", "view-end"];
  
  // Ocultar todas las vistas
  views.forEach(viewId => {
    const element = document.getElementById(viewId);
    if (element && viewId !== view) {
      element.classList.add("hidden");
      element.classList.remove("view-visible");
      element.style.setProperty("display", "none", "important");
      console.log(`Ocultando ${viewId}`);
    }
  });

  // Mostrar la vista seleccionada
  const viewElement = document.getElementById(view);
  if (!viewElement) {
    console.error(`Vista "${view}" no encontrada`);
    return;
  }
  
  // Remover clase hidden y agregar clase visible
  viewElement.classList.remove("hidden");
  viewElement.classList.add("view-visible");
  viewElement.style.setProperty("display", "block", "important");
  
  // Actualizar la vista actual
  currentView = view;
  
  console.log(`Vista ${view} mostrada. Estado:`, {
    display: window.getComputedStyle(viewElement).display,
    hasHidden: viewElement.classList.contains("hidden"),
    hasVisible: viewElement.classList.contains("view-visible")
  });
  
  // Verificación adicional después de un breve delay
  setTimeout(() => {
    const computedStyle = window.getComputedStyle(viewElement);
    if (computedStyle.display === "none" || viewElement.classList.contains("hidden")) {
      console.warn(`Vista ${view} fue ocultada, restaurando...`);
      viewElement.classList.remove("hidden");
      viewElement.classList.add("view-visible");
      viewElement.style.setProperty("display", "block", "important");
    }
  }, 100);
}

function format(s) {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}
