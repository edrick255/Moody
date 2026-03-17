const API = "http://localhost:3000";

let token = localStorage.getItem("token");

/* ELEMENTOS */
const loginScreen = document.getElementById("login");
const appScreen = document.getElementById("app");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const userInput = document.getElementById("user");
const passInput = document.getElementById("pass");

const togglePass = document.getElementById("togglePass");

const addRecipeBtn = document.getElementById("addRecipe");
const generateBtn = document.getElementById("generate");

/* 👁 MOSTRAR / OCULTAR PASSWORD */
togglePass.onclick = ()=>{
  passInput.type = passInput.type === "password" ? "text" : "password";
};

/* LOGIN */
loginBtn.onclick = async ()=>{
  if(!userInput.value || !passInput.value){
    alert("Por favor completa usuario y contraseña");
    return;
  }

  const res = await fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      user:userInput.value,
      pass:passInput.value
    })
  });

  if(res.ok){
    const data = await res.json();
    token = data.token;
    localStorage.setItem("token", token);
    enterApp();
  }else{
    alert("Credenciales incorrectas");
  }
};

/* REGISTER */
registerBtn.onclick = async ()=>{
  if(!userInput.value || !passInput.value){
    alert("Completa los campos");
    return;
  }

  const res = await fetch(API+"/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      user:userInput.value,
      pass:passInput.value
    })
  });

  alert(res.ok ? "Registrado correctamente" : "Error al registrar");
};

/* LOGOUT */
logoutBtn.onclick = ()=>{
  localStorage.removeItem("token");
  location.reload();
};

/* ENTRAR */
function enterApp(){
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  loadRecipes();
  initPlan();
}

/* IMC */
function calcularIMC(){
  const peso = parseFloat(document.getElementById("peso").value);
  const altura = parseFloat(document.getElementById("altura").value) / 100;

  if(!peso || !altura){
    alert("Completa peso y altura");
    return;
  }

  const imc = peso / (altura * altura);
  let mensaje = "";

  if(imc < 18.5){
    mensaje = "Bajo peso - aumentar calorías";
  }else if(imc < 25){
    mensaje = "Peso normal - mantener dieta equilibrada";
  }else if(imc < 30){
    mensaje = "Sobrepeso - déficit calórico";
  }else{
    mensaje = "Obesidad - plan nutricional estricto";
  }

  document.getElementById("resultadoIMC").innerText =
    `IMC: ${imc.toFixed(2)} | ${mensaje}`;
}

/* RECETAS */
async function loadRecipes(){
  const res = await fetch(API+"/recipes",{
    headers:{Authorization:token}
  });

  const data = await res.json();
  const container = document.getElementById("recipes");
  container.innerHTML = "";

  data.forEach(r=>{
    const div = document.createElement("div");
    div.className="card glass";

    div.innerHTML = `
      <img src="${r.img}">
      <p>${r.name}</p>
    `;

    div.onclick = ()=> deleteRecipe(r.id);

    container.appendChild(div);
  });
}

addRecipeBtn.onclick = async ()=>{
  const name = prompt("Nombre receta");
  const img = prompt("URL imagen");

  if(!name) return;

  await fetch(API+"/recipes",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:token
    },
    body: JSON.stringify({name,img})
  });

  loadRecipes();
};

async function deleteRecipe(id){
  await fetch(API+"/recipes/"+id,{
    method:"DELETE",
    headers:{Authorization:token}
  });

  loadRecipes();
}

/* PLAN */
function initPlan(){
  const days = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];
  const meals = ["Des","Col","Com","Col","Cena"];

  let html="<tr><th>Día</th>";
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

/* IA SIMULADA */
generateBtn.onclick = ()=>{
  const foods = ["Pollo","Arroz","Pescado","Ensalada","Fruta","Avena"];

  document.querySelectorAll("#plan input").forEach(i=>{
    i.value = foods[Math.floor(Math.random()*foods.length)];
  });
};

/* AUTO LOGIN */
if(token){
  enterApp();
}
