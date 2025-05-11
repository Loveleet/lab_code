

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

const DashboardCard = ({ title, value, isSelected, onClick }) =>  {

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
      className={`cursor-pointer p-8 rounded-2xl border transition-all duration-300 transform
        ${isSelected
          ? "bg-gradient-to-br from-blue-900 to-green-500 scale-[1.03] shadow-lg ring-4 ring-yellow-600 border-yellow-700 text-gray-900"
          : "bg-gradient-to-br from-blue-800 to-indigo-900 hover:scale-[1.03] hover:shadow-xl hover:ring-4 hover:ring-yellow-400/60 hover:border-yellow-500/70 text-white"}`}
      onClick={onClick}
    >
      {/* ✅ Title with sky blue color */}
      <h2 className="text-lg font-semibold text-center text-blue-400">{title.replace(/_/g, " ")}</h2>
      {/* ✅ Properly formatted value using dangerouslySetInnerHTML */}
      <p className="text-base font-semibold text-center">
        {typeof value === "string"
          ? <span dangerouslySetInnerHTML={{ __html: formatValue(value) }} />
          : value}
      </p>
    </div>
  );
};

// Apply this background to the dashboard container:
<div className="flex bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen text-white">
  {/* Sidebar & Content */}
</div>;




const TableView = ({ title, tradeData, clientData, logData, activeSubReport, setActiveSubReport }) => {
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
    if (!tradeData || tradeData.length === 0) return;
  
    const result = tradeData.map((trade, index) => formatTradeData(trade, index));
    setFilteredData(result);
  }, [title, tradeData, activeSubReport]);

  const handleOpenReport = (title, sortedData) => {
    if (!sortedData || sortedData.length === 0) return;
    const reportWindow = window.open("", "_blank", "width=1200,height=600");
    const tableHeaders = Object.keys(sortedData[0]);

     const reportContent = `
  <html>
  <head>
  <title>${title.replace(/_/g, " ")} Report</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
  <style>
  body { font-family: Arial; margin:20px; background:#f2f2f7; }
  table { width:100%; border-collapse: collapse; cursor:pointer; }
  th, td { padding:6px 8px; border-bottom:1px solid #ccc; text-align:center; font-size:12px; }
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
    if (!tradeData || tradeData.length === 0) return;
    
    let result = [];

    switch (title) {
      case "Profit_Stats":
        result = tradeData
          .filter((trade) => {
            if (activeSubReport === "running") return trade.Type === "running";
            if (activeSubReport === "close") return trade.Type === "close";
            return true;
          })
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Count_Stats":
        result = tradeData
          .filter((trade) => {
            if (activeSubReport === "loss") return trade.Type === "close" && trade.Pl_after_comm < 0;
            if (activeSubReport === "profit") return trade.Type === "close" && trade.Pl_after_comm > 0;
            if (activeSubReport === "pj") return trade.Type === "close" && trade.Profit_journey === true;
            return true;
          })
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Hedge_Stats":
        result = tradeData
          .filter((trade) => {
            if (!trade.Hedge) return false;
            if (activeSubReport === "running") return trade.Hedge_1_1_bool === false && trade.Type === "running";
            if (activeSubReport === "holding") return trade.Hedge_1_1_bool === true && trade.Type === "running";
            if (activeSubReport === "closed") return trade.Type === "hedge_close";
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
      case "Journey_Stats":
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
          .filter(
            (trade) =>
              trade.Type === "close" &&
              trade.Min_close === "Min_close" &&
              trade.Pl_after_comm > 0
          )
          .map((trade, index) => formatTradeData(trade, index));
        break;
      case "Min_Close_Loss":
        result = tradeData
          .filter(
            (trade) =>
              trade.Type === "close" &&
              trade.Min_close === "Min_close" &&
              trade.Pl_after_comm < 0
          )
          .map((trade, index) => formatTradeData(trade, index));
        break;
      default:
        result = [];
    }
    setFilteredData(result);
  }, [title, tradeData, activeSubReport, clientData]);

  // Add conditional early return to prevent unnecessary rendering
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
    {/* ✅ SEARCH, EXPORT, RESET FILTER BAR */}

  {/* Search */}
  <input
    type="text"
    placeholder="🔍 Type to search..."
    onChange={(e) => {
      const value = e.target.value.toLowerCase();
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
    case "Profit_Stats":
      options = ["running", "close", "total"];
      break;
    case "Hedge_Stats":
      options = ["running", "holding", "closed"];
      break;
    case "Count_Stats":
      options = ["loss", "profit", "pj"];
      break;
    case "Buy_Sell_Stats":
      options = ["buy", "sell"];
      break;
    case "Journey_Stats":
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
      <table className="w-full border-collapse">
      <thead className="sticky top-0 z-30 bg-teal-700 text-white text-sm">
<tr>
  {Object.keys(sortedData[0] || {}).map((key, index) => {
    const isSticky = index < 3;
    return (
      <th
  key={key}
  onClick={() => handleSort(key)}   // ✅ Clicking anywhere will sort
  className="relative px-4 py-2 text-left border cursor-pointer whitespace-nowrap"
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
  "Operator_🕒": formatDateTime(trade.Operator_Close_time),
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
  HSLowP : safeFixed(trade.Hedge_Swing_Low_Point, 6)  

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

    pushTo("Profit_Stats");
    pushTo("Count_Stats");
    if (trade.Hedge === true) pushTo("Hedge_Stats");

    // --- ADD: Buy_Sell_Stats logic
    if (["BUY", "SELL"].includes(trade.Action)) pushTo("Buy_Sell_Stats");

    // --- ADD: Journey_Stats logic (fix missing)
    if (trade.Type === "running" && trade.Pl_after_comm > 0 && trade.Profit_journey === true) pushTo("Journey_Stats");
    if (trade.Type === "running" && trade.Pl_after_comm > 0 && trade.Commision_journey === true && !trade.Profit_journey) pushTo("Journey_Stats");
    if (trade.Type === "running" && trade.Pl_after_comm < 0) pushTo("Journey_Stats");
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
        .filter(trade => trade.Hedge === true & trade.Hedge_1_1_bool === false & trade.Pl_after_comm > 0)
        .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        const hedgeActiveRunningMinus = filteredTradeData 
        .filter(trade => trade.Hedge === true & trade.Hedge_1_1_bool === false & trade.Pl_after_comm < 0)
        .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        const hedgeActiveRunningTotal = filteredTradeData
        .filter(trade => trade.Hedge === true & trade.Hedge_1_1_bool === false)
        .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);

        const hedgeClosedPlus = filteredTradeData
        .filter(trade => trade.Type === "hedge_close" & trade.Pl_after_comm > 0)
        .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        const hedgeClosedMinus = filteredTradeData
        .filter(trade => trade.Type === "hedge_close" & trade.Hedge_1_1_bool === false & trade.Pl_after_comm < 0)
        .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        const hedgeClosedTotal = filteredTradeData
        .filter(trade => trade.Type === "hedge_close" & trade.Hedge_1_1_bool === false )
        .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0);
        
        const runningTotalDisplay = (
          <>
            Buy &nbsp;&nbsp;=&gt;&nbsp;&nbsp; {buyRunning}&nbsp;&nbsp; / &nbsp;&nbsp;{buyTotal} <br />
            Sell&nbsp;&nbsp; =&gt;&nbsp;&nbsp; {sellRunning} &nbsp;&nbsp;/ &nbsp;&nbsp;{sellTotal} <br />
            </>
            );

        const pj_cj_bc = (
          <>
          <span className="text-xs font-semibold opacity-40">&nbsp;&nbsp;PJ&nbsp;&nbsp;-&nbsp;&nbsp;</span>
<span className="text-green-300">{filteredTradeData.filter(trade => trade.Profit_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running").length}</span>
<span className="text-xs font-semibold opacity-40">&nbsp;&nbsp; /&nbsp;&nbsp; CJ&nbsp;&nbsp;-&nbsp;&nbsp;</span>
<span className="text-yellow-300">{filteredTradeData.filter(trade => trade.Commision_journey === true && trade.Pl_after_comm > 0 && trade.Type === "running" && trade.Profit_journey === false).length}</span>
<span className="text-xs font-semibold opacity-40">&nbsp;&nbsp; /&nbsp;&nbsp; BC&nbsp;&nbsp;-&nbsp;&nbsp;</span>
<span className="text-red-400">{filteredTradeData.filter(trade => trade.Pl_after_comm < 0 && trade.Type === "running").length}</span>
          </>
        );

        const totalClient = (
          <>
          Clients&nbsp;&nbsp; : &nbsp;&nbsp;{machines.filter(machine => machine.Active).length}&nbsp;&nbsp; / &nbsp;&nbsp;{machines.length}
          </>
        );

        const minCloseProfitVlaue = filteredTradeData
          .filter(trade => trade.Min_close === "Min_close"  &&  trade.Type === "close" && trade.Pl_after_comm > 0)
          .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0).toFixed(2)
        
        const minCloseProfit = (
          <>
          Min Close Profit&nbsp;&nbsp;:&nbsp;&nbsp; <span className="text-green-300">{filteredTradeData.filter(trade => trade.Min_close === "Min_close"  &&  trade.Type === "close" && trade.Pl_after_comm > 0).length}</span>
           &nbsp;&nbsp;=&nbsp;&nbsp; $&nbsp;&nbsp; <span className={`${minCloseProfitVlaue >= 0 ? "text-green-300" : "text-red-400"}`}>{minCloseProfitVlaue}</span>
          </>
        );
        
        const minCloseLossVlaue = filteredTradeData
          .filter(trade => trade.Min_close === "Min_close"  &&  trade.Type === "close" && trade.Pl_after_comm < 0)
          .reduce((sum, trade) => sum + (trade.Pl_after_comm || 0), 0).toFixed(2)
        
        const minCloseLoss = (
          <>
          Min Close Loss&nbsp;&nbsp;:&nbsp;&nbsp; <span className="text-red-400">{filteredTradeData.filter(trade => trade.Min_close === "Min_close"  &&  trade.Type === "close" && trade.Pl_after_comm < 0).length}</span>
          &nbsp;&nbsp; = &nbsp;&nbsp;$&nbsp;&nbsp; <span className={`${minCloseLossVlaue >= 0 ? "text-green-300" : "text-red-400"}`}>{minCloseLossVlaue}</span>
          </>
        );

        // console.log("🔍 Filtered Trade Data:", filteredTradeData);  


        // 🔹 Format dates for comparison
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().split("T")[0];

        // 🔹 Set Metrics (Dashboard Data)
        setMetrics(prevMetrics => ({
          ...prevMetrics, 

       
          
          
     "Profit_Stats": (
            <>
              {filteredTradeData.filter(trade => trade.Type === "assign").length}-✨&nbsp;&nbsp;&nbsp;{filteredTradeData.filter(trade => trade.Type === "running").length}-🏃‍♂️&nbsp; <span className="text-green-300">{runningPlus.toFixed(2)}</span> &nbsp;&nbsp;+ &nbsp;&nbsp;<span className="text-red-400">{runningMinus.toFixed(2)}</span>&nbsp;&nbsp; = &nbsp;&nbsp;<span className={`${runningProfit >= 0 ? "text-green-300" : "text-red-400"}`}>{runningProfit.toFixed(2)}</span><br />
              {filteredTradeData.filter(trade => trade.Type === "close").length}-🔒&nbsp;&nbsp;&nbsp;<span className="text-green-300">{closePlus.toFixed(2)}</span> &nbsp;&nbsp;+&nbsp;&nbsp; <span className="text-red-400">{closeMinus.toFixed(2)}</span> &nbsp;&nbsp;=&nbsp;&nbsp; <span className={`${closedProfit >= 0 ? "text-green-300" : "text-red-400"}`}>{closedProfit.toFixed(2)}</span><br />
              {filteredTradeData.length}-📈 &nbsp;&nbsp;&nbsp; <span className="text-green-300">{plus.toFixed(2)}</span> &nbsp;&nbsp;+ &nbsp;&nbsp;<span className="text-red-400">{minus.toFixed(2)}</span> &nbsp;&nbsp;=&nbsp;&nbsp; <span className={`${totalProfit >= 0 ? "text-green-300" : "text-red-400"}`}>{totalProfit.toFixed(2)}</span>
            </>
          ),
           "Hedge_Stats": (
              <>
                  {filteredTradeData.filter(trade => trade.Hedge_1_1_bool === false & trade.Hedge === true & trade.Type === "running" ).length}-🏃‍♂️ &nbsp;&nbsp;&nbsp;<span className="text-green-300">{hedgeActiveRunningPlus.toFixed(2)}</span> &nbsp;&nbsp;+&nbsp;&nbsp;<span className="text-red-400">{hedgeActiveRunningMinus.toFixed(2)}</span> &nbsp;&nbsp;= &nbsp;&nbsp;<span className={`${hedgeActiveRunningTotal >= 0 ? "text-green-300" : "text-red-400"}`}>{hedgeActiveRunningTotal.toFixed(2)}</span><br />
                 {filteredTradeData.filter(trade => trade.Hedge === true & trade.Hedge_1_1_bool === true).length}-🔒 &nbsp;&nbsp;&nbsp;<span className="text-green-300">{hedgePlusRunning.toFixed(2)}</span> &nbsp;&nbsp;+ &nbsp;&nbsp;<span className="text-red-400">{hedgeMinusRunning.toFixed(2)}</span>&nbsp;&nbsp; =&nbsp;&nbsp; <span className={`${hedgeRunningProfit >= 0 ? "text-green-300" : "text-red-400"}`}>{hedgeRunningProfit.toFixed(2)}</span><br />
                  {filteredTradeData.filter(trade => trade.Hedge === true & trade.Type === "hedge_close").length }-📈 &nbsp;&nbsp;&nbsp;<span className="text-green-300">{hedgeClosedPlus.toFixed(2)}</span> &nbsp;&nbsp;+ &nbsp;&nbsp;<span className="text-red-400">{hedgeClosedMinus.toFixed(2)}</span> &nbsp;&nbsp;= &nbsp;&nbsp;<span className={`${hedgeClosedTotal >= 0 ? "text-green-300" : "text-red-400"}`}>{hedgeClosedTotal.toFixed(2)}</span>
              </>
            ),
      

      "Count_Stats": (
              <>
                ❌ &nbsp;&nbsp;Loss&nbsp;&nbsp; Count :&nbsp;&nbsp; {filteredTradeData.filter(trade => trade.Pl_after_comm < 0 && trade.Type === "close").length}<br />
                ✅ &nbsp;&nbsp;Profit&nbsp;&nbsp; Count :&nbsp;&nbsp; {filteredTradeData.filter(trade => trade.Pl_after_comm > 0 && trade.Type === "close").length}<br />
                🚀 &nbsp;&nbsp;After&nbsp;&nbsp; PJ&nbsp;&nbsp; Count :&nbsp;&nbsp;{filteredTradeData.filter(trade => trade.Profit_journey === true && trade.Type === "close").length}
              </>
            ), 
     "Buy_Sell_Stats": runningTotalDisplay ,
      "Journey_Stats" : pj_cj_bc,
      "Client_Stats" : totalClient,
      "Min_Close_Profit": minCloseProfit,
      "Min_Close_Loss": minCloseLoss,
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
    const normalizedPrev = (prevSelected || "").trim().replace(/\s+/g, "_");
    return normalizedPrev === normalized || !data ? null : normalized;
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
> Reset
</button>
  </div>
</div>
</div>


</div>
        
        
        {/* ✅ Dashboard Cards */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(metrics).map(([title, value]) => {
              const normalizedKey = title.trim().replace(/\s+/g, "_");
              return (
                <DashboardCard
                  key={normalizedKey}
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
  