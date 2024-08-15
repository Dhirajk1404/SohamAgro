const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');
const config = require('./config');  // Import your config file
require('dotenv').config();
const connection = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.json());


const db = mysql.createConnection({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL Connected...");
});

app.get('/api', (req, res) => {
  res.send(`BASE_URL is: ${BASE_URL}`);
});

// Signup endpoint (without password hashing)
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Name, email, and password are required");
  }

  try {
    // Check if email already exists
    const checkEmailSql = "SELECT * FROM adminlogin WHERE email = ?";
    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database query error");
      }

      if (results.length > 0) {
        return res.status(400).send("Email already exists");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Insert user with hashed password into database
      const insertUserSql =
        "INSERT INTO adminlogin (name, email, password) VALUES (?, ?, ?)";
      db.query(insertUserSql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Failed to register user");
        }
        res.status(201).send("User registered");
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});


// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM adminlogin WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];

    // Compare hashed password with user input
    bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
      if (bcryptErr) {
        console.error('Bcrypt error:', bcryptErr);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (bcryptResult) {
        // Return the adminName along with the success message
        res.status(200).json({
          message: 'Login successful',
          Name: user.name, // Assuming 'adminName' is the column name for admin name
        });
      } else {
        res.status(401).json({ message: 'Incorrect password' });
      }
    });
  });
});

app.post('/user-login', (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.status(400).json({ message: 'User ID and password are required' });
  }

  const sql = 'SELECT * FROM user WHERE user_id = ?';
  db.query(sql, [user_id], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];

    // Compare hashed password with user input
    bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
      if (bcryptErr) {
        console.error('Bcrypt error:', bcryptErr);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (bcryptResult) {
        // Return the user name along with the success message
        res.status(200).json({
          message: 'Login successful',
          Name: user.name, // Assuming 'name' is the column name for user name
        });
      } else {
        res.status(401).json({ message: 'Incorrect password' });
      }
    });
  });
});

// Endpoint to store customer details
app.post("/store-customer", (req, res) => {
  const {
    customerId,
    name,
    address,
    city,
    state,
    country,
    pinNumber,
    mobileNumber,
    landLineNumber,
    emailId,
    socialHandle,
    shipToAddress,
    billingAddress,
    bankDetails,
    paymentTerms,
    gstNumber,
  } = req.body;

  if (
    !customerId ||
    !name ||
    !address ||
    !city ||
    !state ||
    !country ||
    !pinNumber ||
    !mobileNumber ||
    !emailId
  ) {
    return res.status(400).send("All required fields must be filled");
  }

  const created_at = new Date().toISOString().slice(0, 19).replace("T", " "); // Current timestamp
  const sql = `
    INSERT INTO customerextra (
      customerId, name, address, city, state, country, 
      pinNumber, mobileNumber, landLineNumber, emailId, 
      socialHandle , shipToAddress, 
      billingAddress, bankDetails, paymentTerms, gstNumber, created_at
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    customerId,
    name,
    address,
    city,
    state,
    country,
    pinNumber,
    mobileNumber,
    landLineNumber,
    emailId,
    socialHandle,
    shipToAddress,
    billingAddress,
    bankDetails,
    paymentTerms,
    gstNumber,
    created_at,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to store customer details");
    } else {
      res.status(201).send("Customer details stored successfully");
    }
  });
});

// API endpoint to fetch all customers
app.get('/customers', (req, res) => {
  const query = `
    SELECT 
      id, 
      customerId, 
      name, 
      address, 
      city, 
      state, 
      country, 
      pinNumber, 
      landLineNumber, 
      mobileNumber, 
      emailId, 
      socialHandle, 
      shipToAddress, 
      billingAddress, 
      bankDetails, 
      paymentTerms, 
      gstNumber, 
      created_at 
    FROM customerextra
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      res.status(500).send('Error fetching customers');
      return;
    }
    res.json(results);
  });
});


