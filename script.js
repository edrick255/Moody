/* LOGIN */

const loginPage=document.getElementById("login-page")
const appPage=document.getElementById("app-page")

const loginBtn=document.getElementById("login-btn")
const logoutBtn=document.getElementById("logout-btn")

const loginError=document.getElementById("login-error")

loginBtn.onclick=()=>{

let user=document.getElementById("login-user").value
let pass=document.getElementById("login-pass").value

if(user.length>0 && pass.length>0){

loginPage.style.display="none"
appPage.style.display="block"

generatePlan()

}else{

loginError.textContent="Usuario o contraseña inválidos"

}

}

logoutBtn.onclick=()=>{

loginPage.style.display="flex"
appPage.style.display="none"

}



/* RECETAS */

const breakfasts=[
"Avena con frutas",
"Omelette de espinaca",
"Hotcakes de avena",
"Yogurt con granola"
]

const snacks=[
"Manzana con nueces",
"Yogurt con fresas",
"Barra de granola"
]

const lunches=[
"Pollo con arroz",
"Pasta integral",
"Ensalada de atún"
]

const dinners=[
"Ensalada de pollo",
"Salmón con verduras",
"Sopa de verduras"
]

const days=[
"Lunes",
"Martes",
"Miércoles",
"Jueves",
"Viernes",
"Sábado",
"Domingo"
]



function random(arr){

return arr[Math.floor(Math.random()*arr.length)]

}



/* TABLA */

function generatePlan(){

const container=document.getElementById("table-container")

let html="<table>"

html+=`
<tr>
<th>Día</th>
<th>Desayuno</th>
<th>Colación</th>
<th>Comida</th>
<th>Colación</th>
<th>Cena</th>
</tr>
`

days.forEach(day=>{

html+=`
<tr>

<td>${day}</td>
<td>${random(breakfasts)}</td>
<td>${random(snacks)}</td>
<td>${random(lunches)}</td>
<td>${random(snacks)}</td>
<td>${random(dinners)}</td>

</tr>
`

})

html+="</table>"

container.innerHTML=html

}



document.getElementById("generate-plan").onclick=generatePlan
