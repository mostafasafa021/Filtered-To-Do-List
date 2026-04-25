// first we need to make an empty array to add tasks to it
let tasksArray = JSON.parse(window.localStorage.getItem("tasks")) || [];

// select tasks cointainer
let tasksCointainer = document.getElementById("tasksContainer");
let taskCounter = document.getElementById("tasksCount");
// select filter btns cointainer
let filtersBtnsContainer = document.getElementById("filterBtnsContainer");
// select all filter btn
let filterBtns = document.querySelectorAll(".filter-btn");

// render tasks from local storage if exist
let currentTasksCount = renderTasks(tasksArray)

// display tasks counter on refresh
displayTasksCounter(currentTasksCount);

addAcitveStyleToFilterBtn()

// creating the task object based on user input
// get user input
// first select the input field and add btn
let input = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
// add event listener to add btn
addBtn.addEventListener("click", () => {
  let userInput = input.value.trim();
  if (userInput === "") return;
  createTaskObject(userInput);
  // on task add render all tasks again
  let currentTasksCount = renderTasks(tasksArray);
  // update task counter
  displayTasksCounter(currentTasksCount);
  // add to localstorage
  addDataToLocalStorage("tasks", tasksArray);
  input.value = "";
});

tasksCointainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    // get the id of deleted dom element
    let elementId = e.target.closest(".task").getAttribute("data-id");

    deleteTaskFromLocalStorage(elementId);

    addDataToLocalStorage("tasks", tasksArray);

    let currentTasksCount = renderTasks(tasksArray);

    displayTasksCounter(currentTasksCount);
  }
  if (e.target.classList.contains("btn-read")) {
    let elementId = e.target.closest(".task").getAttribute("data-id");
    updateTaskDoneState(elementId);
    addDataToLocalStorage("tasks", tasksArray);
    let currentTasksCount = renderTasks(tasksArray)
    displayTasksCounter(currentTasksCount)
  }
});

filtersBtnsContainer.addEventListener("click", (e) => {
  // set the filter state and return it
  let filterState = setFilterState(e);
  // add current filter state to local storage to render based on it
  addDataToLocalStorage("filter-state", filterState);
  // add active class on current filter btn
  addAcitveStyleToFilterBtn()
  // render tasks and retrun the currentArray length to use it on display count
  let currentTasksCount = renderTasks(tasksArray);
  // display the current tasks count
  displayTasksCounter(currentTasksCount);
});

function createTaskObject(userInput) {
  const userData = {
    id: crypto.randomUUID(),
    isDone: false,
    taskText: userInput,
  };
  tasksArray.push(userData);
}

function renderTasks(tasksArray) {
  let html = "";
  let currentArray;
  if (window.localStorage.getItem("filter-state")) {
    let filterState = JSON.parse(window.localStorage.getItem("filter-state"));
    if (filterState === "done") {
      currentArray = tasksArray.filter((el) => el.isDone);
    } else if (filterState === "active") {
      currentArray = tasksArray.filter((el) => !el.isDone);
    } else {
      currentArray = tasksArray
    }
  } else {
    currentArray = tasksArray;
  }
  currentArray.forEach((el) => {
    html += `<div class="task ${el.isDone ? "done" : ""}" id="task" data-id="${el.id}">
        <span class="task-text">${el.taskText}</span>
        <div class="task-actions" id="tasksActions">
          <button class="btn-read">Mark as Done</button>
          <button class="btn-delete">Delete</button>
        </div>
      </div>`;
  });
  tasksCointainer.innerHTML = html;

  // return currentArray length to use it for the current tasks count
  return currentArray.length;
}

function addDataToLocalStorage(key, data) {
  window.localStorage.setItem(key, JSON.stringify(data));
}

function deleteTaskFromLocalStorage(elementId) {
  tasksArray = tasksArray.filter((el) => el.id !== elementId);
}

function updateTaskDoneState(elementId) {
  tasksArray = tasksArray.map((el) => {
    if (el.id === elementId) el.isDone = !el.isDone;
    return el;
  });
}

function displayTasksCounter(tasksCount) {
  taskCounter.textContent = tasksCount;
}

function setFilterState(event) {
  let currentFilterState = "";
  if (event.target.getAttribute("data-filter") === "done") {
    currentFilterState = "done";
  } else if (event.target.getAttribute("data-filter") === "active") {
    currentFilterState = "active";
  } else {
    currentFilterState = "all";
  }
  return currentFilterState;
}

function addAcitveStyleToFilterBtn () {
  filterBtns.forEach((el) => {
    el.classList.remove("active")
  })
  let filterState = JSON.parse(window.localStorage.getItem("filter-state"))
  if (filterState) {
    document.querySelector(`[data-filter="${filterState}"]`).classList.add("active")
  }
}