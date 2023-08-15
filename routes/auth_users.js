/////all the users toutes//////
const routerusers = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltrounds = 10;
const {secret} = require("./secret");

routerusers.post("/", async (req, res) => {
  try {
    const name = await req.body.name;
    const password = await bcrypt.hash(req.body.password, saltrounds);

    const userList = await pool.query(
      "insert into users  (name, password) values ($1, $2) RETURNING *",
      [name, password]
    );
    res.json(userList.rows[0]);
    //console.log(res.json(userList.rows[0]));
    //res.status(201).send("User created successfully!");
  } catch (err) {
    console.error(err.message);
  }
});

routerusers.post("/createuser", async (req, res) => {
  let username;
  let password;

  try {
    username = await req.body.username;
    password = await req.body.password;
    const usernames = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (usernames.rows.length > 0) {
      res.json({ message: "Username already exists." });
    } else {
      try {
        const hashedpassword = await bcrypt.hash(password, saltrounds);

        const result = await pool.query(
          `INSERT INTO users(username,password) VALUES ($1,$2) `,
          [username, hashedpassword]
        );
        res.json({ message: "User created successfully!" });
      } catch (error) {
        console.error(error.message);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
});

routerusers.post("/login", async (req, res) => {
  try {
    const username = await req.body.username;
    const password = await req.body.password;
    const usernames = await pool.query("SELECT username FROM users");

    if (usernames.rows.some((obj) => obj.username === username)) {
      try {
        const result = await pool.query(
          "SELECT password,identifier FROM users where username=$1",
          [username]
        );

        const retrievedPassword = await result.rows[0].password;
        const identifier = await result.rows[0].identifier;
        console.log("identifier", identifier);
        if (await bcrypt.compare(password, retrievedPassword)) {
          console.log("login successful");
          const token = jwt.sign({ _id: { username } }, secret);
          res.header('auth-token', token)
          res.status(200).json({ message: "success", identifier: identifier,token:token });
          
        } else {
          res.status(404).json({ message: "Login failed!" });
        }
      } catch (error) {
        console.error(error.message);
        res.status(404).json({ message: "error" });
      }
    } else {
      res.status(404).json({ message: "error" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "error" });
  }
});

module.exports = routerusers;