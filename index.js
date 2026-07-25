const express = require("express");
const cors = require("cors");
const env = require("dotenv");

const app = express();

env.config();

const port = process.env.PORT;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://petadeption.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,

} = require("mongodb");

const uri =
process.env.MONGO_URI;

const client =
new MongoClient(uri, {

  serverApi: {

    version:
    ServerApiVersion.v1,

    strict:
    true,

    deprecationErrors:
    true,
  },
});

// VERIFY MIDDLEWARE
const verify =
(req,res,next)=>{

  const token =
  req.headers.authorization;

  if(!token){

    return res
    .status(401)
    .send({

      message:
      "Unauthorized",
    });
  }

  next();
};

async function run() {

  try {

    const db =
    await client.db(
      "petadaption"
    );

    const CollectionDb =
    await db.collection(
      "usersCollection"
    );

    console.log(
      "MongoDB Connected"
    );

    // ALL PETS
    app.get(

      "/pets",

      async (req, res) => {

        const search =
        req.query.search || "";

        const species =
        req.query.species || "";

        let query = {};

        if (search) {

          query.petName = {

            $regex:
            search,

            $options:
            "i",
          };
        }

        if (species) {

          query.species = {

            $in:
            [species],
          };
        }

        const result =
        await CollectionDb
        .find(query)
        .toArray();

        res.send(result);
      }
    );

    // SINGLE PET
    app.get(

      "/pets/:id",

      verify,

      async (req, res) => {

        const { id } =
        req.params;

        const result =
        await CollectionDb
        .findOne({

          _id:
          new ObjectId(id),
        });

        res.send(result);
      }
    );

    // ADD PET
    app.post(

      "/pets-add",

      verify,

      async (req, res) => {

        const data =
        req.body;

        const result =
        await CollectionDb
        .insertOne(data);

        res.send(result);
      }
    );

    // MY PETS
    app.get(

      "/pet/:id",

      verify,

      async (req, res) => {

        const { id } =
        req.params;

        const result =
        await CollectionDb
        .find({

          userId: id,
        })

        .toArray();

        res.send(result);
      }
    );

    // DELETE PET
    app.delete(

      "/delete-pat/:id",

      verify,

      async (req, res) => {

        const { id } =
        req.params;

        const result =
        await CollectionDb
        .deleteOne({

          _id:
          new ObjectId(id),
        });

        res.send(result);
      }
    );

    // UPDATE PET
    app.put(

      "/update-pet/:id",

      verify,

      async (req, res) => {

        const data =
        req.body;

        const { id } =
        req.params;

        const result =
        await CollectionDb
        .updateOne(

          {
            _id:
            new ObjectId(id),
          },

          {
            $set:
            data,
          }
        );

        res.send(result);
      }
    );

    // REQUEST PET
    app.post(

      "/request-pet",

      verify,

      async (req, res) => {

        const data =
        req.body;

        const result =
        await CollectionDb
        .insertOne(data);

        res.send(result);
      }
    );

    // MY REQUEST
    app.get(

      "/my-request/:id",

      verify,

      async (req, res) => {

        const { id } =
        req.params;

        const result =
        await CollectionDb
        .find({

          userId: id,

          status:
          "Pending",
        })

        .toArray();

        res.send(result);
      }
    );

    // UPDATE STATUS
    app.put(

      "/request-status/:id",

      verify,

      async (req, res) => {

        const { id } =
        req.params;

        const data =
        req.body;

        const result =
        await CollectionDb
        .updateOne(

          {
            _id:
            new ObjectId(id),
          },

          {
            $set: {

              status:
              data.status,
            },
          }
        );

        res.send(result);
      }
    );

    // REQUEST PET DATA
    app.get(

      "/request-pet/:id",

      verify,

      async (req, res) => {

        const { id } =
        req.params;

        const result =
        await CollectionDb
        .find({

          petId: id,
        })

        .toArray();

        res.send(result);
      }
    );

  } finally {

  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({
    ok: true,
    service: "PawHaven API",
    message: "Server is running",
  });
});

app.get("/health", (req, res) => {
  res.send({ status: "ok" });
});

app.listen(port, () => {

  console.log(
`Server Running On ${port}`
  );
});