/* =================================
LOGIN
================================= */

document.getElementById("loginBtn").onclick=function(){

let u=document.getElementById("username").value
let p=document.getElementById("password").value

if(u!=="" && p!==""){

document.getElementById("loginScreen").style.display="none"
document.getElementById("app").style.display="block"

loadRecipes()
initHealthPanel()

}else{

alert("Ingresa usuario y contraseña")

}

}



/* =================================
GUARDAR RECETAS
================================= */

function saveRecipes(){

localStorage.setItem("nutriplan_recipes",JSON.stringify(recipes))

}

function loadSavedRecipes(){

let data=localStorage.getItem("nutriplan_recipes")

if(data){

recipes=JSON.parse(data)

}

}



/* =================================
IA ESTIMADOR CALORIAS
================================= */

function estimateCalories(name,grams){

name=name.toLowerCase()

let table={

pollo:165,
arroz:130,
avena:389,
huevo:155,
salmon:208,
queso:402,
pan:265,
tomate:18,
lechuga:15,
platano:89,
manzana:52,
fresa:32,
yogurt:59,
quinoa:120,
espinaca:23,
pepino:16

}

let base=table[name]||120

return Math.round((base/100)*grams)

}



/* =================================
RECETAS BASE
================================= */

let recipes=[

{
name:"Ensalada César",
image:"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
ingredients:[
["Lechuga",100,15],
["Pollo",150,200],
["Aderezo",30,120]
]
},

{
name:"Salmón con quinoa",
image:"https://images.pexels.com/photos/3296275/pexels-photo-3296275.jpeg",
ingredients:[
["Salmón",200,350],
["Quinoa",100,120],
["Espinaca",50,10]
]
},

{
name:"Smoothie de fresa",
image:"https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg",
ingredients:[
["Fresa",100,30],
["Yogurt",120,70],
["Plátano",80,80]
]
},

{
name:"Tostada de aguacate",
image:"https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg",
ingredients:[
["Pan",80,120],
["Aguacate",100,160],
["Tomate",40,10]
]
},

{
name:"Bowl saludable",
image:"https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
ingredients:[
["Arroz",120,150],
["Pollo",150,200],
["Verduras",100,60]
]
}

]

let currentRecipe=null

loadSavedRecipes()



/* =================================
CARGAR TARJETAS
================================= */

function loadRecipes(){

let container=document.getElementById("recipes")

container.innerHTML=""

recipes.forEach((r,i)=>{

let card=document.createElement("div")

card.className="card"

card.innerHTML=`

<div class="recipeMenu" onclick="toggleMenu(${i})">⋮</div>

<div class="menuPanel" id="menu${i}">

<button onclick="renameRecipe(${i})">Cambiar nombre</button>

<button onclick="changeImage(${i})">Cambiar imagen</button>

<button onclick="uploadImage(${i})">Subir imagen</button>

<button onclick="deleteRecipe(${i})">Eliminar receta</button>

<button onclick="newRecipe()">Nueva receta</button>

</div>

<img class="recipeImg" src="${r.image}">

<h3 onclick="openRecipe(${i})">${r.name}</h3>

`

container.appendChild(card)

})

}



/* =================================
MENU
================================= */

function toggleMenu(i){

let m=document.getElementById("menu"+i)

m.style.display=m.style.display==="block"?"none":"block"

}



/* =================================
EDITAR RECETA
================================= */

function renameRecipe(i){

let n=prompt("Nuevo nombre",recipes[i].name)

if(n)recipes[i].name=n

saveRecipes()
loadRecipes()

}

function changeImage(i){

let url=prompt("URL imagen")

if(url)recipes[i].image=url

saveRecipes()
loadRecipes()

}

function uploadImage(i){

let input=document.createElement("input")

input.type="file"

input.onchange=e=>{

let file=e.target.files[0]

let reader=new FileReader()

reader.onload=function(){

recipes[i].image=reader.result
saveRecipes()
loadRecipes()

}

reader.readAsDataURL(file)

}

input.click()

}

function deleteRecipe(i){

if(confirm("Eliminar receta?")){

recipes.splice(i,1)

saveRecipes()
loadRecipes()

}

}

function newRecipe(){

recipes.push({

name:"Nueva receta",
image:"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
ingredients:[["Ingrediente",100,50]]

})

saveRecipes()
loadRecipes()

}



/* =================================
ABRIR RECETA
================================= */

