// Находим элементы на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

// Добавление задачи
form.addEventListener("submit", addTask);

// Удаление задачи
tasksList.addEventListener("click", deleteTask);

// Отмечаем задачу завершенной
tasksList.addEventListener("click", doneTask);

// Функции
function addTask(event) {
  event.preventDefault();

  // Достаем текст задачи из поля ввода
  const taskText = taskInput.value;

  // Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавляем задачу в массив с задачами
  tasks.push(newTask);
  saveToLocalStorage();

  renderTask(newTask);

  // Очищаем поле ввода и возвращаем на него фокус
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // Проверяем если клик был НЕ по кнопке "удалить задачу"
  if (event.target.dataset.action !== "delete") return;

  // Либо выполним, если по кнопке "удалить задачу"
  const parentNode = event.target.closest(".list-group-item");

  // Определяем ID задачи
  const id = Number(parentNode.id);

  // Находим индекс задачи в массиве
  const index = tasks.findIndex((task) => task.id === id);

  // Удаляем задачу из массива с задачами
  tasks.splice(index, 1);
  saveToLocalStorage();

  // Удаляем задачу из разметки
  parentNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  // Проверяем что клик был YT по кнопке "задача выполнена"
  if (event.target.dataset.action !== "done") return;

  // Либо выполним, если по кнопке "задача выполнена"
  const parentNode = event.target.closest(".list-group-item");

  // Определяем ID задачи
  const id = Number(parentNode.id);
  // Находим нужный "объект задачи" в массиве
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  // Формируем сss класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // Формируем разметку для новой задачи
  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
  <span class="${cssClass}">${task.text}</span>
  <div class="task-item__buttons">
    <button type="button" data-action="done" class="btn-action">
      <img src="./img/tick.svg" alt="Done" width="18" height="18" />
    </button>
    <button type="button" data-action="delete" class="btn-action">
      <img src="./img/cross.svg" alt="Done" width="18" height="18" />
    </button>
  </div>
</li>`;

  // Добавляем задачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
