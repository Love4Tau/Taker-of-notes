const router = require("express").Router();

const fs = require("fs");

const {v4: uuidv4 } = require("uuid");

// const dbPath = "../db/db.json";

// get notes from json file and sends as response
router.get("/api/notes", (req, res) => {
    fs.readFile("db/db.json", "utf8", (err, data) => {
        if(err) {
            console.error(err);
            res.status(500).send("Error")
        } else {
            const dbData = JSON.parse(data);
            res.json(dbData);
        }
    })
})

//Post request to add a new note to json file
router.post("/api/notes", (req, res) => {
    const dbData = JSON.parse(fs.readFileSync("db/db.json", "utf8"));

    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4(),
    }
    dbData.push(newNote);
    fs.writeFileSync("db/db.json", JSON.stringify(dbData));
    res.json(dbData);
})

//Used async file read and write operations to handle JSON data + error handling
router.delete("/api/notes/:id", (req, res) => {
    fs.readFile("db/db.json", "utf8", (err, data) => {
        if(err) {
            res.status(500).send("Error");
            return;
        }

        const dbData = JSON.parse(data);

        const newNotes = dbData.filter((note)=> note.id !== req.params.id);

        fs.writeFile("db/db.json", JSON.stringify(newNotes), (err) => {
            if(err) {
                res.status(500).send("Error");
                return;
            }
            res.json("Deleted Note.");
        });
    });
});

module.exports = router;