const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Simulate a database
const database = {}; // Replace with your database logic

// Utility function to check if the data is valid
const isDataValid = (data) => {
  const requiredFields = [
    "incoterms",
    "valuta",
    "kurs",
    "nilai",
    "biayaTambahan",
    "biayaPengurang",
    "tarifVD",
    "fob",
    "asuransiBiayaDi",
    "asuransi",
    "freight",
    "cif",
    "cifRp",
    "bruto",
    "netto",
    "flagKontainer",
  ];

  return requiredFields.every(
    (field) => data[field] !== undefined && data[field] !== ""
  );
};

// Utility function to calculate values (dummy logic)
const calculateValues = (data) => {
  const fob = (
    parseFloat(data.nilai || 0) +
    parseFloat(data.biayaTambahan || 0) -
    parseFloat(data.biayaPengurang || 0) +
    parseFloat(data.tarifVD || 0)
  ).toFixed(2);

  return { ...data, fob };
};

app.post("/api/pungutan", (req, res) => {
  const data = req.body;

  // 1. Perform re-check calculations based on the payload
  const calculatedData = calculateValues(data);

  // 2. Validate data
  if (!isDataValid(data)) {
    return res
      .status(400)
      .json({ error: "Some required fields are missing or empty" });
  }

  // 3. Handle primary key and update or insert data
  if (data.primaryKey) {
    // Update existing record
    if (database[data.primaryKey]) {
      database[data.primaryKey] = calculatedData;
      return res.status(200).json({ message: "Data updated successfully!" });
    } else {
      return res.status(404).json({ error: "Record not found for update" });
    }
  } else {
    // Insert new record
    const newPrimaryKey = Date.now(); // Generate a new primary key
    database[newPrimaryKey] = calculatedData;
    return res
      .status(201)
      .json({ message: "Data saved successfully!", primaryKey: newPrimaryKey });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
