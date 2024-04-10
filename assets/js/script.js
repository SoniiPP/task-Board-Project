// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = taskList.reduce((acc, task) => Math.max(acc, task.id), 0) +1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
 return nextId++; // Increment nextID for each new task
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const now = new Date();
  const deadline = new Date(task.deadline);
  let bgColor = "bg-white";
  if (deadline < now) { // overdue task
    bgColor = "bg-danger";
  } else if ((deadline - now) / (1000 * 60 * 60 * 24) <= 3) { // within 3 days
    bgColor = "bg-warning";
  }

  return $(`
    <div class="card task-card ${bgColor}" id="task-${task.id}" data-task-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.name}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text">Deadline: ${task.deadline}</p>
        <button class="btn btn-danger delete-task">Delete</button>
      </div>
    </div>
  `).draggable({
    containment: 'document',
    cursor: 'move',
    helper: 'clone',
    revert: 'invalid'
  });
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#to-do, #in-progress, #done').empty(); // Clear existing tasks
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $(`#${task.status}`).append(taskCard);
    });
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList(); // Refresh the task list display
  }

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault(); // Prevent form submission
  
  const taskName = $('#taskName').val();
  const taskDescription = $('#taskDescription').val();
  const taskDeadline = $('#taskDeadline').val();
  const taskStatus = $('#taskStatus').val();

  const task = {
    id: generateTaskId(),
    name: taskName,
    description: taskDescription,
    deadline: taskDeadline,
    status: taskStatus || 'to-do', // default status
  };

  taskList.push(task);
  saveTasks();

  // Add the new task card to the To Do lane
  $('#to-do-cards').append(createTaskCard(task));

  // Close the modal and reset the form
  $('#formModal').modal('hide');
  $('#taskForm')[0].reset();
    
}


// Todo: create a function to handle deleting a task
$(document).on('click', '.delete-task', function(event) {
  const taskId = $(event.target).closest('.task-card').data('task-id');
  taskList = taskList.filter(task => task.id !== taskId);
  saveTasks();
});
// function handleDeleteTask(event){
//     const taskId = $(event.target).closest('.task-card').data('task-id');
//     taskList = taskList.filter(task => task.id !== taskId);
//     saveTasks();
//     // $(event.target).closest('.task-card').remove();

// });

// // Todo: create a function to handle dropping a task into a new status lane
// function handleDrop(event, ui) {
//     const taskId = ui.draggable.data('task-id');
//     const newStatus = $(event.target).closest('.lane').attr('id');
//     const task = taskList.find(task => task.id === taskId);
    
//     if (task) {
//         task.status = newStatus;
//         saveTasks();
//         ui.draggable.detach().appendTo($(event.target)).removeAttr('style'); // Remove styling added by jQuery UI
//   }
//     }


// // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// $(document).ready(function () {
//     renderTaskList();
  
//     // Event listener for adding a task
//   $('#taskForm').on('submit', handleAddTask);
  
//   // Make lanes droppable
//   $('.lane').droppable({
//     accept: '.task-card',
//     drop: handleDrop
//   });

//   // Event listener for deleting tasks
//   $(document).on('click', '.delete-task', handleDeleteTask);
  
//   // Initialize date picker
//   $('#taskDeadline').datepicker();
// });
// Document ready
$(document).ready(function () {
  renderTaskList();

  $('#taskForm').on('submit', handleAddTask);

  // Make lanes droppable
  $('.lane').droppable({
    accept: '.task-card',
    drop: function(event, ui) {
      const taskId = ui.draggable.data('task-id');
      const newStatus = $(this).attr('id'); // Use 'this' to reference the lane
      const task = taskList.find(task => task.id === taskId);

      if (task) {
        task.status = newStatus;
        saveTasks();
        ui.draggable.detach().appendTo($(this)).removeAttr('style'); // Append to new lane
      }
    }
  });

  // Initialize date picker
  $('#taskDeadline').datepicker();
});