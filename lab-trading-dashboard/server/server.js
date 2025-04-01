const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Allowed Frontend Origins (Local + Vercel + Render)
const allowedOrigins = [
  "http://localhost:5173",                    // Dev (Vite)
  "https://lab-code-lyart.vercel.app",       // ✅ Your Vercel Frontend
  "https://lab-code-trs1.onrender.com"       // Optional: if your frontend is ever on Render
];

// ✅ Proper CORS Handling
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS blocked origin:", origin);
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());

// ✅ Database Configuration
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

// ✅ Retry SQL Connection Until Successful
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

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// ✅ API: Fetch All Trades
app.get("/api/trades", async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) throw new Error("Database not connected");
    const result = await pool.request().query("SELECT * FROM AllTradeRecords;");
    res.json({ trades: result.recordset });
  } catch (error) {
    console.error("❌ Query Error (/api/trades):", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch trades" });
  }
});

// ✅ API: Fetch Machines
app.get("/api/machines", async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) throw new Error("Database not connected");
    const result = await pool.request().query("SELECT MachineId, Active FROM Machines;");
    res.json({ machines: result.recordset });
  } catch (error) {
    console.error("❌ Query Error (/api/machines):", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch machines" });
  }
});

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});