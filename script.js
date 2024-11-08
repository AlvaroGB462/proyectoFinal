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

                if (usuario) {
                    // Guardar "Administrador" o el nombre de usuario en localStorage
                    localStorage.setItem('userRole', usuario.admin ? 'Administrador' : usuario.nick_user);

                    // Redirigir a la página de inicio
                    window.location.href = 'index.html';
                } else {
                    alert("Datos incorrectos.");
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
    // Limpiar listas existentes
    const listaNormales = document.getElementById('lista-usuarios-normales');
    const listaAdministradores = document.getElementById('lista-usuarios-administradores');
    listaNormales.innerHTML = '';
    listaAdministradores.innerHTML = '';

    // Filtrar usuarios normales (admin: false) y administradores (admin: true)
    const usuariosNormales = usuarios.filter(usuario => usuario.admin === false);
    const usuariosAdministradores = usuarios.filter(usuario => usuario.admin === true);

    // Función para crear un elemento de lista con botones de modificar y eliminar
    function crearElementoUsuario(usuario, lista) {
        const listItem = document.createElement('li');
        listItem.textContent = `Nick: ${usuario.nick_user}`;

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
    }

    // Crear y añadir elementos para usuarios normales
    usuariosNormales.forEach(usuario => crearElementoUsuario(usuario, listaNormales));

    // Crear y añadir elementos para usuarios administradores
    usuariosAdministradores.forEach(usuario => {
        const listItem = document.createElement('li');
        listItem.textContent = `Nick: ${usuario.nick_user}`;
        
        // Crear los botones de modificar y eliminar para el administrador
        const modifyButton = document.createElement('button');
        modifyButton.textContent = 'Modificar';
        modifyButton.onclick = function() {
            mostrarFormulario(usuario); // Cargar datos en el formulario de modificación
        };

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
        listaAdministradores.appendChild(listItem);
    });
}

// Función para eliminar un usuario
function borrarUsuario(id) {
    const url = `http://localhost:3000/usuarios/${id}`;
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                alert("Usuario eliminado con éxito.");
                mostrarUsuarios(); // Actualizar la lista de usuarios
            } else {
                console.error("Error al eliminar el usuario:", xhr.status, xhr.statusText);
                alert("No se pudo eliminar el usuario. Intenta nuevamente.");
            }
        }
    };
    xhr.send();
}

// Variable global para almacenar el usuario que se está modificando
let usuarioSeleccionado = null;

// Mostrar el formulario de usuario, configurando el usuario si es una modificación
function mostrarFormulario(usuario = null) {
    usuarioSeleccionado = usuario; // Almacenar usuario que se está modificando o null si es un nuevo registro

    document.getElementById('buttons-container').style.display = 'none';
    document.getElementById('users-section').style.display = 'none';
    
    const form = document.getElementById('user-form');
    form.style.display = 'block';
    document.getElementById('form-title').textContent = usuario ? "Modificar Usuario" : "Registrar Usuario";

    // Llenar campos con los datos del usuario a modificar o dejarlos vacíos
    document.getElementById('nick_user').value = usuario ? usuario.nick_user : '';
    document.getElementById('name_user').value = usuario ? usuario.name_user : '';
    document.getElementById('email_user').value = usuario ? usuario.email : '';
    document.getElementById('address_user').value = usuario ? usuario.address : '';
    document.getElementById('dni_user').value = usuario ? usuario.dni : '';
    document.getElementById('admin').checked = usuario ? usuario.admin : false;

    // Cambiar el botón "Guardar" para que llame a la función correcta según si es modificación o creación
    const submitButton = document.querySelector('#user-form .submit');
    submitButton.onclick = usuario ? modificarUsuario : guardarUsuario;
}

// Guardar el usuario en el servidor
function guardarUsuario() {
    // Obtener los valores de los campos
    const nick_user = document.getElementById('nick_user').value;
    const name_user = document.getElementById('name_user').value;
    const password_user = document.getElementById('password_user').value;
    const email_user = document.getElementById('email_user').value;
    const address_user = document.getElementById('address_user').value;
    const dni_user = document.getElementById('dni_user').value;

    // Validar que todos los campos sean obligatorios
    if (!nick_user || !name_user || !password_user || !email_user || !address_user || !dni_user) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // Validar que el nick, email y DNI no estén ya en la base de datos
    const url = 'http://localhost:3000/usuarios';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const usuarios = JSON.parse(xhr.responseText);

            // Verificar si el nick, email o DNI ya existen
            const nickExiste = usuarios.some(usuario => usuario.nick_user === nick_user);
            const emailExiste = usuarios.some(usuario => usuario.email === email_user);
            const dniExiste = usuarios.some(usuario => usuario.dni === dni_user);

            let mensajeError = "";
            if (nickExiste) mensajeError += "El nick ya existe. ";
            if (emailExiste) mensajeError += "El correo ya existe. ";
            if (dniExiste) mensajeError += "El DNI ya existe. ";

            if (mensajeError) {
                alert(mensajeError); // Mostrar mensaje si hay duplicados
                return;
            }

            // Si no hay duplicados, continuar con la creación del usuario
            const isAdmin = document.getElementById('admin').checked;
            const userData = {
                nick_user,
                name_user,
                password_user,
                email_user,
                address_user,
                dni_user,
                admin: isAdmin
            };

            var xhrPost = new XMLHttpRequest();
            xhrPost.open('POST', url, true);
            xhrPost.setRequestHeader('Content-Type', 'application/json');
            xhrPost.onreadystatechange = function() {
                if (xhrPost.readyState === 4 && xhrPost.status === 201) {
                    alert("Usuario guardado con éxito.");
                    cerrarFormulario(); // Cerrar el formulario al guardar
                    mostrarUsuarios(); // Actualizar la lista de usuarios
                } else if (xhrPost.readyState === 4) {
                    alert("Error al guardar el usuario.");
                }
            };
            xhrPost.send(JSON.stringify(userData));
        } else if (xhr.readyState === 4) {
            console.error("Error al verificar la existencia del usuario:", xhr.status, xhr.statusText);
            alert("Hubo un problema al verificar los datos. Inténtalo de nuevo.");
        }
    };
    xhr.send();
}

function cerrarFormulario() {
    // Ocultar el formulario
    const form = document.getElementById('user-form');
    form.style.display = 'none';

    // Volver a mostrar las secciones de lista de usuarios y botones
    document.getElementById('buttons-container').style.display = 'block';
    document.getElementById('users-section').style.display = 'block';
}


