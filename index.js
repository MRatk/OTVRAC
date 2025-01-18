const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { auth, requiresAuth} = require('express-openid-connect');
const fs = require('fs');
const session = require('express-session');


const app = express();
const PORT = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'OTVRAC',
    password: 'bazepodataka',
    port: 5432,
});

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'Jp1U8x1mlsXszyLfoFKfud9DZdbaBRGERQNT8w4D4_3Rf7HWxno1bWy40FWKiAWF',
    baseURL: 'http://localhost:3000',
    clientID: '65jkuMattnN9oPcZmX355YvPkOfVMXXD',
    issuerBaseURL: 'https://dev-1toh3papmv4d6yrs.us.auth0.com'
};

app.use(session({
    secret: 'c37b6e07e572cebb5919849d7e227d42d6f240e1da2fdb4812cc8f3b99f8f872\n',
    resave: false,
    saveUninitialized: true,
}));

app.use(auth(config));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use('/style', express.static(path.join(__dirname, 'style')));


app.get('/', (req, res) => {
    try{
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
    }catch(error){
        return res.status(500).json({
            status:false,
            message:"Server side error"
        });
    }
});


app.get('/login', (req, res) => {
    if(!req.oidc.isAuthenticated()){
        res.oidc.login({
            prompt:'none'
        });
    }
});

app.get('/logout', (req, res)=>{
    res.oidc.logout();
})

app.get('/profilPage', requiresAuth(), (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'profil.html'));
})

app.get('/api/users', (req, res) =>{
    if(req.oidc.isAuthenticated()){
        const user = req.oidc.user;
        //console.log(user);
        const jsonLD = {
            "@context": "https://schema.org/",
            "@type": "Person",
            "givenName": user.nickname,
            "email": user.email,
            "performerIn": {
                "@type": "Event",
                "endDate": user.updated_at
            }

        };
        return res.json({
            logged: true,
            jsonLD: jsonLD

        })
    }else{
        return res.json({logged: false})
    }
});

app.put('/refresh', requiresAuth(), async (req, res) => {
    try {

        const response = await pool.query(`
            SELECT m.ime_modela, m.tvrtka, m.godina_proizvodnje,
                   v.naziv_verzije, v.cijena, v.operacijski_sustav,
                   v.ram, v.tezina_gram, v.kamera_mp,
                   v.visina_inch, v.baterija_mah
            FROM mobiteli m
                     JOIN verzije v ON m.ime_modela = v.ime_modela;
        `);

        const jsonData = response.rows
        const groupedData = {};


        jsonData.forEach(row => {
            if (!groupedData[row.ime_modela]) {
                groupedData[row.ime_modela] = {
                    model: row.ime_modela,
                    tvrtka: row.tvrtka,
                    godina_proizvodnje: row.godina_proizvodnje,
                    verzije: []
                };
            }

            groupedData[row.ime_modela].verzije.push({
                naziv_verzije: row.naziv_verzije,
                cijena: row.cijena,
                operacijski_sustav: row.operacijski_sustav,
                RAM: row.ram,
                tezina_gram: row.tezina_gram,
                kamera_mp: row.kamera_mp,
                visina_inch: parseFloat(row.visina_inch),
                baterija_mah: row.baterija_mah
            });
        });

        const finalJsonData = Object.values(groupedData);


        const jsonFilePath = path.join(__dirname, 'mobiteli.json');
        const csvFilePath = path.join(__dirname, 'mobiteli.csv');

        if (fs.existsSync(jsonFilePath)) {
            fs.unlinkSync(jsonFilePath);
        }
        if (fs.existsSync(csvFilePath)) {
            fs.unlinkSync(csvFilePath);
        }

        fs.writeFileSync(jsonFilePath, JSON.stringify(finalJsonData, null, 2));

        let csvData = 'ime_modela,tvrtka,godina_proizvodnje,naziv_verzije,cijena,operacijski_sustav,ram,tezina_gram,kamera_mp,visina_inch,baterija_mah\n';
        response.rows.forEach(row => {
            csvData += `${row.ime_modela},${row.tvrtka},${row.godina_proizvodnje},${row.naziv_verzije},${row.cijena},${row.operacijski_sustav},${row.ram},${row.tezina_gram},${row.kamera_mp},${row.visina_inch},${row.baterija_mah}\n`;
        });

        fs.writeFileSync(csvFilePath, csvData);

        res.status(200).json({
            status: true,
            message: 'Preslike uspješno osvježene.',
            files: {
                json: '/mobiteli.json',
                csv: '/mobiteli.csv'
            }
        });
    } catch (error) {
        console.error('Greška prilikom osvježavanja preslika:', error);
        res.status(500).json({
            status: false,
            message: 'Greška prilikom osvježavanja preslika.'
        });
    }
});


