BLOG API PROJECT

app.get("/posts"):app.get("/"):  API fetches all blogs from database and then gives it to server.js which then sends it to index.ejs to render 

app.get("/posts/:id"): app.get("/edit/:id"):To edit a specific blog user clicks on the edit button of the blog which then send the id of the blog in request object to server.js and to index.js(api), api then fetches the specific blog 

app.post("/posts"):app.post("/api/posts"): request object carries title content and author which the user input which is stored by the api to the database and once it is done server.js redirects the user to homepage

app.patch("/posts/:id"):app.post("/api/posts/:id"): To actually edit a blog user clicks on the edit button changes all the information which is sent to api and then to database and once it is done server.js redirects the user to homepage

app.delete("/posts/:id"):app.get("/api/posts/delete/:id"):User presses delete button of a blog which sends the id of that specific blog to api and then api deleted it from database and server.js returns user to homepage


