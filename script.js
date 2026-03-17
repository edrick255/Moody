// app.js

let recipes = [];

function login(){
  if(user.value && pass.value){
    loginDiv = document.getElementById('login');
    app = document.getElementById('app');
    loginDiv.classList.add('hidden');
    app.classList.remove('hidden');
    initPlan();
  }
}

function logout(){
  location.reload();
}

function addRecipePrompt(){
  const name = prompt("Nombre receta");
  const img = prompt("URL imagen");
  if(name){
    recipes.push({name, img, ingredients:[]});
    renderRecipes();
  }
}

function renderRecipes(){
  const container = document.getElementById('recipes');
  container.innerHTML = '';

  recipes.forEach((r,i)=>{
    container.innerHTML += `
      <div class="glass card" onclick="openRecipe(${i})">
        <div class="menu" onclick="event.stopPropagation();menu(${i})">⋮</div>
        <img src="${r.img || 'https://via.placeholder.com/150'}">
        <p>${r.name}</p>
      </div>
    `;
  });
}

function menu(i){
  const opt = prompt("1 editar, 2 eliminar, 3 imagen");
  if(opt==1){
    recipes[i].name = prompt("Nuevo nombre");
  }
  if(opt==2){
    recipes.splice(i,1);
  }
  if(opt==3){
    recipes[i].img = prompt("Nueva imagen");
  }
  renderRecipes();
}

function openRecipe(i){
  const r = recipes[i];
  const d = document.getElementById('detail');
  d.classList.remove('hidden');

  d.innerHTML = `
    <div class="glass">
      <h3>${r.name}</h3>
      <button onclick="addIngredient(${i})">+ ingrediente</button>
      <ul>
        ${r.ingredients.map((ing,idx)=>`
          <li>
            ${ing.name} - ${ing.qty} - ${ing.cal} kcal
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function addIngredient(i){
  const name = prompt("Ingrediente");
  const qty = prompt("Cantidad");
  const cal = prompt("Calorías");
  recipes[i].ingredients.push({name,qty,cal});
  openRecipe(i);
}

function initPlan(){
  const days = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];
  const meals = ["Des","Col","Com","Col","Cena"];
  const table = document.getElementById('plan');

  let html = "<tr><th>Día</th>";
  meals.forEach(m=> html += `<th>${m}</th>`);
  html += "</tr>";

  days.forEach(d=>{
    html += `<tr><td>${d}</td>`;
    meals.forEach(()=>{
      html += `<td><input></td>`;
    });
    html += "</tr>";
  });

  table.innerHTML = html;
}

function generatePlan(){
  document.querySelectorAll("#plan input").forEach(i=>{
    i.value = ["Pollo","Arroz","Ensalada","Fruta","Pescado"][Math.floor(Math.random()*5)];
  });
}
