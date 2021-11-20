const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

let PORT_HOST = "3000";

app.listen(process.env.PORT || PORT_HOST, () => console.log("Server is running on port: " + PORT_HOST));

app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());

let allPosts = JSON.parse(fs.readFileSync("post.json"));


// POST /Image
let imageURL = "";
const myMulter = multer({
    dest: "./public/images"
})

app.post("/imgPost/", myMulter.single("file"), (req, res) => {
    let oldPath = req.file.path;
    let newPath = "./public/images/" + req.file.originalname;
    fs.rename(oldPath, newPath, (err) => {});

    imageURL = req.file.originalname;
    res.send(imageURL)
})


// GET /posts
app.get("/posts", (req, res) => {
    res.send(allPosts);
})

// POST /posts
app.post("/posts", (req, res) => {
    let numOfid = 1
    if (allPosts.length > 0) {
        numOfid += parseInt(allPosts[0].id);
    }
    let new_data = {
        id: numOfid,
        author: req.body.author,
        date: req.body.date,
        description: req.body.description,
        image: imageURL,
        numOfLike: req.body.numOfLike,
        userLike: []
    };
    allPosts.unshift(new_data);
    fs.writeFileSync("post.json", JSON.stringify(allPosts));
    res.send(allPosts);
})

// PUT /posts
app.put("/posts/:id", (req, res) => {
    let id = req.params.id;
    let name = req.body.author;
    let date = req.body.date;
    let description = req.body.description;
    let index = allPosts.findIndex( post => post.id === parseInt(id));

    let post = allPosts[index];
    post.author = name;
    post.date = date;
    post.description = description;
    post.image = req.body.image;
    fs.writeFileSync("post.json", JSON.stringify(allPosts));
    res.send(allPosts);
})

// DELETE /posts
app.delete("/posts/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let index = allPosts.findIndex(post => parseInt(post.id) === id);
    if (index >= 0) {
        allPosts.splice(index, 1);
        fs.writeFileSync("post.json", JSON.stringify(allPosts))
        res.send(allPosts);
    } else {
        res.status(404)
        res.send({error: "User id not found"});
    }

})