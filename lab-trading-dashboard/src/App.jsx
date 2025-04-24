

import React, { useState, useEffect, useMemo } from "react";
import { Home, BarChart, Users, FileText, Menu, X, Plus } from "lucide-react";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from "moment";



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

const DashboardCard = ({ title, value, isSelected, onClick, filteredTradeData }) =>  {

const [actionRadioMode, setActionRadioMode] = useState(false);
const [selectedActions, setSelectedActions] = useState({
  BUY: true,
  SELL: true,
});
const [includeMinClose, setIncludeMinClose] = useState(true);

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
  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 transform
    ${isSelected
      ? "bg-gradient-to-br from-blue-900 to-green-500 scale-[1.03] shadow-lg ring-4 ring-yellow-600 border-yellow-700 text-gray-900"
      : "bg-gradient-to-br from-blue-800 to-indigo-900 hover:scale-[1.03] hover:shadow-xl hover:ring-4 hover:ring-yellow-400/60 hover:border-yellow-500/70 text-white"}`}
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

const TableView = ({ title, tradeData, clientData, logData }) => {

  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  const [selectedRow, setSelectedRow] = useState(null);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key] || "";
      const bVal = b[sortConfig.key] || "";

      if (!isNaN(aVal) && !isNaN(bVal)) {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [filteredData, sortConfig]);

  useEffect(() => {
    if (!tradeData || tradeData.length === 0) return;
  
    const result = tradeData.map((trade, index) => formatTradeData(trade, index));
    setFilteredData(result);
  }, [title, tradeData]);

const handleOpenReport = (title, sortedData) => {
  if (!sortedData || sortedData.length === 0) return;
  const reportWindow = window.open("", "_blank", "width=1200,height=600");

  if (!sortedData || sortedData.length === 0 || typeof sortedData[0] !== "object") {
    return ;
  }
  const tableHeaders = sortedData.length > 0 && typeof sortedData[0] === "object" ? Object.keys(sortedData[0]) : [];
  

  const reportContent = `
    <html>
      <head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
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
<button onclick="exportToExcel()" style="
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  margin-bottom: 20px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
">
  📥 Export to Excel
</button> 
thead th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgb(40, 137, 148);
  color: white;
  padding: 8px 10px;
  font-size: 13px;
  border-bottom: 2px solid white;
  text-align: center;
  vertical-align: middle;
  white-space: normal;
}

/* 🔹 Apply sticky to first 3 columns with correct offsets */
.sticky-col-1 {
  position: sticky;
  left: 0px;
  z-index: 3;
  background: rgb(4, 110, 122);
  color: white;
}

.sticky-col-2 {
  position: sticky;
  left: 110px; /* 110px = width of column 1 */
  z-index: 3;
  background: rgb(4, 110, 122);
  color: white;
}

