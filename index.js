//CRUD OPERATIONS - API

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import cors from 'cors';
env.config();
const app = express();
const port = 4000;

//DATABASE CONNECTIONS
const db=new pg.Client({
  user:process.env.USER,
  host:process.env.HOST,
  database:process.env.DATABASE,
  password:process.env.PASSWORD,
  port: process.env.PORT,
});
db.connect();
db.query("Create table if not exists POSTS(id SERIAL PRIMARY KEY, title TEXT, content TEXT, author TEXT, date DATE)",(err,res)=>{
  if(err){
    console.log("Error in creating table");
  }
  else{
    console.log("Table created successfully");
  }
});


// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET all posts and display it at blog homepage
app.get("/posts", async (req, res) => {
  try{
    const all= await db.query("select * from posts");
    const posts=all.rows;
    console.log(posts);
    res.json(posts);
  }
  catch(err){
    console.log("Error in fetching Data /posts");
  };
});

// GET a specific blog by id which is further used to edit the specific blog
app.get("/posts/:id", async(req, res) => {
  try{
    let p=parseInt(req.params.id);
    const all= await db.query("select * from posts where id=$1",[p]);
    const post=all.rows;
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  }
  catch(err){
    console.log("Error in fetching Data");
  };
});

// POST a new blog when New Post button is clicked, takes in values(title,content,author) from request object
app.post("/posts", async(req, res) => {
  try{
    let d= new Date();
    const result=await db.query("Insert into posts(title, content, author, date) values($1,$2,$3,$4) RETURNING *",[req.body.title , req.body.content , req.body.author , d]);
    console.log("DB query run");
    const post = result.rows[0];
    res.status(201).json(post);
    console.log("Run");
    }
    catch(err){
      console.log("error")
    }
});

// PATCH a post when you just want to update one parameter, used when edit button of existing blog is clicked
app.patch("/posts/:id", async (req, res) => {
  try{
    let p =req.params.id;
    const all= await db.query("select * from posts where id=$1",[p]);
    const post=all.rows;
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;
    if (req.body.author) post.author = req.body.author;
    await db.query("UPDATE posts SET title = $1, content = $2, author = $3 WHERE id = $4 RETURNING *",[req.body.title , req.body.content , req.body.author ,p])
    res.json(post);
    }
  catch(err){
    console.log("Error in fetching Data");
    };
});

// DELETE a specific post by providing the post id
app.delete("/posts/:id", async (req, res) => {
  try {
    let postId = parseInt(req.params.id);
    const result = await db.query("DELETE FROM posts WHERE id = $1 RETURNING *", [postId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Post Deleted:", result.rows[0]);
    res.status(204).send(); // Send a success response with status 204 (No Content)
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Error deleting post" });
  }
});


app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
