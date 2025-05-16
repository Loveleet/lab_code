

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Home, BarChart, Users, FileText, Menu, X, Plus, Space } from "lucide-react";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import * as XLSX from "xlsx";



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

import { useRef } from "react";
const DashboardCard = ({ title, value, isSelected, onClick }) =>  {
  // Tag state for each card, loaded from localStorage by title
  const [tag, setTag] = React.useState(() => localStorage.getItem(`boxTag-${title}`) || "");

  // Tag add/update
  const handleTagClick = (e) => {
    e.stopPropagation();
    const newTag = prompt("Enter tag name:");
    if (newTag !== null) {
      const colorChoices = {
        "yellow": "#FFF9C4",
        "orange": "#FFE0B2",
        "green": "#C8E6C9",
        "blue": "#BBDEFB",
        "pink": "#F8BBD0"
      };

      const colorName = prompt("Choose tag color (yellow, orange, green, blue, pink):", "yellow");
      const chosenColor = colorChoices[colorName?.toLowerCase()] || "#FFF9C4";

      const sizeChoice = prompt("Choose tag size (small, large, largest):", "small");
      let scale = 1.0;
      if (sizeChoice === "large") scale = 1.2;
      if (sizeChoice === "largest") scale = 1.4;

      const tagData = JSON.stringify({ text: newTag, color: chosenColor, scale });
      setTag(tagData);
      localStorage.setItem(`boxTag-${title}`, tagData);
    }
  };
  // Tag remove
  const handleTagRemove = (e) => {
    e.stopPropagation();
    setTag("");
    localStorage.removeItem(`boxTag-${title}`);
  };

  // Use title attribute for tooltips on number spans
  const formatValue = (val) => {
    let numberIndex = 0;
    return val.split(/([+-]?[\d.]+)/g).map((part, index) => {
      if (!isNaN(part) && part.trim() !== "") {
        const num = parseFloat(part);
        const colorClass = num < 0 ? "text-red-400" : "text-green-300";
        numberIndex++;
        // Tooltip mapping for number spans (running, closed, total)
        // Handlers for single tooltip reuse
        return (
          <span
            key={index}
            className={`relative px-[3px] font-semibold text-[46px] ${colorClass}`}
            onMouseEnter={(e) => {
              const tooltipMap = ["Running", "Closed", "Total"];
              let tooltip = window.dashboardTooltip;

              if (!tooltip) {
                tooltip = document.createElement("div");
                tooltip.id = "dashboardTooltip";
                tooltip.style.cssText = `
                  position: fixed;
                  background: #222;
                  color: #fff;
                  padding: 6px 12px;
                  border-radius: 5px;
                  font-size: 18px;
                  font-weight: 600;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                  z-index: 9999;
                  pointer-events: none;
                  opacity: 0;
                  transition: opacity 0.1s ease;
                `;
                document.body.appendChild(tooltip);
                window.dashboardTooltip = tooltip;
              }

              tooltip.innerText = tooltipMap[numberIndex - 1] || "";
              tooltip.style.left = `${e.clientX + 10}px`;
              tooltip.style.top = `${e.clientY + 10}px`;
              tooltip.style.opacity = "0";
              requestAnimationFrame(() => {
                tooltip.style.display = "block";
                requestAnimationFrame(() => {
                  tooltip.style.opacity = "1";
                });
              });
            }}
            onMouseMove={(e) => {
              if (window.dashboardTooltip) {
                window.dashboardTooltip.style.left = `${e.clientX + 10}px`;
                window.dashboardTooltip.style.top = `${e.clientY + 10}px`;
              }
            }}
            onMouseLeave={() => {
              if (window.dashboardTooltip) {
                window.dashboardTooltip.style.display = "none";
              }
            }}
          >
            {part}
          </span>
        );
      } else {
        return (
          <span key={index} className="text-white text-sm px-[1px] opacity-80">
            {part}
          </span>
        );
      }
    });
  };

  // Wrap card UI in relative div with overlays for tag and add button
  return (
    <div className="relative">
      {/* Tag display and remove button with dynamic color and font size */}
      {tag && (() => {
        const parsed = JSON.parse(tag);
        return (
          <div
            className="absolute top-2 left-2 text-black px-3 py-1.5 rounded-full z-10 shadow"
            style={{
              backgroundColor: parsed.color || "yellow",
              fontSize: `calc(1.1rem * var(--app-font-scale) * ${parsed.scale || 1})`,
            }}
          >
            {parsed.text}
            <button onClick={handleTagRemove} className="ml-1 text-red-700 font-bold">×</button>
          </div>
        );
      })()}
      {/* Add tag button (always shown) */}
      <button
        onClick={handleTagClick}
        className="absolute top-2 left-2 bg-gray-200 text-black text-xs w-4 h-4 rounded-full z-10 shadow hover:bg-gray-300"
        style={{ transform: "translate(-100%, -100%)" }}
      >
        +
      </button>
      {/* Card UI */}
      <div
        className={`cursor-pointer p-8 rounded-2xl border transition-all duration-300 transform
        ${isSelected
          ? "bg-gradient-to-br from-blue-900 to-green-500 scale-[1.03] shadow-lg ring-4 ring-yellow-600 border-yellow-700 text-gray-900"
          : "bg-gradient-to-br from-blue-800 to-indigo-900 hover:scale-[1.03] hover:shadow-xl hover:ring-4 hover:ring-yellow-400/60 hover:border-yellow-500/70 text-white"}`}
        onClick={onClick}
      >
        {/* ✅ Title with sky blue color */}
        {/* <h2 className="text-lg font-semibold text-center text-blue-400">{title.replace(/_/g, " ")}</h2> */}
        {/* ✅ Properly formatted value using JSX with tooltips */}
        <p className="text-2xl font-bold text-center leading-snug whitespace-nowrap overflow-x-auto">
          {typeof value === "string"
            ? (
              <span className="text-[22px] leading-snug inline-block min-w-full pointer-events-none">
                <div className="flex flex-wrap justify-end gap-[3px] pointer-events-auto" style={{ pointerEvents: "auto" }}>
                  {formatValue(value)}
                </div>
              </span>
            )
            : value}
        </p>
      </div>
    </div>
  );
};

// Apply this background to the dashboard container:
<div className="flex bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen text-white">
  {/* Sidebar & Content */}
</div>;




