const taskList = document.querySelector('.task-list')
const inputTask = document.querySelector('.inp')
const btn = document.querySelector('.btn')
const numbers = document.querySelector('#numbers')
const progressAmount = document.querySelector('.progress-amount')
const congrat = document.querySelector('.congrat')

let count = 0
let checkedTask = 0

// بارگذاری تسک‌ها از localStorage هنگام شروع
loadTasks()
progress()

btn.addEventListener('click', (e) => {
    e.preventDefault();
    let temp = inputTask.value.trim()
    if (temp === '') {
        alert('Please fill the box first!!')
        return
    }
    
    count++
    let li = document.createElement('li')
    li.innerHTML = `        
       <h3>${temp}</h3>
       <div class='task-actions'>
         <span><input onclick="checkTask(this)" type="checkbox"></span>
         <span onclick="deleteTask(this)" class='delete'>🗑️</span>
         <span onclick="editTask(this)">✎</span>
       </div>
    `
    taskList.appendChild(li)
    inputTask.value = ''
    updateNumber()
    saveTasks()
})

function deleteTask(s) {
    const li = s.closest('li');
    const checkbox = li.querySelector('input[type="checkbox"]');
    
    if (confirm('Are you sure?')) {
        if (checkbox.checked) checkedTask--
        count--
        li.remove()
        updateNumber()
        saveTasks()
    }
}

function checkTask(s) {
    let temp = s.parentElement.parentElement.previousElementSibling.innerText
    if (s.checked) {
        s.parentElement.parentElement.previousElementSibling.innerHTML = '<del>' + temp + '</del>'
        checkedTask++
    } else {
        s.parentElement.parentElement.previousElementSibling.innerHTML = temp
        checkedTask--
    }
    updateNumber()
    saveTasks()
}

function editTask(s) {
    const li = s.closest('li');
    const h3 = li.querySelector('h3');

    if (li.querySelector('input.edit-input')) return;

    const text = h3.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = text;
    input.className = 'edit-input';

    li.replaceChild(input, h3);

    input.focus();
    input.select();

    function save() {
        const newText = input.value.trim();
        if (newText.length > 0) {
            h3.textContent = newText;
        }
        li.replaceChild(h3, input);
        saveTasks()
    }

    input.addEventListener('blur', save);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            save();
        }
    });
}

function progress() {
    if (count === 0) {
        progressAmount.style.width = '0%';
        congrat.innerText = 'Keep it up!'
        return;
    }
    let percent = (checkedTask / count) * 100;
    progressAmount.style.width = percent + '%';
}

const animation = () => {
    if (count === 0) return;

    let percent = (checkedTask / count) * 100;

    if (percent === 100) {
        const confettiSettings = { target: 'demo' };
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
        congrat.innerText = 'Congratulations!!!'

        
        setTimeout(() => confetti.clear(), 5000);
    }
}

function updateNumber() {
    numbers.innerHTML = `${checkedTask} / ${count}`;
    progress()
    animation()
}

function saveTasks() {
    const tasks = [];
    const lis = taskList.querySelectorAll('li');
    lis.forEach(li => {
        const text = li.querySelector('h3').textContent;
        const completed = li.querySelector('input[type="checkbox"]').checked;
        tasks.push({ text, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (!tasks) return;
    count = 0;
    checkedTask = 0;
    taskList.innerHTML = '';
    tasks.forEach(task => {
        count++;
        if (task.completed) checkedTask++;
        let li = document.createElement('li');
        li.innerHTML = `
            <h3>${task.completed ? `<del>${task.text}</del>` : task.text}</h3>
            <div class='task-actions'>
                <span><input onclick="checkTask(this)" type="checkbox" ${task.completed ? 'checked' : ''}></span>
                <span onclick="deleteTask(this)" class='delete'>🗑️</span>
                <span onclick="editTask(this)">✎</span>
            </div>
        `;
        taskList.appendChild(li);
    });
    updateNumber();
}





