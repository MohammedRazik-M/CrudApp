const express = require("express");
const cors = require("cors");
const users = require("./sample.json");
const fs = require("fs"); //File System Package

const app = express();
app.use(express.json()); //To handle json response from client to server
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"]
}));

const port = 8000;

//Display all Users
app.get("/users", (req, res) => {
    return res.json(users);  //It is visible in Postman on visiting the corresponding link.
});

//Delete User
app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => user.id !== id);
    fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err, data) => {
        return res.json(filteredUsers);
    });
});

//Add New User
app.post("/users", (req, res) => {
    let { name, age, city} = req.body;
    if(!name || !age || !city) {
        res.status(400).send({"message": "All fields required!"});
    }
    let id = Date.now();
    users.push({ id, name, age, city });
    fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
        return res.json({"message": "User detail added successfully!"});
    });
});

//Update User Details
app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city} = req.body;
    if(!name || !age || !city) {
        res.status(400).send({"message": "All fields required!"});
    }
    let index = users.findIndex((user => user.id === id));
    users.splice(index, 1, {...req.body});
    fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
        return res.json({"message": "User detail updated successfully!"});
    });
});

app.listen(port, (err) => {
    console.log(`App is listening at ${port}`);
});
