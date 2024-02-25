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

// 1. todo list 可以拖曳調整排序
// 從這裡開始 ---
const sortable = new Sortable.default(containers, {
  draggable: '.box--isDraggable',
  mirror: {
    appendTo: containers,
    constrainDimensions: true, // 如果啟用，來源元素的高度和寬度將套用於鏡像
  },
  delay: 100 // 延遲，避免與click重疊
});
// 到這裡結束，已經可以拖曳和調整排序了。

// 3. 加入限制筆數功能，超過就無法在拖曳進去。（緊急 5 筆、重要 3 筆）

let urgentCount = 0;
let importantCount = 0;

// sortable:start 取得當前被限制數量的子節點數量
sortable.on('sortable:start', (evt) => {
  urgentCount = urgent.childElementCount; // 緊急有幾個？
  importantCount = important.childElementCount; // 重要有幾個？

  // console.log(evt);
});

// sortable:sort 若對象筆數已滿，則取消
sortable.on('sortable:sort', (evt) => {
  // console.log(urgentCount, importantCount); // 在這裡抓得到 sortable:start 設置的值
  let finalCategory = evt.overContainer.dataset.category; // 當前項目移動後，最後在的分類
  if (finalCategory === "urgent" && urgentCount === limitCapacity.urgent) { // 如果是在緊急的項目，並且剛好在限制的筆數，就無法再拖曳進去！
    // console.log("超過了");
    evt.cancel();
    // setTimeout(() => {
    //   alert("緊急只能最多放5筆")
    // }, 500);
  } else if (finalCategory === "important" && importantCount === limitCapacity.important) {
    evt.cancel();
    // setTimeout(() => {
    //   alert("重要只能最多放3筆")
    // }, 500);
  }

  // console.log(evt);
});

// sortable:sorted 排序完成時，更新該資料的 category 狀態
sortable.on('sortable:sorted', (evt) => {
  let originalID = evt.data.dragEvent.data.source.dataset.id; // 拖曳後，原本的id
  let newCategory = evt.newContainer.dataset.category; // 拖曳後，當前的分類
  editCategory(originalID, newCategory);

  console.log(evt);
});


// ====== function ======

// 2. 使用 LocalStorage 來記錄 todo list 狀態（順序、完成）
// start. LocalStorage
function setLocalStorage() { // 把最新的資料更新到LocalStorage
  let localStorageData = JSON.stringify(todoData);
  localStorage.setItem("todoData", localStorageData);
}
function getLocalStorage() { // 從LocalStorage把最新的資料載下來
  let localStorageData = JSON.parse(localStorage.getItem("todoData")) || todoData;
  todoData = localStorageData;
  renderTodo(localStorageData);
}
// end. LocalStorage

// 3-1. 更新該資料的 category 狀態
function editCategory(id, category) {
  let index = todoData.findIndex(item => {
    return item.data.id == id;
  })
  todoData[index].category = category;
  setLocalStorage();
}


function renderTodo(data) {
  let todoStr = {
    urgent: '', // 緊急
    important: '', // 重要
    normal: '', // 不急
  };
  data.forEach((item, index) => {
    // console.log(item.category); // *** 原來這樣就可以直接分類成array，不需要用到 if 耶！神奇！
    todoStr[item.category] +=
      `
        <li class="box box--isDraggable" data-id=${item.data.id}>
          <div class="flex items-center">
            <input class="task-done hover:border-green-500 mr-2 ${item.data.done && 'checked'}" type="checkbox" id=${item.data.id}>
            <label class="task-text cursor-pointer" for="${item.data.id}">${item.data.title}</label>
          </div>
          <div class="text-base text-gray-200 hover:text-orange-700 cursor-pointer"><span class="task-del-js fas fa-times pl-2" data-id=${item.data.id}></span></div>
        </li>
      `;
  });
  urgent.innerHTML = todoStr['urgent'];
  important.innerHTML = todoStr['important'];
  normal.innerHTML = todoStr['normal'];
}

function doneToggle(id) {
  let index = todoData.findIndex(item => item.data.id == id);
  todoData[index].data.done = !todoData[index].data.done;
  setLocalStorage(); // 更新到 LocalStorage
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
  setLocalStorage(); // 更新到 LocalStorage
}

function delTodo(id) {
  let index = todoData.findIndex(item => item.data.id == id);
  todoData.splice(index, 1);
  renderTodo(todoData);
  setLocalStorage();  // 更新到 LocalStorage
}

function init() {
  getLocalStorage(); // 先取得 LocalStorage 當前的資料
  renderTodo(todoData);
};

// ====== addEventListener ======
stackedListJs.addEventListener('click', function (e) {
  const targetIsDone = e.target.classList.contains('task-done');
  const targetIsDel = e.target.classList.contains('task-del-js');
  if (targetIsDone) {
    e.target.classList.toggle('checked');
    doneToggle(e.target.id);
  } else if (targetIsDel) {
    targetIsDel && delTodo(e.target.dataset.id);
  }
}, false);

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const todoInput = document.getElementById('addTodo');
  addTodo(todoInput.value);
  todoInput.value = '';
}, false);


init();
