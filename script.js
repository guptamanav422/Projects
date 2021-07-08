let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let deleteBtn = document.querySelector(".delete");
let color = ["pink", "blue", "green", "black"];
let deleteNode = false;

if (localStorage.getItem("AllTickets") == undefined) {
  let AllTickets = {};
  AllTickets = JSON.stringify(AllTickets);
  localStorage.setItem("AllTickets", AllTickets);
}


let allFilter=document.querySelectorAll(".filter");

for(let i=0;i<allFilter.length;i++)
{
    allFilter[i].addEventListener('click',(e)=>{
        let filterdiv=allFilter[i].querySelector('div');
        let filterclass=filterdiv.classList[0];

        if (allFilter[i].classList.contains("filter-selected")) {
            allFilter[i].classList.remove("filter-selected");
            loadTickets();
          } else {
            for(let i=0;i<allFilter.length;i++)
            {
                if(allFilter[i].classList.contains("filter-selected"))
                allFilter[i].classList.remove("filter-selected");
            }
            allFilter[i].classList.add("filter-selected");
            loadTickets(filterclass);
          }
    })
}
loadTickets();

deleteBtn.addEventListener("click", (e) => {
  if (e.currentTarget.classList.contains("delete-selected")) {
    e.currentTarget.classList.remove("delete-selected");
    deleteNode = false;
  } else {
    e.currentTarget.classList.add("delete-selected");
    deleteNode = true;
  }
});
addBtn.addEventListener("click", () => {
  // agr hmne add button pr click krra tbh hme ui se deletebtn se class htani hai
  // agr class nhi hogi fer bhi ye koi error nhi dega
  deleteBtn.classList.remove("delete-selected");
  deleteNode = false;
  let preModal = document.querySelector(".modal");
  if (preModal != null) return;

  let div = document.createElement("div");

  div.classList.add("modal");
  div.innerHTML = `<div class="task-section">
                    <div class="task-inner-container" contenteditable="true">
                    </div>
                </div>
                <div class="modal-priority-section">
                    <div class="priority-inner-container">
                        <div class="modal-priority pink"></div>
                        <div class="modal-priority blue"></div>
                        <div class="modal-priority green"></div>
                        <div class="modal-priority black selected"></div>
                    </div>
                </div>`;
  body.append(div);
  let allModalPriority = document.querySelectorAll(".modal-priority");

  let ticketColor = "black";
  for (let i = 0; i < 4; i++) {
    allModalPriority[i].addEventListener("click", () => {
      for (let j = 0; j < 4; j++) {
        allModalPriority[j].classList.remove("selected");
      }
      allModalPriority[i].classList.add("selected");
      ticketColor = allModalPriority[i].classList[1];
    });
  }

  let taskInnerContainer = document.querySelector(".task-inner-container");
  taskInnerContainer.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      let id = uid();
      let data = e.currentTarget.innerText;
      // step1 jobhi data hai localstorage me usse lekr aao
      let AllTickets = JSON.parse(localStorage.getItem("AllTickets"));

      // step2 usko update krro

      let temp = {
        color: ticketColor,
        taskValue: data,
      };

      AllTickets[id] = temp;
      // step3 wapas updated object ko localStorage me save krro
      localStorage.setItem("AllTickets", JSON.stringify(AllTickets));

      let ticketdiv = document.createElement("div");
      ticketdiv.classList.add("ticket");
      ticketdiv.innerHTML = `
            <div data-id=${id} class="ticket-color ${ticketColor}"></div>
                <div class="ticket-id">
                #${id}
                </div>
                <div data-id=${id} contenteditable="true" class="actual-task">
                    ${data}
                </div>`;

      grid.append(ticketdiv);
      div.remove();

      ticketdiv.setAttribute("data-id", id);
      ticketdiv.addEventListener("click", (e) => {
        if (deleteNode) {
          e.currentTarget.remove();
          let id = e.currentTarget.getAttribute("data-id");
          let AllTickets = JSON.parse(localStorage.getItem("AllTickets"));
          delete AllTickets[id];
          localStorage.setItem("AllTickets", JSON.stringify(AllTickets));
        }
      });
      let ticketColorDiv = ticketdiv.querySelector(".ticket-color");

      let actualTask = ticketdiv.querySelector(".actual-task");
      actualTask.addEventListener("input", (e) => {
        let updateTask = e.currentTarget.innerText;
        let id = e.currentTarget.getAttribute("data-id");
        let AllTickets = JSON.parse(localStorage.getItem("AllTickets"));
        AllTickets[id].taskValue = updateTask;
        localStorage.setItem("AllTickets", JSON.stringify(AllTickets));
      });
      ticketColorDiv.addEventListener("click", (e) => {
        let id = e.currentTarget.getAttribute("data-id");
        // console.log(id);
        let curColor = e.currentTarget.classList[1];
        let index = -1;
        for (let i = 0; i < color.length; i++) {
          if (color[i] == curColor) index = i;
        }
        index = (index + 1) % 4;
        ticketColorDiv.classList.remove(curColor);
        ticketColorDiv.classList.add(color[index]);
        let AllTickets = JSON.parse(localStorage.getItem("AllTickets"));
        AllTickets[id].color = color[index];
        localStorage.setItem("AllTickets", JSON.stringify(AllTickets));
      });
    } else if (e.key === "Escape") {
      div.remove();
    }
  });
});

