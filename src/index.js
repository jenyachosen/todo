const LOW_PRIORITY = "low";
const MIDDLE_PRIORITY = "middle";
const HIGH_PRIORITY = "high";
/**
 * data: [{
 *  text: string,
 *  id: string,
 *  priority: 'low' | 'middle' | 'high',
 * }]
 */
let state = {
  data: [],
  editedId: "",
  removingItemId: null,
};

console.log('====================================');
console.log({state});
console.log('====================================');

if (localStorage.getItem("data")) {
  state.data = JSON.parse(localStorage.getItem("data"));
}

if (sessionStorage.getItem("editedId")) {
  state.editedId = sessionStorage.getItem("editedId");
}

function setState(newState) {
  state = newState;
  localStorage.setItem("data", JSON.stringify(state.data));
  sessionStorage.setItem("editedId", state.editedId);
  render();
}
const buttonSort = document.querySelector('.sort');

buttonSort.addEventListener('click', (e) => {
  if (buttonSort.innerHTML == 'A-Z') {
 
    sortAZ()
    buttonSort.innerHTML = 'Z-A'
  } else {
    sortZA();
    buttonSort.innerHTML = 'A-Z'
  }
  render()
})

function sortAZ(){
  state.data.sort((a, b)=>{
    if(a.text > b.text){
      return 1
    }
    if(a.text < b.text){
      return -1
    }
    return 0
  })
  render()
}
function sortZA(){
  state.data.sort((a, b)=>{
    if(b.text > a.text){
      return 1
    }
    if(b.text < a.text){
      return -1
    }
    return 0
  })
}


function render() {
  const { data, editedId } = state;
  const listElement = document.querySelector("#list");
  listElement.innerHTML = data
    .map((item, index) => {
      const isEdit = editedId && item.id === editedId;
      return `<li class="list-group-item d-flex justify-content-between align-items-center">
      <div class="d-flex justify-content-start align-items-center ">
        <div class="circle ${item.priority}"></div>
        ${++index}. 
        ${
          isEdit
            ? `<input class="update-input form-control" value="${item.text}"/>`
            : item.text
        }
      </div>
      <div class="d-flex">
        <div class="btn-group ms-2" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-info set-priority" data-status="${LOW_PRIORITY}" data-id="${
        item.id
      }">Low</button>
          <button type="button" class="btn btn-info set-priority" data-status="${MIDDLE_PRIORITY}" data-id="${
        item.id
      }">Middle</button>
          <button type="button" class="btn btn-info set-priority" data-status="${HIGH_PRIORITY}" data-id="${
        item.id
      }">High</button>
        </div>
        ${
          isEdit
            ? '<button type="button" class="btn btn-primary update-button ms-2" data-id="' +
              item.id +
              '">Update</button>'
            : '<button type="button" class="btn btn-primary edit-button ms-2" data-id="' +
              item.id +
              '">Edit</button>'
        }
        <button type="button" class="btn btn-danger delete-button ms-2" data-id=${
          item.id
        }>Delete</button>
        
      </div>
      </li>`;
    })
    .join("");
}

function addTask() {
  const input = document.querySelector(".task-input");

  state.data.push({
    id: Date.now().toString(),
    text: input.value,
    priority: LOW_PRIORITY,
  });


  // state.data.sort((a, b)=> {
  //   if(a > b){
  //     return 1
  //   }else{
  //     return -1
  //   }
  // })
  // console.log(state.data);

  setState({ ...state, data: state.data });

  input.value = "";
}

function deleteTask(button) {
  const newData = state.data.filter(({ id }) => {
    return id !== state.removingItemId;
  });

  document.querySelector(".removing").classList.remove("opened");
  setState({ ...state, data: newData, removingItemId: null });
}

function showDeleteWindow(button) {
  const buttonId = button.dataset.id;
  setState({ ...state, removingItemId: buttonId });
  document.querySelector(".removing").classList.add("opened");
}

function hideDeleteWindow() {
  setState({ ...state, removingItemId: null });
  document.querySelector(".removing").classList.remove("opened");
}

function editTask(button) {
  setState({ ...state, editedId: button.dataset.id });
}

function updateTask(button) {
  const { value } = document.querySelector(".update-input");
  const id = button.dataset.id;
  const newData = state.data.map((item) => {
    return item.id === id ? { ...item, text: value } : item;
  });

  setState({ ...state, editedId: "", data: newData });
}

function changePriority(button) {
  const status = button.dataset.status;
  const id = button.dataset.id;
  const newData = state.data.map((item) => {
    return item.id === id ? { ...item, priority: status } : item;
  });
  setState({ ...state, data: newData });
}

document.querySelector(".task-input").addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    addTask();
  }
});

// buttonElement.onclick = function () {
//   alert(inputElement.value + "!!!");
// };

document.querySelector(".task-button").addEventListener("click", () => {
  addTask();
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("delete-button")) {
    showDeleteWindow(target);
  }
  if (target.classList.contains("edit-button")) {
    editTask(target);
  }

  if (target.classList.contains("update-button")) {
    updateTask(target);
  }
  if (target.classList.contains("set-priority")) {
    changePriority(target);
  }
  if (target.classList.contains("close-wind")) {
    hideDeleteWindow();
  }
  if (target.classList.contains("remove-wind-button")) {
    deleteTask();
  }
});

render();
/*
DZ: Sorting
A -> Z
Z -> A
Hight first
Low First
https://getbootstrap.com/docs/5.2/components/dropdowns/#overview

*/
