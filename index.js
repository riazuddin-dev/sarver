const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

env.config();

const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.use(cookieParser());

const verifyToken =
(req, res, next) => {

  const token =
    req.cookies.token;

  if (!token) {

    return res
      .status(401)
      .send({

        message:
          "Unauthorized Access please try again",
      });
  }

  jwt.verify(

    token,

    process.env.JWT_SECRET,

    (err, decoded) => {

      if (err) {

        return res
          .status(401)
          .send({

            message:
              "Unauthorized Access",
          });
      }

      req.user = decoded;

      next();
    }
  );
};

const uri =
process.env.MONGO_URI;

const client =
new MongoClient(uri, {

  serverApi: {

    version:
      ServerApiVersion.v1,

    strict: true,

    deprecationErrors: true,
  },
});

async function run() {

  try {

    const db =
      client.db("petadaption");

    const petsCollection =
      db.collection("pets");

    const requestCollection =
      db.collection("requests");

    app.post(

      "/jwt",

      async (req, res) => {

        const user =
          req.body;

        const token =
          jwt.sign(

            user,

            process.env.JWT_SECRET,

            {
              expiresIn:
                "7d",
            }
          );

        res
          .cookie(

            "token",

            token,

            {

              httpOnly: true,

              secure: true,

              sameSite: "none",
            }
          )

          .send({

            success: true,
          });
      }
    );

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

          query.species = species;
        }

        const result =
          await petsCollection
            .find(query)
            .toArray();

        res.send(result);
      }
    );

    app.get(

      "/pets/:id",

      async (req, res) => {

        const { id } =
          req.params;

        const result =
          await petsCollection
            .findOne({

              _id:
                new ObjectId(id),
            });

        res.send(result);
      }
    );

    app.post(

      "/pets-add",

      verifyToken,

      async (req, res) => {

        const data =
          req.body;

        const result =
          await petsCollection
            .insertOne(data);

        res.send(result);
      }
    );

    app.get(

      "/pet/:id",

      verifyToken,

      async (req, res) => {

        const { id } =
          req.params;

        const result =
          await petsCollection
            .find({

              userId: id,
            })
            .toArray();

        res.send(result);
      }
    );

    app.delete(

      "/delete-pat/:id",

      verifyToken,

      async (req, res) => {

        const { id } =
          req.params;

        const result =
          await petsCollection
            .deleteOne({

              _id:
                new ObjectId(id),
            });

        res.send(result);
      }
    );

    app.put(

      "/update-pet/:id",

      verifyToken,

      async (req, res) => {

        const data =
          req.body;

        const { id } =
          req.params;

        const result =
          await petsCollection
            .updateOne(

              {
                _id:
                  new ObjectId(id),
              },

              {
                $set: data,
              }
            );

        res.send(result);
      }
    );

    app.post(

      "/request-pet",

      verifyToken,

      async (req, res) => {

        const data =
          req.body;

        const result =
          await requestCollection
            .insertOne(data);

        res.send(result);
      }
    );

    app.get(

      "/my-request/:id",

      verifyToken,

      async (req, res) => {

        const { id } =
          req.params;

        const result =
          await requestCollection
            .find({

              userId: id,

              status:
                "Pending",
            })
            .toArray();

        res.send(result);
      }
    );

    app.put(

      "/request-status/:id",

      verifyToken,

      async (req, res) => {

        const { id } =
          req.params;

        const data =
          req.body;

        const result =
          await requestCollection
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

    app.get(

      "/request-pet/:id",

      verifyToken,

      async (req, res) => {

        const { id } =
          req.params;

        const result =
          await requestCollection
            .find({

              petId: id,
            })
            .toArray();

        res.send(result);
      }
    );

    console.log(
      "MongoDB Connected"
    );

  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {

  res.send("hello");
});

app.listen(port, () => {

  console.log(
    `Server Running On ${port}`
  );
});