const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const PORT = 3000 || process.env.PORT;

const Note = require("./models/Note");

const app = express();

// connect to mongodb using mongoose
mongoose.connect("mongodb://localhost:27017/notesDB", {useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    if (err){
        console.error(err);
    } else {
        console.log("Connected to Database");
    }
});

// enable body-parser to get input from user
app.use(bodyParser.urlencoded({ extended: true }));

// enable use of static files
app.use(express.static("public"));

// set view engine
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    const notes = await Note.find({});
    res.render("index", {notes});
});

// get data from input from on root directory
app.post("/", async (req, res) => {
    await Note.create(req.body);
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const selectedNoteId = req.body.deleteBtn;
    Note.findByIdAndRemove(selectedNoteId, (err) => {
        if (err){
            console.error(err);
        } else {
            console.log("Successfully removed");
        }
    });
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});