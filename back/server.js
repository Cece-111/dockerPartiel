// var
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const dbFile = path.join(__dirname, 'guestbook.db');
const sqlInitFile = path.join(__dirname, 'init_db.sql');

// middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// bdd
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
    const initSql = fs.readFileSync(sqlInitFile, 'utf8');
    db.exec(initSql, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database initialized');
    });
});

// front
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// post data
app.post('/api/data', (req, res) => {
    const inputData = req.body.data;
    db.run("INSERT INTO data (data) VALUES (?)", [inputData], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.json({ message: "Data saved successfully!" });
    });
});

// get data
app.get('/api/data', (req, res) => {
    db.all("SELECT id, data, created_at FROM data", [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

