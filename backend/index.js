const express = require("express");
const cors = require("cors");
const app = express();
const envv = require("dotenv");
envv.config();
var store = {};
app.use(express.json());
app.use(cors());
const db = require("./Database");

const Capilize = (string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

app.get("/customers", async (req, res) => {
  const { data } = req.query;
  try {
    const query = `SELECT * FROM customerdetails ORDER BY ${data}`;
    const { rows } = await db.query(query);
    const { rowCount } = await db.query("select * from customerdetails");
    store = rows;
    res.json({ rows, rowCount });
  } catch (error) {
    console.log(error);
  }
});

app.post("/customers/create", async (req, res) => {
  const query = `INSERT INTO customerdetails(sno, customer_name, age, phone, location, created_at, about) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
  const update = `UPDATE customerdetails SET sno = sno + 1`;
  await db.query(update, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Success");
    }
  });
  await db.query(query, [
    req.body.sno,
    Capilize(req.body.customer_name),
    req.body.age,
    req.body.phone,
    Capilize(req.body.location),
    req.body.created_at,
    req.body.about,
  ]);
  res.json("Successfully Created");
});

app.delete("/customers/delete", async (req, res) => {
  const { sno } = req.query;
  const query = `DELETE FROM public.customerdetails WHERE sno=$1`;
  await db
    .query(query, [sno])
    .then(() => {
      const update = `UPDATE customerdetails SET sno = sno - 1 WHERE sno> $1`;
      db.query(update, [sno]);
      res.json("Successfully Deleted");
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.put("/customers/update", async (req, res) => {
  const query = `UPDATE customerdetails SET customer_name = $2 , age= $3 , phone = $4 , location = $5 , created_at= $6 , about = $7 Where sno = $1`;
  await db
    .query(query, [
      req.body.sno,
      req.body.customer_name,
      req.body.age,
      req.body.phone,
      req.body.location,
      req.body.created_at,
      req.body.about,
    ])
    .then(() => {
      res.json("Succesfully Updated.");
    });
});

app.get("/customers/time", async (req, res) => {
  const { order } = req.query;

  const query = `SELECT *
    FROM customerdetails
    ORDER BY TO_DATE(SUBSTRING(created_at, 1, 10), 'DD-MM-YYYY') ${order} `;
  await db
    .query(query)
    .then((row) => {
      res.json(row.rows);
    })
    .catch((err) => {
      res.json(err);
      console.log(err);
    });
});

app.get("/customers/searchs", async (req, res) => {
  var { search } = req.query;
  if (!search) {
    res.json(store);
    return;
  }
  search = Capilize(search);
  const query = `SELECT * FROM public.customerdetails  where customer_name LIKE '%${search}%' or location LIKE '%${search}%'`;
  await db
    .query(query)
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});
PORT = process.env.REACT_APP_SERVER_PORT ;
app.listen(PORT, () => {
  console.log("Connected To Backend At Port: " + PORT);
});
