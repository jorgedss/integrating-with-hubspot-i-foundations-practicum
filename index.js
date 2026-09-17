require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;
const HUBSPOT_ACCOUNT_ID = process.env.HUBSPOT_ACCOUNT_ID;
const HUBSPOT_OBJECT_ID = process.env.HUBSPOT_OBJECT_ID;
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    const petsUrl = `https://api.hubapi.com/crm/v3/objects/${HUBSPOT_OBJECT_ID}?limit=100&properties=pet_name,species,bio`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(petsUrl, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Pets | HubSpot', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Pets data');
    }
});

app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', { title: 'Add a New Pet | HubSpot' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error rendering form');
    }
});

app.post('/update-cobj', async (req, res) => {
    const newPet = {
        properties: {
            pet_name: req.body.pet_name,
            species: req.body.species,
            bio: req.body.bio
        }
    };

    const createUrl = `https://api.hubapi.com/crm/v3/objects/${HUBSPOT_OBJECT_ID}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createUrl, newPet, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating new Pet');
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));