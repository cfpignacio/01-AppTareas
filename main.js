const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

function setFormTask(task) {
	document.getElementById('taskid').value = task.id;
	document.getElementById('title').value = task.titulo;
	document.getElementById('completed').checked = task.terminada;
}
function renderTasks(tasks) {
	taskList.innerHTML = '';
	tasks.forEach((task) => {
		const taskItem = document.createElement('div');
		taskItem.classList.add('task-item');
		taskItem.innerHTML = `
      <p>Título: ${task.titulo}</p>
      <p>Terminada: ${task.terminada ? 'Sí' : 'No'}</p>
      <p>Fecha: ${task.fecha ? task.fecha : 'sin fecha'}</p>
	  <button name="botonBorrar" id=${task.id}>Borrar</button>
    `;

		const buttonEditar = document.createElement('button');
		buttonEditar.textContent = 'Editar';
		buttonEditar.onclick = () => setFormTask(task);
		taskItem.appendChild(buttonEditar);

		taskList.appendChild(taskItem);
	});
	const botonBorrar = document.getElementsByName('botonBorrar');

	botonBorrar.forEach((b) => {
		b.addEventListener('click', () => {
			deleteTask(b.id);
		});
	});
}
form.addEventListener('submit', async (event) => {
	try {
		event.preventDefault();

		const id = document.getElementById('taskid').value;
		const title = document.getElementById('title').value;
		const completed = document.getElementById('completed').checked;

		const task = {
			id: id,
			titulo: title,
			terminada: completed,
		};

		await saveTask(task);
	} catch (error) {
		console.error('Error de red:', error);
	}
});

async function saveTask(task) {
	const hoy = new Date();

	try {
		if (!task.id) {
			// CREAR TAREA
			const response = await fetch('http://localhost:3000/tareas', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					titulo: task.titulo,
					terminada: task.terminada,
					fecha: hoy.toDateString(),
				}),
			});

			if (response.ok) {
				form.reset();
				loadTasks();
				console.log('Tarea creada con éxito');
			} else {
				throw new Error('No se puedo crear la tarea');
			}
		} else {
			// EDITAR TAREA
			const response = await fetch(`http://localhost:3000/tareas/${task.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					titulo: task.titulo,
					terminada: task.terminada,
					fecha: hoy.toDateString(),
				}),
			});
			if (response.ok) {
				form.reset();
				loadTasks();
				console.log('Tarea editada con éxito');
			} else {
				throw new Error('No se puedo editar la tarea');
			}
		}
	} catch (error) {
		console.log(error);
	}
}
async function loadTasks() {
	try {
		const response = await fetch('http://localhost:3000/tareas');
		if (response.ok) {
			const tasks = await response.json();
			renderTasks(tasks);
		} else {
			console.error('Error al obtener las tareas');
		}
	} catch (error) {
		console.error('Error de red:', error);
	}
}
async function deleteTask(idTask) {
	try {
		const urlDelete = `http://localhost:3000/tareas/${idTask}`;
		const response = await fetch(urlDelete, { method: 'DELETE' });
		if (response.ok) {
			console.log('Tarea Borrada');
			loadTasks();
		}
	} catch (error) {
		console.error('Error al borrar la tarea');
	}
}

// Cargar las tareas al inicio
await loadTasks();