.sticky-col-3 {
  position: sticky;
  left: 240px; /* 110px + 130px = width of col 1 + col 2 */
  z-index: 3;
  background: rgb(4, 110, 122);
  color: white;
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
.sticky-col-1 {
  position: sticky;
  left: 0px;
  z-index: 4;
  background: rgb(4, 110, 122);
  color: white;
  min-width: 90px;
  max-width: 90px;
}
.sticky-col-2 {
  position: sticky;
  left: 90px;
  z-index: 4;
  background: rgb(4, 110, 122);
  color: white;
  min-width: 100px;
  max-width: 100px;
}
.sticky-col-3 {
  position: sticky;
  left: 190px;
  z-index: 4;
  background: rgb(4, 110, 122);
  color: white;
  min-width: 170px;
  max-width: 170px;
}

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
    .highlighted-row {
  background-color:rgb(190, 204, 0) !important;
  color: black !important;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
  box-shadow: inset 0 0 0 2px #005fa3, 0 0 5px rgba(0, 0, 0, 0.2);
}
  
tr:hover {
  background-color: #bbf7d0 !important; /* light green hover */
  transform: scale(1.003);
  border-left: 2px solid #3b82f6; /* blue border on hover */
  transition: all 0.2s ease-in-out;
}

/* ✨ Stylish selected row effect */
tr.highlighted-row {
  background: linear-gradient(to right, #facc15, #f59e0b); /* yellow-300 to yellow-500 */
  font-weight: 800;
  color: black;
  border-left: 4px solid #b45309; /* deep yellow border */
  border-radius: 6px;
  transform: scale(1.01);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  font-size: 14px;

        </style>
      </head>
      <body>
        <h2>${title.replace(/_/g, " ")} Details</h2>
        <input type="text" id="searchBox" placeholder="🔍 Type to filter rows..." onkeyup="filterRows()" />
<button onclick="exportToExcel()" style="
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  margin-bottom: 20px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
">
  📥 Export to Excel
</button>
        <table id="reportTable">
          <thead>
            <tr>
            ${tableHeaders.map((key, index) => {
              const stickyClass = index < 3 ? `sticky-col sticky-col-${index + 1}` : "";
              return `<th onclick="sortTable(${index})" class="${stickyClass}" data-index='${index}'>${key.replace(/_/g, " ")}</th>`;            }).join("")}
            </tr>
          </thead>
        <tbody id="tableBody">
            ${sortedData.map(item => `
              <tr class="transition-all duration-200 hover:bg-yellow-100 hover:shadow hover:scale-[1.01] cursor-pointer">${tableHeaders.map((key, index) => {
                const stickyClass = index < 3 ? `sticky-col sticky-col-${index + 1}` : "";

                if (key === "Unique_ID" && typeof item[key] === "string") {
                  const id = item[key];
                  const match = id.match(/(\d{4}-\d{2}-\d{2})/); // match full date like 2025-03-30
                  if (match) {
                    const splitIndex = id.indexOf(match[0]);
                    const pair = id.slice(0, splitIndex).toUpperCase();
                    const timestamp = id.slice(splitIndex).replace("T", " ");
                    return `<td class="${stickyClass}">
                      <div style="font-weight: bold; font-size: 13px;">${pair}</div>
                      <div style="font-size: 11px; opacity: 0.8; margin-top: 2px;">${timestamp}</div>
                    </td>`;
                  } else {
                    // ⚠️ If no date found, return raw ID safely
                    return `<td class="${stickyClass}">${id}</td>`;
                  }
                }

                // ✅ Default rendering for all other columns
                return `<td class="${stickyClass}">${item[key]}</td>`;
              }).join("")}</tr>
            `).join("")}
          </tbody>


        </table>

        <script >
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

  // ✅ Fix: Attach event listeners right away after page loads
  document.getElementById("tableBody").addEventListener("click", function (e) {
  const clickedRow = e.target.closest("tr");
  if (!clickedRow) return;

  // Remove highlight from all rows
  Array.from(this.rows).forEach(row => row.classList.remove("highlighted-row"));

  // Add highlight to clicked row
  clickedRow.classList.add("highlighted-row");
});// Small delay to ensure table renders first
  
  function exportToExcel() {
  const table = document.getElementById("reportTable");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(table);

  // Format all date fields to include full date + time
  const dateFields = [
    "Candle Time",
    "Fetcher Trade Time",
    "Operator Trade Time",
    "Operator Close Time"
  ];

  const headerRow = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];

  const dateColIndexes = dateFields.map(field => headerRow.indexOf(field)).filter(i => i !== -1);

  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const formatted = data.map((row, rowIndex) => {
  if (rowIndex === 0) return row; // headers
  return row.map((cell, colIndex) => {
    if (dateColIndexes.includes(colIndex)) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel starts at 1900-01-01
  const days = parseFloat(cell);
  if (!isNaN(days)) {
    const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
    return date.toISOString().replace("T", " ").slice(0, 19);
  }
  return cell;
}
    return cell;
  });
});

  const newWs = XLSX.utils.aoa_to_sheet(formatted);
  XLSX.utils.book_append_sheet(wb, newWs, "Report");
  XLSX.writeFile(wb, "Lab_Trade_Report.xlsx");
}
  </script>      </body>
      </html>
    `;

  reportWindow.document.write(reportContent);
};

// ✅ SAFE to render fallback after all hooks
// if (!tradeData || tradeData.length === 0) {
//   return <p className="text-center text-gray-500 mt-4">⚠️ No data available for {title}</p>;
// }


  // ✅ SORT FUNCTION
  const sortTable = (key) => {
    setSortConfig((prevConfig) => {
      const direction = prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
  };
  

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  
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
          .filter(trade => trade.Commision_journey === true && trade.Pl_after_comm > 0 && trade.Profit_journey === false && trade.Type === "running" )
          .map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Profit_Journey_Crossed":
        result = tradeData
          .filter(trade => trade.Profit_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running" )
          .map((trade, index) => formatTradeData(trade, index));
        break;
  
      case "Below_Commision_Point":
        result = tradeData
          .filter(trade =>  trade.Pl_after_comm < 0 && trade.Type === "running" )
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

        case "Close_in_Profit":
          result = tradeData
            .filter(trade => trade.Type === "close" && trade.Pl_after_comm > 0)
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
      case "Min_Close_Profit":
        result = tradeData
        .filter(trade => trade.Type === "close" && trade.Min_close === "Min_close" && trade.Pl_after_comm > 0 )
        .map((trade, index) => formatTradeData(trade, index));
      break;
      case "Min_Close_Loss":
        result = tradeData
        .filter(trade => trade.Type === "close" && trade.Min_close === "Min_close" && trade.Pl_after_comm < 0 )
        .map((trade, index) => formatTradeData(trade, index));
      break;

  
      default:
        result = [];
    }
  
    setFilteredData(result);
  }, [title, tradeData]);

  if (!tradeData || tradeData.length === 0) {
    return <p className="text-center text-gray-500 mt-4">⚠️ No data available for {title}</p>;
  }
  if (filteredData.length === 0) {
    return <p className="text-center text-gray-500 mt-4">⚠️ No relevant data available for {title}</p>;
  }
  const getStickyClass = (index) => {
    if (index === 0)
      return "sticky left-0 z-[5] bg-[#046e7a] text-white min-w-[110px] max-w-[110px]";
    if (index === 1)
      return "sticky left-[110px] z-[5] bg-[#046e7a] text-white min-w-[130px] max-w-[130px]";
    if (index === 2)
  return "sticky left-[190px] z-[5] bg-[#046e7a] text-white min-w-[130px] max-w-[130px]";
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
   <tr
   key={rowIndex}
   className={`border-b cursor-pointer transition-all duration-200 ${
     selectedRow === rowIndex
       ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black text-[15px] font-bold shadow-xl border-l-4 border-yellow-700 rounded-md"
       : "hover:bg-green-200 hover:scale-[1.001] hover:border-l-2 hover:border-blue-500"
   }`}
   onClick={() => setSelectedRow(prev => prev === rowIndex ? null : rowIndex)}
 >
     {Object.entries(item).map(([key, val], colIndex) => (
  <td
    key={colIndex}
    className={`
      px-2 py-1 border whitespace-nowrap align-top text-sm
      ${colIndex === 0 && "min-w-[90px] max-w-[90px] sticky left-0 bg-[#046e7a] text-white z-[5] text-xs"}
      ${colIndex === 1 && "min-w-[100px] max-w-[100px] sticky left-[90px] bg-[#046e7a] text-white z-[5] text-[10px] font-light"}
      ${colIndex === 2 && "min-w-[170px] max-w-[170px] sticky left-[190px] bg-[#046e7a] text-white z-[5] text-[12px] leading-snug"}
      ${["Candle_Time", "Fetcher_Trade_Time", "Operator_Trade_Time", "Operator_Close_Time"].includes(key) ? "text-[11px]" : ""}
    `}
  >
    {key === "Unique_ID" && typeof val === "string" && val.match(/\d{4}-\d{2}-\d{2}/) ? (
      (() => {
        const match = val.match(/\d{4}-\d{2}-\d{2}/);
        const splitIndex = val.indexOf(match[0]);
        const pair = val.slice(0, splitIndex);
        const timestamp = val.slice(splitIndex).replace("T", " ");
        return (
          <>
            <div className="font-bold text-[13px] leading-tight">{pair}</div>
            <div className="text-[11px] opacity-80 -mt-[2px] leading-tight">{timestamp}</div>
          </>
        );
      })()
    ) : (
      val
    )}
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
const safeFixed = (val, digits = 2, prefix = "") => {
  const num = parseFloat(val);
  return isNaN(num) ? "N/A" : `${prefix}${num.toFixed(digits)}`;
};
const formatDateTime = (val) => {
  if (!val || val === "N/A") return "N/A";
  try {
    const parsed = moment(val);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD HH:mm:ss") : "N/A";
  } catch {
    return "N/A";
  }
};

const formatTradeData = (trade, index) => ({
  "S No": index + 1,
  MachineId: trade.MachineId || "N/A",
  Unique_ID: trade.Unique_id || "N/A",

  Candle_Time: formatDateTime(trade.Candel_time),
Fetcher_Trade_Time: formatDateTime(trade.Fetcher_Trade_time),
Operator_Trade_Time: formatDateTime(trade.Operator_Trade_time),
Operator_Close_Time: formatDateTime(trade.Operator_Close_time),
  Pair: trade.Pair || "N/A",
  Investment: safeFixed(trade.Investment, 2, "$"),
  Interval: trade.Interval || "N/A",
  Stop_Price: safeFixed(trade.Stop_price, 6),
  Save_Price: safeFixed(trade.Save_price, 6),
  Min_Comm: safeFixed(trade.Min_comm, 6),
  Hedge: trade.Hedge ? "✅ Yes" : "❌ No",
  Hedge_1_1_Bool: trade.Hedge_1_1_bool ? "✅ Yes" : "❌ No",
  Hedge_Order_Size: trade.Hedge_order_size || "N/A",
  Min_Comm_After_Hedge: safeFixed(trade.Min_comm_after_hedge, 6),
  Min_Profit: safeFixed(trade.Min_profit, 2, "$"),
  Action: trade.Action || "N/A",
  Buy_Qty: trade.Buy_qty || 0,
  Buy_Price: safeFixed(trade.Buy_price, 6),
  Buy_PL: safeFixed(trade.Buy_pl, 6),
  Added_Qty: trade.Added_qty || "N/A",
  Sell_Qty: trade.Sell_qty || 0,
  Sell_Price: safeFixed(trade.Sell_price, 6),
  Sell_PL: safeFixed(trade.Sell_pl, 6),
  Close_Price: safeFixed(trade.Close_price, 6),
  Commission: safeFixed(trade.Commission, 2, "$"),
  Commision_Journey: trade.Commision_journey ? "✅ Yes" : "❌ No",
  PL_After_Comm: safeFixed(trade.Pl_after_comm, 2, "$"),
  Profit_Journey: trade.Profit_journey ? "✅ Yes" : "❌ No",
  Signal_From: trade.SignalFrom || "N/A",
  Type: trade.Type || "N/A",
  Timestamp: trade.SignalFrom || "N/A",
  Date: trade.Candel_time ? trade.Candel_time.split(" ")[0] : "N/A",
  Min_close: trade.Min_close,
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
  const [machineRadioMode, setMachineRadioMode] = useState(false);
  const [includeMinClose, setIncludeMinClose] = useState(true);
  const [signalToggleAll, setSignalToggleAll] = useState(() => {
    const saved = localStorage.getItem("selectedSignals");
    if (saved) {
      const parsed = JSON.parse(saved);
      const allSelected = Object.values(parsed).every((val) => val === true);
      return allSelected ? false : true; // If all selected, button should show ❌ Uncheck
    }
    return true; // Default
  });
  const [machineToggleAll, setMachineToggleAll] = useState(true);
  const signalLabels = {
    "2POLE_IN5LOOP": "2P_L",
    "IMACD": "IMACD",
    "2POLE_Direct_Signal": "2P_DS",
    "HIGHEST SWING HIGH": "HSH",
    "LOWEST SWING LOW": "LSL",
    "NORMAL SWING HIGH": "NSH",
    "NORMAL SWING LOW": "NSL",
    "ProGap":"PG",
    "CrossOver": "CO",
    "Kicker":"KR",
  };
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);



  const [selectedSignals, setSelectedSignals] = useState({
    "2POLE_IN5LOOP": true,
    "IMACD": true,
    "2POLE_Direct_Signal": true,
    "HIGHEST SWING HIGH": true,
    "LOWEST SWING LOW": true,
    "NORMAL SWING HIGH": true,
    "NORMAL SWING LOW": true,
    "ProGap": true,
    "CrossOver": true,
    "Kicker": true,

  });
  const [intervalRadioMode, setIntervalRadioMode] = useState(false);
  const [actionRadioMode, setActionRadioMode] = useState(false);

const [selectedActions, setSelectedActions] = useState({
  BUY: true,
  SELL: true,
});
const [selectedIntervals, setSelectedIntervals] = useState({
  "1m": true,
  "3m": true,
  "5m": true,
  "15m": true,
  "30m": true,
  "1h": true,
  "4h": true,
});
  const [selectedMachines, setSelectedMachines] = useState({});
  const [dateKey, setDateKey] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const tradeRes = await fetch("https://lab-code-37fy.onrender.com/api/trades");
            const tradeJson = tradeRes.ok ? await tradeRes.json() : { trades: [] };
            const trades = Array.isArray(tradeJson.trades) ? tradeJson.trades : [];

            const machinesRes = await fetch("https://lab-code-37fy.onrender.com/api/machines"); 
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
    const interval = setInterval(fetchData, 20000); // ✅ Fetch every second
    return () => clearInterval(interval);
}, []); 
const filteredTradeData = useMemo(() => {
  if (!Array.isArray(tradeData)) return [];

  return tradeData.filter(trade => {

    if (!includeMinClose && trade.Min_close === "Min_close") return false;
    const isSignalSelected = selectedSignals[trade.SignalFrom];
    const isMachineSelected = selectedMachines[trade.MachineId];
    const isIntervalSelected = selectedIntervals[trade.Interval];
    const isActionSelected = selectedActions[trade.Action];

    // ✅ Handle missing or malformed Candle time
    if (!trade.Candel_time) return false;

    const tradeTime = moment(trade.Candel_time); // ⏳ Parse to moment

    // ✅ Check if within selected date & time range
    const isDateInRange = (!fromDate || tradeTime.isSameOrAfter(fromDate)) &&
                          (!toDate || tradeTime.isSameOrBefore(toDate));

    return isSignalSelected && isMachineSelected && isIntervalSelected && isActionSelected && isDateInRange;
  });
}, [tradeData, selectedSignals, selectedMachines, selectedIntervals, selectedActions, fromDate, toDate, includeMinClose]);

const getFilteredForTitle = useMemo(() => {
  const memo = {};

  (filteredTradeData || []).forEach((trade) => {
    const pushTo = (key) => {
      if (!memo[key]) memo[key] = [];
      memo[key].push(trade);  // ✅ Only push raw trade here
    };

    pushTo("Total_Trades");

    if (trade.Type === "close") pushTo("Profit_+_Loss_=_Closed_Profit $");
    if (trade.Type === "running") pushTo("Profit_+_Loss_=_Running_Profit $");
    if (["assign", "running", "close"].includes(trade.Type)) pushTo("Assign_/_Running_/_Closed Count");

    if (trade.Action === "BUY" && trade.Type === "running") {
      pushTo("Running_/_Total_Buy");
    }

    if (trade.Action === "SELL" && trade.Type === "running") {
      pushTo("Running_/_Total_Sell");
    }

    if (trade.Commision_journey && trade.Pl_after_comm > 0 && trade.Profit_journey === false && trade.Type === "running" ) pushTo("Comission_Point_Crossed");
    if (trade.Profit_journey && trade.Pl_after_comm > 0 && trade.Type === "running"  ) pushTo("Profit_Journey_Crossed");
    if (trade.Pl_after_comm < 0 && trade.Type === "running" ) pushTo("Below_Commision_Point");

    if (trade.Type === "close" && trade.Commision_journey && !trade.Profit_journey) pushTo("Closed_After_Comission_Point");
    if (trade.Type === "close" && trade.Pl_after_comm < 0) pushTo("Close_in_Loss");
    if (trade.Type === "close" && trade.Pl_after_comm > 0) pushTo("Close_in_Profit");
    if (trade.Type === "close" && trade.Profit_journey) pushTo("Close_After_Profit_Journey");
    if (trade.Type === "close" && trade.Commision_journey && trade.Pl_after_comm < 0) pushTo("Close_Curve_in_Loss");

    if (trade.Type === "close" && trade.Min_close === "Min_close") {
      if (trade.Pl_after_comm > 0) pushTo("Min_Close_Profit");
      if (trade.Pl_after_comm < 0) pushTo("Min_Close_Loss");
    }

    pushTo("Profit_+_Loss_=_Total_Profit $");
  });

  return memo;
}, [filteredTradeData]);

  useEffect(() => {
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
          Comission_Point_Crossed: filteredTradeData.filter(trade => trade.Commision_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running" && trade.Profit_journey === false).length,
          Profit_Journey_Crossed: filteredTradeData.filter(trade => trade.Profit_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running"  ).length,
          Below_Commision_Point: filteredTradeData.filter(trade => trade.Pl_after_comm < 0 && trade.Type === "running" ).length,
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
        
   
}, [tradeData, selectedSignals, selectedMachines, selectedIntervals, selectedActions, fromDate, toDate, includeMinClose]);

useEffect(() => {
  const savedSignals = localStorage.getItem("selectedSignals");
  const savedMachines = localStorage.getItem("selectedMachines");

  if (savedSignals) {
    const parsed = JSON.parse(savedSignals);
    const merged = {
      "2POLE_IN5LOOP": true,
      "IMACD": true,
      "2POLE_Direct_Signal": true,
      "HIGHEST SWING HIGH": true,
      "LOWEST SWING LOW": true,
      "NORMAL SWING HIGH": true,
      "NORMAL SWING LOW": true,
      "ProGap": true,
      "CrossOver": true,
      "Kicker": true,
      ...parsed,
    };
    setSelectedSignals(merged);
    const allSelected = Object.values(merged).every((val) => val === true);
    setSignalToggleAll(!allSelected); // ✅ sync toggle button state
  }

  if (savedMachines) {
    setSelectedMachines(JSON.parse(savedMachines));
  }
}, []);
const toggleInterval = (interval) => {
  setSelectedIntervals(prev => {
    const updated = { ...prev, [interval]: !prev[interval] };
    localStorage.setItem("selectedIntervals", JSON.stringify(updated));
    return updated;
  });
};

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
useEffect(() => {
  if (intervalRadioMode) {
    const selected = Object.keys(selectedIntervals).find(key => selectedIntervals[key]);
    if (selected) {
      const updated = {};
      Object.keys(selectedIntervals).forEach((key) => {
        updated[key] = key === selected;
      });
      setSelectedIntervals(updated);
      localStorage.setItem("selectedIntervals", JSON.stringify(updated));
    }
  }
}, [intervalRadioMode]);                         
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
    <span className="font-semibold text-gray-800">Signal :</span> <span></span><span></span>
    <button
      onClick={() => setSignalRadioMode(prev => !prev)}
      className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
    >
      {signalRadioMode ?"🔘 Check" :"☑️ Radio"}
    </button>
  {/* ✅ Select All / Deselect All only when Checkbox Mode */}
  {!signalRadioMode && (
    <button
      onClick={() => {
        const newState = {};
        Object.keys(selectedSignals).forEach(key => newState[key] = signalToggleAll);
        setSelectedSignals(newState);
        setSignalToggleAll(!signalToggleAll);
        localStorage.setItem("selectedSignals", JSON.stringify(newState));
      }}
      className={`text-white text-sm px-2 py-1 rounded w-fit ${
        Object.values(selectedSignals).every(v => v === true)
          ? "bg-blue-600 hover:bg-blue-700"
        : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {signalToggleAll ?"✅>------All" :"❌ Uncheck" }
    </button>
)}<span></span> <span></span> 
{/* ✅ Signal Inputs */}
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
        <span className="text-gray-700 font-semibold">{signalLabels[signal] || signal}</span>
      </label>
    ))}
  
