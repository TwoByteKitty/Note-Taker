const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public", { extensions: ["html"] }));

//get all notes
app.get("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), function (err, data) {
        const notes = JSON.parse(data);
        res.json(notes);
    });
});
//create new note
app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    fs.readFile(path.join(__dirname, "db/db.json"), function (err, data) {
        const notes = JSON.parse(data);
        let newNoteID;
        if (notes.length === 0) {
            newNoteID = 1;
        } else {
            newNoteID = notes[notes.length - 1].id + 1;
        }
        newNote.id = newNoteID;
        notes.push(newNote);
        fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(notes));
        res.json(newNote);
    });
});
//delete note
app.delete("/api/notes/:id", function (req, res) {
    const noteID = parseInt(req.params.id);
    fs.readFile(path.join(__dirname, "db/db.json"), function (err, data) {
        const notes = JSON.parse(data);
        const indexToDelete = notes.findIndex(x => x.id === noteID);
        if (indexToDelete > -1) {
            notes.splice(indexToDelete, 1);
        }
        fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(notes));
        res.json(notes);
    });
});
//wildcard
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});



app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
