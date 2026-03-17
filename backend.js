const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "super_secret_key";

/* BASE DE DATOS SIMULADA */
let users = [];
let recipes = [];

/* REGISTER */
app.post("/register", (req,res)=>{
  const {user, pass} = req.body;

  if(!user || !pass) return res.status(400).send("Datos incompletos");

  if(users.find(u=>u.user===user)){
    return res.status(400).send("Usuario ya existe");
  }

  users.push({user, pass});
  res.send("ok");
});

/* LOGIN */
app.post("/login", (req,res)=>{
  const {user, pass} = req.body;

  const found = users.find(u=>u.user===user && u.pass===pass);
  if(!found) return res.status(401).send("Credenciales incorrectas");

  const token = jwt.sign({user}, SECRET, {expiresIn:"2h"});
  res.json({token});
});

/* AUTH */
function auth(req,res,next){
  const token = req.headers.authorization;
  if(!token) return res.sendStatus(403);

  try{
    req.user = jwt.verify(token, SECRET);
    next();
  }catch{
    res.sendStatus(403);
  }
}

/* RECETAS */
app.get("/recipes", auth, (req,res)=>{
  const userRecipes = recipes.filter(r=>r.user===req.user.user);
  res.json(userRecipes);
});

app.post("/recipes", auth, (req,res)=>{
  const {name, img} = req.body;

  const recipe = {
    id: Date.now(),
    user: req.user.user,
    name,
    img: img || "https://source.unsplash.com/300x200/?food"
  };

  recipes.push(recipe);
  res.json(recipe);
});

app.delete("/recipes/:id", auth, (req,res)=>{
  recipes = recipes.filter(r=>r.id != req.params.id);
  res.send("ok");
});

app.listen(3000, ()=> console.log("🚀 API en http://localhost:3000"));
