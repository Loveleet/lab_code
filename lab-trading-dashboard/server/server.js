const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Set up CORS correctly
const allowedOrigins = [
  "http://localhost:5173",         // Your React dev environment
  "https://lab-code-trs1.onrender.com" // Add your production frontend URL if needed
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed for this origin"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());

// ✅ Database Config
const dbConfig = {
  user: "lab",
  password: "IndiaNepal1-",
  server: "4.240.115.57",
  port: 1433,
  database: "labDB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// ✅ Auto-Retry SQL Connection
async function connectWithRetry() {
  try {
    const pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log("✅ Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("❌ SQL Connection Failed. Retrying in 5 seconds...", err.code || err.message);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return connectWithRetry();
  }
}

let poolPromise = connectWithRetry();

// ✅ Routes
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

app.get("/api/trades", async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) throw new Error("Database not connected");
    const result = await pool.request().query("SELECT * FROM AllTradeRecords;");
    res.json({ trades: result.recordset });
  } catch (error) {
    console.error("❌ Query Error (trades):", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch trades" });
  }
});

app.get("/api/machines", async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) throw new Error("Database not connected");
    const result = await pool.request().query("SELECT MachineId, Active FROM Machines;");
    res.json({ machines: result.recordset });
  } catch (error) {
    console.error("❌ Query Error (machines):", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch machines" });
  }
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});