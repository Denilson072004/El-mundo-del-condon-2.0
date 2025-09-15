document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM completamente cargado");
    console.log("✅ Script funciona");
    console.log("✅ Todo en orden");
    console.log("✅ Barcita de mi vida");
    console.log("✅ Hola");

    // *** REGISTRO DE USUARIOS ***
    const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const correo = document.getElementById("new-username").value.trim();
    const contrasena = document.getElementById("new-password").value.trim();

    if (!correo || !contrasena) {
      alert("correo y contraseña son requeridos");
      return;
    }

    try {
      const res = await fetch("/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Error en registro");
        return;
      }

      alert("Registro exitoso");
      // En Astro, navega a tu página de login .astro:
      window.location.href = "login";
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar con el servidor");
    }
  });
}

    // *** INICIO DE SESIÓN ***
    const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const correo = document.getElementById("username").value.trim();
    const contrasena = document.getElementById("password").value.trim();

    if (!correo || !contrasena) {
      alert("correo y contraseña son requeridos");
      return;
    }

    try {
      const res = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "No se pudo iniciar sesión");
        return;
      }

      // Guarda datos mínimos de sesión (id_usuario y correo)
      localStorage.setItem("user", JSON.stringify(data));
      alert("Inicio de sesión exitoso");
      window.location.href = "/Elmundodelcondon"; // o a la página que prefieras
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar con el servidor");
    }
  });
}

