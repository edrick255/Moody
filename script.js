/* =========================
LOGIN
========================= */

function login(){

let user=document.getElementById("user").value
let pass=document.getElementById("pass").value

if(user.length>0 && pass.length>0){

document.getElementById("loginScreen").style.display="none"
document.getElementById("app").style.display="block"

generateNutritionTable()

}else{

alert("Ingresa usuario y contraseña")

}

}


/* =========================
RECETAS
========================= */

let breakfast=[

"Avena con frutas",
"Omelette de espinaca",
"Hotcakes de avena",
"Yogurt con granola",
"Tostadas con aguacate",
"Huevos revueltos con tomate",
"Smoothie de plátano",
"Avena con miel",
"Pan integral con huevo",
"Yogurt con nueces"

]

let snack=[

"Manzana con crema de cacahuate",
"Yogurt con fresas",
"Barra de granola",
"Puñado de nueces",
"Batido de proteína",
"Gelatina light",
"Plátano con almendras",
"Mix de semillas",
"Fruta con yogurt",
"Batido de avena"

]

let lunch=[

"Pollo a la plancha con arroz",
"Pasta integral con verduras",
"Salmón con quinoa",
"Tacos de lechuga con pollo",
"Ensalada de atún",
"Carne magra con verduras",
"Arroz con pollo saludable",
"Filete de pescado con arroz",
"Pollo con puré de papa",
"Ensalada mediterránea"

]

let dinner=[

"Ensalada de pollo",
"Atún con aguacate",
"Sopa de verduras",
"Wrap integral de pollo",
"Salmón con espárragos",
"Tortilla española ligera",
"Ensalada de quinoa",
"Pescado al horno",
"Pollo con verduras",
"Huevo con espinaca"

]



/* =========================
DIAS DE LA SEMANA
========================= */

let days=[

"Lunes",
"Martes",
"Miércoles",
"Jueves",
"Viernes",
"Sábado",
"Domingo"

]



/* =========================
FUNCION RANDOM
========================= */

function randomItem(list){

return list[Math.floor(Math.random()*list.length)]

}



/* =========================
GENERAR TABLA NUTRICIONAL
========================= */

function generateNutritionTable(){

let container=document.getElementById("nutritionTableContainer")

container.innerHTML=""

let table=document.createElement("table")

table.className="nutritionTable"

let header=`

<tr>

<th>Día</th>
<th>Desayuno</th>
<th>Colación</th>
<th>Comida</th>
<th>Colación</th>
<th>Cena</th>

</tr>

`

let rows=""



days.forEach(day=>{

rows+=`

<tr>

<td>${day}</td>

<td>${randomItem(breakfast)}</td>

<td>${randomItem(snack)}</td>

<td>${randomItem(lunch)}</td>

<td>${randomItem(snack)}</td>

<td>${randomItem(dinner)}</td>

</tr>

`

})



table.innerHTML=header+rows

container.appendChild(table)

}



/* =========================
GENERAR AUTOMATICAMENTE
========================= */

document.addEventListener("DOMContentLoaded",function(){

let btn=document.querySelector(".generateBtn")

if(btn){

btn.addEventListener("click",generateNutritionTable)

}

})