// Update customer endpoint
app.put('/edit-customer/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    city,
    state,
    country,
    pinNumber,
    mobileNumber,
    emailId,
    socialHandle,
    shipToAddress,
    billingAddress,
    bankDetails,
    paymentTerms,
    gstNumber
  } = req.body;

  const sql = `
    UPDATE customerextra SET
      name = ?,
      address = ?,
      city = ?,
      state = ?,
      country = ?,
      pinNumber = ?,
      mobileNumber = ?,
      emailId = ?,
      socialHandle = ?,
      shipToAddress = ?,
      billingAddress = ?,
      bankDetails = ?,
      paymentTerms = ?,
      gstNumber = ?
    WHERE customerId = ?
  `;

  db.query(sql, [
    name,
    address,
    city,
    state,
    country,
    pinNumber,
    mobileNumber,
    emailId,
    socialHandle,
    shipToAddress,
    billingAddress,
    bankDetails,
    paymentTerms,
    gstNumber,
    id
  ], (err, result) => {
    if (err) {
      console.error('Error updating customer:', err);
      return res.status(500).send('Failed to update customer');
    }
    res.send('Customer updated successfully');
  });
});

// API endpoint to delete a customer by ID
app.delete('/delete-customers/:customerId', (req, res) => {
  const customerId = req.params.customerId;

  // SQL query to delete the customer by ID
  db.query('DELETE FROM customerextra WHERE customerId = ?', [customerId], (err, results) => {
    if (err) {
      console.error('Error deleting customer:', err);
      return res.status(500).json({ message: 'Error deleting customer' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    console.log('Customer deleted:', customerId); // Log deleted customer ID
    res.json({ message: 'Customer deleted successfully' });
  });
});



// Endpoint to store product details
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/store-product', upload.single('image'), (req, res) => {
  const {
    productId,
    productName,
    description,
    unitOfMeasurement,
    price,
    currency,
    productCategory,
    expiryDate,
    batchNumber,
    status,
    discountAllowed,
  } = req.body;

  const image = req.file ? req.file.filename : null;

  // Validate required fields
  if (!productId || !description || !unitOfMeasurement || !price || !currency || !productCategory) {
    return res.status(400).send('All required fields must be filled');
  }

  const created_at = new Date().toISOString().slice(0, 10);
  const sql = `
    INSERT INTO productextra (
      productId, 	productName, description, unitOfMeasurement, price, currency, productCategory,
      expiryDate, batchNumber, status, discountAllowed, image, created_at
    ) 
    VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    productId,
    productName,
    description,
    unitOfMeasurement,
    price,
    currency,
    productCategory,
    expiryDate,
    batchNumber,
    status,
    discountAllowed,
    image,
    created_at,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to store product details');
    } else {
      res.status(201).send('Product details stored successfully');
    }
  });
});

// Define endpoint to get products
app.get('/get-products', (req, res) => {
  connection.query('SELECT * FROM productextra', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Error fetching products' });
    }
    console.log('Products fetched:', results); // Log results
    res.json(results);
  });
});

// Define endpoint to delete a product
app.delete('/delete-product/:id', (req, res) => {
  const productId = req.params.id;
  connection.query('DELETE FROM productextra WHERE productId = ?', [productId], (err, results) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Error deleting product' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('Product deleted:', productId); // Log deleted product ID
    res.json({ message: 'Product deleted successfully' });
  });
});

// Endpoint to update a product
app.put('/update-product/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const { productName, description, unitOfMeasurement, price, currency, productCategory, expiryDate, batchNumber, status, discountAllowed } = req.body;

  console.log('Product ID:', productId);
  console.log('Update data:', {
    productName,
    description,
    unitOfMeasurement,
    price,
    currency,
    productCategory,
    expiryDate,
    batchNumber,
    status,
    discountAllowed
  });

  const query = `
    UPDATE productextra 
    SET productName = ?, description = ?, unitOfMeasurement = ?, price = ?, currency = ?, productCategory = ?, expiryDate = ?, batchNumber = ?, status = ?, discountAllowed = ?
    WHERE id = ?
  `;
  
  connection.query(query, [productName, description, unitOfMeasurement, price, currency, productCategory, expiryDate, batchNumber, status, discountAllowed, productId], (err, results) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Error updating product' });
      return;
    }
    console.log('Update results:', results);
    res.json({ message: 'Product updated successfully' });
  });
});


app.post("/store-purchase-order", (req, res) => {
  const {
    customerId,
    customerName,
    products, // Array of products with quantities
    orderDate,
    expectedDeliveryDate,
    paymentMethod,
    specialInstructions,
    billingAddress,
    shippingAddress,
    location // Ensure location is provided
  } = req.body;

  // Validate required fields
  if (
    !customerId ||
    !customerName ||
    !products || !Array.isArray(products) ||
    !orderDate ||
    !expectedDeliveryDate ||
    !paymentMethod ||
    !billingAddress ||
    !shippingAddress ||
    !location // Ensure location is provided
  ) {
    return res.status(400).send("All required fields must be filled");
  }

  // Prepare the SQL statement
  const sql = `
    INSERT INTO purchaseorderextra (
      customerId, customerName, products, orderDate, expectedDeliveryDate,
      paymentMethod, specialInstructions, billingAddress, shippingAddress, location
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  // Convert the products array to JSON string
  const productsJson = JSON.stringify(products);
  
  // Prepare values for the SQL query
  const values = [
    customerId,
    customerName,
    productsJson, // Store products array as JSON
    orderDate,
    expectedDeliveryDate,
    paymentMethod,
    specialInstructions,
    billingAddress,
    shippingAddress,
    JSON.stringify(location) // Store location as JSON
  ];

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to store purchase order details");
    } else {
      res.status(201).send("Purchase order details stored successfully");
    }
  });
});
// API endpoint to fetch purchase order details
app.get('/purchase-orders', (req, res) => {
  const query = `
    SELECT 
      id, 
      customerId, 
      customerName, 
      products, 
      orderDate, 
      expectedDeliveryDate, 
      paymentMethod, 
      specialInstructions, 
      billingAddress, 
      shippingAddress,
      location  
    FROM purchaseorderextra
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching purchase orders:', err);
      res.status(500).json({ error: 'Error fetching purchase orders' });
      return;
    }

    const parsedResults = results.map(order => {
      let products = [];
      let location = { latitude: "N/A", longitude: "N/A" };

      // Parse products field
      try {
        products = order.products ? JSON.parse(order.products) : [];
      } catch (parseError) {
        console.error('Error parsing products:', parseError);
      }

      // Parse location field
      try {
        location = order.location ? JSON.parse(order.location) : { latitude: "N/A", longitude: "N/A" };
      } catch (parseError) {
        console.error('Error parsing location:', parseError);
      }

      // Combine product details and quantity
      // Assuming products are already combined as [{productName: "example", quantity: "1"}, ...]
      return {
        ...order,
        products,
        location
      };
    });

    res.json(parsedResults);
  });
});



// Endpoint to update a purchase order
app.put("/edit-purchase-orders/:id", (req, res) => {
  const orderId = req.params.id;
  const {
    customerId,
    customerName,
    products,
    orderDate,
    expectedDeliveryDate,
    paymentMethod,
    specialInstructions,
    billingAddress,
    shippingAddress,
  } = req.body;

  console.log("Order ID:", orderId);
  console.log("Update data:", {
    customerId,
    customerName,
    products,
    orderDate,
    expectedDeliveryDate,
    paymentMethod,
    specialInstructions,
    billingAddress,
    shippingAddress,
  });

  const query = `
    UPDATE purchaseorderextra
    SET customerId = ?, customerName = ?, products = ?, orderDate = ?, expectedDeliveryDate = ?, paymentMethod = ?, specialInstructions = ?, billingAddress = ?, shippingAddress = ?
    WHERE id = ?`;

  db.query(
    query,
    [
      customerId,
      customerName,
      JSON.stringify(products), // Ensure products are stored as JSON string
      orderDate,
      expectedDeliveryDate,
      paymentMethod,
      specialInstructions,
      billingAddress,
      shippingAddress,
      orderId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating order:", err);
        res.status(500).send("Failed to update order");
        return;
      }
      res.send("Order updated successfully");
    }
  );
});

app.post('/add-users', async (req, res) => {
  const { name, user_id, password, emailid, mobile_no, role, status } = req.body;

  console.log('Received request to add user:', req.body); // Log the request body

  if (!name || !user_id || !password || !emailid || !mobile_no || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO user (name, user_id, password, emailid, mobile_no, role, status) VALUES ( ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, user_id,  hashedPassword, emailid, mobile_no, role, status], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'User added successfully' });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all users
app.get('/users', (req, res) => {
  const query = 'SELECT name, user_id, emailid, mobile_no, role, status FROM user';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error retrieving users' });
    }
    res.status(200).json(results);
  });
});


app.put('/update-user/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { name,  emailid, mobile_no, role, status } = req.body;

  // Validate required fields
  if (!name || !emailid || !mobile_no || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // SQL query to update user
  const query = `
    UPDATE user
    SET name = ?,  emailid = ?, mobile_no = ?, role = ?, status = ?
    WHERE user_id = ?
  `;

  // Execute query
  db.query(query, [name, emailid, mobile_no, role, status, user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error updating user' });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully' });
  });
});

// Route to delete a user
app.delete('/delete-user/:user_id', (req, res) => {
  const { user_id } = req.params;

  // SQL query to delete user
  const query = 'DELETE FROM user WHERE user_id = ?';

  // Execute query
  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error deleting user' });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  });
});



// API endpoint to fetch purchase order details
app.get('/purchase-orders', (req, res) => {
  const query = `
    SELECT 
      id, 
      customerId, 
      customerName, 
      products, 
      quantity, 
      orderDate, 
      expectedDeliveryDate, 
      paymentMethod, 
      specialInstructions, 
      billingAddress, 
      shippingAddress,
      location
    FROM purchaseorderextra
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching purchase orders:', err);
      res.status(500).json({ error: 'Error fetching purchase orders' });
      return;
    }

    // Parse the products and location fields with error handling
    const parsedResults = results.map(order => {
      let products = [];
      let location = { latitude: "N/A", longitude: "N/A" };

      try {
        products = order.products ? JSON.parse(order.products) : [];
      } catch (error) {
        console.error('Error parsing products JSON:', error);
      }

      try {
        location = order.location ? JSON.parse(order.location) : { latitude: "N/A", longitude: "N/A" };
      } catch (error) {
        console.error('Error parsing location JSON:', error);
      }

      return {
        ...order,
        products,
        location
      };
    });

    res.json(parsedResults);
  });
});

// Endpoint to search products
app.get('/products', (req, res) => {
    const { search } = req.query;
    const query = `
      SELECT productName, description 
      FROM productextra 
      WHERE productName LIKE ? 
         OR description LIKE ?
    `;
  
    const searchKeyword = `%${search}%`;
  
    connection.query(query, [searchKeyword, searchKeyword], (error, results) => {
      if (error) {
        console.error('Database Query Error:', error);
        res.status(500).send('Server error');
      } else {
        console.log('Query Results:', results);
        const formattedResults = results.map(row => ({
          id: row.id || 'unknown', // Ensure `id` exists
          productName: row.productName || 'No Name',
          description: row.description || 'No Description'
        }));
        res.json(formattedResults);
      }
    });
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // You can also log the error to a monitoring service here
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // It's important to handle this and optionally restart the process
  // You can also log the error to a monitoring service here
});