function openRecipe(i){

currentRecipe=i

let r=recipes[i]

document.getElementById("recipeModal").style.display="flex"

document.getElementById("recipeTitle").innerText=r.name
document.getElementById("recipeImage").src=r.image

let ingDiv=document.getElementById("ingredients")
ingDiv.innerHTML=""

let totalCalories=0

r.ingredients.forEach((ing,index)=>{

totalCalories+=ing[2]

let d=document.createElement("div")

d.innerHTML=`

${ing[0]} - ${ing[1]}g - ${ing[2]} cal

<button onclick="editIngredientName(${index})">✏</button>
<button onclick="editIngredientAmount(${index})">⚖</button>
<button onclick="deleteIngredient(${index})">❌</button>

`

ingDiv.appendChild(d)

})

let total=document.createElement("h3")

total.innerText="Total Calorías: "+totalCalories

ingDiv.appendChild(total)

let addBtn=document.createElement("button")

addBtn.innerText="Agregar ingrediente"

addBtn.onclick=addIngredient

ingDiv.appendChild(addBtn)

drawChart()

}



/* =================================
CERRAR MODAL
================================= */

document.getElementById("closeModal").onclick=function(){

let modal=document.getElementById("recipeModal")

modal.style.display="none"

currentRecipe=null

}

window.addEventListener("click",function(event){

let modal=document.getElementById("recipeModal")

if(event.target===modal){

modal.style.display="none"

currentRecipe=null

}

})



/* =================================
INGREDIENTES
================================= */

function editIngredientName(index){

let ing=recipes[currentRecipe].ingredients[index]

let newName=prompt("Nuevo nombre",ing[0])

if(newName){

recipes[currentRecipe].ingredients[index][0]=newName
openRecipe(currentRecipe)
saveRecipes()

}

}

function editIngredientAmount(index){

let ing=recipes[currentRecipe].ingredients[index]

let grams=prompt("Cantidad gramos",ing[1])

if(grams){

let cal=estimateCalories(ing[0],grams)

recipes[currentRecipe].ingredients[index]=[
ing[0],
parseInt(grams),
cal
]

openRecipe(currentRecipe)
saveRecipes()

}

}

function deleteIngredient(index){

if(confirm("Eliminar ingrediente?")){

recipes[currentRecipe].ingredients.splice(index,1)
openRecipe(currentRecipe)
saveRecipes()

}

}

function addIngredient(){

let name=prompt("Nombre ingrediente")
let grams=prompt("Cantidad gramos")

if(name){

let cal=estimateCalories(name,grams)

recipes[currentRecipe].ingredients.push([

name,
parseInt(grams)||100,
cal

])

openRecipe(currentRecipe)
saveRecipes()

}

}



/* =================================
GRAFICA
================================= */

function drawChart(){

let canvas=document.getElementById("chart")
let ctx=canvas.getContext("2d")

ctx.clearRect(0,0,700,300)

let ing=recipes[currentRecipe].ingredients

ing.forEach((i,index)=>{

let height=i[2]

ctx.fillStyle="#38bdf8"

ctx.fillRect(100+index*140,260-height,80,height)

ctx.fillStyle="white"

ctx.fillText(i[0],100+index*140,280)

})

}



/* =================================
PANEL SALUD
================================= */

function initHealthPanel(){

let panel=document.createElement("div")

panel.innerHTML=`

<h2>Perfil de Salud</h2>

Peso(kg)<input id="peso">

Altura(cm)<input id="altura">

Edad<input id="edad">

Alergias<input id="alergias">

Enfermedades<input id="enfermedades">

<button onclick="calculateBMI()">Calcular IMC</button>

<button onclick="generatePlan()">Generar plan semanal</button>

<div id="imcResult"></div>

<div id="planSemanal"></div>

`

document.getElementById("app").prepend(panel)

}



/* =================================
IMC
================================= */

function calculateBMI(){

let peso=document.getElementById("peso").value
let altura=document.getElementById("altura").value/100

let imc=(peso/(altura*altura)).toFixed(2)

document.getElementById("imcResult").innerText="IMC: "+imc

}



/* =================================
PLAN SEMANAL
================================= */

function generatePlan(){

let days=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"]

let plan=""

days.forEach(d=>{

let r=recipes[Math.floor(Math.random()*recipes.length)]

plan+=`<p><b>${d}</b>  
08:00 Desayuno  
13:00 Comida  
20:00 Cena  
Receta sugerida: ${r.name}</p>`

})

document.getElementById("planSemanal").innerHTML=plan

}



/* =================================
BUSCADOR
================================= */

document.getElementById("search").oninput=function(){

let text=this.value.toLowerCase()

let cards=document.querySelectorAll(".card")

cards.forEach(c=>{

let title=c.innerText.toLowerCase()

c.style.display=title.includes(text)?"block":"none"

})

}
/* =========================================================
ESTILOS AUTOMATICOS (para no modificar styles.css)
========================================================= */

