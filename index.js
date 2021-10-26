const express = require('express'); // step 1
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express(); // step 2
const port = 5000; // step 3

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dn7ou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected database ');
 
        // create database name
        const database = client.db('carMechanic');
        // create database collection name
        const servicesCollection = database.collection('services')

        // GET API
        app.get('/services', async (req, res) => {
            // load all docs
            const cursor = servicesCollection.find({});
            // get them in an array
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting id', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            // res.send('post hitted')
            /* // create doc
            const service = {
                "name": "ENGINE DIAGNOSTIC",
                "price": "300",
                "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
                "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            } */
            // insert doc and show result
            const result = await servicesCollection.insertOne(service);
            res.json(result)
            // console.log(result) 
        });

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running the app')
}); // step 4

app.listen(port, () => {
    console.log('Running the app on port', port);
}); // step 5