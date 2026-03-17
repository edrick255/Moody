const API = "http://localhost:3000";
let token = localStorage.getItem("token");

/* ELEMENTOS */
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const userInput = document.getElementById("user");
const passInput = document.getElementById("pass");
const togglePass = document.getElementById("togglePass");

const loginError = document.getElementById("loginError");

/* PASSWORD */
togglePass.onclick = ()=>{
  passInput.type = passInput.type==="password"?"text":"password";
};

/* LOGIN */
loginBtn.onclick = async ()=>{
  if(!userInput.value || !passInput.value){
    loginError.innerText="Completa los campos";
    return;
  }

  const res = await fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      user:userInput.value,
      pass:passInput.value
    })
  });

  if(res.ok){
    const data = await res.json();
    token=data.token;
    localStorage.setItem("token",token);
    enterApp();
  }else{
    loginError.innerText="Datos incorrectos";
  }
};

/* REGISTER */
registerBtn.onclick = async ()=>{
  await fetch(API+"/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      user:userInput.value,
      pass:passInput.value
    })
  });
  loginError.innerText="Usuario creado";
};

/* LOGOUT */
logoutBtn.onclick=()=>{
  localStorage.removeItem("token");
  location.reload();
};

/* ENTRAR */
function enterApp(){
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  loadRecipes();
  initPlan();
}

/* IMC */
function calcularIMC(){
  let peso=document.getElementById("peso").value;
  let altura=document.getElementById("altura").value/100;

  let imc=peso/(altura*altura);
  let msg="";

  if(imc<18.5) msg="Bajo peso";
  else if(imc<25) msg="Normal";
  else if(imc<30) msg="Sobrepeso";
  else msg="Obesidad";

  document.getElementById("resultadoIMC").innerText=
    "IMC: "+imc.toFixed(2)+" - "+msg;
}

/* RECETAS */
async function loadRecipes(){
  const res=await fetch(API+"/recipes",{headers:{Authorization:token}});
  const data=await res.json();

  const container=document.getElementById("recipes");
  container.innerHTML="";

  data.forEach(r=>{
    const div=document.createElement("div");
    div.className="card";

    div.innerHTML=`
      <img src="${r.img}">
      <p>${r.name}</p>
    `;

    div.onclick=()=>deleteRecipe(r.id);

    container.appendChild(div);
  });
}

document.getElementById("addRecipe").onclick=async ()=>{
  const name=prompt("Nombre");
  const img=prompt("Imagen URL");

  await fetch(API+"/recipes",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:token
    },
    body:JSON.stringify({name,img})
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
  const days=["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];
  const meals=["Des","Col","Com","Col","Cena"];

  let html="<tr><th>Día</th>";
  meals.forEach(m=>html+=`<th>${m}</th>`);
  html+="</tr>";

  days.forEach(d=>{
    html+=`<tr><td>${d}</td>`;
    meals.forEach(()=>html+=`<td><input></td>`);
    html+="</tr>";
  });

  document.getElementById("plan").innerHTML=html;
}

document.getElementById("generate").onclick=()=>{
  const foods=["Pollo","Arroz","Pescado","Avena","Fruta"];
  document.querySelectorAll("#plan input").forEach(i=>{
    i.value=foods[Math.floor(Math.random()*foods.length)];
  });
};

/* AUTO LOGIN */
if(token) enterApp();