app.get('/mobiteli.json', (req, res) => {
    try{
        res.setHeader('Content-Disposition', 'attachment; filename="mobiteli.json"');
        res.sendFile(path.join(__dirname, 'mobiteli.json'));
    }catch(error){
        return res.status(500).json({
            status:false,
            message:"Server side error"
        });

    }
});

app.get('/mobiteli.csv', (req, res) => {
    try{
        res.setHeader('Content-Disposition', 'attachment; filename="mobiteli.csv"');
        res.sendFile(path.join(__dirname, 'mobiteli.csv'));
    }catch(error){
        return res.status(500).json({
            status:false,
            message:"Server side error"
        });
    }

});

app.get('/openapi.json', (req, res) => {
    try{
        res.setHeader('Content-Disposition', 'attachment; filename="openapi.json"');
        res.sendFile(path.join(__dirname, 'openapi.json'));
    }catch(error){
        return res.status(500).json({
            status:false,
            message:"Server side error"
        });

    }
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

        const jsonLDArray = response.rows.map(row =>({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": row.ime_modela,
            "brand": {
                "@type": "Brand",
                "name": row.tvrtka
            },
            "model": row.naziv_verzije,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "HRK",
                "price": row.cijena
            },
            "description": `Model: ${row.ime_modela} - Verzija: ${row.naziv_verzije}`,
            "weight": {
                "@type": "QuantitativeValue",
                    "unitText": "g",
                    "value": row.tezina_gram
            },
            "height": {
                "@type": "QuantitativeValue",
                "unitText": "inches",
                "value": row.visina_inch
            },
            "additionalProperty":[
                {
                    "@type": "PropertyValue",
                    "name": "operatingSystem",
                    "value": row.operacijski_sustav
                },
                {
                    "@type": "PropertyValue",
                    "name": "RAM",
                    "value": row.ram
                },
                {
                    "@type": "PropertyValue",
                    "name": "camera",
                    "value": row.kamera_mp
                },
                {
                    "@type": "PropertyValue",
                    "name": "battery",
                    "value": row.baterija_mah
                },
                {
                    "@type": "PropertyValue",
                    "name": "publishingYear",
                    "value": row.godina_proizvodnje
                }
            ]
        }));
        return res.status(200).json({
            status:true,
            database:jsonLDArray
        });
    }catch (error){
        return res.status(500).json({
            status:false,
            message:"Server side error"
        });
    }
})

