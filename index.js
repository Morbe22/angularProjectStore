const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs"); //checks password & user if valid
const jwt = require("jsonwebtoken"); // checks if its really you connected.
const app = express();
const mysql = require("mysql");
const dateFormat = require("dateformat");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const md5 = require("md5");

require("dotenv").config();

app.use(express.json()); //creates req.body
app.use(cors());
app.use(express.static("public")); //the user can approach here.

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "myStore",
});

db.connect((err) => {
  if (err) {
    console.log(err);
    throw err;
  } else {
    console.log("database connented!");
  }
});

const Query = (q, ...opt) => {
  return new Promise((resolve, reject) => {
    db.query(q, opt, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
    // let finalQuery =
    // console.log(finalQuery.sql);
  });
};

//////////////////////////  -- MW -- /////////////////////////////

const allUsers = (req, res, next) => {
  const token = req.header("Authorization"); //saved there
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        req.user = decoded;
        next(); //valid
      }
    });
  } else {
    res.status(401).send("token not found");
  }
};

const onlyAdmin = (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
        throw err;
      }
      if (decoded.isAdmin) {
        req.user = decoded;
        next(); //admin valid
      } else {
        res.status(403).send("Not Admin!");
      }
    });
  } else {
    res.status(401).send("token not found");
  }
};

///////////////////// -- user Routes -- ///////////////////////

app.post("/registration", async (req, res) => {
  const { ID, email, password, f_name, l_name, city, street } = req.body; //things Im expecting to get from client
  console.log(req.body);

  if (ID && email && password && f_name && l_name && city && street) {
    const salt = await bcrypt.genSalt(); //default 10 rounds.
    let hashed_password = await bcrypt.hash(password, salt);

    let q = `INSERT INTO users
              (ID , email, password , f_name , l_name , city , street)
              VALUES
              (?,?,?,?,?,?,?)`;

    let user = await Query(
      q,
      ID,
      email,
      hashed_password,
      f_name,
      l_name,
      city,
      street
    );
    if (user) {
      jwt.sign(
        { email, f_name, ID, isAdmin: 0 }, //payload
        process.env.SECRET,
        (err, token) => {
          if (err) {
            console.log(err);
          } else {
            res.status(201).json({ token, message: "new user" });
          }
        }
      );
    }
  } else {
    res.status(500).send("missing info");
  }
});

//for registration
app.post("/checkEm_n_ID", async (req, res) => {
  const { ID, email } = req.body;
  if (ID && email) {
    const q = `SELECT * FROM users
      WHERE ID = ?
      OR email = ? `;

    let validUser = await Query(q, ID, email);

    if (validUser.length) {
      res.status(400).send(
        JSON.stringify({
          status: "error",
          message: "ID or Email already exists",
        })
      );
    } else {
      res.status(200).send(JSON.stringify({ status: "ok" }));
    }
  } else {
    res
      .status(400)
      .send(JSON.stringify({ status: "error", message: "missing info" }));
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const q = `SELECT * FROM users
          WHERE email = ?`;

    const user = await Query(q, email);
    if (user[0]) {
      if (bcrypt.compareSync(password, user[0].password)) {
        jwt.sign(
          { email, isAdmin: user[0].isAdmin, ID: user[0].ID }, //payload
          process.env.SECRET,
          (err, token) => {
            if (err) {
              res.status(400).send("token not found");
            } else {
              // console.log("payload login:", token);
              res.status(200).json({ token });
            }
          }
        );
      } else {
        res.status(401).send("Incorrect password");
      }
    } else {
      res.status(400).send("user not exists");
    }
  } else {
    res.status(400).send("missing info");
  }
});

/////////////////// -- shop Routes -- /////////////////////
app.post("/createCartForUser", allUsers, async (req, res) => {
  // console.log(typeof req.user.isAdmin);
  const { isAdmin, ID } = req.user;
  if (isAdmin != 1) {
    const q = `INSERT INTO user_cart
    (user_id)
    VALUES
    (?)`;

    const userCart = await Query(q, ID);
    res.status(201).send({ cartStatus: "starting" }); //which means that the cart is still open
  } else {
    res.status(401).send("this is admin");
  }
});

app.post("/addToCart", allUsers, async (req, res) => {
  const { product_id, amount, total_price, user_cart_id } = req.body;
  const q = `INSERT INTO cart_info
  (product_id , amount , total_price , user_cart_id)
  VALUES
  (?,?,?,?)`;

  const cartItem = await Query(
    q,
    product_id,
    amount,
    total_price,
    user_cart_id
  );
  // console.log(cartItem);
});