</div>
        </div>
       {/* ✅ Machine Filter with Mode Toggle */}
<div className="flex flex-col space-y-2 mb-4">
  <div className="flex items-center space-x-2">
    <span className="font-semibold text-gray-800">Machine :</span>
    <button
      onClick={() => setMachineRadioMode(prev => !prev)}
      className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
    >
      {machineRadioMode ?"🔘 Check " : "☑️ Radio"}
    </button>


  {/* ✅ Single Toggle All Button in Checkbox Mode */}
  {!machineRadioMode && (
    <button
      onClick={() => {
        const allChecked = Object.values(selectedMachines).every(v => v === true);
        const updated = {};
        machines.forEach(machine => {
          if (machine.Active) updated[machine.MachineId] = !allChecked;
        });
        setSelectedMachines(updated);
        localStorage.setItem("selectedMachines", JSON.stringify(updated));
      }}
      className={`text-white text-sm px-2 py-1 rounded w-fit ${
        Object.values(selectedMachines).every(v => v === true)
          ? "bg-blue-600 hover:bg-blue-700"
        : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {Object.values(selectedMachines).every(v => v === true) ?"❌ Uncheck" : "✅>------All"}
    </button>
  )}<span></span> <span></span> 
   

  {/* ✅ Machines Filter Inputs */}
  
    {machines
      .filter(machine => machine.Active)
      .map((machine) => (
        <label key={machine.MachineId} className="flex items-center space-x-2">
          {machineRadioMode ? (
            <input
              type="radio"
              name="machineRadio"
              checked={selectedMachines[machine.MachineId] === true}
              onChange={() => {
                const updated = {};
                machines.forEach((m) => {
                  if (m.Active) updated[m.MachineId] = m.MachineId === machine.MachineId;
                });
                setSelectedMachines(updated);
                localStorage.setItem("selectedMachines", JSON.stringify(updated));
              }}
              className="form-radio h-5 w-5 text-green-600"
            />
          ) : (
            <input
              type="checkbox"
              checked={selectedMachines[machine.MachineId] || false}
              onChange={() => toggleMachine(machine.MachineId)}
              className="form-checkbox h-5 w-5 text-green-600"
            />
          )}
          <span className="text-gray-700 font-semibold">{machine.MachineId}</span>
        </label>
      ))}
  </div>
  <div></div>
 {/* ✅ Interval Filter */}
 <div className="flex flex-col space-y-2 mb-4">
  <div className="flex items-center space-x-2">
    <span className="font-semibold text-gray-800">Interval :</span> <span></span>
    <button
      onClick={() => setIntervalRadioMode(prev => !prev)}
      className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
    >
      {intervalRadioMode ? "🔘 Check" :"☑️ Radio"}
    </button>
    {!intervalRadioMode && (
  <button
    onClick={() => {
      const allSelected = Object.values(selectedIntervals).every(val => val);
      const updated = {};
      Object.keys(selectedIntervals).forEach(key => {
        updated[key] = !allSelected;
      });
      setSelectedIntervals(updated);
      localStorage.setItem("selectedIntervals", JSON.stringify(updated));
    }}
    className={`text-white text-sm px-2 py-1 rounded ${
      Object.values(selectedIntervals).every(val => val)
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-green-600 hover:bg-green-700"
    }`}
  >
    {Object.values(selectedIntervals).every(val => val) ?"❌ Uncheck" :"✅>------All"}
  </button>
)}<span></span> <span></span>

    {Object.keys(selectedIntervals).map((interval) => (
      <label key={interval} className="flex items-center space-x-2">
        {intervalRadioMode ? (
          <input
            type="radio"
            name="intervalFilterRadio"
            checked={selectedIntervals[interval]}
            onChange={() => {
              const updated = {};
              Object.keys(selectedIntervals).forEach((key) => {
                updated[key] = key === interval;
              });
              setSelectedIntervals(updated);
              localStorage.setItem("selectedIntervals", JSON.stringify(updated));
            }}
            className="form-radio h-5 w-5 text-purple-600"
          />
        ) : (
          <input
            type="checkbox"
            checked={selectedIntervals[interval]}
            onChange={() => toggleInterval(interval)}
            className="form-checkbox h-5 w-5 text-purple-600"
          />
        )}
        <span className="text-gray-700 font-semibold">{interval}</span>
      </label>
    ))}
  </div>
</div>
<div></div>
{/* ✅ Buy/Sell Filter */}
<div className="flex flex-col space-y-2 mb-4">
  <div className="flex items-center space-x-2">
    <span className="font-semibold text-gray-800">Action :</span> <span></span><span></span>
    <button
      onClick={() => setActionRadioMode(prev => !prev)}
      className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
    >
      {actionRadioMode ? "🔘 Check" : "☑️ Radio"}
    </button>

    {!actionRadioMode && (
      <button
        onClick={() => {
          const allSelected = Object.values(selectedActions).every(val => val);
          const updated = { BUY: !allSelected, SELL: !allSelected };
          setSelectedActions(updated);
          localStorage.setItem("selectedActions", JSON.stringify(updated));
        }}
        className={`text-white text-sm px-2 py-1 rounded ${
          Object.values(selectedActions).every(val => val)
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {Object.values(selectedActions).every(val => val) ? "❌ Uncheck" : "✅>------All"}
      </button>
    )}
    <span></span> <span></span>
    {["BUY", "SELL"].map((action) => (
      <label key={action} className="flex items-center space-x-2">
        {actionRadioMode ? (
          <input
            type="radio"
            name="actionRadio"
            checked={selectedActions[action]}
            onChange={() => {
              const updated = { BUY: false, SELL: false };
              updated[action] = true;
              setSelectedActions(updated);
              localStorage.setItem("selectedActions", JSON.stringify(updated));
            }}
            className="form-radio h-5 w-5 text-pink-600"
          />
        ) : (
          <input
            type="checkbox"
            checked={selectedActions[action]}
            onChange={() => {
              const updated = { ...selectedActions, [action]: !selectedActions[action] };
              setSelectedActions(updated);
              localStorage.setItem("selectedActions", JSON.stringify(updated));
            }}
            className="form-checkbox h-5 w-5 text-pink-600"
          />
        )}
        <span className="text-gray-700 font-semibold">{action}</span>
      </label>
    ))}
  </div>
</div>
<div className="flex items-center mb-4">
  <button
    onClick={() => setIncludeMinClose(prev => !prev)}
    className={`text-white px-3 py-2 rounded text-sm transition-all ${
      includeMinClose ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
    }`}
  >
    {includeMinClose ? "✅ Min Close ON" : "❌ Min Close OFF"}
  </button>
</div>
<div></div>
<div className="flex flex-wrap items-center gap-4 my-4">
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-800 mb-1">📅 From Date & Time</label>
    <Datetime
    key={`from-${dateKey}`}
  value={fromDate ? fromDate : ''} // ✅ Show empty when null
  onChange={(date) => {
    if (moment.isMoment(date)) {
      setFromDate(date);
    } else {
      setFromDate(null);
    }
  }}
  inputProps={{ placeholder: "Select From Date & Time" }}
  timeFormat="HH:mm"
  dateFormat="YYYY-MM-DD"
/>
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-800 mb-1">📅 To Date & Time</label>
    <Datetime
    key={`to-${dateKey}`}
  value={toDate ? toDate : ''} // ✅ Show empty when null
  onChange={(date) => {
    if (moment.isMoment(date)) {
      setToDate(date);
    } else {
      setToDate(null);
    }
  }}
  inputProps={{ placeholder: "Select To Date & Time" }}
  timeFormat="HH:mm"
  dateFormat="YYYY-MM-DD"
/>
  </div>

  <div className="flex items-end">
  <button
  onClick={() => {
    setFromDate(null);
    setToDate(null);
    setDateKey(prev => prev + 1); // 🔁 Force calendar re-render
  }}
  className="bg-yellow-600 text-white px-4 py-2 rounded mt-auto"
>
  ❌ Clear
</button>
  </div>
</div>
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
              filteredTradeData={filteredTradeData} // ✅ Add this line if DashboardCard uses it!
            />
            ))}
          </div>
        )}
        
        {/* ✅ Data Table */}
        
        {selectedBox && (
  <TableView 
    title={selectedBox} 
    tradeData={getFilteredForTitle[selectedBox] || []}
    clientData={clientData || []}
    logData={logData || []}
  />
)}

      </div>
    </div>
  </div>
);
};

export default Dashboard;