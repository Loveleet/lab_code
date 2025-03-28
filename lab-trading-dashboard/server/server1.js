const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
const PORT = 3017;

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

// ✅ Connect to Database
sql.connect(dbConfig)
  .then(() => console.log("✅ Connected to SQL Server"))
  .catch((err) => console.error("❌ Database Connection Failed:", err));

app.use(cors());

// // ✅ API to Fetch ALL Trades (Running & Closed)
// app.get("/api/trades", async (req, res) => {
//   try {
//     const result = await sql.query("SELECT * FROM AllTradeRecords;");
//     res.json({ trades: result.recordset || [] }); // ✅ Ensures valid JSON response
//   } catch (error) {
//     console.error("❌ Query Error:", error);
//     res.status(500).json({ error: "Failed to fetch trades" });
//   }
// });

app.get("/api/trades", async (req, res) => {
  try {
    console.log("🔍 Fetching Trades...");

    const result = await sql.query("SELECT * FROM AllTradeRecords;");
    
    console.log("✅ API Data Fetched:", result.recordset.slice(0, 5)); // Print only first 5 for debugging

    res.json({ trades: result.recordset });
  } catch (error) {
    console.error("❌ Query Error:", error);
    res.status(500).json({ error: "Failed to fetch trades" });
  }
});
// // ✅ API to Fetch Total Profit from Closed Trades
// app.get("/api/closed_profit", async (req, res) => {
//   try {
//     const result = await sql.query(`
//       SELECT COALESCE(SUM(Pl_after_comm), 0) AS total_closed_profit
//       FROM AllTradeRecords
//       WHERE Type = 'close';
//     `);
    
//     res.json({ total_closed_profit: result.recordset[0].total_closed_profit || 0 });
//   } catch (error) {
//     console.error("❌ Query Error:", error);
//     res.status(500).json({ error: "Failed to fetch closed trades profit" });
//   }
// });

// ✅ API to Fetch Total Profit from Closed Trades
// app.get("/api/running_profit", async (req, res) => {
//   try {
//     const result = await sql.query(`
//       SELECT COALESCE(SUM(Pl_after_comm), 0) AS total_closed_profit
//       FROM AllTradeRecords
//       WHERE Type = 'running';
//     `);
    
//     res.json({ total_closed_profit: result.recordset[0].total_closed_profit || 0 });
//   } catch (error) {
//     console.error("❌ Query Error:", error);
//     res.status(500).json({ error: "Failed to fetch closed trades profit" });
//   }
// });
// // ✅ API to Fetch Closed Trades
// app.get("/api/closed_trades", async (req, res) => {
//   try {
//     const result = await sql.query("SELECT * FROM AllTradeRecords WHERE Type = 'close';");
//     res.json({ trades: result.recordset || [] });
//   } catch (error) {
//     console.error("❌ Query Error:", error);
//     res.status(500).json({ error: "Failed to fetch closed trades" });
//   }
// });

// ✅ API to Fetch Total Profit per Machine
// app.get("/api/total_profit", async (req, res) => {
//   try {
//     const result = await sql.query(`
//       SELECT SUM(Pl_after_comm) AS total_pl, 'M1' AS source FROM M1 WHERE Type = 'close'
//       UNION ALL
//       SELECT SUM(Pl_after_comm), 'M2' FROM M2 WHERE Type = 'close'
//       UNION ALL
//       SELECT SUM(Pl_after_comm), 'M3' FROM M3 WHERE Type = 'close';
//     `);
//     res.json(result.recordset || []);
//   } catch (error) {
//     console.error("❌ Query Error:", error);
//     res.status(500).json({ error: "Failed to fetch total profit" });
//   }
// });

// ✅ API to Fetch Grand Total Profit
// app.get("/api/grand_total_profit", async (req, res) => {
//   try {
//     const result = await sql.query(`
//       SELECT 
//           (SELECT COALESCE(SUM(Pl_after_comm), 0) FROM M1) +
//           (SELECT COALESCE(SUM(Pl_after_comm), 0) FROM M2) +
//           (SELECT COALESCE(SUM(Pl_after_comm), 0) FROM M3) 
//           AS grand_total;
//     `);
//     res.json(result.recordset?.[0] || { grand_total: 0 });
//   } catch (error) {
//     console.error("❌ Query Error:", error);
//     res.status(500).json({ error: "Failed to fetch grand total profit" });
//   }
// });

// ✅ API to Fetch Active Machines (Fix for 404 Error)
// ✅ API to Fetch Machines (Fix 404 Error)
app.get("/api/machines", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT MachineId, Active FROM Machines;
    `);
    res.json({ machines: result.recordset });
  } catch (error) {
    console.error("❌ Query Error:", error);
    res.status(500).json({ error: "Failed to fetch machines" });
  }
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});