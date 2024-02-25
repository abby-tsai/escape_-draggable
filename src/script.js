console.clear();

// ====== DOM ======
const urgent = document.querySelector('.stacked-list-js.urgent');
const important = document.querySelector('.stacked-list-js.important');
const normal = document.querySelector('.stacked-list-js.normal');

const containers = document.querySelectorAll('#multiple-containers-js .stacked-list-js');
const stackedListJs = document.querySelector('#multiple-containers-js');
const addTodoBtn = document.querySelector('.addTodoBtn-js');
const form = document.getElementById('form');

// ====== draggable var ======
const containerTwoCapacity = 3;
const limitCapacity = {
  urgent: 5,
  important: 3,
};
const limitIndexMapping = {
  urgent: 0,
  important: 1,
};
let dragBeforeIndex;
let dragAfterIndex;
let dragIndex;

// ====== Data ======
let todoData = [
  {
    category: 'urgent',
    data: {
      id: 0,
      title: '第一關',
      done: false,
    }
  },
  {
    category: 'urgent',
    data: {
      id: 1,
      title: '第二關',
      done: true,
    }
  },
  {
    category: 'urgent',
    data: {
      id: 2,
      title: '第三關',
      done: false,
    }
  },
  {
    category: 'urgent',
    data: {
      id: 3,
      title: '第四關',
      done: false,
    }
  },
  {
    category: 'urgent',
    data: {
      id: 4,
      title: '第五關',
      done: false,
    }
  },
  {
    category: 'important',
    data: {
      id: 5,
      title: '第六關',
      done: false,
    }
  },
  {
    category: 'important',
    data: {
      id: 6,
      title: '第七關',
      done: false,
    }
  },
  {
    category: 'important',
    data: {
      id: 7,
      title: '第八關',
      done: false,
    }
  },
  {
    category: 'normal',
    data: {
      id: 8,
      title: '第九關',
      done: false,
    }
  },
  {
    category: 'normal',
    data: {
      id: 9,
      title: '第十關',
      done: false,
    }
  },
];

// ====== draggable ======



// ====== function ======
function renderTodo(data) {
  let todoStr = {
    urgent: '',
    important: '',
    normal: '',
  };
  data.forEach( (item, index) => {
    todoStr[item.category] += `<li class="box box--isDraggable" data-id=${item.data.id}>
          <div class="flex items-center">
            <input class="task-done hover:border-green-500 mr-2 ${item.data.done && 'checked'}" type="checkbox" id=${item.data.id}>
            <label class="task-text cursor-pointer" for="${item.data.id}">${item.data.title}</label>
          </div>
          <div class="text-base text-gray-200 hover:text-orange-700 cursor-pointer"><span class="task-del-js fas fa-times pl-2" data-id=${item.data.id}></span></div>
        </li>`;
  });
  urgent.innerHTML = todoStr['urgent'];
  important.innerHTML = todoStr['important'];
  normal.innerHTML = todoStr['normal'];
}

function doneToggle(id) {
  let index = todoData.findIndex(item => item.data.id == id);
  todoData[index].data.done = !todoData[index].data.done;
}

function addTodo(title) {
  todoData.push({
    category: 'normal',
    data: {
      id: new Date().getTime(), // UNIX Timestamp 
      title: title,
      done: false,
    }
  });
  renderTodo(todoData);
}

function delTodo(id) {
  let index = todoData.findIndex(item => item.data.id == id);
  todoData.splice(index, 1);
  renderTodo(todoData);
}

function init() {
  renderTodo(todoData);
};

// ====== addEventListener ======
stackedListJs.addEventListener('click', function(e) {
  const targetIsDone = e.target.classList.contains('task-done');
  const targetIsDel = e.target.classList.contains('task-del-js');
  if (targetIsDone) {
    e.target.classList.toggle('checked');
    doneToggle(e.target.id);
  } else if (targetIsDel) {
    targetIsDel && delTodo(e.target.dataset.id);
  }
}, false);

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const todoInput = document.getElementById('addTodo');
  addTodo(todoInput.value);
  todoInput.value = '';
}, false);


init();