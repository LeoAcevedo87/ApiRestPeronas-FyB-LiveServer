document.addEventListener("DOMContentLoaded", () => {
    const addPersonBtn = document.getElementById("addPersonBtn");
    const personModal = document.getElementById("personModal");
    const confirmModal = document.getElementById("confirmModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const closeModal = document.querySelectorAll(".close");
    const personForm = document.getElementById("personForm");
    const searchInput = document.getElementById("searchInput");
    const personTableBody = document.getElementById("personTableBody");

    let editingPersonId = null;
    let deletingPersonId = null;

    addPersonBtn.addEventListener("click", () => {
        openModal();
    });

    closeModal.forEach(btn => {
        btn.addEventListener("click", () => {
            closeModalAction();
        });
    });

    cancelBtn.addEventListener("click", () => {
        closeModalAction();
    });

    confirmBtn.addEventListener("click", () => {
        deleteConfirmed();
    });

    personForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const personData = {
            dni: document.getElementById("dni").value,
            apellido: document.getElementById("apellido").value,
            nombre: document.getElementById("nombre").value,
        };

        if (editingPersonId) {
            await updatePerson(editingPersonId, personData);
        } else {
            await createPerson(personData);
        }

        closeModalAction();
        searchInput.value = ""; // Limpiar campo de búsqueda
        fetchPersons();
    });

    searchInput.addEventListener("input", () => {
        filterPersons(searchInput.value);
    });

    window.onclick = (event) => {
        if (event.target == personModal || event.target == confirmModal) {
            closeModalAction();
        }
    };

    const openModal = (person = null) => {
        if (person) {
            document.getElementById("modalTitle").innerText = "Editar Persona";
            document.getElementById("dni").value = person.dni;
            document.getElementById("apellido").value = person.apellido;
            document.getElementById("nombre").value = person.nombre;
            editingPersonId = person.id_persona;
        } else {
            document.getElementById("modalTitle").innerText = "Agregar Persona";
            personForm.reset();
            editingPersonId = null;
        }
        personModal.style.display = "block";
    };

    const openConfirmModal = (personId, dni, apellido, nombre) => {
        const confirmText = document.getElementById("confirmText");
        confirmText.textContent = `¿Está seguro que desea eliminar a ${nombre} ${apellido} (DNI: ${dni})?`;
        deletingPersonId = personId;
        confirmModal.style.display = "block";
    };

    const deleteConfirmed = async () => {
        try {
            const response = await fetch(`http://localhost:8080/borrar/persona/${deletingPersonId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar persona');
            }
            closeModalAction(); // Cierra el modal de confirmación
            searchInput.value = ""; // Limpiar campo de búsqueda
            fetchPersons(); // Actualiza la lista de personas después de eliminar
        } catch (error) {
            console.error('Error al eliminar persona:', error);
        }
    };

    const closeModalAction = () => {
        personModal.style.display = "none";
        confirmModal.style.display = "none";
        personForm.reset();
    };

    const fetchPersons = async () => {
        try {
            const response = await fetch('http://localhost:8080/persona/listarPersonas');
            if (!response.ok) {
                throw new Error('Error al obtener la lista de personas');
            }
            const persons = await response.json();
            renderPersonTable(persons);
        } catch (error) {
            console.error('Error al obtener la lista de personas:', error);
        }
    };

    const createPerson = async (personData) => {
        try {
            const response = await fetch('http://localhost:8080/persona/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(personData)
            });
            if (!response.ok) {
                throw new Error('Error al crear persona');
            }
            alert('Persona guardada correctamente');
            fetchPersons();
        } catch (error) {
            console.error('Error al crear persona:', error);
            alert('Hubo un error al guardar la persona');
        }
    };

    const updatePerson = async (id, personData) => {
        try {
            const response = await fetch('http://localhost:8080/editar/persona', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_persona: id, ...personData })
            });
            if (!response.ok) {
                throw new Error('Error al actualizar persona');
            }
            fetchPersons();
        } catch (error) {
            console.error('Error al actualizar persona:', error);
        }
    };

    const deletePerson = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/borrar/persona/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar persona');
            }
            fetchPersons();
        } catch (error) {
            console.error('Error al eliminar persona:', error);
        }
    };

    const filterPersons = (searchTerm) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const rows = personTableBody.querySelectorAll("tr");
        rows.forEach(row => {
            const dni = row.querySelector(".dni").innerText.toLowerCase();
            const apellido = row.querySelector(".apellido").innerText.toLowerCase();
            if (dni.includes(lowerCaseSearchTerm) || apellido.includes(lowerCaseSearchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    };

    const renderPersonTable = (persons) => {
        personTableBody.innerHTML = "";
        persons.forEach(person => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${person.id_persona}</td>
                <td class="dni">${person.dni}</td>
                <td class="apellido">${person.apellido}</td>
                <td>${person.nombre}</td>
                <td>
                    <button class="action-btn edit-btn" data-person='${JSON.stringify(person)}'>Editar</button>
                    <button class="action-btn delete-btn" data-id="${person.id_persona}" data-dni="${person.dni}" data-apellido="${person.apellido}" data-nombre="${person.nombre}">Eliminar</button>
                </td>
            `;
            personTableBody.appendChild(row);
        });

        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach(button => {
            button.addEventListener("click", () => {
                const person = JSON.parse(button.getAttribute("data-person"));
                openModal(person);
            });
        });

        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", () => {
                const personId = button.getAttribute("data-id");
                const dni = button.getAttribute("data-dni");
                const apellido = button.getAttribute("data-apellido");
                const nombre = button.getAttribute("data-nombre");
                openConfirmModal(personId, dni, apellido, nombre);
            });
        });
    };

    fetchPersons();
});
