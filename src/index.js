let state = {
  data: [],
  editedId: "",
};

let localState = localStorage.getItem("state");

if (localState) {
  state = JSON.parse(localState);
}

function setState(newState) {
  state = newState;
  localStorage.setItem("state", JSON.stringify(state));
  render();
}

function render() {
  const { data, editedId } = state;
  const listElement = document.querySelector("#list");
  listElement.innerHTML = data
    .map((item, index) => {
      const isEdit = editedId && item.id === editedId;
      return `<li class="list-group-item">${++index}. 
      ${
        isEdit
          ? `<input class="update-input form-control" value="${item.text}"/>`
          : item.text
      }
      ${
        isEdit
          ? '<button type="button" class="btn btn-primary update-button" data-id="' +
            item.id +
            '">Update</button>'
          : '<button type="button" class="btn btn-primary edit-button" data-id="' +
            item.id +
            '">Edit</button>'
      }
      <button type="button" class="btn btn-danger delete-button" data-id=${
        item.id
      }>Delete</button>
      </li>`;
    })
    .join("");
}

function addTask() {
  const input = document.querySelector(".task-input");

  state.data.push({
    id: Date.now().toString(),
    text: input.value,
  });

  setState({ ...state, data: state.data });

  input.value = "";
}

function deleteTask(button) {
  const buttonId = button.dataset.id;
  const newData = state.data.filter(({ id }) => {
    return id !== buttonId;
  });

  setState({ ...state, data: newData });
}

// refactor
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
    deleteTask(target);
  }
  if (target.classList.contains("edit-button")) {
    editTask(target);
  }

  if (target.classList.contains("update-button")) {
    updateTask(target);
  }
});

render();

// console.dir(buttonElement);
// console.dir(inputElement.value);

/* Jan 24, 2023
- Add Editing
- state
- Add any library of components

DZ:
- Save state to SessionStorage or Cookie
https://developer.mozilla.org/ru/docs/Web/API/Window/sessionStorage
https://developer.mozilla.org/ru/docs/Web/HTTP/Cookies

*/