app.post("/filterBy", allUsers, async (req, res) => {
  const { ids } = req.body;

  let q = `SELECT
  products.* ,
  catagory.theme
  FROM products
  LEFT JOIN catagory
  ON products.catagory_id = catagory.id
  WHERE catagory_id IN ?`;

  const results = await Query(q, [ids]);

  console.log(results);

  res.status(200).json(results);
});

app.post("/showCart", allUsers, async (req, res) => {
  const { user_cart_id } = req.body;
  // console.log(user_cart_id);

  const q = `SELECT 
  cart_info.*,
  products.picture,
  products.price,
  products.p_name,
  products.id as p_id
  FROM cart_info
  INNER JOIN products
  ON cart_info.product_id = products.id 
  WHERE user_cart_id = ?`;

  const show = await Query(q, user_cart_id);
  // console.log(show);

  res.status(200).json(show);
});

app.post("/getTotalPrice", allUsers, async (req, res) => {
  const { user_cart_id } = req.body;
  // console.log(user_cart_id);

  const q = `SELECT SUM(total_price) as finalPrice
  FROM cart_info
  WHERE user_cart_id = ?`;

  const total = await Query(q, user_cart_id);
  // console.log(total);
  res.status(200).json(total[0]);
});

app.post("/searchP", allUsers, async (req, res) => {
  const { search } = req.body;

  const q = `SELECT * FROM products
  WHERE p_name LIKE ? `;

  const result = await Query(q, `%${search}%`);

  res.status(200).json(result);
});

app.post("/searchP_order", allUsers, async (req, res) => {
  const { search } = req.body;

  const q = `SELECT 
  cart_info.*,
  products.p_name,
  products.picture
  FROM cart_info
  INNER JOIN products
  on product_id = products.id
  WHERE p_name LIKE ? `;

  const result = await Query(q, `%${search}%`);

  res.status(200).json(result);
});

app.post("/order", allUsers, async (req, res) => {
  const {
    user_cart_id,
    final_price,
    city_shipping,
    street_shipping,
    date_order_toShipping,
    creditCard,
  } = req.body;

  if (
    user_cart_id &&
    final_price &&
    city_shipping &&
    street_shipping &&
    date_order_toShipping &&
    creditCard
  ) {
    const d2 = dateFormat(date_order_toShipping, "isoDateTime");
    const d1 = d2.split("T").join(" ");
    const d = d1.split("+")[0];
    console.log(d);

    const q = `INSERT INTO orders
  (user_id , user_cart_id , final_price , city_shipping, street_shipping, date_order_toShipping, creditCard)
  VALUES
  (?,?,?,?,?,?,?)`;

    const order = await Query(
      q,
      req.user.ID,
      user_cart_id,
      final_price,
      city_shipping,
      street_shipping,
      d,
      creditCard
    );

    res.status(200).json(order);
  } else {
    res.status(500).send("missing details");
  }
});

app.post("/check3Dates", allUsers, async (req, res) => {
  const { date_order_toShipping } = req.body;

  const q = `SELECT
  COUNT(date_order_toShipping) as booked
  FROM orders
  WHERE date_order_toShipping = ? `;

  const d2 = dateFormat(date_order_toShipping, "isoDateTime");
  const d1 = d2.split("T").join(" ");
  const d = d1.split("+")[0];

  // console.log(d);

  const bookFor3 = await Query(q, d);
  // console.log(bookFor3[0]);

  if (bookFor3[0].booked >= 3) {
    res.status(500).send("too many booked");
  } else {
    res.status(200).send("ok");
  }
});

