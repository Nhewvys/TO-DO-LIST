const btn = document.getElementById('btnAdd');
const clearButton = document.getElementById('clear'); // Botão de limpar
const itens = document.querySelector('.itens');
const areaMsg = document.getElementById('Additem');

function createTaskElement(taskText) {
    const div = document.createElement('div');
    div.classList.add('item');
    div.innerHTML = `
        <button class="circle"><i class="fa-regular fa-circle"></i></button>
        <h3>${taskText}</h3>
        <button class="trash"><i class="fa-solid fa-xmark"></i></button>
    `;

    const circleButton = div.querySelector('.circle');
    const taskTitle = div.querySelector('h3');

    circleButton.addEventListener('click', () => {
        const circleIcon = circleButton.querySelector('i');

        circleIcon.classList.toggle('fa-circle');
        circleIcon.classList.toggle('fa-circle-check');

        taskTitle.classList.toggle('completed');
        circleIcon.classList.toggle('completed-i');
    });

    const trashButton = div.querySelector('.trash');
    trashButton.addEventListener('click', () => {
        removeTask(div);
    });

    return div;
}

// Função para adicionar uma nova tarefa
function add() {
    const areaMsg = document.getElementById('Additem');
    const input = areaMsg.value;

    if (!input) {
        alert('Preencha o campo de tarefa.');
        return;
    }

    const taskElement = createTaskElement(input);
    const itens = document.querySelector('.itens');
    itens.prepend(taskElement);

    areaMsg.value = '';
    areaMsg.focus();
    saveTasks();
    updateClearButtonDisplay(); // Adiciona a atualização do botão "Clear All" após adicionar uma tarefa
}

// Função para remover uma tarefa do DOM e do localStorage
function removeTask(taskElement) {
    taskElement.classList.add('item-removed'); // Adicione a classe de animação
    setTimeout(() => {
        taskElement.remove();
    }, 500); // Remova o elemento após a conclusão da animação (300ms)
    
    // Remove a tarefa do localStorage
    const taskText = taskElement.querySelector('h3').textContent;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter((task) => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    updateClearButtonDisplay(); // Adiciona a atualização do botão "Clear All" após remover uma tarefa
}


// Função para remover todas as tarefas do DOM e do localStorage (quando confirmado)
function clearAll() {
    // Remove todas as tarefas do DOM
    const taskElements = document.querySelectorAll('.item');
    taskElements.forEach((taskElement) => {
        taskElement.classList.add('item-removed'); 
        setTimeout(() => {
            taskElement.remove();
        }, 500);
    });

    // Remove todas as tarefas do localStorage
    localStorage.removeItem('tasks');
    clearButton.style.display = 'none';
}

// Função para confirmar antes de limpar todas as tarefas
function confirmClearAll() {
    const confirmResult = window.confirm('Tem certeza disso? Isso irá apagar todas as tarefas.');

    if (confirmResult) {
        clearAll(); // Se confirmado, limpe todas as tarefas
    }
}

// Função para salvar as tarefas no localStorage
function saveTasks() {
    const taskElements = document.querySelectorAll('.item');
    const tasks = [];

    taskElements.forEach((taskElement) => {
        const taskText = taskElement.querySelector('h3').textContent;
        tasks.push({ text: taskText });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar as tarefas do localStorage ao carregar a página
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const itens = document.querySelector('.itens');

    tasks.forEach((task) => {
        const taskElement = createTaskElement(task.text);
        itens.appendChild(taskElement);
    });

    updateClearButtonDisplay(); // Adiciona a atualização do botão "Clear All" após o carregamento
}

// Função para verificar se há tarefas e exibir/ocultar o botão "Clear All"
function updateClearButtonDisplay() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const clearButton = document.getElementById('clear'); // Botão "Clear All"
    if (tasks.length > 0) {
        clearButton.style.display = 'block';
    } else {
        clearButton.style.display = 'none';
    }
}

// Configuração de eventos
btn.addEventListener('click', add);
areaMsg.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        add();
    }
});
clearButton.addEventListener('click', confirmClearAll);

// Carregar tarefas ao carregar a página
loadTasks();
