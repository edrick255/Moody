const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET="nutriapp";

/* DATA EN MEMORIA */
let users=[];
let recipes=[];

/* AUTH */
function auth(req,res,next){
  const token=req.headers.authorization;
  if(!token) return res.sendStatus(403);

  try{
    jwt.verify(token,SECRET);
    next();
  }catch{
    res.sendStatus(401);
  }
}

/* REGISTER */
app.post("/register",(req,res)=>{
  users.push(req.body);
  res.sendStatus(200);
});

/* LOGIN */
app.post("/login",(req,res)=>{
  const user=users.find(u=>
    u.user===req.body.user && u.pass===req.body.pass
  );

  if(!user) return res.sendStatus(401);

  const token=jwt.sign({user:user.user},SECRET);
  res.json({token});
});

/* RECETAS */
app.get("/recipes",auth,(req,res)=>{
  res.json(recipes);
});

app.post("/recipes",auth,(req,res)=>{
  const newRecipe={
    id:Date.now(),
    name:req.body.name,
    img:req.body.img || "https://source.unsplash.com/300x200/?food"
  };
  recipes.push(newRecipe);
  res.json(newRecipe);
});

app.delete("/recipes/:id",auth,(req,res)=>{
  recipes=recipes.filter(r=>r.id!=req.params.id);
  res.sendStatus(200);
});

/* START */
app.listen(3000,()=>{
  console.log("API en http://localhost:3000");
});