// *** CERRAR SESIÓN ***
window.cerrarSesion = function () {
  localStorage.removeItem("user"); // antes quitabas "loggedin"
  window.location.href = "login";
};


    // *** RECUPERACIÓN DE CONTRASEÑA ***
    const recoverForm = document.getElementById("recover-form");
    if (recoverForm) {
        recoverForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const recoverUsername = document.getElementById("recover-username").value.trim();
            let users = JSON.parse(localStorage.getItem("users")) || [];
            let user = users.find(user => user.username === recoverUsername);

            if (!user) {
                alert("El usuario no existe.");
                return;
            }

            const newPassword = prompt("Ingresa tu nueva contraseña:");
            if (newPassword) {
                user.password = newPassword;
                localStorage.setItem("users", JSON.stringify(users));
                alert("Contraseña actualizada exitosamente.");
                window.location.href = "login.html";
            }
        });
    }


    // *** GENERAR CONTRASEÑA ***
    window.generarContrasena = function () {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let contrasena = "";
        for (let i = 0; i < 10; i++) {
            contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        document.getElementById("new-password").value = contrasena;
        alert("Contraseña generada: " + contrasena);
    };

    // *** ROTACIÓN 3D DE IMÁGENES ***
    const images3D = document.querySelectorAll(".rotacion3D");
    images3D.forEach(image => {
        image.addEventListener("mousemove", (event) => {
            const rect = image.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * 15;
            const rotateY = (centerX - x) / centerX * 15;
            image.style.transform = `scale(1.2) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        image.addEventListener("mouseleave", () => {
            image.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
        });
    });
    

    // *** MOSTRAR/OCULTAR CONTRASEÑA ***
    window.togglePassword = function (fieldId, button) {
        const field = document.getElementById(fieldId);
        if (field.type === "password") {
            field.type = "text";
            button.textContent = "Ocultar Contraseña";
        } else {
            field.type = "password";
            button.textContent = "Mostrar Contraseña";
        }
    };

    // *** CONSULTAR CLIMA ***
    const apiKey = "5c05ca2b4f5a153d0f648d3767594f22";
    window.consultarClima = async function () {
        let ciudad = document.getElementById("ciudad").value;
        if (!ciudad) {
            alert("Por favor, ingresa una ciudad");
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;
        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) throw new Error("Ciudad no encontrada");

            const datos = await respuesta.json();
            const temperatura = Math.round(datos.main.temp);
            const clima = datos.weather[0].description;
            const icono = datos.weather[0].icon;

            document.getElementById("clima").innerHTML = `
                <img src="https://openweathermap.org/img/wn/${icono}.png" alt="Icono clima">
                <span>${ciudad}: ${temperatura}°C, ${clima}</span>
            `;
            cerrarModal();
        } catch (error) {
            alert("Error al obtener el clima. Intenta con otra ciudad.");
        }
    };

    // *** BOTÓN SCROLL ARRIBA ***
    window.onscroll = function () {
        let btn = document.getElementById("btnArriba");
        if (btn) {
            btn.style.display = (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ? "block" : "none";
        }
    };

    window.scrollArriba = function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // *** CERRAR SESIÓN ***
    window.cerrarSesion = function () {
        localStorage.removeItem("loggedin");
        window.location.href = "login.html";
    };

    // *** CARRITO DE COMPRAS ***
window.agregarCarrito = function (nombre, precio, imagen) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Buscar si ya existe
  const productoExistente = carrito.find(item => item.nombre === nombre);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ nombre, precio, imagen, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`"${nombre}" ha sido agregado al carrito por $${precio}.`);
};



   window.comprarAhora = function(nombre, precio, imagen) {
  // Llenar los datos en el modal
  document.getElementById("modal-nombre").textContent = nombre;
  document.getElementById("modal-precio").textContent = `Total: $${precio}`;
  document.getElementById("modal-imagen").src = imagen;

  // Mostrar el modal
  document.getElementById("modal-compra").style.display = "flex";
};

window.cerrarModalCompra = function() {
  document.getElementById("modal-compra").style.display = "none";
};


    // *** MODAL ***
    window.abrirModal = function () {
        document.getElementById("miModal").style.display = "flex";
    };

    window.cerrarModal = function () {
        document.getElementById("miModal").style.display = "none";
    };

    //Formulario
    document.getElementById("condomForm").addEventListener("submit", function(event) {
        event.preventDefault();
        alert("Formulario enviado correctamente");
        this.reset();
    });

});


    // Lista Dinámica
    function addItem() {
        const ul = document.getElementById("itemList");
        const li = document.createElement("li");
        li.textContent = `Elemento ${ul.children.length + 1}`;
        li.onclick = () => li.remove(); // Elimina al hacer click
        ul.appendChild(li);
    }

    // Agregar una nueva tarea con nombre personalizado
    function addTask() {
        let taskName = prompt("Ingrese el nombre de la tarea:");
        if (!taskName || taskName.trim() === "") {
            alert("El nombre de la tarea no puede estar vacío.");
            return;
        }

        const taskList = document.getElementById("taskList");
        const li = document.createElement("li");
        li.classList.add("task");
        li.draggable = true;
        li.innerHTML = `
            <span class="task-name">${taskName}</span>
            <button class="btn" onclick="editTask(this)">✏️</button>
            <button class="btn" onclick="removeTask(this)">❌</button>
        `;

        addDragEvents(li);
        taskList.appendChild(li);
    }

    // Editar el nombre de una tarea
    function editTask(button) {
        let taskText = button.parentElement.querySelector(".task-name");
        let newName = prompt("Edita la tarea:", taskText.textContent);
        if (newName && newName.trim() !== "") {
            taskText.textContent = newName;
        } else {
            alert("El nombre no puede estar vacío.");
        }
    }

    // Eliminar tarea al hacer clic en el botón "X"
    function removeTask(button) {
        button.parentElement.remove();
    }

    // Drag & Drop - Agregar eventos a cada tarea
    function addDragEvents(task) {
        task.addEventListener("dragstart", () => {
            task.classList.add("dragging");
        });

        task.addEventListener("dragend", () => {
            task.classList.remove("dragging");
        });
    }

    const taskList = document.getElementById("taskList");

    taskList.addEventListener("dragover", (event) => {
        event.preventDefault();
        const draggingTask = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(taskList, event.clientY);
        if (afterElement == null) {
            taskList.appendChild(draggingTask);
        } else {
            taskList.insertBefore(draggingTask, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".task:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Agregar eventos Drag & Drop a las tareas existentes
    document.querySelectorAll(".task").forEach(addDragEvents);

    function recuperarContrasena() {
        const email = prompt("Ingresa tu correo electrónico:");
        if (!email) return;
        
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let user = users.find(user => user.username === email);
        
        if (user) {
          alert("Tu contraseña es: " + user.password);
        } else {
          alert("El correo ingresado no está registrado.");
        }
      }

/*Chat*/
function sendMessage() {
    const messageInput = document.getElementById("message");
    const messageText = messageInput.value.trim();
    if (messageText === "") return;
    addMessage("Tú", messageText, "user");
    messageInput.value = "";
    setTimeout(() => {
      const botResponse = generateResponse(messageText);
      addMessage("Soporte", botResponse, "bot");
    }, 1000);
  }
  
  function generateResponse(userMessage) {
    userMessage = userMessage.toLowerCase();
    if (userMessage.includes("hola")) return "¡Hola! ¿En qué puedo ayudarte hoy?";
    if (userMessage.includes("precio")) return "Nuestros condones tienen precios desde $63 a $90 por unidad.";
    if (userMessage.includes("envío" && "envio")) return "Realizamos envíos discretos en un plazo de 24-48 horas.";
    if (userMessage.includes("material")) return "Manejamos condones de látex, poliuretano y otros materiales hipoalergénicos. ¿Cuál te interesa?";
    if (userMessage.includes("látex")) return "Los condones de látex son los más comunes y ofrecen gran elasticidad y resistencia.";
    if (userMessage.includes("poliuretano")) return "Los condones de poliuretano son una excelente opción para quienes tienen alergia al látex y son más delgados.";
    if (userMessage.includes("hipoalergénico")) return "Los condones hipoalergénicos están diseñados para minimizar reacciones alérgicas y brindar mayor comodidad.";
    if (userMessage.includes("tamaño")) return "Ofrecemos tamaños estándar, grande y extra grande. ¿Cuál prefieres?";
    if (userMessage.includes("estándar")) return "El tamaño estándar es el más utilizado y se ajusta a la mayoría de los usuarios.";
    if (userMessage.includes("grande")) return "El tamaño grande ofrece más espacio para mayor comodidad y ajuste.";
    if (userMessage.includes("extra grande")) return "El tamaño extra grande está diseñado para quienes necesitan un ajuste más amplio y cómodo.";
    if (userMessage.includes("lubricante")) return "Tenemos condones con lubricante a base de agua y silicona. ¿Cuál prefieres?";
    if (userMessage.includes("agua")) return "El lubricante a base de agua es compatible con todos los materiales y fácil de limpiar.";
    if (userMessage.includes("silicona")) return "El lubricante a base de silicona dura más tiempo y es ideal para relaciones más prolongadas.";
    if (userMessage.includes("marca")) return "Trabajamos con marcas como Durex, Trojan y Sico. ¿Quieres conocer más detalles?";
    if (userMessage.includes("durex")) return "Durex es una marca reconocida mundialmente por su calidad y variedad de productos.";
    if (userMessage.includes("trojan")) return "Trojan es una de las marcas más populares en EE.UU., ofreciendo gran resistencia y variedad.";
    if (userMessage.includes("sico")) return "Sico es una marca confiable con opciones accesibles y de alta calidad.";
    if (userMessage.includes("uso correcto")) return "Para un uso seguro, verifica la fecha de caducidad, ábrelo con cuidado y colócalo correctamente. ¿Necesitas más detalles?";
    if (userMessage.includes("sí") || userMessage.includes("claro")) return "Perfecto. ¿Te gustaría más detalles sobre modelos o disponibilidad?";
    if (userMessage.includes("modelos") || userMessage.includes("disponibilidad")) return "Tenemos diferentes modelos disponibles, incluyendo ultra delgados, texturizados y extra lubricados.";
    if (userMessage.includes("gracias")) return "¡De nada! Si necesitas más ayuda, aquí estaré.";
    return "No estoy seguro de entender. ¿Podrías darme más detalles?";
  }
  
  function addMessage(sender, text, type) {
    const chatBox = document.getElementById("chat");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    messageDiv.textContent = `${sender}: ${text}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
