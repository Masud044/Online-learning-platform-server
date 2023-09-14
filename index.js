const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;


// middle ware
const cors = require('cors');
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DbUser}:${process.env.DbPassword}@cluster0.igjj82v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const onlineCollection = client.db('OnlineLearning').collection('course');
    const myCourseCollection = client.db('OnlineLearning').collection('MyCourse'); const userCollection = client.db('OnlineLearning').collection('User');



    app.post('/courses', async (req, res) => {
      const item = req.body;

      const result = await onlineCollection.insertOne(item);
      res.send(result);
    })

    app.post('/mycourse', async (req, res) => {
      const item = req.body;
      const result = await myCourseCollection.insertOne(item);

      res.send(result);
    })

    app.post('/user', async (req, res) => {
      const item = req.body;
      const result = await userCollection.insertOne(item);

      res.send(result);
    })

    app.get('/user',async(req,res)=>{
         const item = req.body;
         const result = await userCollection.find(item).toArray();
         res.send(result);
    })

    app.patch('/user/:id',async(req,res)=>{
       const id = req.params.id;
       const filter = {_id: new ObjectId(id)};
       const updateDoc = {
      $set: {
          role:'admin'
      },
    }
      const result = await userCollection.updateOne(filter,updateDoc);
      res.send(result);
     
    
    })
       

    
    app.get('/courses', async (req, res) => {
      const item = req.body;


      const result = await onlineCollection.find(item).toArray();
      res.send(result);
    })
    app.get('/courses/:text', async (req, res) => {
      const text = req.params.text;
      const query = { category: text };


      const result = await onlineCollection.find(query).toArray();

      res.send(result);




    })

    app.get('/details/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) }
      const result = await onlineCollection.findOne(qurey);
      res.send(result);
    })


    app.get('/mycourse', async (req, res) => {
      const email = req.query.email;
      const sort = req.query.sort;
      const options = {

        sort: { "courseFee": sort == 'asc' ? 1 : -1 },

      };

      if (!email) {
        res.send([]);
      }
      const query = { email: email }

      const result = await myCourseCollection.find(query, options).toArray();
      res.send(result);
    })

    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await myCourseCollection.deleteOne(filter);
      res.send(result);
    })












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('Online learning coming')
})

app.listen(port, () => {
  console.log(`port is running ${port}`);
})