function applyAdvancedStyles(){

let style=document.createElement("style")

style.innerHTML=`

/* fondo futurista */

body{
background:linear-gradient(140deg,#020617,#0f172a,#020617);
font-family:Arial,Helvetica,sans-serif;
}

/* titulo nutriplan */

#logoTitle{
font-size:48px;
font-weight:900;
text-align:center;
background:linear-gradient(90deg,#38bdf8,#60a5fa,#38bdf8);
-webkit-background-clip:text;
color:transparent;
text-shadow:0 0 25px rgba(56,189,248,.6);
margin-bottom:30px;
}

/* tarjetas recetas */

.card{
backdrop-filter:blur(20px);
background:rgba(15,23,42,.8);
border:1px solid rgba(56,189,248,.3);
border-radius:16px;
transition:all .3s;
}

.card:hover{
transform:scale(1.03);
box-shadow:0 0 20px rgba(56,189,248,.4);
}

/* imagen recetas pequeñas */

.recipeImg{
width:100%;
height:120px;
object-fit:cover;
border-radius:10px;
}

/* imagen grande dentro receta */

#recipeImage{
width:260px;
max-height:200px;
object-fit:cover;
border-radius:12px;
display:block;
margin:auto;
}

/* botones */

button{
background:linear-gradient(120deg,#38bdf8,#0ea5e9);
border:none;
border-radius:10px;
padding:8px 14px;
color:white;
cursor:pointer;
transition:.3s;
}

button:hover{
box-shadow:0 0 10px #38bdf8;
transform:scale(1.05);
}

/* menu tres puntos */

.optionsMenu{
background:#020617;
border:1px solid #38bdf8;
border-radius:10px;
}

/* dashboard */

#nutritionDashboard{
margin-top:30px;
padding:20px;
background:rgba(2,6,23,.8);
border-radius:14px;
border:1px solid rgba(56,189,248,.4);
}

/* plan semanal */

#weeklyPlan{
margin-top:30px;
padding:20px;
border-radius:14px;
background:rgba(2,6,23,.8);
border:1px solid rgba(56,189,248,.4);
}

/* estadisticas */

#monthlyStats{
margin-top:30px;
padding:20px;
background:rgba(2,6,23,.8);
border-radius:14px;
border:1px solid rgba(56,189,248,.4);
}

`

document.head.appendChild(style)

}



/* =========================================================
IA PLAN ALIMENTICIO AVANZADO
========================================================= */

function generateAdvancedDiet(){

let peso=document.getElementById("peso")?.value||70
let altura=document.getElementById("altura")?.value||170
let edad=document.getElementById("edad")?.value||25

let calorias=(10*peso)+(6.25*altura)-(5*edad)+5

let desayuno=recipes[Math.floor(Math.random()*recipes.length)]
let comida=recipes[Math.floor(Math.random()*recipes.length)]
let cena=recipes[Math.floor(Math.random()*recipes.length)]

return{

calorias:Math.round(calorias),

plan:[
{hora:"08:00",receta:desayuno.name},
{hora:"14:00",receta:comida.name},
{hora:"20:00",receta:cena.name}

]

}

}



/* =========================================================
MOSTRAR PLAN INTELIGENTE
========================================================= */

function showAdvancedPlan(){

let data=generateAdvancedDiet()

let div=document.createElement("div")

div.id="smartDiet"

let html=`<h2>Plan alimenticio inteligente IA</h2>`

html+=`<p>Calorías recomendadas: ${data.calorias}</p>`

data.plan.forEach(p=>{

html+=`<p>${p.hora} - ${p.receta}</p>`

})

div.innerHTML=html

document.getElementById("app").appendChild(div)

}



/* =========================================================
GRAFICAS ANIMADAS
========================================================= */

function drawAnimatedChart(){

let canvas=document.createElement("canvas")

canvas.width=350
canvas.height=200

canvas.id="animatedChart"

document.getElementById("nutritionDashboard").appendChild(canvas)

let ctx=canvas.getContext("2d")

let value=0

let target=2000

let interval=setInterval(()=>{

ctx.clearRect(0,0,350,200)

ctx.fillStyle="#38bdf8"

ctx.fillRect(50,200-value/10,80,value/10)

ctx.fillStyle="white"

ctx.fillText("Calorías",60,190)

value+=50

if(value>=target){

clearInterval(interval)

}

},30)

}



/* =========================================================
ANIMACION TARJETAS RECETA
========================================================= */

function animateRecipeCards(){

let cards=document.querySelectorAll(".card")

cards.forEach((c,i)=>{

c.style.opacity="0"

setTimeout(()=>{

c.style.transition="all .6s"

c.style.opacity="1"

c.style.transform="translateY(0px)"

},i*120)

})

}



/* =========================================================
IA DETECTOR DE ALIMENTOS (SIMULADO)
========================================================= */

function foodRecognitionAI(){

let input=document.createElement("input")

input.type="file"

input.onchange=function(){

alert("IA detectó posible alimento saludable")

}

input.click()

}



