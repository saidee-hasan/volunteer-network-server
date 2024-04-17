const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
const { ObjectId } = require("mongodb");

require("dotenv").config();
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@volunteer.71crcs5.mongodb.net/?retryWrites=true&w=majority&appName=volunteer`;
const client = new MongoClient(uri);

async function run() {
  try {
    const productCollection = client.db("user").collection("data");
    const registerCollection = client.db("register").collection("daa");
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      console.log(product);
      await productCollection.insertMany(product).then((result) => {
        console.log(result.insertedCount);
      });
    });
    app.get("/products", async (req, res) => {
      const data = productCollection.find({ name: { $regex: "babySit" } });
      const documents = await data.toArray();
      res.send(documents);
    });
    app.post("/addData", async (req, res) => {
      const products = req.body;
      console.log(products);
      await registerCollection.insertOne(products).then((result) => {
        console.log(result.insertedCount);
      });
    });

    app.get("/register", async (req, res) => {
      const data = registerCollection.find({});
      const documents = await data.toArray();
      res.send(documents);
    });
    app.get("/fiendemail", async (req, res) => {
      console.log(req.query.email);
      const data = registerCollection.find({ email: req.query.email });
      const documents = await data.toArray();
      res.send(documents);
    });

    app.delete("/delete/:id", async (req, res) => {
      console.log(req.params.id);
      registerCollection
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then((result) => {
          console.log(result);
        });
    });
    console.log("db is connected");
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