function loadTickets(color) {
  // 1 fetch all tickets data


  let ticketOnUi=document.querySelectorAll(".ticket");
  for(let i=0;i<ticketOnUi.length;i++)
  {
      ticketOnUi[i].remove();
  }
  let AllTickets = JSON.parse(localStorage.getItem("AllTickets"));
  // 2 createtiket ui for each ticket obj
  for (x in AllTickets) {

    let ticketId = x;
    let singleTicket = AllTickets[x];

    if(color && color!=singleTicket.color) continue;

    let ticketdiv = document.createElement("div");
    ticketdiv.classList.add("ticket");
    ticketdiv.innerHTML = `
        <div data-id=${ticketId} class="ticket-color ${singleTicket.color}"></div>
            <div class="ticket-id">
            #${ticketId}
            </div>
            <div data-id=${ticketId} contenteditable="true" class="actual-task">
                ${singleTicket.taskValue}
            </div>`;
    // 3 attach required listeners

    let ticketColorDiv = ticketdiv.querySelector(".ticket-color");

    let actualTask = ticketdiv.querySelector(".actual-task");

    actualTask.addEventListener("input", (e) => {
      let updateTask = e.currentTarget.innerText;
      let id = e.currentTarget.getAttribute("data-id");
      let AllTickets = JSON.parse(localStorage.getItem("AllTickets"));
      AllTickets[id].taskValue = updateTask;
      localStorage.setItem("AllTickets", JSON.stringify(AllTickets));
    });
    ticketColorDiv.addEventListener("click", (e) => {
        let color = ["pink", "blue", "green", "black"];
      let id = e.currentTarget.getAttribute("data-id");
      let curColor = e.currentTarget.classList[1];
      let index = -1;
      for (let i = 0; i < 4; i++) {
        if (color[i] == curColor) index = i;
      }
      index = (index + 1) % 4;
      ticketColorDiv.classList.remove(curColor);
      ticketColorDiv.classList.add(color[index]);
      let AllTickets = JSON.parse(localStorage.getItem("AllTickets"));
      AllTickets[id].color = color[index];
      localStorage.setItem("AllTickets", JSON.stringify(AllTickets));
    });

    ticketdiv.addEventListener("click", (e) => {
      if (deleteNode) {
        e.currentTarget.remove();
        let id = e.currentTarget.getAttribute("data-id");
        let AllTickets = JSON.parse(localStorage.getItem("AllTickets"));
        delete AllTickets[id];
        localStorage.setItem("AllTickets", JSON.stringify(AllTickets));
      }
    });
    // 4 add tickets in the grid section of ui

    grid.append(ticketdiv);
  }
}