app.post("/createReceipt", allUsers, async (req, res) => {
  try {
    const { user_cart_id, total } = req.body;
    // console.log(total);

    const q = `SELECT
  cart_info.*,
  products.price,
  products.p_name
  FROM cart_info
  INNER JOIN products
  ON cart_info.product_id = products.id
  WHERE user_cart_id = ?`;

    const allP = await Query(q, user_cart_id);

    let Order_data = [];

    allP.forEach((p) => {
      Order_data.push(`${p.p_name} X${p.amount}`);
      return Order_data.toString();
    });
    const totalO = total.toString();

    const data = `
    products : ${Order_data}
    total: ${totalO}
    `;

    const n = Math.floor(Math.random() * 1000 * (Math.random() * 1000));
    const filename = n + ".txt";
    const file_dir = path.resolve(__dirname + "/" + filename);
    console.log(file_dir);

    fs.writeFile(file_dir, data, (err) => {
      if (err) {
        res.status(403).json(err);
      } else {
        //this is for the client.
        res.download(file_dir, (err) => {
          if (err) {
            res.status(403).json(err);
          } else {
            //remove the created file from server.
            fs.unlink(file_dir, () => {
              console.log("deleted");
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);

    res.status(500).send(error);
  }
});

app.post("/addProd", onlyAdmin, async (req, res) => {
  const { p_name, catagory_id, price, picture } = req.body;
  console.log(req.body);

  const q = ` INSERT INTO products
           (p_name , catagory_id , price ,picture )
           VALUES
           (? , ? , ? , ?)
          `;
  const product = await Query(
    q,
    p_name,
    catagory_id,
    price,
    `uploads/${picture}`
  );
});

app.post("/upload", onlyAdmin, async (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
    }
    let extension = files.file.name.toString().split(".").pop();
    let oldpath = files.file.path;
    // console.log(oldpath);

    let for_client = "uploads/" + files.file.name;

    // let clientPath =
    //   "uploads/" + md5(files.file.name + new Date()) + "." + extension; //"uploads/892472hwjh2q9r.png" -Example

    // let clientPath = "uploads/" + files.file.name;

    let newpath = "/home/mormor/Desktop/shoppingonline/public/" + for_client;
    // copy the file to a new location
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;

      res.send("File uploaded and moved!");
    });
  });
});

app.put("/deleteCart", allUsers, async (req, res) => {
  const { id } = req.body;
  console.log(id);

  const q = `DELETE FROM user_cart
  WHERE id = ?`;
  console.log(id);

  const deleted = await Query(q, id);
});

app.put("/editProduct", onlyAdmin, async (req, res) => {
  const { p_name, catagory_id, price, picture, id } = req.body;
  console.log(p_name, catagory_id, price, picture, id);

  const q = `UPDATE products SET
  p_name = ? ,
  catagory_id = ? ,
  price = ? ,
  picture = ?
  WHERE id = ? 
  `;

  const edited_p = await Query(q, p_name, catagory_id, price, picture, id);
});

app.put("/delOneP", allUsers, async (req, res) => {
  const { product_id } = req.body;
  const q = `DELETE FROM cart_info
  WHERE product_id = ?`;

  const currentCart = await Query(q, product_id);
  // console.log(currentCart);
});

app.put("/delAllP", allUsers, async (req, res) => {
  const { user_cart_id } = req.body;
  const q = `DELETE FROM cart_info
  WHERE user_cart_id = ? `;

  console.log(user_cart_id);
  const result = await Query(q, user_cart_id);
});

app.put("/checkIfProductExist", allUsers, async (req, res) => {
  const { product_id, user_cart_id } = req.body;
  console.log(product_id, user_cart_id);

  const q = `SELECT * FROM cart_info
  WHERE product_id = ? AND user_cart_id = ?`;

  const product = await Query(q, product_id, user_cart_id);
  // console.log(product[0]);
  if (product.length) {
    res.status(500).send({ message: "product already exists" });
  } else {
    res.status(200).send({ message: "ok" });
  }
});

app.get("/hasCart", allUsers, async (req, res) => {
  try {
    const q = `SELECT * FROM user_cart
  WHERE user_id = ?`;

    const seeCartID = await Query(q, req.user.ID);

    // console.log(seeCartID);
    // console.log(seeCartID[0].id); // id of cart

    res.status(200).json(seeCartID[0]); //response: all cart objects
  } catch (error) {
    res.status(500).send("dont have any carts");
  }
});

app.get("/allProducts", allUsers, async (req, res) => {
  try {
    const q = `SELECT
  products.* , 
  catagory.theme
  FROM products
  LEFT JOIN catagory
  ON products.catagory_id = catagory.id`;

    const products = await Query(q);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send("cant bring products");
  }
});

app.get("/catagories", allUsers, async (req, res) => {
  const q = ` SELECT * FROM catagory`;
  const catagories = await Query(q);

  res.status(200).json(catagories);
});

app.get("/general_Data_C", async (req, res) => {
  const q = ` SELECT (SELECT COUNT(id) FROM products) AS AmountOfProducts,
    (SELECT COUNT(id) FROM orders) AS AmountOfOrders`;

  const stockData = await Query(q);

  res.json(stockData[0]);
});

app.get("/findUser", allUsers, async (req, res) => {
  // console.log(req.user);

  const q = `SELECT * FROM users
  WHERE ID = ? `;

  const user = await Query(q, req.user.ID);

  if (user.length) {
    res.status(200).json(user[0]);
  } else {
    res.status(400).send("cant find user");
  }
});

app.listen(1035, console.log("1035 port is on!"));
