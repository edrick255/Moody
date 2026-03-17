const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addRecipeBtn = document.getElementById("addRecipe");
const generateBtn = document.getElementById("generate");

const loginScreen = document.getElementById("login");
const appScreen = document.getElementById("app");

const userInput = document.getElementById("user");
const passInput = document.getElementById("pass");

let recipes = [];

/* LOGIN FUNCIONAL */
loginBtn.addEventListener("click", () => {
  if(userInput.value && passInput.value){
    transition(loginScreen, appScreen);
    initPlan();
  }else{
    alert("Completa los campos");
  }
});

/* LOGOUT */
logoutBtn.addEventListener("click", () => location.reload());

/* TRANSICIÓN SUAVE */
function transition(from,to){
  from.classList.remove("active");
  from.classList.add("hidden");

  setTimeout(()=>{
    to.classList.remove("hidden");
    to.classList.add("active");
  },300);
}

/* RECETAS */
addRecipeBtn.addEventListener("click", () => {
  const name = prompt("Nombre receta");
  const img = prompt("Imagen URL");

  if(!name) return;

  recipes.push({
    name,
    img: img || "https://via.placeholder.com/150"
  });

  renderRecipes();
});

function renderRecipes(){
  const container = document.getElementById("recipes");
  container.innerHTML = "";

  recipes.forEach((r,i)=>{
    const div = document.createElement("div");
    div.className = "glass card";
    div.innerHTML = `
      <img src="${r.img}">
      <p>${r.name}</p>
    `;

    div.onclick = () => editRecipe(i);

    container.appendChild(div);
  });
}

function editRecipe(i){
  const option = prompt("1 editar, 2 eliminar");

  if(option == 1){
    recipes[i].name = prompt("Nuevo nombre") || recipes[i].name;
  }

  if(option == 2){
    recipes.splice(i,1);
  }

  renderRecipes();
}

/* PLAN */
function initPlan(){
  const days = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];
  const meals = ["Des","Col","Com","Col","Cena"];

  let html = "<tr><th>Día</th>";
  meals.forEach(m=> html+=`<th>${m}</th>`);
  html+="</tr>";

  days.forEach(d=>{
    html+=`<tr><td>${d}</td>`;
    meals.forEach(()=>{
      html+=`<td><input></td>`;
    });
    html+="</tr>";
  });

  document.getElementById("plan").innerHTML = html;
}

/* GENERADOR IA SIMULADO */
generateBtn.addEventListener("click", () => {
  const foods = ["Pollo","Arroz","Pescado","Ensalada","Fruta","Huevos"];

  document.querySelectorAll("#plan input").forEach(i=>{
    i.value = foods[Math.floor(Math.random()*foods.length)];
  });
});
