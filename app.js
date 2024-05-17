// Get page elements
const workoutForm = document.getElementById('workout-form');
const addExerciseBtn = document.getElementById('add-exercise-btn');
const exerciseList = document.querySelector('.exercise-list');
const searchButton = document.getElementById('search-button');
const searchDate = document.getElementById('search-date');
const workoutRecords = document.querySelector('.workout-records');
const clearFormBtn = document.getElementById('clear-form-btn');
const goalsGrid = document.querySelector('.goals-grid');
const weeklyGoalInput = document.getElementById('weekly-goal');
const goalsMessage = document.querySelector('.goals-message');

// training data array
let workouts = [];

// Dynamically add training item rows
function addExerciseRow() {
  const exerciseRow = document.createElement('div');
  exerciseRow.classList.add('exercise-row');
  exerciseRow.innerHTML = `
    <input type="text" name="exercise" placeholder="Exercise" required>
    <input type="number" name="sets" placeholder="Sets" required>
    <input type="number" name="reps" placeholder="Reps" required>
    <input type="number" name="weight" placeholder="Weight (kg)" required>
  `;
  exerciseList.appendChild(exerciseRow);
}

// Render target comparison section
function renderGoalsComparison() {
  const today = new Date();
  let goalsGridHtml = '';
  let goalsLabelsHtml = '';
  let completedDays = 0;

  // Traverse the past 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const isWorkoutDay = workouts.some(workout => workout.date === formattedDate);

    // Style grid items based on whether training is complete
    if (isWorkoutDay) {
      completedDays++;
      goalsGridHtml += '<div class="goal-day completed"></div>';
    } else {
      goalsGridHtml += '<div class="goal-day incomplete"></div>';
    }

    goalsLabelsHtml += `<div>${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}</div>`;
  }

  goalsGrid.innerHTML = goalsGridHtml;
  document.querySelector('.goals-labels').innerHTML = goalsLabelsHtml;

  const weeklyGoal = parseInt(weeklyGoalInput.value);

  // Display corresponding messages based on the number of training days completed
  if (completedDays >= weeklyGoal) {
    goalsMessage.textContent = 'Congratulations! You reached your weekly goal!';
  } else {
    goalsMessage.textContent = 'Keep going! Don\'t give up!';
  }
}

// Rendering training records
function renderWorkoutRecords(workoutsToRender) {
  let workoutRecordsHtml = '';

  // Loop through the training records to be rendered
  workoutsToRender.forEach(workout => {
    let exercisesHtml = '';

    // Generate HTML for each training item
    workout.exercises.forEach(exercise => {
      exercisesHtml += `
        <div>
          <p>Exercise: ${exercise.exercise}</p>
          <p>Sets: ${exercise.sets}</p>
          <p>Reps: ${exercise.reps}</p>
          <p>Weight: ${exercise.weight}</p>
        </div>
      `;
    });

    // Generate complete training record 
    workoutRecordsHtml += `
      <div class="workout-record">
        <p>Date: ${workout.date}</p>
        <p>Theme: ${workout.theme}</p>
        <p>Category: ${workout.category}</p>
        ${exercisesHtml}
        <p>Notes: ${workout.notes}</p>
        <button type="button" class="delete-record-btn" data-id="${workout.id.toString()}">Delete</button>
      </div>
    `;
  });

  workoutRecords.innerHTML = workoutRecordsHtml;
}

// Clear data
function clearForm() {
  workoutForm.reset();
  exerciseList.innerHTML = `
    <div class="exercise-row">
      <input type="text" name="exercise" placeholder="Exercise" required>
      <input type="number" name="sets" placeholder="Sets" required>
      <input type="number" name="reps" placeholder="Reps" required>
      <input type="number" name="weight" placeholder="Weight (kg)" required>
    </div>
  `;
}

// Delete training records
function deleteWorkoutRecord(id) {
  workouts = workouts.filter(workout => workout.id !== id);
  localStorage.setItem('workouts', JSON.stringify(workouts));
  renderGoalsComparison();
  renderWorkoutRecords(workouts);
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const theme = document.getElementById('theme').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const notes = document.getElementById('notes').value;

  // Get training project data
  const exercises = Array.from(exerciseList.querySelectorAll('.exercise-row')).map(row => {
    const exercise = row.querySelector('input[name="exercise"]').value;
    const sets = row.querySelector('input[name="sets"]').value;
    const reps = row.querySelector('input[name="reps"]').value;
    const weight = row.querySelector('input[name="weight"]').value;

    return { exercise, sets, reps, weight };
  });

  // Create a new training record object
  const newWorkout = {
    id: Date.now().toString(),
    theme,
    category,
    date,
    exercises,
    notes
  };

  workouts.push(newWorkout);
  localStorage.setItem('workouts', JSON.stringify(workouts));

  clearForm();
  renderGoalsComparison();
  renderWorkoutRecords(workouts);
}

// Handle search functionality
function handleSearch() {
  const selectedDate = searchDate.value;
  const filteredWorkouts = workouts.filter(workout => workout.date === selectedDate);
  renderWorkoutRecords(filteredWorkouts);
}

// Add event listener
addExerciseBtn.addEventListener('click', addExerciseRow);
workoutForm.addEventListener('submit', handleFormSubmit);
searchButton.addEventListener('click', handleSearch);
clearFormBtn.addEventListener('click', clearForm);
weeklyGoalInput.addEventListener('change', renderGoalsComparison);
workoutRecords.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-record-btn')) {
    const workoutId = event.target.dataset.id;
    deleteWorkoutRecord(workoutId);
  }
});

// Initialize application
function init() {
  const storedWorkouts = localStorage.getItem('workouts');
  if (storedWorkouts) {
    workouts = JSON.parse(storedWorkouts);
    // Add id to training records without id attribute
    workouts.forEach(workout => {
      if (!workout.id) {
        workout.id = Date.now().toString();
      }
    });
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  renderGoalsComparison();
  renderWorkoutRecords(workouts);
}

init();