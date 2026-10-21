let todos = [];
let currentFilter = "all";

const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");
const todoCount = document.querySelector(".todo-count");
const clearBtn = document.querySelector(".clear-btn");
const filterButtons = document.querySelectorAll(".filter-btn");

//Загрузка задач из localStorage с защитой от повреждения данных
try {
  const saveTodos = localStorage.getItem("todos");
  todos = saveTodos ? JSON.parse(saveTodos) : [];

  if(!Array.isArray(todos)) {
    todos = [];
  }
todos = todos.filter(function(todo) {
  return (
    todo
    && typeof todo.text === "string" &&
    typeof todo.completed === "boolean"
  );
 });
} catch (error) {
  todos = [];
}


// Сохраняем задачи в localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//Обновляем счетчик
function updateCount() {
  const activeTodos = todos.filter(function (todo) {
    return !todo.completed;
  });

  if (activeTodos.length === 0) {
    todoCount.textContent = "Все задачи выполнены";
    return;
  }

  todoCount.textContent = `Осталось: ${activeTodos.length}`;
}

// Отображаем задачи на странице
function renderTodos() {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.classList.add("empty-message");
    emptyMessage.textContent = "Задач пока нет. Добавьте первую задачу!";
    todoList.appendChild(emptyMessage);
    updateCount();
    return;
  }

  const filteredTodos = todos.filter(function (todo) {
    if (currentFilter === "active") {
      return !todo.completed;
    }

    if (currentFilter === "completed") {
      return todo.completed;
    }

    return true;
  });

  filteredTodos.forEach(function (todo, index) {
    const todoItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    const taskTextElement = document.createElement("span");
    taskTextElement.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.type = "button";
    deleteBtn.setAttribute("aria-label", `Удалить задачу: ${todo.text}`);

    todoItem.appendChild(checkbox);
    todoItem.appendChild(taskTextElement);
    todoItem.appendChild(deleteBtn);

    if (todo.completed) {
      todoItem.classList.add("completed");
    }

    checkbox.addEventListener("change", function () {
      todo.completed = checkbox.checked;

      saveTodos();
      updateCount();
    });

    deleteBtn.addEventListener("click", function () {
      const confirmed = confirm("Вы действительно хотите удалить эту задачу?");

      if(!confirmed) {
        return;
      }

      todos.splice(todos.indexOf(todo), 1);

      saveTodos();
      renderTodos();
    });

    todoList.appendChild(todoItem);
  });

  if (filteredTodos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.classList.add("empty-message");
    emptyMessage.textContent = "Задач по этому фильтру нет";
    todoList.appendChild(emptyMessage);
  }

  updateCount();
}

//Добавление новой задачи
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = todoInput.value.trim();

  if (taskText === "") {
    return;
  }

  todos.push({
    text: taskText,
    completed: false,
  });

  saveTodos();
  renderTodos();

  todoInput.value = "";
});

//Очистить выполненые задачи
clearBtn.addEventListener("click", function () {
  todos = todos.filter(function (todo) {
    return !todo.completed;
  });

  saveTodos();
  renderTodos();
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderTodos();
  });
});
