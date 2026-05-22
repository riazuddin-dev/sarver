//
const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const app = express();

env.config();
const port = process.env.PORT;
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://petadeption.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const db = await client.db("petadaption");
    const CollectionDb = await db.collection("usersCollection");

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    app.get("/pets", async (req, res) => {
      const search = req.query.search || "";

      const species = req.query.species || "";

      let query = {};

      // SEARCH BY NAME
      if (search) {
        query.petName = {
          $regex: search,

          $options: "i",
        };
      }

      // FILTER BY SPECIES
      if (species) {
        query.species = {
          $in: [species],
        };
      }

      const result = await CollectionDb.find(query).toArray();

      res.send(result);
    });

    app.get("/pets/:id", async (req, res) => {
      const { id } = req.params;

      const result = await CollectionDb.findOne({ _id: new ObjectId(id) });

      res.send(result);
    });

    app.post("/pets-add", async (req, res) => {
      const data = req.body;
      const result = await CollectionDb.insertOne(data);

      res.send(result);
    });

    app.get("/pet/:id", async (req, res) => {
      const { id } = req.params;

      const result = await CollectionDb.find({
        userId: id,
      }).toArray();

      res.send(result);
    });

    app.delete("/delete-pat/:id", async (req, res) => {
      const { id } = req.params;

      const result = await CollectionDb.deleteOne({ _id: new ObjectId(id) });

      res.send(result);
    });

    app.put("/update-pet/:id", async (req, res) => {
      const data = req.body;

      const { id } = req.params;

      const result = await CollectionDb.updateOne(
        { _id: new ObjectId(id) },
        { $set: data },
      );

      res.send(result);
    });

    app.post("/request-pet", async (req, res) => {
      const data = req.body;

      const result = await CollectionDb.insertOne(data);
      res.send(result);
    });

    app.get(
      "/my-request/:id",

      async (req, res) => {
        const { id } = req.params;

        const result = await CollectionDb.find({
          userId: id,

          status: "Pending",
        }).toArray();

        res.send(result);
      },
    );
    app.put("/request-status/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      const result = await CollectionDb.updateOne(
        { _id: new ObjectId(id) },

        {
          $set: {
            status: data.status,
          },
        },
      );

      res.send(result);
    });

    app.get(
      "/request-pet/:id",

      async (req, res) => {
        const { id } = req.params;

        const result = await CollectionDb.find({
          petId: id,
        }).toArray();

        res.send(result);
      },
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
