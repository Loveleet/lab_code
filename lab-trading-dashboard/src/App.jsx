

import React, { useState, useEffect } from "react";
import { Home, BarChart, Users, FileText, Menu, X, Plus } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
      <div className="flex items-center justify-between p-5">
        <h2 className={`text-xl font-bold transition-all ${isOpen ? "block" : "hidden"}`}>LAB</h2>
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <nav className="mt-10">
        <ul className="space-y-4">
          <SidebarItem icon={Home} text="home" isOpen={isOpen} />
          <SidebarItem icon={BarChart} text="trades" isOpen={isOpen} />
          <SidebarItem icon={Users} text="clients" isOpen={isOpen} />
          <SidebarItem icon={FileText} text="reports" isOpen={isOpen} />
        </ul>
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, text, isOpen }) => (
  <li className="flex items-center space-x-4 px-4 py-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-all">
    <Icon size={24} />
    <span className={`transition-all ${isOpen ? "block" : "hidden"}`}>{text.replace(/_/g, " ")}</span>
  </li>
);

const DashboardCard = ({ title, value, isSelected, onClick }) => {

  const formatValue = (val) => {
    return val.split(/([+-]?[\d.]+)/g).map((part) => {
      if (!isNaN(part) && part.trim() !== "") {
        // ✅ Number Formatting
        const num = parseFloat(part);
        const colorClass = num < 0 ? "text-red-400" : "text-green-300";
        return `<span class="${colorClass}">${part}</span>`; // ✅ Return as STRING
      } else if (["+", "=", "$", "/"].includes(part.trim())) {
        // ✅ Signs/Operators Formatting
        return `<span class="text-white">${part}</span>`;
      } else {
        return part;
      }
    }).join(""); // ✅ Join into one string
  };
  return (
    <div
      className={`cursor-pointer p-6 rounded-xl shadow-lg transition-all duration-300
      ${isSelected ? "bg-yellow-500 scale-110" : "bg-gradient-to-br from-blue-800 to-indigo-900 hover:brightness-210"}`}
      onClick={onClick}
    >
      {/* ✅ Title with sky blue color */}
      <h2 className="text-lg font-semibold text-center text-blue-400">{title.replace(/_/g, " ")}</h2>
      
        
      {/* ✅ Properly formatted value using dangerouslySetInnerHTML */}
      <p className="text-2xl font-bold text-center" dangerouslySetInnerHTML={{ __html: formatValue(String(value)) }}></p>
    </div>
  );
};

// Apply this background to the dashboard container:
<div className="flex bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen text-white">
  {/* Sidebar & Content */}
</div>;

