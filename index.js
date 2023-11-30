const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tryvron.mongodb.net/?retryWrites=true&w=majority`;
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
    // await client.connect();

    // jwt token api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.SECRET_TOKEN, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      // res.send({ token });
      res.send({ success: true });
    });

    app.post("/login", async (req, res) => {
      const user = req.body;
      res.clearCookie("token", { maxAge: 0 }).send({ success: true });
    });
    // brand Api

    const brandCollection = client.db("TrendyBrand").collection("brandList");
    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/brand", async (req, res) => {
      const newBrand = req.body;
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    });

    // Women cloth collection
    const womenClothCollect = client.db("TrendyBrand").collection("womenCloth");

    app.get("/womenCloth", async (req, res) => {
      const cursor = womenClothCollect.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/womenCloth", async (req, res) => {
      const newCoth = req.body;
      const result = await womenClothCollect.insertOne(newCoth);
      res.send(result);
    });

    // Kid cloth collection
    const kidClothCollect = client.db("TrendyBrand").collection("kidCloth");

    app.get("/kidCloth", async (req, res) => {
      const cursor = kidClothCollect.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/kidCloth", async (req, res) => {
      const newCoth = req.body;
      const result = await kidClothCollect.insertOne(newCoth);
      res.send(result);
    });

    // User cart data collection
    const userCartCollection = client
      .db("TrendyBrand")
      .collection("userCartData");

    app.get("/userCartData", async (req, res) => {
      const cursor = userCartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/userCartData", async (req, res) => {
      const user = req.body;
      const result = await userCartCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/userCartData/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await userCartCollection.deleteOne(query);
      res.send(result);
    });

    // Service Card Collections
    const serviceCollection = client.db("serviceData").collection("cardList");

    app.get("/serviceData", async (req, res) => {
      console.log("server Cookie:", req.cookies);
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/serviceData", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    // Delete all documents in the collection
    app.delete("/serviceData", async (req, res) => {
      try {
        const result = await serviceCollection.deleteMany({});
        res.send(result);
      } catch (error) {
        console.error("Error deleting documents:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/serviceData", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    // service product details Api
    app.get("/serviceData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    // service cart data api
    const serviceCartCollection = client
      .db("serviceData")
      .collection("serviceCart");

    app.get("/serviceCart", async (req, res) => {
      const cursor = serviceCartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/serviceCart", async (req, res) => {
      const user = req.body;
      const result = await serviceCartCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/serviceCart/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await serviceCartCollection.deleteOne(query);
      res.send(result);
    });

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
  res.send("Trendy Server is working");
});

app.listen(port, () => {
  console.log("Trendy Server is Working");
});
