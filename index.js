const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const { Pool } = require('pg');


const app = express();
const PORT = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'OTVRAC',
    password: 'bazepodataka',
    port: 5432,
});


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use('/style', express.static(path.join(__dirname, 'style')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/mobiteli.json', (req, res) => {
    res.setHeader('Content-Disposition', 'attachment; filename="mobiteli.json"');
    res.sendFile(path.join(__dirname, 'mobiteli.json'));
});

app.get('/mobiteli.csv', (req, res) => {
    res.setHeader('Content-Disposition', 'attachment; filename="mobiteli.csv"');
    res.sendFile(path.join(__dirname, 'mobiteli.csv'));
});

app.get('/db', async (req, res) =>{
    try{
        const response = await pool.query(`
    SELECT m.ime_modela, m.tvrtka, m.godina_proizvodnje, 
           v.naziv_verzije, v.cijena, v.operacijski_sustav,
           v.ram, v.tezina_gram, v.kamera_mp, 
           v.visina_inch, v.baterija_mah
    FROM mobiteli m
    JOIN verzije v ON m.ime_modela = v.ime_modela;
  `);
        //console.log(response);
        res.json(response.rows);
    }catch (error){
        res.status(500).send('Server error');
    }
})

app.get('/favicon.ico', (req, res) => res.status(204).end());

// app.get('/scripts/home_script.js', (req, res) => {
//     console.log('Request for home_script.js received');
//     res.sendFile(path.join(__dirname, 'scripts', 'home_script.js'));
// });

try {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Error starting server:', error);
}
