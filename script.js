const taskInput = document.getElementById('task');
const addTaskBtn = document.getElementById('add-task-btn');
const saveTaskBtn = document.getElementById('save-task-btn');
const tableBody = document.querySelector('#table tbody');
const completedTableBody = document.querySelector('#completed-table tbody');

// Task list array
let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
let editingTaskIndex = null;

function displayTaskList(tasks = taskList) {
  tableBody.innerHTML = '';
  completedTableBody.innerHTML = '';

  tasks.forEach(function (task, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskStatus(${index})">
        <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
      </td>
      <td>
        <button onclick="editTask(${index})"><i class="fas fa-edit"></i> Edit</button>
        <button onclick="deleteTask(${index})"><i class="fas fa-trash-alt"></i> Delete</button>
      </td>
    `;
    if (task.completed) {
      completedTableBody.appendChild(row);
    } else {
      tableBody.appendChild(row);
    }
  });
}

// Add a new task to the task list
function addTask() {
  const taskName = taskInput.value.trim();

  if (taskName === '') {
    alert('Please enter a task');
    return;
  }

  if (editingTaskIndex !== null) {
    taskList[editingTaskIndex].name = taskName;
    editingTaskIndex = null;
    addTaskBtn.style.display = 'block';
    saveTaskBtn.style.display = 'none';
  } else {
    taskList.push({ name: taskName, completed: false });
  }

  displayTaskList();
  clearInputField();
  saveTaskListToLocalStorage();
}

// Function to clear the input field after a task is added
function clearInputField() {
  taskInput.value = '';
}

// Function to delete a task from the task list
function deleteTask(taskIndex) {
  taskList.splice(taskIndex, 1);
  displayTaskList();
  saveTaskListToLocalStorage();
}

// Function to edit a task in the task list
function editTask(taskIndex) {
  const task = taskList[taskIndex].name;

  taskInput.value = task;

  editingTaskIndex = taskIndex;
  addTaskBtn.style.display = 'none';
  saveTaskBtn.style.display = 'block';
}

// Function to toggle task status
function toggleTaskStatus(taskIndex) {
  taskList[taskIndex].completed = !taskList[taskIndex].completed;
  displayTaskList();
  saveTaskListToLocalStorage();
}

// Search functionality
function handleSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm === '') {
    displayTaskList();
    return;
  }

  const filteredTasks = taskList.filter((task) => task.name.toLowerCase().includes(searchTerm));

  displayTaskList(filteredTasks);
}

// Input field for search
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', handleSearch);

addTaskBtn.addEventListener('click', addTask);

saveTaskBtn.addEventListener('click', addTask);

// Save the task list data to local storage
function saveTaskListToLocalStorage() {
  localStorage.setItem('taskList', JSON.stringify(taskList));
}

// Initial display of the task list
displayTaskList();