const TableView = ({ title, tradeData }) => {
  console.log("📊 TableView - Selected Box:", title);
  console.log("📊 TableView - Received Data:", tradeData);

 
  const [filteredData, setFilteredData] = useState([]);


const handleOpenReport = (title, sortedData) => {
  const reportWindow = window.open("", "_blank", "width=1200,height=600");

  const tableHeaders = Object.keys(sortedData[0] || []);

  const reportContent = `
    <html>
      <head>
        <title>${title.replace(/_/g, " ")} Report</title>
        <style>
         body {
  font-family: Arial, sans-serif;
  margin: 20px;
  background-color: #f2f2f7; /* ✅ Light Grayish Background */
  color: #222; /* ✅ Slightly Softer Text Color */
}

table {
  width: 100%;
  border-collapse: collapse;
  cursor: pointer;
}

th, td {
  font-size: clamp(11px, 1vw, 14px);         /* Slightly smaller font */
  padding: 6px 8px;
  line-height: 1.2;
  text-align: center;
  word-wrap: break-word;   /* Break long text if needed */
  white-space: normal;     /* Allow wrapping */
  vertical-align: center;
  max-width: 140px;        /* Prevent super wide columns */
  border-bottom: 2px solid white;
}

th {
  position: sticky;
  top: 0;             /* Locks it to the top */
  z-index: 4; 
  padding: 8px 10px;
  font-size: clamp(11px, 1vw, 14px); 
  background-color:rgb(40, 137, 148);
  color: white;
  border-bottom: 2px solid white;
  text-align: center;
  vertical-align: center;
  white-space: normal;     /* Allow long headers to wrap */
}

/* ✅ FIX: Sticky header cells in first 3 columns */
th.sticky-col-1,
th.sticky-col-2,
th.sticky-col-3 {
  z-index: 5; /* 👈 this is the final fix */
}
  /* ✅ Reduce font size only for Date/Time columns */
td.datetime-column, th.datetime-column {
  font-size: 12px;   /* Make text smaller */
  white-space: nowrap; /* Prevent text wrapping */
  text-align: center;  /* Center align for better look */
  padding: 4px 6px;   /* Reduce padding to save space */
}

/* ✅ Make headers slightly bigger for readability */
th.datetime-column {
  font-size: 13px;  
  font-weight: bold;
}


/* 🔹 Fix Sticky Column Misalignment */
.sticky-col {
  position: sticky;
  z-index: 2;
  background: rgb(4, 110, 122);
  color: white;
  left: 0;
  text-align: center;
  min-width: 110px;     /* Increased from 100px */
  max-width: 130px;     /* Slightly more breathing room */
  padding: 4px 8px;     /* Add padding for spacing */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

/* 🔹 Apply sticky to first 3 columns */
.sticky-col-1 { left: 0; z-index: 3; }
.sticky-col-2 { left: 110px; }
.sticky-col-3 { left: 240px; }

/* 🔹 Ensure the table scrolls properly */
.table-container {
  overflow: auto;
  max-width: 100%;
  max-height: 600px;
  border: 1px solid #ccc;
}
<th class="datetime-column">Candle Time</th>
<th class="datetime-column">Fetcher Trade Time</th>
<th class="datetime-column">Operator Trade Time</th>
<th class="datetime-column">Operator Close Time</th>

<td class="datetime-column">2025-03-21 18:45:00</td>
<td class="datetime-column">2025-03-21 18:46:30</td>
<td class="datetime-column">2025-03-21 19:01:10</td>
<td class="datetime-column">2025-03-21 18:55:45</td>
  th.sorted-asc::after { content: " 🔼"; }
  th.sorted-desc::after { content: " 🔽"; }
  input[type="text"] {
    margin-bottom: 10px;
    padding: 6px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <h2>${title.replace(/_/g, " ")} Details</h2>
        <input type="text" id="searchBox" placeholder="🔍 Type to filter rows..." onkeyup="filterRows()" />

        <table id="reportTable">
          <thead>
            <tr>
            ${tableHeaders.map((key, index) => {
              const stickyClass = index < 3 ? `sticky-col sticky-col-${index + 1}` : "";
              return `<th onclick="sortTable(${index })" class="${stickyClass}" data-index < "${index < 3}">${key.replace(/_/g, " ")}</th>`;
            }).join("")}
            </tr>
          </thead>
          <tbody id="tableBody">
          ${sortedData.map(item => `
            <tr>${tableHeaders.map((key, index) => {
              const stickyClass = index < 3 ? `sticky-col sticky-col-${index + 1}` : "";
              return `<td class="${stickyClass}">${item[key]}</td>`;
            }).join("")}</tr>
          `).join("")}
          </tbody>
        </table>

        <script>
          let currentSortIndex = null;
          let currentSortDirection = "asc";

          function sortTable(columnIndex) {
            const table = document.getElementById("reportTable");
            const tbody = table.querySelector("tbody");
            const rows = Array.from(tbody.rows);

            const isAsc = currentSortIndex === columnIndex && currentSortDirection === "asc" ? false : true;
            currentSortIndex = columnIndex;
            currentSortDirection = isAsc ? "asc" : "desc";

            rows.sort((a, b) => {
              const valA = a.cells[columnIndex].textContent.trim();
              const valB = b.cells[columnIndex].textContent.trim();

              if (!isNaN(valA) && !isNaN(valB)) {
                return isAsc ? parseFloat(valA) - parseFloat(valB) : parseFloat(valB) - parseFloat(valA);
              }
              return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });

            tbody.innerHTML = "";
            rows.forEach(row => tbody.appendChild(row));

            document.querySelectorAll("th").forEach(th => th.classList.remove("sorted-asc", "sorted-desc"));
            document.querySelector(\`th[data-index="\${columnIndex}"]\`).classList.add(isAsc ? "sorted-asc" : "sorted-desc");
          }

          function filterRows() {
            const query = document.getElementById("searchBox").value.toLowerCase();
            const rows = document.querySelectorAll("#tableBody tr");

            rows.forEach(row => {
              const rowText = row.textContent.toLowerCase();
              row.style.display = rowText.includes(query) ? "" : "none";
            });
          }
        </script>
      </body>
    </html>
  `;

  reportWindow.document.write(reportContent);
};

  if (!tradeData || tradeData.length === 0) {
    return <p className="text-center text-gray-500 mt-4">⚠️ No data available for {title}</p>;
  }
  // ✅ SORTING STATE
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  // ✅ SORT FUNCTION
  const sortTable = (key) => {
    setSortConfig((prevConfig) => {
      const direction = prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
  };
  

  // ✅ APPLY SORTING TO DATA
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortConfig.key] || "";
      let bValue = b[sortConfig.key] || "";

      if (!isNaN(aValue) && !isNaN(bValue)) {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (!tradeData || tradeData.length === 0) {
    return <p className="text-center text-gray-500 mt-4">⚠️ No data available for {title}</p>;
  }

  
  
  useEffect(() => {
    if (!tradeData || tradeData.length === 0) return;
  
    let result = [];
    
    switch (title) {

      case "Profit_+_Loss_=_Total_Profit $":
      result = tradeData
        .map((trade, index) => formatTradeData(trade, index));
      break;

    case "Profit_+_Loss_=_Closed_Profit $":
      result = tradeData
      .filter(trade => trade.Type === "close")
        .map((trade, index) => formatTradeData(trade, index));
      break;
      
    case "Profit_+_Loss_=_Running_Profit $":
      result = tradeData
      .filter(trade => trade.Type === "running")
        .map((trade, index) => formatTradeData(trade, index));
      break;
      
      case "Total_Trades":
        result = tradeData.map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Running_/_Total_Buy":
        result = tradeData
          .filter(trade => trade.Action === "BUY" && trade.Type === "running")
          .map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Running_/_Total_Sell":
        result = tradeData
          .filter(trade => trade.Action === "SELL" && trade.Type === "running")
          .map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Assign_/_Running_/_Closed Count":
        result = tradeData.map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Comission_Point_Crossed":
        result = tradeData
          .filter(trade => trade.Commision_journey === true)
          .map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Profit_Journey_Crossed":
        result = tradeData
          .filter(trade => trade.Profit_journey === true)
          .map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Below_Commision_Point":
        result = tradeData
          .filter(trade => trade.Commision_journey === false)
          .map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Closed_After_Comission_Point":
        result = tradeData
          .filter(trade => trade.Type === "close" && trade.Commision_journey === true)
          .map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Close_in_Loss":
        result = tradeData
          .filter(trade => trade.Type === "close" && trade.Pl_after_comm < 0)
          .map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Close_After_Profit_Journey":
        result = tradeData
          .filter(trade => trade.Type === "close" && trade.Profit_journey === true)
          .map((trade, index) => formatTradeData(trade, index));
        break;


      case "Close_Curve_in_Loss":
        result = tradeData
        .filter(trade => trade.Type === "close" && trade.Commision_journey === true && trade.Pl_after_comm < 0 )
        .map((trade, index) => formatTradeData(trade, index));
      break;

  
      default:
        result = [];
    }
  
    setFilteredData(result);
  }, [title, tradeData]);

  if (filteredData.length === 0) {
    return <p className="text-center text-gray-500 mt-4">⚠️ No relevant data available for {title}</p>;
  }
  const getStickyClass = (index) => {
    if (index === 0) return "sticky left-0 z-[5] bg-[#046e7a] text-white min-w-[110px] max-w-[110px]";
    if (index === 1) return "sticky left-[110px] z-[5] bg-[#046e7a] text-white min-w-[130px] max-w-[130px]";
    if (index === 2) return "sticky left-[240px] z-[5] bg-[#046e7a] text-white min-w-[130px] max-w-[130px]";
    return "";
  };
return (
  <div className="mt-6 p-6 bg-[#f2f2f7] text-[#222] shadow-md rounded-lg max-w-full">
    <h2 className="text-xl font-bold">{title.replace(/_/g, " ")} Details</h2>

    {/* ✅ Open Report Button */}
          <button
        onClick={() => handleOpenReport(title, sortedData)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 mb-4"
      >
        Open in New Page
      </button>

    {/* ✅ Table with Sorting */}
    <div className="overflow-auto max-h-[600px] border border-gray-300 rounded-lg">
      <table className="w-full border-collapse">
      <thead className="sticky top-0 z-30 bg-teal-700 text-white text-sm">
  <tr>
    {Object.keys(sortedData[0] || {}).map((key, index) => {
      const isSticky = index < 3;
      return (
              <th
        key={key}
        onClick={() => sortTable(key)}
        className={`px-4 py-2 text-left border cursor-pointer whitespace-nowrap ${getStickyClass(index)}`}
      >
          {key.replace(/_/g, " ")}{" "}
          {sortConfig.key === key
            ? sortConfig.direction === "asc"
              ? "🔼"
              : "🔽"
            : ""}
        </th>
      );
    })}
  </tr>
</thead>
<tbody>
  {sortedData.map((item, rowIndex) => (
    <tr key={rowIndex} className="border-b">
      {Object.values(item).map((val, colIndex) => (
        <td
          key={colIndex}
          className={`px-4 py-2 border text-sm whitespace-nowrap  ${
            colIndex < 3 ? `sticky left-[${colIndex * 110}px] bg-[#046e7a] text-white z-30` : ""
          } ${[
            "Candle_Time",
            "Fetcher_Trade_Time",
            "Operator_Trade_Time",
            "Operator_Close_Time",
          ].includes(Object.keys(item)[colIndex])
            ? "text-xs"
            : ""
          }`}
        >
          {val}
        </td>
      ))}
    </tr>
  ))} 
</tbody>
      </table>
    </div>
  </div>
);
};
// ✅ Helper Function to Format Trade Data
const formatTradeData = (trade, index) => ({
  "S No": index + 1,
  MachineId: trade.MachineId || "N/A",
  Unique_ID: trade.Unique_id || "N/A",
  Candle_Time: trade.Candel_time || "N/A", 
  Fetcher_Trade_Time: trade.Fetcher_Trade_time || "N/A",
  Operator_Trade_Time: trade.Operator_Trade_time || "N/A",
  Operator_Close_Time: trade.Operator_Close_time || "N/A",
  Pair: trade.Pair || "N/A",
  Investment: trade.Investment ? `$${trade.Investment.toFixed(2)}` : "N/A",
  Interval: trade.Interval || "N/A",
  Stop_Price: trade.Stop_price ? trade.Stop_price.toFixed(6) : "N/A",
  Save_Price: trade.Save_price ? trade.Save_price.toFixed(6) : "N/A",
  Min_Comm: trade.Min_comm ? trade.Min_comm.toFixed(6) : "N/A",
  Hedge: trade.Hedge ? "✅ Yes" : "❌ No",
  Hedge_1_1_Bool: trade.Hedge_1_1_bool ? "✅ Yes" : "❌ No", // ✅ Newly Added
  Hedge_Order_Size: trade.Hedge_order_size || "N/A", // ✅ Newly Added
  Min_Comm_After_Hedge: trade.Min_comm_after_hedge ? trade.Min_comm_after_hedge.toFixed(6) : "N/A", // ✅ Newly Added
  Min_Profit: trade.Min_profit ? `$${trade.Min_profit.toFixed(2)}` : "N/A", // ✅ Newly Added
  Action: trade.Action || "N/A",
  Buy_Qty: trade.Buy_qty || 0,
  Buy_Price: trade.Buy_price ? trade.Buy_price.toFixed(6) : "N/A",
  Buy_PL: trade.Buy_pl ? trade.Buy_pl.toFixed(6) : "N/A",
  Added_Qty: trade.Added_qty || "N/A", // ✅ Newly Added
  Sell_Qty: trade.Sell_qty || 0,
  Sell_Price: trade.Sell_price ? trade.Sell_price.toFixed(6) : "N/A",
  Sell_PL: trade.Sell_pl ? trade.Sell_pl.toFixed(6) : "N/A",
  Close_Price: trade.Close_price ? trade.Close_price.toFixed(6) : "N/A", // ✅ Newly Added
  Commission: trade.Commission ? `$${trade.Commission.toFixed(2)}` : "N/A",
  Commision_Journey: trade.Commision_journey ? "✅ Yes" : "❌ No",
  PL_After_Comm: trade.Pl_after_comm ? `$${trade.Pl_after_comm.toFixed(2)}` : "N/A",
  Profit_Journey: trade.Profit_journey ? "✅ Yes" : "❌ No",
  Signal_From: trade.SignalFrom || "N/A", // ✅ Newly Added
  Type: trade.Type || "N/A", // ✅ Newly Added
  Timestamp: trade.SignalFrom || "N/A",
  Date: trade.Candel_time ? trade.Candel_time.split(" ")[0] : "N/A",
  Min_close: trade.Min_close
});
const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [tradeData, setTradeData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [machines, setMachines] = useState([]);
  const [signalRadioMode, setSignalRadioMode] = useState(false);
  
  const [selectedSignals, setSelectedSignals] = useState({
    "2POLE_IN5LOOP": true,
    "IMACD": true,
    "2POLE_Direct_Signal": true,
    "HIGHEST SWING HIGH": true,
    "LOWEST SWING LOW": true,
    "NORMAL SWING HIGH": true,
    "NORMAL SWING LOW": true,

  });
  const [selectedMachines, setSelectedMachines] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const tradeRes = await fetch("https://lab-code-xqtq.onrender.com/api/trades");
            const tradeJson = tradeRes.ok ? await tradeRes.json() : { trades: [] };
            const trades = Array.isArray(tradeJson.trades) ? tradeJson.trades : [];

            const machinesRes = await fetch("https://lab-code-xqtq.onrender.com/api/machines"); 
            const machinesJson = machinesRes.ok ? await machinesRes.json() : { machines: [] };
            const machinesList = Array.isArray(machinesJson.machines) ? machinesJson.machines : [];

            const logRes = await fetch("/logs.json");
            const logJson = logRes.ok ? await logRes.json() : { logs: [] };
            const logs = Array.isArray(logJson.logs) ? logJson.logs : [];

            setMachines(machinesList);
            setTradeData(trades);
            setLogData(logs);
            
            setClientData(machinesList);

            if (Object.keys(selectedMachines).length === 0) {
                const savedMachines = localStorage.getItem("selectedMachines");
                if (savedMachines) {
                    setSelectedMachines(JSON.parse(savedMachines)); // ✅ Load from storage first
                } else {
                    const activeMachines = machinesList.reduce((acc, machine) => {
                        if (machine.Active) acc[machine.MachineId] = true;
                        return acc;
                    }, {});
                    setSelectedMachines(activeMachines); 
                    localStorage.setItem("selectedMachines", JSON.stringify(activeMachines)); // ✅ Save to prevent resets
                }
            }
        } catch (error) { 
            console.error("❌ Error fetching data:", error);
            setTradeData([]);
        }
    };
    
    
    fetchData();
    const interval = setInterval(fetchData, 1000); // ✅ Fetch every second
    return () => clearInterval(interval);
}, []); 
const filteredTradeData = tradeData && Array.isArray(tradeData)
  ? tradeData.filter(trade =>
      selectedSignals[trade.SignalFrom] !== undefined &&
      selectedSignals[trade.SignalFrom] &&
      selectedMachines[trade.MachineId] !== undefined &&
      selectedMachines[trade.MachineId]
    )
  : []; 
  useEffect(() => {
         
        
    
    // ✅ If tradeData is undefined, assign an empty array

        // 🔹 Total Investment Calculation
        const totalInvestment = filteredTradeData.reduce((sum, trade) => sum + (trade.Investment || 0), 0);
        let investmentAvailable = 50000 - totalInvestment;
        investmentAvailable = investmentAvailable < 0 ? 0 : investmentAvailable; // ✅ Prevent negative values

        // 🔹 Ensure grand_total is handled safely
        const totalProfit = filteredTradeData.reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        const plus = filteredTradeData
          .filter(trade => trade.Pl_after_comm > 0) // ✅ Correct field reference
          .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0); // ✅ Consistent field usage
        const minus = filteredTradeData
          .filter(trade => trade.Pl_after_comm < 0) // ✅ Correct field reference
          .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0); // ✅ Consistent field usage
        const closePlus = filteredTradeData
          .filter(trade => trade.Pl_after_comm > 0 & trade.Type === "close") // ✅ Correct field reference
          .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        const closeMinus = filteredTradeData
          .filter(trade => trade.Pl_after_comm < 0 & trade.Type === "close") // ✅ Correct field reference
          .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        const runningPlus = filteredTradeData
          .filter(trade => trade.Pl_after_comm > 0 & trade.Type === "running") // ✅ Correct field reference
          .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        const runningMinus = filteredTradeData
          .filter(trade => trade.Pl_after_comm < 0 & trade.Type === "running") // ✅ Correct field reference
          .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        const closedProfit = filteredTradeData
            .filter(trade => trade.Type === "close")
            .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        const runningProfit = totalProfit - closedProfit;

       
        
        // console.log("Trades Data:", trades);
        // console.log("Total profit : ", totalProfit);
        // console.log("Total Investment Calculation:", totalInvestment);
        // console.log("Total profit journey:", trades.filter(trade => trade.Profit_journey === false ).length);
        // console.log("Profit after closing trades:", closedProfit); // ✅ DEBUG LOG
        // console.log("Profit after closing trades:", runningProfit); // ✅ DEBUG LOG
        // console.log("🔍 Selected Signals:", selectedSignals);
        // console.log("🔍 Selected Machines:", selectedMachines);
// Min_close
// : 
// "Min_close"
        console.log("🔍 Filtered Trade Data:", filteredTradeData);


        // 🔹 Format dates for comparison
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().split("T")[0];

        // 🔹 Set Metrics (Dashboard Data)
        setMetrics(prevMetrics => ({
          ...prevMetrics, 

          "Profit_+_Loss_=_Total_Profit $": `${plus.toFixed(2)} + ${minus.toFixed(2)} = ${totalProfit.toFixed(2)}`,
          "Profit_+_Loss_=_Closed_Profit $": `${closePlus.toFixed(2)} + ${closeMinus.toFixed(2)} = ${closedProfit.toFixed(2)}`, // ✅ NEW DATA ADDED
          "Profit_+_Loss_=_Running_Profit $": `${runningPlus.toFixed(2)} + ${runningMinus.toFixed(2)} = ${runningProfit.toFixed(2)}`, // ✅ NEW DATA ADDE
          Total_Clients: `${machines.filter(machine => machine.Active).length} / ${machines.length}`,
          Total_Trades: filteredTradeData.length,
          "Running_/_Total_Buy": `${filteredTradeData.filter(trade => trade.Action === "BUY" && trade.Type === "running").length} / ${filteredTradeData.filter(trade => trade.Action === "BUY").length}`,
          "Running_/_Total_Sell": `${filteredTradeData.filter(trade => trade.Action === "SELL" && trade.Type === "running").length}  /  ${filteredTradeData.filter(trade => trade.Action === "SELL").length}`,
          // profit_journey: trades.filter(trade => trade.Profit_journey).length,
          // total_hedge: trades.filter(trade => trade.Hedge).length,
          // Total_Hedge: filteredTradeData.filter(trade => trade.Hedge === true || trade.Hedge?.toString().toLowerCase() === "true").length,
          // todays_count: trades.filter(trade => trade.Candle_time && trade.Candle_time.startsWith(today)).length, // ✅ FIXED
          "Assign_/_Running_/_Closed Count": `${filteredTradeData.filter(trade => trade.Type === "assign").length} / ${filteredTradeData.filter(trade => trade.Type === "running").length} / ${filteredTradeData.filter(trade => trade.Type === "close").length}`,
          // yesterdays_count: trades.filter(trade => trade.Candle_time && trade.Candle_time.startsWith(yesterdayDate)).length, // ✅ FIXED
          // Comission_Journey_Crossed : filteredTradeData.filter(trade => trade.Commision_journey === true  ).length,
          Comission_Point_Crossed: filteredTradeData.filter(trade => trade.Commision_journey === true && trade.Type === "running" && trade.Profit_journey === false).length,
          Profit_Journey_Crossed: filteredTradeData.filter(trade => trade.Profit_journey === true && trade.Type === "running" ).length,
          Below_Commision_Point: filteredTradeData.filter(trade => trade.Commision_journey === false && trade.Type === "running" ).length,
          Closed_After_Comission_Point: filteredTradeData.filter(trade => trade.Commision_journey === true && trade.Type === "close" && trade.Profit_journey === false ).length,
          Close_in_Loss : filteredTradeData.filter(trade => trade.Pl_after_comm < 0 && trade.Type === "close").length,
          Close_After_Profit_Journey: filteredTradeData.filter(trade => trade.Profit_journey === true && trade.Type === "close" ).length,
          Total_Investment: isNaN(totalInvestment) ? "$0" : `$${totalInvestment.toFixed(2)}`,
          Investment_Available: isNaN(investmentAvailable) ? "$0" : `$${investmentAvailable.toFixed(2)}`,
          Close_in_Profit : filteredTradeData.filter(trade => trade.Pl_after_comm > 0 && trade.Type === "close").length,
          Close_Curve_in_Loss : `${filteredTradeData.filter(trade => trade.Pl_after_comm < 0  &&  trade.Type === "close" && trade.Commision_journey === true).length} / $${filteredTradeData
            .filter(trade => trade.Pl_after_comm < 0 && trade.Type === "close" && trade.Commision_journey === true)// ✅ Correct field reference
            .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0).toFixed(2)}`,
          Min_Close_Profit : `${filteredTradeData.filter(trade => trade.Min_close === "Min_close"  &&  trade.Type === "close" && trade.Pl_after_comm > 0).length} 
          = $${filteredTradeData
            .filter(trade => trade.Min_close === "Min_close"  &&  trade.Type === "close" && trade.Pl_after_comm > 0)
            .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0).toFixed(2)}`,
          Min_Close_Loss : `${filteredTradeData.filter(trade => trade.Min_close === "Min_close"  &&  trade.Type === "close" && trade.Pl_after_comm < 0).length} 
          = $${filteredTradeData
            .filter(trade => trade.Min_close === "Min_close"  &&  trade.Type === "close" && trade.Pl_after_comm < 0)
            .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0).toFixed(2)}`,
        }));
        
   
}, [tradeData, selectedSignals, selectedMachines]);
useEffect(() => {
  const savedSignals = localStorage.getItem("selectedSignals");
  const savedMachines = localStorage.getItem("selectedMachines");

  if (savedSignals) {
    const parsed = JSON.parse(savedSignals);
    // ✅ Merge with any new signal keys not saved previously
    const merged = {
      "2POLE_IN5LOOP": true,
      "IMACD": true,
      "2POLE_Direct_Signal": true,
      "HIGHEST SWING HIGH": true,
    "LOWEST SWING LOW": true,
    "NORMAL SWING HIGH": true,
    "NORMAL SWING LOW": true,
      ...parsed // this will override saved ones
    };
    setSelectedSignals(merged);
  }

  if (savedMachines) {
    setSelectedMachines(JSON.parse(savedMachines));
  }
}, []);

  const toggleBox = (title) => {
                                    setSelectedBox(selectedBox === title ? null : title);
                                        };
  const toggleSignal = (signal) => {
  setSelectedSignals(prev => {
    const updatedSignals = { ...prev, [signal]: !prev[signal] };
    localStorage.setItem("selectedSignals", JSON.stringify(updatedSignals)); // ✅ Save instantly
    return updatedSignals;
  });
  };

  
const toggleMachine = (machineId) => {
  setSelectedMachines(prev => {
      const updatedMachines = { ...prev, [machineId]: !prev[machineId] };
      localStorage.setItem("selectedMachines", JSON.stringify(updatedMachines)); // ✅ Save instantly
      return updatedMachines;
  });
};
useEffect(() => {
  if (signalRadioMode) {
    const selected = Object.keys(selectedSignals).find((key) => selectedSignals[key]);
    if (selected) {
      const updated = {};
      Object.keys(selectedSignals).forEach((key) => {
        updated[key] = key === selected;
      });
      setSelectedSignals(updated);
      localStorage.setItem("selectedSignals", JSON.stringify(updated));
    }
  }
}, [signalRadioMode]);                               
return (
  <div className="flex">
    {/* Sidebar */}
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

    <div className={`flex-1 min-h-screen transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} overflow-hidden`}>
      <div className="p-8">
        {/* ✅ Dashboard Title */}
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">LAB Dashboard</h1>

{/* ✅ Signal Filter Checkboxes */}
<div className="flex flex-col space-y-2 mb-4">
  
  {/* ✅ Toggle Mode Button */}
  <div className="flex items-center space-x-2">
    <span className="font-semibold text-gray-800">Signal Filter Mode:</span>
    <button
      onClick={() => setSignalRadioMode(prev => !prev)}
      className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
    >
      {signalRadioMode ? "🔘 Radio Mode" : "☑️ Checkbox Mode"}
    </button>
  </div>

  {/* ✅ Select All / Deselect All only when Checkbox Mode */}
  {!signalRadioMode && (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => {
          const allTrue = {};
          Object.keys(selectedSignals).forEach(key => allTrue[key] = true);
          setSelectedSignals(allTrue);
          localStorage.setItem("selectedSignals", JSON.stringify(allTrue));
        }}
        className="bg-green-600 text-white text-sm px-2 py-1 rounded"
      >
        ✅ Select All
      </button>
      <button
        onClick={() => {
          const allFalse = {};
          Object.keys(selectedSignals).forEach(key => allFalse[key] = false);
          setSelectedSignals(allFalse);
          localStorage.setItem("selectedSignals", JSON.stringify(allFalse));
        }}
        className="bg-red-600 text-white text-sm px-2 py-1 rounded"
      >
        ❌ Deselect All
      </button>
    </div>
  )}

  {/* ✅ Signal Inputs */}
  <div className="flex flex-wrap items-center gap-4">
    {Object.keys(selectedSignals).map((signal) => (
      <label key={signal} className="flex items-center space-x-2">
        {signalRadioMode ? (
          <input
            type="radio"
            name="signalFilterRadio"
            checked={selectedSignals[signal]}
            onChange={() => {
              const updated = {};
              Object.keys(selectedSignals).forEach((key) => {
                updated[key] = key === signal;
              });
              setSelectedSignals(updated);
              localStorage.setItem("selectedSignals", JSON.stringify(updated));
            }}
            className="form-radio h-5 w-5 text-blue-600"
          />
        ) : (
          <input
            type="checkbox"
            checked={selectedSignals[signal]}
            onChange={() => toggleSignal(signal)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        )}
        <span className="text-gray-700 font-semibold">{signal}</span>
      </label>
    ))}
  </div>

        </div>
        {/* ✅ Machine Filter Checkboxes */}
        <div className="flex items-center space-x-4 mb-4">
          {machines
            .filter(machine => machine.Active) // ✅ NEW CHANGE: Show only active machines
            .map((machine) => (
              <label key={machine.MachineId} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedMachines[machine.MachineId] || false}
                  onChange={() => toggleMachine(machine.MachineId)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="text-gray-700 font-semibold">{machine.MachineId}</span>
              </label>
            ))}
        </div>
        
        
        {/* ✅ Dashboard Cards */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.entries(metrics).map(([title, value]) => (
              <DashboardCard 
                key={title} 
                title={title} 
                value={value} 
                isSelected={selectedBox === title} 
                onClick={() => toggleBox(title)} 
              />
            ))}
          </div>
        )}
        
        {/* ✅ Data Table */}
        
        {selectedBox && (
          
  <TableView 
  
    title={selectedBox} 
    tradeData={filteredTradeData || []}  // ✅ Prevents undefined error
    clientData={clientData || []}  // ✅ Ensures clientData is valid
    logData={logData || []}  // ✅ Ensures logData is valid
  />
  
)}

      </div>
    </div>
  </div>
);
};

export default Dashboard;