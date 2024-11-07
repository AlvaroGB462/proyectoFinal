// Función para realizar el login del usuario
function loginUsuario() {
    const url = 'http://localhost:3000/usuarios'; // URL de json-server
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Crear la solicitud AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true); // Realizamos una solicitud GET para obtener los usuarios
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const usuarios = JSON.parse(xhr.responseText);
                
                // Buscamos al usuario con el nick_user o email_user proporcionados
                const usuario = usuarios.find(u => (u.nick_user === username || u.email === username) && u.password_user === password);

                // Si encontramos un usuario y el campo "admin" es true
                if (usuario && usuario.admin === true) {
                    alert("Login exitoso, redirigiendo...");
                    window.location.href = 'usersClubs.html'; // Redirigir a la página de administración
                } else {
                    // Si no es administrador, no hacemos nada o mostramos un mensaje
                    alert("No tienes permisos de administrador o los datos son incorrectos.");
                }
            } else {
                console.error("Error al hacer la solicitud:", xhr.status, xhr.statusText);
                alert("Hubo un error en el proceso de autenticación.");
            }
        }
    };
    xhr.send(); // Enviar la solicitud
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Mostrar la lista de usuarios
function mostrarUsuarios() {
    const url = 'http://localhost:3000/usuarios';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const usuarios = JSON.parse(xhr.responseText);
            crearListaUsuarios(usuarios);
            document.getElementById('users-section').style.display = 'block'; // Mostrar sección de usuarios
        } else if (xhr.readyState === 4) {
            console.error("Error al cargar los usuarios:", xhr.status, xhr.statusText);
        }
    };
    xhr.send();
}

// Crear la lista de usuarios en el DOM
function crearListaUsuarios(usuarios) {
    const lista = document.getElementById('lista-usuarios');
    lista.innerHTML = ''; // Limpiar lista existente

    // Filtrar usuarios con admin false y mostrarlos
    usuarios.filter(usuario => usuario.admin === false).forEach(usuario => {
        const listItem = document.createElement('li');
        listItem.textContent = `Nick: ${usuario.nick_user} - Id: ${usuario.id}`;

        // Botón para modificar usuario
        const modifyButton = document.createElement('button');
        modifyButton.textContent = 'Modificar';
        modifyButton.onclick = function() {
            mostrarFormulario(usuario); // Cargar datos en el formulario de modificación
        };

        // Botón para eliminar usuario
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = function() {
            const confirmacion = prompt('Para confirmar la eliminación, escribe "CONFIRMAR":');
            if (confirmacion === "CONFIRMAR") {
                borrarUsuario(usuario.id); // Llamar a la función de eliminar
            } else {
                alert("El usuario no se ha eliminado.");
            }
        };

        listItem.appendChild(modifyButton);
        listItem.appendChild(deleteButton);
        lista.appendChild(listItem);
    });
}

// Función para mostrar formulario de usuario
function mostrarFormulario() {
    // Ocultar lista de usuarios y los botones de navegación
    document.getElementById('buttons-container').style.display = 'none';
    document.getElementById('users-section').style.display = 'none'; // Esconde la sección de usuarios

    // Mostrar formulario para registro de usuario
    const form = document.getElementById('user-form');
    form.style.display = 'block'; // Mostrar el formulario
    document.getElementById('form-title').textContent = "Registrar Usuario"; // Título del formulario
    
    // Limpiar los campos de entrada
    document.getElementById('nick_user').value = '';
    document.getElementById('name_user').value = '';
    document.getElementById('email_user').value = '';
    document.getElementById('address_user').value = '';
}

// Variable para determinar si el usuario es administrador
let isAdmin = false;

// Función para marcar o desmarcar como administrador
function marcarAdministrador() {
    isAdmin = !isAdmin; // Cambia entre true y false
    const adminButton = document.getElementById('adminButton');
    if (isAdmin) {
        adminButton.textContent = 'Quitar Administrador'; // Cambia el texto del botón
    } else {
        adminButton.textContent = 'Administrador'; // Cambia el texto del botón
    }
}

// Guardar el usuario en el servidor
function guardarUsuario() {
    // Obtener los valores de los campos
    const nick_user = document.getElementById('nick_user').value;
    const name_user = document.getElementById('name_user').value;
    const password_user = document.getElementById('password_user').value;
    const email_user = document.getElementById('email_user').value;
    const address_user = document.getElementById('address_user').value;
    const dni_user = document.getElementById('dni_user').value; // Obtener el valor del DNI

    // Validar que todos los campos sean obligatorios
    if (!nick_user || !name_user || !password_user || !email_user || !address_user || !dni_user) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // Crear objeto usuario
    const usuario = {
        nick_user: nick_user,
        name_user: name_user,
        password_user: password_user,
        email: email_user,
        address: address_user,
        dni: dni_user, // Asignar el DNI
        admin: isAdmin // Asigna el valor de isAdmin
    };

    // Enviar el usuario al servidor
    const url = 'http://localhost:3000/usuarios';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 201) {
            mostrarUsuarios(); // Refrescar la lista de usuarios
            cerrarFormulario(); // Cerrar el formulario
        } else if (xhr.readyState === 4) {
            console.error("Error al guardar el usuario:", xhr.status, xhr.statusText);
            alert("No se pudo guardar el usuario.");
        }
    };
    xhr.send(JSON.stringify(usuario));
}


// Cerrar el formulario y volver a mostrar la lista de usuarios
function cerrarFormulario() {
    const form = document.getElementById('user-form');
    form.style.display = 'none'; // Ocultar el formulario
    document.getElementById('users-section').style.display = 'block'; // Mostrar la lista de usuarios
    document.getElementById('buttons-container').style.display = 'flex'; // Mostrar los botones de "Usuarios" y "Clubes"
}