app.get('/db/:ime_modela/version_name/:naziv_verzije', async (req, res) => {
    const {ime_modela, naziv_verzije} = req.params;
    try {
        const response = await pool.query(`
            SELECT m.ime_modela,
                   m.tvrtka,
                   m.godina_proizvodnje,
                   v.naziv_verzije,
                   v.cijena,
                   v.operacijski_sustav,
                   v.ram,
                   v.tezina_gram,
                   v.kamera_mp,
                   v.visina_inch,
                   v.baterija_mah
            FROM mobiteli m
                     JOIN verzije v ON m.ime_modela = v.ime_modela
            WHERE m.ime_modela = $1 AND v.naziv_verzije = $2;
        `, [ime_modela, naziv_verzije]);

        if(response.rows.length === 0){
            return res.status(404).json({
                status: false,
                message: `phone ${ime_modela} ${naziv_verzije} not found`
            })
        }
        const data = response.rows[0];
        const jsonLD = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": data.ime_modela,
            "brand": {
                "@type": "Brand",
                "name": data.tvrtka
            },
            "model": data.naziv_verzije,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "HRK",
                "price": data.cijena
            },
            "description": `Model: ${data.ime_modela} - Verzija: ${data.naziv_verzije}`,
            "weight": {
                "@type": "QuantitativeValue",
                "unitText": "g",
                "value": data.tezina_gram
            },
            "height": {
                "@type": "QuantitativeValue",
                "unitText": "inches",
                "value": data.visina_inch
            },
            "additionalProperty":[
                {
                    "@type": "PropertyValue",
                    "name": "operatingSystem",
                    "value": data.operacijski_sustav
                },
                {
                    "@type": "PropertyValue",
                    "name": "RAM",
                    "value": data.ram
                },
                {
                    "@type": "PropertyValue",
                    "name": "camera",
                    "value": data.kamera_mp
                },
                {
                    "@type": "PropertyValue",
                    "name": "battery",
                    "value": data.baterija_mah
                },
                {
                    "@type": "PropertyValue",
                    "name": "publishingYear",
                    "value": data.godina_proizvodnje
                }
            ]
        };
        //console.log(response);
        res.json({
            status: true,
            jsonLD: jsonLD
        });
    } catch (error) {
        return res.status(500).json({
            status:false,
            message: `Server side error`
        });
    }
})

