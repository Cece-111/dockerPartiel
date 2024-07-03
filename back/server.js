const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Configurer le middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../front')));

// Configurer la base de données
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE data (info TEXT)");
});

// Route pour le front-end
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

// API pour recevoir les données
app.post('/api/data', (req, res) => {
    const inputData = req.body.data;
    db.run("INSERT INTO data (info) VALUES (?)", [inputData], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.json({ message: "Data saved successfully!" });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

