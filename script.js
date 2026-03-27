let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];

function addTask() {
  const name = document.getElementById('task-name').value.trim();
  const subject = document.getElementById('task-subject').value.trim();
  const deadline = document.getElementById('task-deadline').value;

  if (!name || !subject || !deadline) {
    alert("Please fill all fields!");
    return;
  }

  tasks.push({
    id: Date.now(),
    name,
    subject,
    deadline,
    completed: false
  });

  localStorage.setItem('studyTasks', JSON.stringify(tasks));

  document.getElementById('task-name').value = '';
  document.getElementById('task-subject').value = '';
  document.getElementById('task-deadline').value = '';

  renderTasks();
  renderProgress();
}

function renderTasks() {
  const container = document.getElementById('task-list');
  container.innerHTML = '';

  if (tasks.length === 0) {
    container.innerHTML = `<p class="text-purple-400 text-center py-12">No tasks yet. Add one to get started! 📚</p>`;
    return;
  }

  tasks.forEach((task, index) => {
    const div = document.createElement('div');
    div.className = `task-item flex items-center justify-between p-5 bg-[#251d44] rounded-2xl border border-purple-500/30 hover:border-violet-500`;

    div.innerHTML = `
      <div class="flex items-center gap-4 flex-1">
        <input type="checkbox" 
          ${task.completed ? 'checked' : ''} 
          onchange="toggleComplete(${index})"
          class="w-6 h-6 accent-violet-500">
        <div class="${task.completed ? 'completed' : ''}">
          <strong class="text-white text-lg">${task.name}</strong>
          <span class="text-purple-400 ml-3">(${task.subject})</span>
          <p class="text-sm text-purple-500 mt-1">Due: ${task.deadline}</p>
        </div>
      </div>
      <button onclick="deleteTask(${index})" 
        class="text-red-400 hover:text-red-500 px-5 py-2 hover:bg-red-950/50 rounded-xl transition-colors">
        Delete
      </button>
    `;
    container.appendChild(div);
  });
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
  renderTasks();
  renderProgress();
}

function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
    renderTasks();
    renderProgress();
  }
}

let progressChart;

function renderProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  const ctx = document.getElementById('progressChart').getContext('2d');
  if (progressChart) progressChart.destroy();

  progressChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ['#a855f7', '#4b5563'],
        borderColor: '#1a1433',
        borderWidth: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#c4b5fd',
            boxWidth: 14,
            padding: 20,
            font: {
              size: 15
            }
          }
        }
      }
    }
  });
}

let countdownInterval;

function startCountdown() {
  const dateInput = document.getElementById('countdown-date').value;
  if (!dateInput) return alert("Please select a target date");

  clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const target = new Date(dateInput).getTime();
    const diff = target - now;

    const display = document.getElementById('countdown-display');

    if (diff < 0) {
      display.innerHTML = `<span class="text-red-400">Deadline Passed! ⏰</span>`;
      clearInterval(countdownInterval);
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      display.innerHTML = `
        <span class="text-5xl font-bold text-violet-400">${days}</span>d 
        <span class="text-5xl font-bold text-violet-400">${hours}</span>h 
        <span class="text-5xl font-bold text-violet-400">${minutes}</span>m 
        <span class="text-5xl font-bold text-violet-400">${seconds}</span>s
      `;
    }
  }, 1000);
}

const quotes = [
  "Small daily improvements lead to stunning long-term results.",
  "Discipline is choosing between what you want now and what you want most.",
  "Consistency beats perfection every time.",
  "The secret of getting ahead is getting started.",
  "Stay focused. Your time is now."
];

function showQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quote-display').innerText = `"${quote}"`;
}

// Initialize
window.onload = () => {
  renderTasks();
  renderProgress();
  showQuote();
};