app.post('/add_data', async (req, res) => {
    const {
        ime_modela,
        tvrtka,
        godina_proizvodnje,
        naziv_verzije,
        cijena,
        operacijski_sustav,
        ram,
        tezina_gram,
        kamera_mp,
        visina_inch,
        baterija_mah
    } = req.body

    if (!ime_modela ||
        !tvrtka ||
        !godina_proizvodnje ||
        !naziv_verzije ||
        !cijena ||
        !operacijski_sustav ||
        !ram ||
        !tezina_gram ||
        !kamera_mp ||
        !visina_inch ||
        !baterija_mah) {
        return res.status(400).json({
            status: false,
            message: "Every parameter is required"
        })
    }

    try {
        const checkPhone = await pool.query('SELECT * FROM mobiteli WHERE ime_modela = $1', [ime_modela]);

        if(checkPhone.rows.length === 0){
            const q1 = await pool.query('INSERT INTO mobiteli (ime_modela, tvrtka, godina_proizvodnje) VALUES ($1, $2, $3)', [ime_modela, tvrtka, godina_proizvodnje])
            if(q1){
                const checkVersion = await pool.query('SELECT * FROM verzije WHERE ime_modela = $1 AND naziv_verzije = $2', [ime_modela, naziv_verzije]);
                if(checkVersion.rows.length === 0){
                    const q2 = await pool.query('INSERT INTO verzije (ime_modela, naziv_verzije, cijena, operacijski_sustav, ram, tezina_gram, kamera_mp, visina_inch, baterija_mah) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [ime_modela, naziv_verzije, cijena, operacijski_sustav, ram, tezina_gram, kamera_mp, visina_inch, baterija_mah])
                    if(q1 && q2){
                        return res.status(200).json({
                            status: true,
                            message: "Data added successfully"
                        })
                    }else{
                        return res.status(401).json({
                            status: false,
                            message:"Addition of data unsuccessful"
                        })
                    }
                }else {
                    return res.status(401).json({
                        status: false,
                        message:"Addition of data unsuccessful"
                    })
                }
            }
        }

        const checkVersion = await pool.query('SELECT * FROM verzije WHERE ime_modela = $1 AND naziv_verzije = $2', [ime_modela, naziv_verzije]);
        if(checkVersion.rows.length === 0){
            const q2 = await pool.query('INSERT INTO verzije (ime_modela, naziv_verzije, cijena, operacijski_sustav, ram, tezina_gram, kamera_mp, visina_inch, baterija_mah) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [ime_modela, naziv_verzije, cijena, operacijski_sustav, ram, tezina_gram, kamera_mp, visina_inch, baterija_mah])
            if(q2){
                return res.status(200).json({
                    status: true,
                    message: "Data added successfully"
                })
            }else{
                return res.status(401).json({
                    status: false,
                    message:"Addition of data unsuccessful"
                })
            }
        }else {
            return res.status(401).json({
                status: false,
                message:"Addition of data unsuccessful"
            })
        }
    }catch (error){
        return res.status(500).json({
            status: false,
            message: error
        })
    }
})

app.delete('/delete/:ime_modela', async (req, res) => {
    const {ime_modela} = req.params;
    if (!ime_modela) {
        return res.status(400).json({
            status: false,
            message: "Name of model is required"
        })
    }
    try{
        const q1 = await pool.query('DELETE FROM mobiteli WHERE ime_modela = $1', [ime_modela])
        const q2 = await pool.query('DELETE FROM verzije WHERE ime_modela = $1', [ime_modela])
        if(q1 && q2){
            return res.status(200).json({
                status: true,
                message:"Data deleted successfully"
            })
        }else {
            return res.status(404).json({
                status: false,
                message:"Data deletion failed"
            })
        }
    }catch(error){
        return res.status(500).json({
            status: false,
            message:"Server side error"
        })
    }

})

app.put('/update/:ime_modela/version_name/:naziv_verzije', async (req, res) => {
    const {ime_modela, naziv_verzije} = req.params;

    const {
        tvrtka,
        godina_proizvodnje,
        cijena,
        operacijski_sustav,
        ram,
        tezina_gram,
        kamera_mp,
        visina_inch,
        baterija_mah
    } = req.body

    try {
        const old_q1 = await pool.query('SELECT * FROM mobiteli WHERE ime_modela = $1', [ime_modela])
        const old_q2 = await pool.query('SELECT * FROM verzije WHERE ime_modela = $1 AND naziv_verzije = $2', [ime_modela, naziv_verzije])
        if(old_q1.rows.length === 0 || old_q2.rows.length === 0){
            return res.status(404).json({
                status:false,
                message: "Error with fetching phone model"
            })
        }
        const old_q1_data = old_q1.rows[0]
        const old_q2_data = old_q2.rows[0]

        const tvrtka_new = tvrtka || old_q1_data.tvrtka
        const godina_proizvodnje_new = godina_proizvodnje || old_q1_data.godina_proizvodnje
        const cijena_new = cijena || old_q2_data.cijena
        const operacijski_sustav_new = operacijski_sustav || old_q2_data.operacijski_sustav
        const ram_new = ram || old_q2_data.ram
        const tezina_gram_new = tezina_gram || old_q2_data.tezina_gram
        const kamera_mp_new = kamera_mp || old_q2_data.kamera_mp
        const visina_inch_new = visina_inch || old_q2_data.visina_inch
        const baterija_mah_new = baterija_mah || old_q2_data.baterija_mah

        const q1 = await pool.query('UPDATE mobiteli SET tvrtka = $1, godina_proizvodnje = $2 WHERE ime_modela = $3', [tvrtka_new, godina_proizvodnje_new, ime_modela])
        const q2 = await pool.query('UPDATE verzije SET cijena = $1, operacijski_sustav = $2, ram = $3, tezina_gram = $4, kamera_mp = $5, visina_inch = $6, baterija_mah = $7 WHERE ime_modela = $8 AND naziv_verzije = $9', [cijena_new, operacijski_sustav_new, ram_new, tezina_gram_new, kamera_mp_new, visina_inch_new, baterija_mah_new, ime_modela, naziv_verzije])

        if(q1.rowCount === 0 || q2.rowCount === 0){
            return res.status(401).json({
                status:false,
                message:"Data update unsuccessful"
            })
        }else {
            return res.status(200).json({
                status:true,
                message:"Data update successful"
            })
        }
    }catch (error){
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "errori"
        })
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
