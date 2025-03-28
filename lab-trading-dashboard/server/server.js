const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
const PORT = 10000;

app.use(cors());

// ✅ Database Connection Config
const dbConfig = {
  user: "sa",
  password: "IndiaNepal-1",
  server: "4.240.115.57",
  port: 1433,
  database: "labDB",
  options: {
    encrypt: false, // Set to true if using Azure SQL
    trustServerCertificate: true, // Use this for self-signed certificates

  },
};
// const dbConfig = { /Users/apple/Desktop/lab_code/lab-trading-dashboard/server/server.js
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_DATABASE,
//   port: 1433,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//   },
// };

// ✅ Auto-Retry SQL Connection Until Successful
async function connectWithRetry() {
  try {
    const pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log("✅ Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("❌ SQL Connection Failed. Retrying in 5 seconds...", err.code || err.message);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return connectWithRetry();
  }
}

let poolPromise = connectWithRetry();

/* ✅ API: Fetch ALL Trades */
app.get("/api/trades", async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) throw new Error("Database not connected");
    const result = await pool.request().query("SELECT * FROM AllTradeRecords;");
    res.json({ trades: result.recordset });
  } catch (error) {
    console.error("❌ Query Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch trades" });
  }
});

/* ✅ API: Fetch Machines */
app.get("/api/machines", async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) throw new Error("Database not connected");
    const result = await pool.request().query("SELECT MachineId, Active FROM Machines;");
    res.json({ machines: result.recordset });
  } catch (error) {
    console.error("❌ Query Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch machines" });
  }
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});