/* =========================================================
EXPORTAR PLAN
========================================================= */

function exportWeeklyPlan(){

let text=document.getElementById("weeklyPlan")?.innerText||"Plan nutricional"

let w=window.open()

w.document.write("<pre>"+text+"</pre>")

w.print()

}



/* =========================================================
INICIALIZACION FINAL
========================================================= */

setTimeout(()=>{

applyAdvancedStyles()

animateRecipeCards()

drawAnimatedChart()

showAdvancedPlan()

},1200)
/* ======================================================
MEJORAR TAMAÑO CAMPOS PERFIL (peso, altura, edad)
====================================================== */

function improveProfileInputs(){

let inputs=["peso","altura","edad"]

inputs.forEach(id=>{

let el=document.getElementById(id)

if(el){

el.style.width="90px"
el.style.padding="6px"
el.style.borderRadius="8px"
el.style.textAlign="center"
el.style.margin="4px"

}

})

}

setTimeout(improveProfileInputs,800)



/* ======================================================
CALCULO IMC MEJORADO
====================================================== */

function calculateAdvancedBMI(){

let peso=parseFloat(document.getElementById("peso")?.value)
let altura=parseFloat(document.getElementById("altura")?.value)

if(!peso || !altura)return

altura=altura/100

let imc=peso/(altura*altura)

let estado="Normal"

if(imc<18.5)estado="Bajo peso"
if(imc>=25)estado="Sobrepeso"
if(imc>=30)estado="Obesidad"

let div=document.createElement("div")

div.innerHTML=`

<p><b>IMC:</b> ${imc.toFixed(1)}</p>
<p><b>Estado:</b> ${estado}</p>

`

document.getElementById("nutritionDashboard")?.appendChild(div)

}



/* ======================================================
GENERAR 200 RECETAS AUTOMATICAS
====================================================== */

function generateRecipeDatabase(){

let foods=[

"avena","huevo","pollo","arroz","salmon","quinoa","yogurt",
"fresa","platano","manzana","espinaca","pasta","queso",
"atún","frijoles","lentejas","pan integral","leche","granola"

]

let types=["Desayuno","Colacion","Comida","Colacion","Cena"]

let db=[]

for(let i=0;i<200;i++){

let food=foods[Math.floor(Math.random()*foods.length)]

let type=types[Math.floor(Math.random()*types.length)]

db.push({

name:type+" saludable "+(i+1),
type:type,
calories:Math.floor(Math.random()*400)+150,
food:food

})

}

return db

}

let recipeDB=generateRecipeDatabase()



/* ======================================================
GENERAR CALENDARIO NUTRICIONAL
====================================================== */

function createNutritionCalendar(){

let container=document.createElement("div")

container.id="nutritionCalendar"

let days=[

"Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"

]

let meals=["Desayuno","Colación","Comida","Colación 2","Cena"]

let html=`<h2>Calendario Nutricional</h2>`

html+=`<table border="1" style="width:100%;text-align:center;border-collapse:collapse">`

html+="<tr><th>Día</th>"

meals.forEach(m=>{

html+=`<th>${m}</th>`

})

html+="</tr>"



days.forEach(day=>{

html+=`<tr>`

html+=`<td><b>${day}</b></td>`

meals.forEach(meal=>{

let r=recipeDB[Math.floor(Math.random()*recipeDB.length)]

html+=`

<td contenteditable="true">

${r.name}

</td>

`

})

html+=`</tr>`

})



html+="</table>"

container.innerHTML=html

document.getElementById("app").appendChild(container)

}



/* ======================================================
INTERACCION CALENDARIO
====================================================== */

function enableCalendarInteraction(){

let cells=document.querySelectorAll("#nutritionCalendar td")

cells.forEach(c=>{

c.addEventListener("click",function(){

this.style.background="#0ea5e9"

})

})

}



/* ======================================================
IA PARA SUGERIR RECETA EN CELDA
====================================================== */

function suggestRecipe(cell){

let r=recipeDB[Math.floor(Math.random()*recipeDB.length)]

cell.innerText=r.name

}



/* ======================================================
BOTON GENERAR NUEVO PLAN
====================================================== */

function addCalendarControls(){

let btn=document.createElement("button")

btn.innerText="Generar nuevo calendario"

btn.onclick=function(){

document.getElementById("nutritionCalendar").remove()

createNutritionCalendar()

enableCalendarInteraction()

}

document.getElementById("app").appendChild(btn)

}



/* ======================================================
INICIALIZAR CALENDARIO
====================================================== */

setTimeout(()=>{

createNutritionCalendar()

enableCalendarInteraction()

addCalendarControls()

calculateAdvancedBMI()

},1600)