const TableView = ({ title, tradeData, clientData, logData, activeSubReport, setActiveSubReport }) => {
  // Font size state for report export
  const [reportFontSizeLevel, setReportFontSizeLevel] = useState(() => {
    const saved = localStorage.getItem("reportFontSizeLevel");
    return saved ? parseInt(saved, 10) : 3;
  });
  useEffect(() => {
    localStorage.setItem("reportFontSizeLevel", reportFontSizeLevel);
  }, [reportFontSizeLevel]);
  // Optimized sub-report click handler
  const handleSubReportClick = useCallback((type, normalizedTitle) => {
    if (normalizedTitle === "Client_Stats") {
      const filtered = clientData.filter(c => c.MachineId === type);
      setFilteredData(filtered.map((client, index) => ({
        "S No": index + 1,
        "Machine ID": client.MachineId || "N/A",
        "Client Name": client.Name || "N/A",
        "Active": client.Active ? "✅" : "❌",
        "Last Ping": client.LastPing || "N/A",
        "Region": client.Region || "N/A",
      })));
    } else {
      setActiveSubReport(type);
    }
  }, [clientData]);

  
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchInput, setSearchInput] = useState(""); // ✅ Preserve search term

  function updateFilterIndicators() {
    document.querySelectorAll("th .filter-icon").forEach((icon) => {
        const index = icon.getAttribute("data-index");
        if (activeFilters[index]) {
            icon.innerText = "✅"; // ✅ Or any other indicator
            icon.style.color = "green";
        } else {
            icon.innerText = "🔍";
            icon.style.color = "";
        }
    });
}
function showFilterPopup(index, event) {
  document.querySelectorAll(".filter-popup").forEach(p => p.remove());

  const values = [...document.querySelectorAll("tbody tr td:nth-child(" + (index + 1) + ")")].map(td => td.innerText.trim());
  const counts = {};
  values.forEach(v => counts[v] = (counts[v] || 0) + 1);
  const unique = Object.keys(counts);

  const popup = document.createElement("div");
  popup.className = "filter-popup";

  // ✅ Apply Proper CSS immediately
  popup.style.position = "fixed";
  popup.style.background = "white";
  popup.style.color = "black";
  popup.style.padding = "12px";
  popup.style.borderRadius = "8px";
  popup.style.zIndex = "999999";
  popup.style.maxHeight = "500px";
  popup.style.overflowY = "auto";
  popup.style.display = "flex";
  popup.style.flexDirection = "column";
  popup.style.gap = "8px";

  const checkboxes = [];
  // Reset Button
  const reset = document.createElement("button");
  reset.innerText = "♻️ Reset Column";
  reset.onclick = (e) => {
    e.stopPropagation();
    const newFilters = { ...activeFilters };
    delete newFilters[index];
    setActiveFilters(newFilters);
    popup.remove();
  };
  popup.appendChild(reset);

  // Apply Button
  const apply = document.createElement("button");
  apply.innerText = "✅ Apply";
  apply.onclick = (e) => {
    e.stopPropagation();
    const sel = checkboxes.filter(c => c.checked).map(c => c.value);
    activeFilters[index] = sel.length === unique.length ? undefined : sel;
    setActiveFilters({ ...activeFilters });
    popup.remove();
    updateFilterIndicators();
  };
  popup.appendChild(apply);

  // Select All Button
  const selectAll = document.createElement("button");
  selectAll.innerText = "✅ Select All";
  selectAll.style.backgroundColor = "#4caf50";
  selectAll.style.color = "white";
  let allSelected = true;
  selectAll.onclick = () => {
    allSelected = !allSelected;
    checkboxes.forEach(cb => cb.checked = allSelected);
    selectAll.innerText = allSelected ? "✅ Select All" : "❌ Deselect All";
    selectAll.style.backgroundColor = allSelected ? "#4caf50" : "#f44336";
  };
  popup.appendChild(selectAll);

  // Checkboxes
  unique.forEach(v => {
    const label = document.createElement("label");

    // ✅ Force nice vertical + spacing
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "6px";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = v;
    input.checked = true;

    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${v} (${counts[v]})`));
    popup.appendChild(label);
    checkboxes.push(input);
  });

  document.body.appendChild(popup);

  // ✅ Proper Popup Placement
  const icon = event.target;
  const rect = icon.getBoundingClientRect();

  popup.style.top = `${rect.bottom + 10}px`;
  popup.style.left = `${rect.left}px`;

  // Close logic
  setTimeout(() => {
    const closePopup = (ev) => {
      if (!popup.contains(ev.target)) {
        popup.remove();
        document.removeEventListener("click", closePopup);
      }
    };
    document.addEventListener("click", closePopup);
  }, 100);
}


function showCopyPopup(text, x, y) {

  let popup = document.getElementById("copyPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "copyPopup";
    popup.innerText = "📋 Copy Selected";

    popup.style.position = "fixed";
    popup.style.background = "black";
    popup.style.color = "white";
    popup.style.padding = "10px 20px";
    popup.style.borderRadius = "8px";
    popup.style.fontSize = "13px";
    popup.style.fontWeight = "bold";
    popup.style.cursor = "pointer";
    popup.style.zIndex = "999999";
    popup.style.opacity = "1";
    popup.style.pointerEvents = "auto";
    popup.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    popup.style.userSelect = "none";
    popup.style.transition = "opacity 0.3s ease, transform 0.2s ease";

    // ✅ Hover effect
    popup.addEventListener("mouseenter", () => {
      popup.style.backgroundColor = "#333";
      popup.style.transform = "scale(1.05)";
    });
    popup.addEventListener("mouseleave", () => {
      popup.style.backgroundColor = "black";
      popup.style.transform = "scale(1)";
    });

    // ✅ Click → Copy
    popup.addEventListener("click", (e) => {
      e.stopPropagation();  // prevent click outside listener to trigger
      navigator.clipboard.writeText(text).then(() => {
        popup.innerText = "✅ Copied!";
        setTimeout(() => {
          if (popup) popup.remove();
        }, 800);
      });
    });

    document.body.appendChild(popup);
  }

  // ✅ Calculate safe position
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  if (x < 10 || x > screenWidth - 10 || y < 10 || y > screenHeight - 10) {
    document.addEventListener("mousemove", (ev) => {
      popup.style.left = `${ev.clientX}px`;
      popup.style.top = `${ev.clientY}px`;
    }, { once: true });
  } else {
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
  }

  popup.style.display = "block";
  popup.style.opacity = "1";

  // ✅ Close on outside click
  const closePopup = (event) => {
    if (!popup.contains(event.target)) {
      popup.remove();
      document.removeEventListener("click", closePopup);
    }
  };
  setTimeout(() => {
    document.addEventListener("click", closePopup);
  }, 10);
}



useEffect(() => {
  const handleMouseUp = (e) => {
    const selection = window.getSelection();
    if (!selection) return;

    const text = selection.toString().trim();

    if (!text) {
      const existingPopup = document.getElementById("copyPopup");
      if (existingPopup) existingPopup.remove();
      return;
    }


    setTimeout(() => {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const x = window.scrollX + rect.left;
        const y = window.scrollY + rect.bottom + 10;

        showCopyPopup(text, x, y);
      } catch (err) {
      }
    }, 0);
  };

  document.addEventListener("mouseup", handleMouseUp);

  return () => {
    document.removeEventListener("mouseup", handleMouseUp);
  };
}, []);




useEffect(() => {
  const handleClickOutside = (e) => {
    const popups = document.querySelectorAll(".filter-popup");
    popups.forEach(popup => {
      if (!popup.contains(e.target)) {
        popup.remove();
        setActivePopupIndex(null);
      }
    });
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);



const filteredAndSortedData = useMemo(() => {
  // First apply filters
  let data = [...filteredData];

  Object.entries(activeFilters).forEach(([index, selectedValues]) => {
    if (!selectedValues) return;

    const columnIndex = parseInt(index);

    data = data.filter(row => {
      const keys = Object.keys(row);
      const key = keys[columnIndex];
      const value = row[key]?.toString().trim();
      return selectedValues.includes(value);
    });
  });

  // Then apply sorting
  if (!sortConfig.key) return data;

  return [...data].sort((a, b) => {
    const aVal = a[sortConfig.key] || "";
    const bVal = b[sortConfig.key] || "";

    if (!isNaN(aVal) && !isNaN(bVal)) {
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortConfig.direction === 'asc'
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });
}, [filteredData, sortConfig, activeFilters]);
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
  if (!title || !tradeData || tradeData.length === 0) return;

  let result = tradeData.map((trade, index) => formatTradeData(trade, index));

  // ✅ Apply sub-report filtering
  switch (title) {
    case "Total_Closed_Stats":
      result = result.filter(trade => trade.Type === "close" || trade.Type === "hedge_close");
      break;
    case "Direct_Closed_Stats":
      result = result.filter(trade => trade.Type === "close");
      break;
    case "Hedge_Closed_Stats":
      result = result.filter(trade => trade.Type === "hedge_close" && trade.Hedge === true);
      break;
    case "Total_Running_Stats":
      result = result.filter(trade => trade.Type === "running" && trade.Hedge_1_1_bool === false);
      break;
    case "Assigned_New":
      result = result.filter(trade => trade.Type === "assign" && trade.Hedge_1_1_bool === false);
      break;
    case "Direct_Running_Stats":
      result = result.filter(trade => trade.Type === "running" && trade.Hedge === false);
      break;
    case "Hedge_Running_Stats":
      result = result.filter(trade => trade.Type === "running" && trade.Hedge === true && trade.Hedge_1_1_bool === false);
      break;
    case "Hedge_on_Hold":
      result = result.filter(trade => trade.Type === "running" && trade.Hedge === true && trade.Hedge_1_1_bool === true);
      break;
    case "Closed_Count_Stats":
      result = result.filter((trade) => {
        if (activeSubReport === "loss") return trade.Type === "close" && trade.Pl_after_comm < 0;
        if (activeSubReport === "profit") return trade.Type === "close" && trade.Pl_after_comm > 0;
        if (activeSubReport === "pj") return trade.Type === "close" && trade.Profit_journey === true;
        return true;
      });
      break;
    case "Buy_Sell_Stats":
      result = result.filter((trade) => {
        if (!["BUY", "SELL"].includes(trade.Action)) return false;
        if (activeSubReport === "buy") return trade.Action === "BUY";
        if (activeSubReport === "sell") return trade.Action === "SELL";
        return true;
      });
      break;
    case "Journey_Stats_Running":
      result = result.filter((trade) => {
        if (activeSubReport === "pj") return trade.Profit_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running";
        if (activeSubReport === "cj") return trade.Commision_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running" && !trade.Profit_journey;
        if (activeSubReport === "bc") return trade.Pl_after_comm < 0 && trade.Type === "running";
        return true;
      });
      break;
    case "Client_Stats":
      result = clientData.map((client, index) => ({
        "S No": index + 1,
        "Machine ID": client.MachineId || "N/A",
        "Client Name": client.Name || "N/A",
        "Active": client.Active ? "✅" : "❌",
        "Last Ping": client.LastPing || "N/A",
        "Region": client.Region || "N/A",
      }));
      break;
    case "Min_Close_Profit":
      result = result.filter(trade => trade.Type === "close" && trade.Min_close === "Min_close" && trade.Pl_after_comm > 0);
      break;
    case "Min_Close_Loss":
      result = result.filter(trade => trade.Type === "close" && trade.Min_close === "Min_close" && trade.Pl_after_comm < 0);
      break;
    default:
      break;
  }

  // Always apply search filter regardless of title
  const query = searchInput.trim().toLowerCase();
  if (query.length > 0) {
    result = result.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(query)
      )
    );
  }

  setFilteredData(result);
}, [title, tradeData, activeSubReport, clientData, searchInput]);

  const handleOpenReport = (title, sortedData, fontSizeLevel = 3) => {
    if (!sortedData || sortedData.length === 0) return;
    const reportWindow = window.open("", "_blank", "width=1200,height=600");
    const tableHeaders = Object.keys(sortedData[0]);

    const reportContent = `
  <html>
  <head>
  <title>${title.replace(/_/g, " ")} Report</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
  <style>
  body { font-family: Arial; margin:20px; background:#f2f2f7; font-size: ${12 + (fontSizeLevel - 8) * 2}px; }
  table { width:100%; border-collapse: collapse; cursor:pointer; }
  th, td { padding:6px 8px; border-bottom:1px solid #ccc; text-align:center; }
  th { background:#288994; color:white; position:sticky; top:0; z-index:3; }
  .sticky-col-1 { position:sticky; left:0; background:#046e7a; color:white; z-index:10; }
  .sticky-col-2 { position:sticky; left:90px; background:#046e7a; color:white; z-index:10; }
  .sticky-col-3 { position:sticky; left:190px; background:#046e7a; color:white; z-index:10; }
  .highlighted-row { background:yellow; font-weight:bold; }
  .filter-popup { position:absolute; background:white; border:1px solid #ccc; padding:10px; z-index:999; max-height:300px; overflow-y:auto; }
  .filter-popup label { display:block; margin-bottom:5px; }
  .filter-popup button { margin-top:8px; padding:4px 8px; background:#4caf50; color:white; border:none; cursor:pointer; }
  #copyPopup { display:none; position:fixed; background:black; color:white; padding:10px 20px; border-radius:20px; font-size:13px; cursor:pointer; z-index:9999; user-select: none; }
  #copyPopup:hover { background-color:#333; transform:scale(1.1); transition:all 0.2s ease; }
  </style>
  </head>
  <body>
    <div style="margin-bottom: 16px;">
      <span style="font-weight: bold;">Report Font:</span>
      ${[1, 2, 3, 4, 5].map((level) => `
        <label style="margin-right: 8px;">
          <input type="radio" name="fontSizeControl" value="${level}" ${level === fontSizeLevel ? "checked" : ""}/>
          ${level}
        </label>
      `).join("")}
    </div>

  <h2>${title.replace(/_/g, " ")} Details</h2>
  <input type="text" id="searchBox" placeholder="🔍 Type to filter rows..." onkeyup="filterRows()" />
  <button onclick="exportToExcel()">📥 Export to Excel</button>
  <button onclick="resetAllFilters()">♻️ Reset All Filters</button>

  <div id="copyPopup">📋 Copy Selected</div>

  <table id="reportTable">
  <thead id="headerRow"></thead>
  <tbody id="tableBody"></tbody>
  </table>

  <script>
    document.querySelectorAll("input[name='fontSizeControl']").forEach(input => {
      input.addEventListener("change", function() {
        const level = parseInt(this.value, 10);
        const base = 12 + (level - 3) * 2;
        document.body.style.fontSize = base + "px";
        document.querySelectorAll("table, th, td").forEach(el => {
          el.style.fontSize = base + "px";
        });
      });
    });
  const tableHeaders = ${JSON.stringify(tableHeaders)};
  const tableData = ${JSON.stringify(sortedData)};
  let activeFilters = {};
  let currentSortIndex = null, currentSortDirection = "asc";
  let lastSelectedText = "";

  function renderTable(){
    document.getElementById("headerRow").innerHTML = tableHeaders.map((key,index)=>{
      let stickyStyle = "";
      if (index === 0) stickyStyle = "min-width:80px;max-width:80px;";
      if (index === 1) stickyStyle = "min-width:100px;max-width:100px;";
      if (index === 2) stickyStyle = "min-width:220px;max-width:220px;";
      const stickyClass = index < 3 ? "sticky-col-"+(index+1) : "";
      return "<th class='"+stickyClass+"' data-index='"+index+"' style='"+stickyStyle+"'><div style='display:flex;justify-content:space-between;align-items:center;'><span>"+key+"</span><span onclick='sortTable("+index+")' style='cursor:pointer;color:orange;'>🔼</span><span class='filter-icon' onclick='showFilterPopup("+index+")' style='cursor:pointer;'>🔍</span></div></th>";
    }).join("");

    document.getElementById("tableBody").innerHTML = tableData.map(row=>{
      return "<tr>"+tableHeaders.map((key,index)=>{
        const stickyClass = index < 3 ? "sticky-col-"+(index+1) : "";
        return "<td class='"+stickyClass+"'>"+row[key]+"</td>";
      }).join("")+"</tr>";
    }).join("");

    filterTable();
  }

  function sortTable(index){
    const isAsc = currentSortIndex===index && currentSortDirection==="asc"?false:true;
    currentSortIndex=index;
    currentSortDirection=isAsc?"asc":"desc";

    tableData.sort((a,b)=>{
      const valA = a[tableHeaders[index]]+"";
      const valB = b[tableHeaders[index]]+"";
      return valA.localeCompare(valB,undefined,{numeric:true}) * (isAsc?1:-1);
    });

    renderTable();
  }

  function filterRows(){
    const query = document.getElementById("searchBox").value.toLowerCase();
    document.querySelectorAll("tbody tr").forEach(row=>{
      row.style.display = row.innerText.toLowerCase().includes(query) ? "" : "none";
    });
  }

  function resetAllFilters(){
    activeFilters={};
    filterTable();
    document.querySelectorAll(".filter-popup").forEach(p=>p.remove());
  }

  function filterTable(){
    document.querySelectorAll("tbody tr").forEach(row=>{
      row.style.display = Object.keys(activeFilters).every(col=>activeFilters[col].includes(row.children[col].innerText.trim()))?"":"none";
    });
  }
// Store current filter popup globally
let currentFilterPopup = null;

function updateFilterIndicators() {
    document.querySelectorAll("th").forEach((th, index) => {
        const icon = th.querySelector(".filter-icon");
        if (!icon) return;

        if (activeFilters[index]) {
            icon.innerText = "✅"; // or ✳️ or any indicator you like
            icon.style.color = "green";
        } else {
            icon.innerText = "🔍";
            icon.style.color = "";
        }
    });
}

function showFilterPopup(index) {
    // ✅ If already open → close and exit (toggle effect)
    if (currentFilterPopup) {
        currentFilterPopup.remove();
        currentFilterPopup = null;
        return;
    }

    document.querySelectorAll(".filter-popup").forEach(p => p.remove());

    const values = [...document.querySelectorAll("tbody tr td:nth-child(" + (index + 1) + ")")].map(td => td.innerText.trim());
    const counts = {};
    values.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const unique = Object.keys(counts);

    const popup = document.createElement("div");
    popup.className = "filter-popup";
    currentFilterPopup = popup; // ✅ set as current active popup

    // ✅ Reset Button
    const reset = document.createElement("button");
    reset.innerText = "♻️ Reset Column";
    reset.onclick = () => {
        delete activeFilters[index];
        filterTable();
        popup.remove();
        currentFilterPopup = null;
        updateFilterIndicators(); // <-- Add this
    };
    popup.appendChild(reset);

    // ✅ Apply Button
    const apply = document.createElement("button");
    apply.innerText = "✅ Apply";
    apply.onclick = () => {
        const sel = [...popup.querySelectorAll("input[type='checkbox']:checked")].map(i => i.value);
        activeFilters[index] = sel.length === unique.length ? undefined : sel;
        filterTable();
        popup.remove();
        currentFilterPopup = null;
        updateFilterIndicators(); // <-- Add this
    };
    popup.appendChild(apply);

    const selectAllButton = document.createElement("button");
    selectAllButton.innerText = "✅ Select All";
    let allSelected = true;
    selectAllButton.onclick = () => {
        allSelected = !allSelected;
        popup.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = allSelected);
        selectAllButton.innerText = allSelected ? "✅ Select All" : "❌ Deselect All";
    };
    popup.appendChild(selectAllButton);

    unique.forEach(v => {
        const label = document.createElement("label");
        label.innerHTML = '<input type="checkbox" value="' + v + '" checked> ' + v + ' (' + counts[v] + ')';
        popup.appendChild(label);
    });

    document.body.appendChild(popup);
    const th = document.querySelector("th[data-index='" + index + "']");
    const rect = th.getBoundingClientRect();
    popup.style.top = rect.bottom + window.scrollY + "px";
    popup.style.left = rect.left + window.scrollX + "px";

    // ✅ Outside click close logic
    setTimeout(() => {
        const closePopup = (event) => {
            if (!popup.contains(event.target)) {
                popup.remove();
                currentFilterPopup = null;
                document.removeEventListener("click", closePopup);
            }
        };
        document.addEventListener("click", closePopup);
    }, 50);
}

document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    const popup = document.getElementById("copyPopup");

    if (!popup) return;

    if (!text) {
        popup.style.display = "none";
        return;
    }

    let rect;
    try {
        rect = selection.getRangeAt(0).getBoundingClientRect();
    } catch {
        rect = null;
    }

    // ✅ Decide where to show
    if (rect && rect.width > 0 && rect.height > 0) {
        popup.style.top = (window.scrollY + rect.bottom + 10) + "px";
        popup.style.left = (window.scrollX + rect.right + 10) + "px";
    } else {
        // ✅ Fallback to mouse position
        document.addEventListener("mousemove", function handler(e) {
            popup.style.top = (e.clientY + window.scrollY + 10) + "px";
            popup.style.left = (e.clientX + window.scrollX + 10) + "px";
            document.removeEventListener("mousemove", handler);
        });
    }

    popup.style.display = "block";
    lastSelectedText = text;
});
document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  if (!text) {
    const popup = document.getElementById("copyPopup");
    if (popup) popup.remove();
    return;
  }

  showCopyPopup(text, e.pageX, e.pageY);  // ✅ Pass mouse position
});

function positionCopyPopup(popup, selection) {
    try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

      popup.style.left = (rect.left + window.scrollX + 10) + "px";
popup.style.top = (rect.bottom + window.scrollY + 10) + "px";
    } catch (err) {
        console.error("Error positioning popup", err);
    }
}

function showCopyPopup(text) {
    let popup = document.getElementById("copyPopup");

    if (!popup) {
        popup = document.createElement("div");
        popup.id = "copyPopup";
        popup.innerText = "📋 Copy Selected";

        popup.style.position = "absolute";
        popup.style.background = "black";
        popup.style.color = "white";
        popup.style.padding = "10px 20px";
        popup.style.borderRadius = "8px";
        popup.style.fontSize = "13px";
        popup.style.fontWeight = "bold";
        popup.style.cursor = "pointer";
        popup.style.zIndex = "9999";
        popup.style.pointerEvents = "auto";
        popup.style.userSelect = "none";

        popup.addEventListener("click", () => {
            navigator.clipboard.writeText(text).then(() => {
                popup.innerText = "✅ Copied!";
                setTimeout(() => popup.remove(), 800);
            });
        });

        document.body.appendChild(popup);
    }

    const selection = window.getSelection();
    positionCopyPopup(popup, selection);

    popup.style.display = "block";

    const scrollHandler = () => {
        const newSelection = window.getSelection();
        if (!newSelection || newSelection.toString().trim() === "") {
            popup.remove();
            window.removeEventListener("scroll", scrollHandler);
        } else {
            positionCopyPopup(popup, newSelection);
        }
    };

    window.addEventListener("scroll", scrollHandler);
}

  function showCopiedAnimation() {
    const copiedMessage = document.createElement("div");
    copiedMessage.innerText = "✅ Copied!";
    copiedMessage.style.position = "fixed";
    copiedMessage.style.background = "#4caf50";
    copiedMessage.style.color = "white";
    copiedMessage.style.padding = "8px 16px";
    copiedMessage.style.borderRadius = "6px";
    copiedMessage.style.top = "50%";
    copiedMessage.style.left = "50%";
    copiedMessage.style.transform = "translate(-50%, -50%)";
    copiedMessage.style.fontSize = "14px";
    copiedMessage.style.zIndex = "10000";
    copiedMessage.style.opacity = "0.95";
    copiedMessage.style.cursor = "pointer";
    copiedMessage.style.transition = "opacity 0.3s ease";

    copiedMessage.addEventListener("click", () => {
        document.body.removeChild(copiedMessage);
    });

    document.body.appendChild(copiedMessage);

    setTimeout(() => {
        copiedMessage.style.opacity = "0";
        setTimeout(() => {
            if (document.body.contains(copiedMessage)) {
                document.body.removeChild(copiedMessage);
            }
        }, 300);
    }, 1000);
}

  document.querySelector("tbody").addEventListener("click",e=>{
    const row=e.target.closest("tr");
    if(!row)return;
    document.querySelectorAll("tbody tr").forEach(r=>r.classList.remove("highlighted-row"));
    row.classList.add("highlighted-row");
  });

  function exportToExcel(){
    const wb = XLSX.utils.book_new();
    
    const table = document.getElementById("reportTable");
    const headers = [...table.querySelectorAll("thead th")].map(th => th.innerText.trim());
    const rows = [...table.querySelectorAll("tbody tr")].map(row => {
        const cells = [...row.querySelectorAll("td")];
        const obj = {};
        cells.forEach((td, idx) => {
            let val = td.innerText.trim();
            // ✅ Add dummy time if date found
            if (headers[idx].includes("Time") && val && !val.includes(":")) {
                val += " 00:00:00";
            }
            obj[headers[idx]] = val;
        });
        return obj;
    });
    
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "Lab_Trade_Report.xlsx");
}

  renderTable();

  // Remove font size override on table/th/td when font size changes
  document.querySelector("input[type=radio][name=reportFontSize]")?.addEventListener("change", function() {
    // No need to set fontSize on table/th/td, they inherit from body
  });
  </script>

  </body>
  </html>
  `;

    reportWindow.document.write(reportContent);
  };


  

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  
  useEffect(() => {
    if (!Array.isArray(tradeData) || tradeData.length === 0 || !title) {
      setFilteredData([]);
      return;
    }

    let result = [];

    switch (title) {
      case "Total_Closed_Stats":
        result = tradeData
          .filter(trade => trade.Type === "close" || trade.Type === "hedge_close")
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Direct_Closed_Stats":
        result = tradeData
          .filter(trade => trade.Type === "close")
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Hedge_Closed_Stats":
        result = tradeData
          .filter(trade => trade.Type === "hedge_close" && trade.Hedge === true)
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Total_Running_Stats":
        result = tradeData
          .filter(trade => trade.Type === "running" && trade.Hedge_1_1_bool === false)
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Assigned_New":
        result = tradeData
          .filter(trade => trade.Type === "assign" && trade.Hedge_1_1_bool === false)
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Direct_Running_Stats":
        result = tradeData
          .filter(trade => trade.Type === "running" && trade.Hedge === false)
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Hedge_Running_Stats":
        result = tradeData
          .filter(trade => trade.Type === "running" && trade.Hedge === true && trade.Hedge_1_1_bool === false)
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Hedge_on_Hold":
        result = tradeData
          .filter(trade => trade.Type === "running" && trade.Hedge === true && trade.Hedge_1_1_bool === true)
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Total_Stats":
        result = tradeData.map((trade, index) => formatTradeData(trade, index));
        break;
      case "Closed_Count_Stats":
        result = tradeData
          .filter((trade) => {
            if (activeSubReport === "loss") return trade.Type === "close" && trade.Pl_after_comm < 0;
            if (activeSubReport === "profit") return trade.Type === "close" && trade.Pl_after_comm > 0;
            if (activeSubReport === "pj") return trade.Type === "close" && trade.Profit_journey === true;
            return true;
          })
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Buy_Sell_Stats":
        result = tradeData
          .filter((trade) => {
            if (!["BUY", "SELL"].includes(trade.Action)) return false;
            if (activeSubReport === "buy") return trade.Action === "BUY";
            if (activeSubReport === "sell") return trade.Action === "SELL";
            return true;
          })
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Journey_Stats_Running":
        result = tradeData
          .filter((trade) => {
            if (activeSubReport === "pj") return trade.Profit_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running";
            if (activeSubReport === "cj") return trade.Commision_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running" && !trade.Profit_journey;
            if (activeSubReport === "bc") return trade.Pl_after_comm < 0 && trade.Type === "running";
            return true;
          })
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Client_Stats":
        result = clientData.map((client, index) => ({
          "S No": index + 1,
          "Machine ID": client.MachineId || "N/A",
          "Client Name": client.Name || "N/A",
          "Active": client.Active ? "✅" : "❌",
          "Last Ping": client.LastPing || "N/A",
          "Region": client.Region || "N/A",
        }));
        break;
      case "Min_Close_Profit":
        result = tradeData
          .filter(trade => trade.Type === "close" && trade.Min_close === "Min_close" && trade.Pl_after_comm > 0)
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Min_Close_Loss":
        result = tradeData
          .filter(trade => trade.Type === "close" && trade.Min_close === "Min_close" && trade.Pl_after_comm < 0)
          .map((trade, index) => formatTradeData(trade, index));
        break;
      default:
        result = tradeData.map((trade, index) => formatTradeData(trade, index));
    }

    const query = searchInput.trim().toLowerCase();
    if (query.length > 0) {
      result = result.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

    setFilteredData(result);
  }, [title, tradeData, activeSubReport, clientData, searchInput]);

  // Add conditional early return to prevent unnecessary rendering
  // (Moved subReportButtons below to allow always showing buttons even if no data)

  // --- Sub-report filter button logic, always above early return for filteredData ---
  const normalizedTitle = title.replace(/\s+/g, "_").trim();
  let options = [];

  switch (normalizedTitle) {
    
    
    case "Closed_Count_Stats":
      options = ["loss", "profit", "pj"];
      break;
    case "Buy_Sell_Stats":
      options = ["buy", "sell"];
      break;
    case "Journey_Stats_Running":
      options = ["pj", "cj", "bc"];
      break;
    case "Client_Stats":
      options = machines.map(machine => machine.MachineId);
      break;
    default:
      options = [];
  }

  const subReportButtons = options.length > 0 && (
    <div className="flex gap-2 mb-2">
      {options.map((type) => (
        <button
          key={type}
          onClick={() => handleSubReportClick(type, normalizedTitle)}
          className={`px-3 py-1 text-sm rounded transition-all duration-150 ease-in-out ${
            activeSubReport === type
              ? "bg-yellow-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {type.toUpperCase()}
        </button>
      ))}
    </div>
  );

  const query = searchInput?.trim()?.toLowerCase();
  const isQueryActive = query && query.length > 0;
  const isFilteredEmpty = filteredData.length === 0;

  if (isFilteredEmpty && !isQueryActive) {
    return (
      <div className="mt-6 p-6 bg-[#f2f2f7] text-[#222] shadow-md rounded-lg max-w-full">
        <h2 className="text-xl font-bold">{title.replace(/_/g, " ")} Details</h2>
        <div className="flex gap-2 my-4">
          <input
            type="text"
            placeholder="🔍 Type to search..."
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              setSearchInput(e.target.value);
              const filtered = tradeData.filter(row =>
                Object.values(row).some(val =>
                  String(val).toLowerCase().includes(value)
                )
              );
              setFilteredData(filtered);
            }}
            className="px-3 py-2 border rounded-md w-64 text-sm"
          />
          <button
            onClick={() => {
              setActiveFilters({});
              setFilteredData(tradeData);
            }}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            ♻️ Reset Filters
          </button>
          {subReportButtons}
        </div>
        <p className="text-center text-gray-500 mt-4">⚠️ No relevant data available for {title}</p>
      </div>
    );
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
  <div
    className="mt-6 p-6 bg-[#f2f2f7] text-[#222] shadow-md rounded-lg max-w-full"
    // style={{ fontSize: `${12 + (reportFontSizeLevel - 2) * 2}px` }}
  >
    {/* Font size plus/minus group for report export */}
    <div className="flex items-center space-x-2 mb-2">
      <button
        onClick={() => setReportFontSizeLevel(prev => {
          const newLevel = Math.max(1, prev - 1);
          localStorage.setItem("reportFontSizeLevel", newLevel);
          return newLevel;
        })}
        className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
        aria-label="Decrease font size"
      >
        ➖
      </button>
      <span className="text-sm font-semibold text-gray-800">
        Font Size: {reportFontSizeLevel}
      </span>
      <button
        onClick={() => setReportFontSizeLevel(prev => {
          const newLevel = Math.min(20, prev + 1);
          localStorage.setItem("reportFontSizeLevel", newLevel);
          return newLevel;
        })}
        className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
        aria-label="Increase font size"
      >
        ➕
      </button>
    </div>
     <div style={{ height: '5px' }} />
    <h2 className="text-xl font-bold">{title.replace(/_/g, " ")} Details</h2>
    <div style={{ height: '5px' }} />

    {/* ✅ Open Report Button */}
    <button
      onClick={() => handleOpenReport(title, sortedData, reportFontSizeLevel)}
      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 mb-4"
    >
      Open in New Page
    </button>
    {/* ✅ SEARCH, EXPORT, RESET FILTER BAR */}

    {/* Search */}
    <input
      type="text"
      placeholder="🔍 Type to search..."
      value={searchInput}
      onChange={(e) => {
        const value = e.target.value.toLowerCase();
        setSearchInput(e.target.value); // store input
        const filtered = tradeData.filter(row =>
          Object.values(row).some(val =>
            String(val).toLowerCase().includes(value)
          )
        );
        setFilteredData(filtered);
      }}
      className="px-3 py-2 border rounded-md w-64 text-sm"
    />
{/* <div className="flex items-center gap-4 mb-4"> */}
  <button
    onClick={() => {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(filteredAndSortedData);
      XLSX.utils.book_append_sheet(wb, ws, "Dashboard Report");
      XLSX.writeFile(wb, "Dashboard_Trade_Report.xlsx");
    }}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
  >
    📥 Export to Excel
  </button>

  <button
  
    onClick={() => {
      setActiveFilters({});
      setFilteredData(tradeData);
    }}
    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
  >
    ♻️ Reset Filters
    
  </button>

  
{(() => {
  const normalizedTitle = title.replace(/\s+/g, "_").trim();
  let options = [];

  switch (normalizedTitle) {
    
    case "Closed_Count_Stats":
      options = ["loss", "profit", "pj"];
      break;
    case "Buy_Sell_Stats":
      options = ["buy", "sell"];
      break;
    case "Journey_Stats_Running":
      options = ["pj", "cj", "bc"];
      break;
    case "Client_Stats":
      options = machines.map(machine => machine.MachineId);
      break;
    default:
      options = [];
  }
  

  

  return options.length > 0 ? (
    <div className="flex gap-2 mb-2">
      {options.map((type) => (
        <button
          key={type}
          onClick={() => handleSubReportClick(type, normalizedTitle)}
          className={`px-3 py-1 text-sm rounded transition-all duration-150 ease-in-out ${
            activeSubReport === type
              ? "bg-yellow-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {type.toUpperCase()}
        </button>
      ))}
    </div>
  ) : null;
})()}
  
{/* </div> */}
    {/* ✅ Table with Sorting */}
    <div className="overflow-auto max-h-[600px] border border-gray-300 rounded-lg">
      <table
        className="w-full border-collapse"
        style={{ fontSize: `${12 + (reportFontSizeLevel - 3) * 2}px` }}
      >
      
        <thead
          className="sticky top-0 z-30 bg-teal-700 text-white"
          style={{ fontSize: "inherit" }}
        >
          <tr>
            {Object.keys(sortedData[0] || {}).map((key, index) => {
              const isSticky = index < 3;
              return (
                <th
                  key={key}
                  onClick={() => handleSort(key)}   // ✅ Clicking anywhere will sort
                  className={`relative px-4 py-2 text-left border cursor-pointer whitespace-nowrap`}
                  style={{ fontSize: "inherit" }}
                >
                  <div className="flex items-center justify-between">
                    <span>{key.replace(/_/g, " ")}</span>

                    {/* Only Visual Sort Icon (no click needed inside it!) */}
                    <span className="ml-1">
                      {sortConfig.key === key ? (
                        sortConfig.direction === "asc" ? (
                          <span className="text-yellow-300">🔼</span>
                        ) : (
                          <span className="text-yellow-300">🔽</span>
                        )
                      ) : (
                        <span className="opacity-60">⇅</span>
                      )}
                    </span>

                    {/* &#128269;
                    Filter icon (keep e.stopPropagation() inside only for this) */}
                    <span
                      className="ml-1 cursor-pointer filter-icon"
                      data-index={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        showFilterPopup(index, e);
                      }}
                    >
                      &#128269;
                    </span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData
            .map((item, rowIndex) => (
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
    px-2 py-1 border whitespace-nowrap align-top text-sm select-text
    ${colIndex === 0 && "min-w-[90px] max-w-[90px] sticky left-0 bg-[#046e7a] text-white z-[5] text-xs"}
    ${colIndex === 1 && "min-w-[100px] max-w-[100px] sticky left-[90px] bg-[#046e7a] text-white z-[5] text-[10px] font-light"}
    ${colIndex === 2 && "min-w-[170px] max-w-[170px] sticky left-[190px] bg-[#046e7a] text-white z-[5] text-[12px] leading-snug"}
    ${["Candle_Time", "Fetcher_Trade_Time", "Operator_Trade_Time", "Operator_Close_Time"].includes(key) ? "text-[11px]" : ""}
    ${["Type", "Action", "Interval", "CJ", "PJ"].includes(key) ? "min-w-[60px] max-w-[60px] text-center" : ""}
  `}
  style={{ fontSize: key === "Unique_ID" ? `${8 + (reportFontSizeLevel - 2) * 2}px` : "inherit" }}
>
  {key === "Unique_ID" && typeof val === "string" && val.match(/\d{4}-\d{2}-\d{2}/) ? (
    (() => {
      const match = val.match(/\d{4}-\d{2}-\d{2}/);
      const splitIndex = val.indexOf(match[0]);
      const pair = val.slice(0, splitIndex);
      const timestamp = val.slice(splitIndex).replace("T", " ");
      return (
        <>
          <div className="font-bold leading-tight" style={{ fontSize: `${10 + (reportFontSizeLevel - 2) * 2}px` }}>{pair}</div>
          <div className="opacity-80 -mt-[2px] leading-tight" style={{ fontSize: `${2 + (reportFontSizeLevel - 2) * 2}px` }}>{timestamp}</div>
        </>
      );
    })()
  ) : (
    key === "PL_After_Comm" && val !== "N/A" ? `$${val}` : val
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
  "M.Id": trade.MachineId || "N/A",
  Unique_ID: trade.Unique_id || "N/A",

  "Candle_🕒": formatDateTime(trade.Candel_time),
  "Fetcher_🕒": formatDateTime(trade.Fetcher_Trade_time),
  "Operator_🕒": formatDateTime(trade.Operator_Trade_time),
  Pair: trade.Pair || "N/A",
  "⏱️": trade.Interval || "N/A",
  "💼": trade.Action || "N/A",
  CJ: trade.Commision_journey ? "✅" : "❌",
  PL: trade.Pl_after_comm != null ? parseFloat(trade.Pl_after_comm.toFixed(2)) : "N/A",
  PJ: trade.Profit_journey ? "✅" : "❌",
  Type: trade.Type || "N/A",
  "Operator_🕒❌": formatDateTime(trade.Operator_Close_time),
  "📡": trade.SignalFrom || "N/A",
  Min: trade.Min_close,
  Stop_Price: safeFixed(trade.Stop_price, 6),
  Save_Price: safeFixed(trade.Save_price, 6),
  Min_Comm: safeFixed(trade.Min_comm, 6),
  "🛡️": trade.Hedge ? "✅ Yes" : "❌ No",
  "🛡️1-1": trade.Hedge_1_1_bool ? "✅ Yes" : "❌ No",
  "🛡️_Order_Size": trade.Hedge_order_size || "N/A",
  "Min_Comm_After_🛡️": safeFixed(trade.Min_comm_after_hedge, 6),
  Min_Profit: safeFixed(trade.Min_profit, 2, "$"),
  Buy_Qty: trade.Buy_qty || 0,
  Buy_Price: safeFixed(trade.Buy_price, 6),
  Buy_PL: safeFixed(trade.Buy_pl, 6),
  Added_Qty: trade.Added_qty || "N/A",
  Sell_Qty: trade.Sell_qty || 0,
  Sell_Price: safeFixed(trade.Sell_price, 6),
  Sell_PL: safeFixed(trade.Sell_pl, 6),
  Close_Price: safeFixed(trade.Close_price, 6),
  Commission: safeFixed(trade.Commission, 2, "$"),
  Date: trade.Candel_time ? trade.Candel_time.split(" ")[0] : "N/A",
  Investment: safeFixed(trade.Investment, 2, "$"),
  Swing1: safeFixed(trade.Swing1, 6),
  Swing2: safeFixed(trade.Swing2, 6),
  Swing3: safeFixed(trade.Swing3, 6),
  Swing4: safeFixed(trade.Swing4, 6),
  Swing5: safeFixed(trade.Swing5, 6),
  HSHighP : safeFixed(trade.Hedge_Swing_High_Point, 6),
  HSLowP : safeFixed(trade.Hedge_Swing_Low_Point, 6),
  THighP : safeFixed(trade.Temp_High_Point, 6),
  TlowP : safeFixed(trade.Temp_Low_Point, 6)

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
  const [activeSubReport, setActiveSubReport] = useState("running");
  const [fontSizeLevel, setFontSizeLevel] = useState(() => {
    const saved = localStorage.getItem("fontSizeLevel");
    return saved ? parseInt(saved, 10) : 3; // default level 3
  });

  // Responsive font scaling: update --app-font-scale on fontSizeLevel change
  useEffect(() => {
    const root = document.documentElement;
    const baseSize = 1; // default rem (1x)
    const adjustment = (fontSizeLevel - 8) * 0.25; // increase/decrease per level
    root.style.setProperty("--app-font-scale", `${baseSize + adjustment}`);
  }, [fontSizeLevel]);

  useEffect(() => {
    localStorage.setItem("fontSizeLevel", fontSizeLevel);
  }, [fontSizeLevel]);

  const handleFontSizeChange = (level) => {
  setFontSizeLevel(level);
  const baseSize = 1; // 1rem
  const adjustment = (level - 3) * 0.25;
  const scale = baseSize + adjustment;
  document.documentElement.style.setProperty("--app-font-scale", `${scale}`);
  localStorage.setItem("fontSizeLevel", level);
};
  const [layoutOption, setLayoutOption] = useState(() => {
  const saved = localStorage.getItem("layoutOption");
  return saved ? parseInt(saved, 10) : 3;
});// default 3 cards per row
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
    "Spike":"SP",
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
    "Spike": true,

  });
  const [intervalRadioMode, setIntervalRadioMode] = useState(false);
  const [actionRadioMode, setActionRadioMode] = useState(false);

const [selectedActions, setSelectedActions] = useState({
  BUY: true,
  SELL: true,
});

// Sync selectedActions when actionRadioMode changes (radio-mode behavior)
useEffect(() => {
  if (actionRadioMode) {
    const selected = Object.keys(selectedActions).find((key) => selectedActions[key]);
    if (selected) {
      const updated = { BUY: false, SELL: false };
      updated[selected] = true;
      setSelectedActions(updated);
      localStorage.setItem("selectedActions", JSON.stringify(updated));
    }
  }
}, [actionRadioMode]);
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
            const tradeRes = await fetch("https://lab-code-9v3o.onrender.com/api/trades");
            const tradeJson = tradeRes.ok ? await tradeRes.json() : { trades: [] };
            const trades = Array.isArray(tradeJson.trades) ? tradeJson.trades : [];

            const machinesRes = await fetch("https://lab-code-9v3o.onrender.com/api/machines"); 
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
}, [tradeData, selectedSignals, selectedMachines, selectedIntervals, selectedActions, fromDate, toDate, includeMinClose, fontSizeLevel]);

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
    if (trade.Hedge) pushTo("Total_Hedge");
    if (trade.Hedge && trade.Type === "running") pushTo("Hedge_Running_pl");
    if (trade.Hedge && trade.Type === "close") pushTo("Hedge_Closed_pl");

    if (trade.Type === "close" && trade.Pl_after_comm > 0) pushTo("Close_in_Profit");
    if (trade.Type === "close" && trade.Profit_journey) pushTo("Close_After_Profit_Journey");
    if (trade.Type === "close" && trade.Commision_journey && trade.Pl_after_comm < 0) pushTo("Close_Curve_in_Loss");

    if (trade.Type === "close" && trade.Min_close === "Min_close") {
      if (trade.Pl_after_comm > 0) pushTo("Min_Close_Profit");
      if (trade.Pl_after_comm < 0) pushTo("Min_Close_Loss");
    }

    pushTo("Total_Closed_Stats");
    pushTo("Direct_Closed_Stats");
    pushTo("Hedge_Closed_Stats");
    pushTo("Total_Running_Stats");
    pushTo("Direct_Running_Stats");
    pushTo("Hedge_Running_Stats");
    pushTo("Hedge_on_Hold");
    pushTo("Total_Stats");
    pushTo("Closed_Count_Stats");
    pushTo("Assigned_New");
    



    if (trade.Hedge === true) pushTo("Hedge_Stats");

    // --- ADD: Buy_Sell_Stats logic
    if (["BUY", "SELL"].includes(trade.Action)) pushTo("Buy_Sell_Stats");

    // --- ADD: Journey_Stats logic (fix missing)
    if (trade.Type === "running" && trade.Pl_after_comm > 0 && trade.Profit_journey === true) pushTo("Journey_Stats_Running");
    if (trade.Type === "running" && trade.Pl_after_comm > 0 && trade.Commision_journey === true && !trade.Profit_journey) pushTo("Journey_Stats_Running");
    if (trade.Type === "running" && trade.Pl_after_comm < 0) pushTo("Journey_Stats_Running");
  });

  return memo;
}, [filteredTradeData]);

useEffect(() => {
  // 🔹 Total Investment Calculation
  const totalInvestment = filteredTradeData.reduce((sum, trade) => sum + (trade.Investment || 0), 0);
  let investmentAvailable = 50000 - totalInvestment;
  investmentAvailable = investmentAvailable < 0 ? 0 : investmentAvailable; // ✅ Prevent negative values

  const closePlus = filteredTradeData
    .filter(trade => trade.Pl_after_comm > 0 && trade.Type === "close" ) // ✅ Correct field reference
    .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  const closeMinus = filteredTradeData
    .filter(trade => trade.Pl_after_comm < 0 && trade.Type === "close"  ) // ✅ Correct field reference
    .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  const runningPlus = filteredTradeData
    .filter(trade => trade.Pl_after_comm > 0 & trade.Type === "running" & trade.Hedge === false) // ✅ Correct field reference
    .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  const runningMinus = filteredTradeData
    .filter(trade => trade.Pl_after_comm < 0 & trade.Type === "running" & trade.Hedge === false) // ✅ Correct field reference
    .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  const closedProfit = filteredTradeData
      .filter(trade => trade.Type === "close")
      .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  const runningProfit = filteredTradeData
  .filter(trade => trade.Hedge === false & trade.Type === "running")
  .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);

  const buyRunning = filteredTradeData.filter(t => t.Action === "BUY" && t.Type === "running").length;
  const buyTotal = filteredTradeData.filter(t => t.Action === "BUY").length;
  const sellRunning = filteredTradeData.filter(t => t.Action === "SELL" && t.Type === "running").length;
  const sellTotal = filteredTradeData.filter(t => t.Action === "SELL").length;

  const hedgePlusRunning = filteredTradeData
  .filter(trade => trade.Pl_after_comm > 0 & trade.Hedge === true & trade.Hedge_1_1_bool === true) // ✅ Correct field reference
  .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  const hedgeMinusRunning = filteredTradeData
    .filter(trade => trade.Pl_after_comm < 0 & trade.Hedge === true & trade.Hedge_1_1_bool === true)
    .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);   
  const hedgeRunningProfit = filteredTradeData
      .filter(trade => trade.Type === "running" & trade.Hedge === true & trade.Hedge_1_1_bool === true)
      .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);

  const hedgeActiveRunningPlus = filteredTradeData
  .filter(trade => trade.Hedge === true & trade.Hedge_1_1_bool === false & trade.Pl_after_comm > 0 & trade.Type === "running")
  .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  const hedgeActiveRunningMinus = filteredTradeData 
  .filter(trade => trade.Hedge === true & trade.Hedge_1_1_bool === false & trade.Pl_after_comm < 0 & trade.Type === "running")
  .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  const hedgeActiveRunningTotal = filteredTradeData
  .filter(trade => trade.Hedge === true & trade.Hedge_1_1_bool === false & trade.Type === "running")
  .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);

  const hedgeClosedPlus = filteredTradeData
  .filter(trade => trade.Type === "hedge_close" & trade.Pl_after_comm > 0)
  .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  const hedgeClosedMinus = filteredTradeData
  .filter(trade => trade.Type === "hedge_close" & trade.Pl_after_comm < 0)
  .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  const hedgeClosedTotal = filteredTradeData
  .filter(trade => trade.Type === "hedge_close"  )
  .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
  
  const minCloseProfitVlaue = filteredTradeData
    .filter(trade => trade.Min_close === "Min_close"  &&  trade.Type === "close" && trade.Pl_after_comm > 0)
    .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0).toFixed(2)
  
  const minCloseLossVlaue = filteredTradeData
    .filter(trade => trade.Min_close === "Min_close"  &&  trade.Type === "close" && trade.Pl_after_comm < 0)
    .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0).toFixed(2)

  console.log("🔍 Filtered Trade Data:", filteredTradeData);  

  // 🔹 Format dates for comparison
  // const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  // const yesterdayDate = yesterday.toISOString().split("T")[0];

  setMetrics(prevMetrics => ({
    ...prevMetrics,
Total_Closed_Stats: (
          <>
{/* className={`relative px-[3px] text-yellow-300 font-semibold font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }} */}

              <span title="Closed Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>Total Closed Trades &nbsp;</span>
              <span title="Closed Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>👇&nbsp;</span>
             
             &nbsp;
               <span title="Closed Count" className={`relative px-[3px] text-yellow-300 font-semibold  font-semibold`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {filteredTradeData.filter(trade => trade.Type === "close" || trade.Type === "hedge_close").length}
              </span>
             
              <div style={{ height: '14px' }} />
              <span title="Closed Profit (Hedge + Direct) " className={`text-green-300 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {(closePlus + hedgeClosedPlus).toFixed(2)}
              </span>
              &nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>+ </span>&nbsp;
              <span title="Closed Loss (Hedge + Direct)" className={`text-red-400 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {(closeMinus  +  hedgeClosedMinus).toFixed(2)}
              </span>
              &nbsp;&nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>=</span>&nbsp;&nbsp;
              <span
                className={`${closedProfit >= 0 ? "text-green-300" : "text-red-400"} text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}
                title="Closed Total (Hedge + Direct)"
              >
                {((closePlus + hedgeClosedPlus)+(closeMinus + hedgeClosedMinus)).toFixed(2)}
              </span>
              </>),
Direct_Closed_Stats: (
          <>

               <span title="Closed Count (Only Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>Direct Closed Trades&nbsp;</span>
              <span title="Closed Count (Only Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>👇&nbsp;</span>
                &nbsp;
             
              <span title="Closed Count" className={`relative px-[3px] text-yellow-300 font-semibold  font-semibold`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {filteredTradeData.filter(trade => trade.Type === "close" ).length}
              </span>
             
              <div style={{ height: '14px' }} />

              <span title="Closed Profit (Only Direct) " className={`text-green-300 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {(closePlus).toFixed(2)}
              </span>
              &nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>+ </span>&nbsp;
              <span title="Closed Loss (Only Direct)" className={`text-red-400 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {(closeMinus).toFixed(2)}
              </span>
              &nbsp;&nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>=</span>&nbsp;&nbsp;
              <span
                className={`${(closePlus + closeMinus ) >= 0 ? "text-green-300" : "text-red-400"} text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}
                title="Closed Total (Only Direct)"
              >
                {(closePlus + closeMinus ).toFixed(2)}
              </span>
              </>),
Hedge_Closed_Stats: (
            <>

               <span title="Total Trades Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold font-semibold`} style={{ fontSize: `${26 + (fontSizeLevel - 8) * 5}px` }}>Hedge Closed  &nbsp;</span>
              <span title="Total Trades Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>👇&nbsp;</span>
            &nbsp;
             
              <span
                className={`relative px-[3px] text-yellow-300 font-semibold  font-semibold`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}
                title="Closed Hedge Count"
              >
                {filteredTradeData.filter(trade => trade.Hedge === true & trade.Type === "hedge_close").length}
              </span>
             
              <div style={{ height: '14px' }} />
              <span className={`text-green-300 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }} title="Closed Hedge Profit +">{hedgeClosedPlus.toFixed(2)}</span>
              &nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>+ </span>&nbsp;
              <span className={`text-red-400 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }} title="Closed Hedge Profit -">{hedgeClosedMinus.toFixed(2)}</span>
              &nbsp;&nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>=</span>&nbsp;&nbsp;
              <span className={`${hedgeClosedTotal >= 0 ? "text-green-300" : "text-red-400"} text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }} title="Closed Hedge Profit Total">{hedgeClosedTotal.toFixed(2)}</span>
            </>
          ),
Total_Running_Stats: (
          <>


             <span title="Running Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>Total Running Trades&nbsp;</span>
             <span title="Running Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>👇</span>
             &nbsp;
           
            <span title="Running Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold  font-semibold`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {filteredTradeData.filter(trade => trade.Type === "running" & trade.Hedge_1_1_bool === false).length}
              </span>
              
           
           <div style={{ height: '14px' }} />
              &nbsp;
              <span title="Running Profit (Hedge + Direct)" className={`text-green-300 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {(runningPlus+hedgeActiveRunningPlus).toFixed(2)}
              </span>
              &nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>+ </span>&nbsp;
              <span title="Running Loss (Hedge + Direct)" className={`text-red-400 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {(runningMinus + hedgeActiveRunningMinus).toFixed(2)}
              </span>
              &nbsp;&nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>=</span>&nbsp;&nbsp;
              <span
                className={`${(runningProfit + hedgeActiveRunningTotal) >= 0 ? "text-green-300" : "text-red-400"} text-[30px]`}style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}
                title="Running Total (Hedge + Direct)"
              >
                {((runningProfit + hedgeActiveRunningTotal)).toFixed(2)}
              </span>
               </>),
 Direct_Running_Stats: (
          <>
            
            
             <span title="Running Count (only Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>Direct Running Trades&nbsp;</span>
             <span title="Running Count (only Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>👇</span>
            &nbsp;
            <span title="Running Count (only Direct)" className={`relative px-[3px] text-yellow-300 font-semibold  font-semibold`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {filteredTradeData.filter(trade => trade.Type === "running" & trade.Hedge === false).length}
              </span>
              
           <div style={{ height: '14px' }} />
              &nbsp;
              <span title="Running Profit (only Direct)" className={`text-green-300 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {runningPlus.toFixed(2)}
              </span>
              &nbsp;<span style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>+ </span>&nbsp;
              <span title="Running Loss (only Direct)" className={`text-red-400 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {runningMinus.toFixed(2)}
              </span>
              &nbsp;&nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>=</span>&nbsp;&nbsp;
              <span
                className={`${runningProfit >= 0 ? "text-green-300" : "text-red-400"} text-[30px]`}style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}
                title="Running Total (only Direct)"
              >
                {runningProfit.toFixed(2)}
              </span>
               </>),
 Hedge_Running_Stats: (
            <>

              <span title="Total Trades Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold  font-semibold`} style={{ fontSize: `${26 + (fontSizeLevel - 8) * 5}px` }}>Hedge Running&nbsp;</span>
              <span title="Total Trades Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>👇&nbsp;</span>
              &nbsp;
              
              <span
                className={`relative px-[3px] text-yellow-300 font-semibold  font-semibold`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}
                title="Running Hedge Count"
              >
                {filteredTradeData.filter(trade => trade.Hedge_1_1_bool === false & trade.Hedge === true & trade.Type === "running").length}
              </span>

              <div style={{ height: '14px' }} />
              <span className={`text-green-300 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }} title="Running Hedge in Profit">{hedgeActiveRunningPlus.toFixed(2)}</span>
              &nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>+ </span>&nbsp;
              <span className={`text-red-400 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }} title="Running Hedge in Loss ">{hedgeActiveRunningMinus.toFixed(2)}</span>
              &nbsp;&nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>=</span>&nbsp;&nbsp;
              <span className={`${hedgeActiveRunningTotal >= 0 ? "text-green-300" : "text-red-400"} text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }} title="Running Hedge Total">{hedgeActiveRunningTotal.toFixed(2)}</span>
              </>
          ),


Total_Stats: (
          <>
               

              
              <span title="Total Trades Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>All Total Trades&nbsp;</span>
              <span title="Total Trades Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>👇&nbsp;</span>
             &nbsp;
              <span title="Total Trades Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold  font-semibold`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {filteredTradeData.length}
              </span>
              <div style={{ height: '14px' }} />
              <span title="Total Profit (Hedge + Direct) " className={`text-green-300 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {(runningPlus + hedgeClosedPlus + hedgePlusRunning + closePlus ).toFixed(2)}
              </span>
              &nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>+ </span>&nbsp;
              <span title="Total Loss (Hedge + Direct)" className={`text-red-400 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>
                {(runningMinus + hedgeClosedMinus + hedgeMinusRunning + closeMinus + hedgeActiveRunningMinus).toFixed(2)}
              </span>
              &nbsp;&nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>=</span>&nbsp;&nbsp;
              <span
                className={`${((runningPlus + hedgeClosedPlus + hedgePlusRunning + closePlus )+((runningMinus + hedgeClosedMinus + hedgeMinusRunning + closeMinus + hedgeActiveRunningMinus))).toFixed(2) >= 0 ? "text-green-300" : "text-red-400"} text-[35px]`}style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}
                title="Total (Hedge + Direct)"
              >
                {((runningPlus + hedgeClosedPlus + hedgePlusRunning + closePlus )+((runningMinus + hedgeClosedMinus + hedgeMinusRunning + closeMinus + hedgeActiveRunningMinus))).toFixed(2)}
              </span>
            </>
          ),
 Buy_Sell_Stats: (
            <>
              <div style={{ height: '6px' }} />

              <span className={`relative px-[3px] text-yellow-300 font-semibold opacity-80`} style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>Buy running&nbsp;&nbsp;</span>
              <span className={`relative px-[3px] text-green-300 `} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{buyRunning}</span>
              &nbsp;&nbsp;<span style={{ fontSize: `${20 + (fontSizeLevel - 8) * 5}px` }}>out of</span>&nbsp;
              <span className={`relative px-[3px] text-green-300 `} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{buyTotal}</span>
              <div style={{ height: '10px' }} />
              
              <span className={`relative px-[3px] text-yellow-300 font-semibold opacity-80 `} style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>Sell running&nbsp;&nbsp;</span>
              <span className={`relative px-[3px] text-green-300 `} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{sellRunning}</span>
              &nbsp;&nbsp;<span style={{ fontSize: `${20 + (fontSizeLevel - 8) * 5}px` }}>out of</span>&nbsp;
              <span className={`relative px-[3px] text-green-300 `} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{sellTotal}</span>
              <br />
            </>
          ),
  Hedge_on_Hold: (
            <>

              
              <span title="Total Trades Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-200 font-semibold  font-semibold`} style={{ fontSize: `${26 + (fontSizeLevel - 8) * 5}px` }}>Hedge on hold  1-1 &nbsp;</span>
              <span title="Total Trades Count (Hedge + Direct)" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>👇&nbsp;</span>
              &nbsp;
              <span
                className={`relative px-[3px] text-yellow-300 font-semibold  font-semibold`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}
                title="Hedge 1-1 Count"
              >
                {filteredTradeData.filter(trade => trade.Hedge === true & trade.Hedge_1_1_bool === true).length}
              </span>
              <div style={{ height: '14px' }} />
              <span className={`text-green-300 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }} title="Hedge 1-1 Profit">{hedgePlusRunning.toFixed(2)}</span>
              &nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>+ </span>&nbsp;
              <span className={`text-red-400 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }} title="Hedge 1-1 Loss">{hedgeMinusRunning.toFixed(2)}</span>
              &nbsp;&nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>=</span>&nbsp;&nbsp;
              <span className={`${hedgeRunningProfit >= 0 ? "text-green-300" : "text-red-400"} text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}title="Hedge 1-1 Total">{hedgeRunningProfit.toFixed(2)}</span>
              </>
          ),

Closed_Count_Stats: (
            <>
            <span title="Closed Trades Count" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>Closed Trades Count&nbsp;</span>
              <span title="Closed Trade Count" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>👇&nbsp;</span>
                            <div style={{ height: '14px' }} />

              <span className={`relative px-[3px] text-yellow-300 font-semibold opacity-80 font-semibold`} style={{ fontSize: `${19 + (fontSizeLevel - 8) * 5}px` }}>After&nbsp;&nbsp;&nbsp;PJ -&nbsp;</span><span className={`relative px-[3px] text-green-300 `} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }} >{filteredTradeData.filter(trade => trade.Profit_journey === true && trade.Type === "close").length}</span>
           
              <span className={`relative px-[3px] text-yellow-300 font-semibold opacity-80 font-semibold`} style={{ fontSize: `${19 + (fontSizeLevel - 8) * 5}px` }}>, &nbsp;&nbsp;&nbsp;Profit -</span> <span className={`relative px-[3px] text-green-300 `} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{filteredTradeData.filter(trade => trade.Pl_after_comm > 0 && trade.Type === "close").length}</span>

              <span className={`relative px-[3px] text-yellow-300 font-semibold opacity-80 font-semibold`} style={{ fontSize: `${19 + (fontSizeLevel - 8) * 5}px` }}>,&nbsp;&nbsp;&nbsp; Loss -</span> <span className="text-[30px] text-red-400" style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{filteredTradeData.filter(trade => trade.Pl_after_comm < 0 && trade.Type === "close").length}</span>
              
            </>
          ),

Journey_Stats_Running: (
            <>
            <span title="Journey Detail" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>Journey Stats&nbsp;</span>
              <span title="Journey Detail" className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}>👇&nbsp;</span>
                            <div style={{ height: '14px' }} />

              <span className="text-[20px] font-semibold opacity-70 text-center" style={{ fontSize: `${20 + (fontSizeLevel - 8) * 5}px` }}>PJ -&nbsp;</span>
              <span className={`text-green-300 text-[30px]text-center`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{filteredTradeData.filter(trade => trade.Profit_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running").length}</span>
              <span className="text-[20px] font-semibold opacity-70 text-center" style={{ fontSize: `${20 + (fontSizeLevel - 8) * 5}px` }}>  &nbsp;&nbsp;&nbsp;CJ -&nbsp;</span>
              <span className="text-yellow-300 text-[30px] text-center" style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{filteredTradeData.filter(trade => trade.Commision_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running" && trade.Profit_journey === false).length}</span>
              <span className="text-[20px] font-semibold opacity-70 text-center"  style={{ fontSize: `${20 + (fontSizeLevel - 8) * 5}px` }}> &nbsp;&nbsp;BC- &nbsp;</span>
              <span className={`text-red-400 text-[30px] text-center`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{filteredTradeData.filter(trade => trade.Pl_after_comm < 0 && trade.Type === "running").length}</span>
            </>
          ),
Client_Stats: (
            <>
             <span className={`relative px-[3px] text-yellow-300 font-semibold opacity-80 font-semibold`} style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}> Clients&nbsp;&nbsp; : &nbsp;&nbsp;</span>
              <span className="text-[30px]" style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{machines.filter(machine => machine.Active).length}</span>
              &nbsp;<span className="text-[30px]"  style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}> &nbsp; out of </span>&nbsp;
              <span className="text-[30px]" style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{machines.length}</span>
            </>
          ),
Min_Close_Profit: (
            <>
             <span className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}> Min Close Profit&nbsp;&nbsp;:&nbsp;&nbsp;</span>
              <span className={`text-green-300 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{filteredTradeData.filter(trade => trade.Min_close === "Min_close" && trade.Type === "close" && trade.Pl_after_comm > 0).length}</span>
              &nbsp;&nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>=&nbsp;&nbsp;$&nbsp;&nbsp;</span>
              <span className={`${minCloseProfitVlaue >= 0 ? "text-green-300" : "text-red-400"} text-[35px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{minCloseProfitVlaue}</span>
            </>
          ),
Min_Close_Loss: (
            <>
             <span className={`relative px-[3px] text-yellow-300 font-semibold opacity-70 font-semibold`} style={{ fontSize: `${24 + (fontSizeLevel - 8) * 5}px` }}> Min Close Loss&nbsp;&nbsp;:&nbsp;&nbsp;</span>
              <span className={`text-red-400 text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{filteredTradeData.filter(trade => trade.Min_close === "Min_close" && trade.Type === "close" && trade.Pl_after_comm < 0).length}</span>
              &nbsp;&nbsp;<span style={{ fontSize: `${25 + (fontSizeLevel - 8) * 5}px` }}>=&nbsp;&nbsp;$&nbsp;&nbsp;</span>
              <span className={`${minCloseLossVlaue >= 0 ? "text-green-300" : "text-red-400"} text-[30px]`} style={{ fontSize: `${30 + (fontSizeLevel - 8) * 5}px` }}>{minCloseLossVlaue}</span>
            </>
          ),
  }));
// Update dependency array to refresh on filteredTradeData, selectedBox, fontSizeLevel
}, [filteredTradeData, selectedBox, fontSizeLevel]);

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
      "Spike": true,
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
// Optimized toggle handlers
const toggleMachine = useCallback((machineId) => {
  setSelectedMachines(prev => {
    const updated = { ...prev, [machineId]: !prev[machineId] };
    localStorage.setItem("selectedMachines", JSON.stringify(updated));
    return updated;
  });
}, []);

const toggleInterval = useCallback((interval) => {
  setSelectedIntervals(prev => {
    const updated = { ...prev, [interval]: !prev[interval] };
    localStorage.setItem("selectedIntervals", JSON.stringify(updated));
    return updated;
  });
}, []);

const toggleAction = useCallback((action) => {
  setSelectedActions(prev => {
    const updated = { ...prev, [action]: !prev[action] };
    localStorage.setItem("selectedActions", JSON.stringify(updated));
    return updated;
  });
}, []);

const toggleBox = (cardTitle) => {
  const normalized = cardTitle.trim().replace(/\s+/g, "_");
  const data = getFilteredForTitle[normalized];

  setSelectedBox((prevSelected) => {
    if (prevSelected === normalized || !data) return null;

    // Automatically select sub-report button based on clicked box title
    if (normalized.includes("Running")) setActiveSubReport("running");
    else if (normalized.includes("Closed") && normalized.includes("Direct")) setActiveSubReport("close");
    else if (normalized.includes("Closed") && normalized.includes("Hedge")) setActiveSubReport("closed");
    else if (normalized.includes("Hedge_on_Hold")) setActiveSubReport("holding");
    else if (normalized.includes("Assign")) setActiveSubReport("assign");
    else if (normalized.includes("Total_Closed")) setActiveSubReport("close");
    else if (normalized.includes("Total_Running")) setActiveSubReport("running");

    return normalized;
  });
};
const toggleSignal = (signal) => {
  setSelectedSignals(prev => {
    const updatedSignals = { ...prev, [signal]: !prev[signal] };
    localStorage.setItem("selectedSignals", JSON.stringify(updatedSignals)); // ✅ Save instantly
    return updatedSignals;
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
  <div className="flex overflow-x-auto">
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
    

      <span className="text-green-600 text-[16px] font-bold block text-left mb-1">
                ➤ Assigned New:</span> <span
  className="text-red-600 text-[34px] font-bold block text-left mb-1 cursor-pointer hover:underline"
  title="Click to view Assigned Trades"
  onClick={() => {
    setSelectedBox((prev) => {
      const next = prev === "Assigned_New" ? null : "Assigned_New";
      if (next) {
        setActiveSubReport("assign");
        setTimeout(() => {
          const section = document.getElementById("tableViewSection");
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
      return next;
    });
  }}
>
  {filteredTradeData.filter(trade => trade.Type === "assign").length}
</span>
  </div>
  
</div>
<div className="flex items-center mb-4 gap-x-8">
  <button
    onClick={() => setIncludeMinClose(prev => !prev)}
    className={`text-white px-3 py-2 rounded text-sm transition-all ${
      includeMinClose ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
    }`}
  >
    {includeMinClose ? "✅ Min Close ON" : "❌ Min Close OFF"}
  </button>
  
  <div className="flex flex-wrap items-center gap-4 my-4">
  <div className="flex flex-col ">
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
<div style={{ height: '12px' }}/>
  <div className="flex flex-col">
    <div style={{ height: '12px' }}/>
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
> Reset
</button>

  </div>
  
</div>
 
</div>
<div className="flex items-center ml-6 space-x-3">
  <span className="text-sm font-semibold text-black">Layout:</span>
  <button
    onClick={() => {
      const newOption = Math.max(1, layoutOption - 1);
      setLayoutOption(newOption);
      localStorage.setItem("layoutOption", newOption);
    }}
    className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
  >
    ➖
  </button>
  &nbsp;&nbsp;
  <button
    onClick={() => {
      const newOption = Math.min(14, layoutOption + 1); // 🚀 Increase up to 14
      setLayoutOption(newOption);
      localStorage.setItem("layoutOption", newOption);
    }}
    className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
  >
    ➕
  </button>

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
   <div className="flex items-center space-x-3">
  <button
    onClick={() => setFontSizeLevel(prev => {
      const newLevel = Math.max(1, prev - 1);
      localStorage.setItem("fontSizeLevel", newLevel);
      return newLevel;
    })}
    className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
    aria-label="Decrease font size"
  >
    ➖
  </button>
  <span className="text-sm font-semibold text-black">Font: {fontSizeLevel}</span>
  <button
    onClick={() => setFontSizeLevel(prev => {
      const newLevel = Math.min(20, prev + 1);
      localStorage.setItem("fontSizeLevel", newLevel);
      return newLevel;
    })}
    className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
    aria-label="Increase font size"
  >
    ➕
  </button>
</div>

  </div>
  <div style={{ height: '12px' }}/>


</div>
        
        
        {/* ✅ Dashboard Cards */}
        {metrics && (
          <div
            className="grid gap-4 w-full px-1"
            style={{
              gridTemplateColumns: `repeat(${layoutOption}, minmax(0, 1fr))`,
              transition: "all 0.3s ease-in-out"
            }}
          >
            {Object.entries(metrics).map(([title, value]) => {
              const normalizedKey = title.trim().replace(/\s+/g, "_");
              return (
                <div
                  key={normalizedKey}
                  className="relative"
                >
                  <DashboardCard
                    title={title}
                    value={value}
                    isSelected={selectedBox === normalizedKey}
                    onClick={() => {
                      const hasData = getFilteredForTitle[normalizedKey];
                      setSelectedBox(prev =>
                        prev === normalizedKey || !hasData ? null : normalizedKey
                      );
                    }}
                    filteredTradeData={filteredTradeData}
                  />
                </div>
              );
            })}
          </div>
        )}
        {/* ✅ Machine Filter with Mode Toggle */}
        
        {/* --- Render metrics/cards here as before --- */}
        {/* ✅ TableView always rendered below dashboard, default to Total Profit if nothing selected */}
        <div className="mt-6">
        {selectedBox && (() => {
          const normalizedKey = selectedBox?.trim().replace(/\s+/g, "_");
          const data = getFilteredForTitle[normalizedKey];
          if (data && data.length > 0) {
            return (
              <div className="mt-6">
                <TableView
  title={selectedBox}
  tradeData={data}
  clientData={clientData}
  logData={logData}
  activeSubReport={activeSubReport}
  setActiveSubReport={setActiveSubReport}
/>
              </div>
            );
          } else {
            return (
              <p className="text-center text-gray-500 mt-4">
                ⚠️ No relevant data available for {selectedBox.replace(/_/g, " ")}
              </p>
            );
          }
        })()}
        </div>
        {/* ✅ Data Table */}
        {/* (removed duplicate TableView block) */}

      </div>
    </div>
  </div>
);
};

export default Dashboard;
  