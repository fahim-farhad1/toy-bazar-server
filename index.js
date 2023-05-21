const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// middleware

app.use(cors());
app.use(express.json());


// console.log(process.env.DB_PASSWORD);
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lxtlzfc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();

    const toyCollection = client.db('ToyBazar').collection('Toys');

    app.get('/allToys', async(req, res) =>{
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/allToys/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toyCollection.findOne(query);
      res.send(result);
    })


    app.get('/toys', async(req, res) =>{
      let query = {};
      if(req.query.category){
        query = {category: req.query.category};
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    })


    app.get('/mytoy', async(req, res) =>{
      let query = {};
      if(req.query.sellerEmail){
        query = {sellerEmail: req.query.sellerEmail};
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/mytoys', async(req, res) =>{
      const newToy = req.body;
      console.log(newToy);
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
