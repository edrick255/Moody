/* =========================
LOGIN
========================= */

document.getElementById("loginBtn").onclick=function(){

let u=document.getElementById("username").value
let p=document.getElementById("password").value

if(u!=="" && p!==""){

document.getElementById("loginScreen").style.display="none"
document.getElementById("app").style.display="block"

loadRecipes()

}else{

alert("Ingresa usuario y contraseña")

}

}



/* =========================
GUARDAR Y CARGAR RECETAS
========================= */

function saveRecipes(){

localStorage.setItem("nutriplan_recipes",JSON.stringify(recipes))

}

function loadSavedRecipes(){

let data=localStorage.getItem("nutriplan_recipes")

if(data){

recipes=JSON.parse(data)

}

}



/* =========================
IA ESTIMADOR NUTRICIONAL
========================= */

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



/* =========================
BASE RECETAS
========================= */

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
},

{
name:"Ensalada mediterránea",
image:"https://images.pexels.com/photos/5938/food-salad-healthy-lunch.jpg",
ingredients:[
["Tomate",100,20],
["Pepino",80,10],
["Queso feta",50,120]
]
},

{
name:"Pasta saludable",
image:"https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
ingredients:[
["Pasta",150,220],
["Salsa tomate",80,40],
["Queso",30,100]
]
},

{
name:"Batido energético",
image:"https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg",
ingredients:[
["Plátano",120,100],
["Leche",200,120],
["Avena",60,90]
]
}

]

let currentRecipe=null

loadSavedRecipes()



/* =========================
CARGAR TARJETAS
========================= */

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

<img src="${r.image}">

<h3 onclick="openRecipe(${i})">${r.name}</h3>

`

container.appendChild(card)

})

}



/* =========================
MENU
========================= */

function toggleMenu(i){

let m=document.getElementById("menu"+i)

m.style.display=m.style.display==="block"?"none":"block"

}



/* =========================
EDITAR RECETA
========================= */

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



/* =========================
ABRIR RECETA
========================= */

function openRecipe(i){

currentRecipe=i

let r=recipes[i]

document.getElementById("recipeModal").style.display="flex"

document.getElementById("recipeTitle").innerText=r.name
document.getElementById("recipeImage").src=r.image

let ingDiv=document.getElementById("ingredients")
ingDiv.innerHTML=""

r.ingredients.forEach((ing,index)=>{

let d=document.createElement("div")

d.innerHTML=`

${ing[0]} - ${ing[1]}g - ${ing[2]} cal

<button onclick="editIngredientName(${index})">✏</button>
<button onclick="editIngredientAmount(${index})">⚖</button>
<button onclick="deleteIngredient(${index})">❌</button>

`

ingDiv.appendChild(d)

})

let addBtn=document.createElement("button")

addBtn.innerText="Agregar ingrediente"

addBtn.onclick=addIngredient

ingDiv.appendChild(addBtn)

drawChart()

}



/* =========================
CERRAR MODAL
========================= */

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



/* =========================
INGREDIENTES
========================= */

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



/* =========================
GRAFICA ANIMADA
========================= */

function drawChart(){

let canvas=document.getElementById("chart")
let ctx=canvas.getContext("2d")

ctx.clearRect(0,0,700,300)

let ing=recipes[currentRecipe].ingredients

ing.forEach((i,index)=>{

let height=i[2]

let current=0

let interval=setInterval(function(){

ctx.fillStyle="#38bdf8"

ctx.fillRect(100+index*140,260-current,100,current)

current+=5

if(current>=height){

clearInterval(interval)

}

},10)

})

}



/* =========================
BUSCADOR
========================= */

document.getElementById("search").oninput=function(){

let text=this.value.toLowerCase()

let cards=document.querySelectorAll(".card")

cards.forEach(c=>{

let title=c.innerText.toLowerCase()

c.style.display=title.includes(text)?"block":"none"

})

}
