import React, { useState, useEffect } from "react";
import { Home, BarChart, Users, FileText, Menu, X } from "lucide-react";

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

const DashboardCard = ({ title, value, isSelected, onClick }) => (
  <div
    className={`cursor-pointer p-6 rounded-xl shadow-xl text-white transition-all duration-300 
      ${isSelected ? "bg-yellow-500 scale-110" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105"}`}
    onClick={onClick}
  >
    <h2 className="text-lg font-semibold text-center">{title.replace(/_/g, " ")}</h2>
    <p className="text-3xl font-bold text-center">{value}</p>
  </div>
);

const TableView = ({ title, tradeData, clientData, logData }) => {
  let filteredData = [];

  switch (title) {
    case "total_trades":
      filteredData = tradeData.map((trade, index) => ({
        S_No: index + 1,
        ...trade
      }));
      break;

    case "total_clients":
      filteredData = clientData.map(client => ({
        Client_id: client.Client_id,
        Investment_allowed: client.Investment_allowed,
        Active: client.Active ? "✅ Yes" : "❌ No"
      }));
      break;

    case "total_buy":
      filteredData = tradeData
        .filter(trade => trade.action === "BUY")
        .map((trade, index) => ({
          S_No: index + 1,
          ...trade
        }));
      break;

    case "total_sell":
      filteredData = tradeData
        .filter(trade => trade.action === "SELL")
        .map((trade, index) => ({
          S_No: index + 1,
          ...trade
        }));
      break;

    case "total_hedge":
      filteredData = tradeData
        .filter(trade => trade.hedge)
        .map((trade, index) => ({
          S_No: index + 1,
          Hedge: trade.hedge ? "✅ Yes" : "❌ No",
          ...trade
        }));
      break;

    case "profit_journey":
      filteredData = tradeData
        .filter(trade => trade.profit_journey)
        .map((trade, index) => ({
          S_No: index + 1,
          Profit_Journey: trade.profit_journey ? "✅ Yes" : "❌ No",
          ...trade
        }));
      break;

    case "active_hedges":
      filteredData = tradeData
        .filter(trade => trade.hedge_1_1_bool === 0)
        .map((trade, index) => ({
          S_No: index + 1,
          Active_Hedge: trade.hedge_1_1_bool === 0 ? "✅ Yes" : "❌ No",
          ...trade
        }));
      break;

    case "hold_hedges":
      filteredData = tradeData
        .filter(trade => trade.hedge_1_1_bool === 1)
        .map((trade, index) => ({
          S_No: index + 1,
          Hold_Hedge: trade.hedge_1_1_bool === 1 ? "✅ Yes" : "❌ No",
          ...trade
        }));
      break;

    case "total_investment":
      filteredData = tradeData.map((trade, index) => ({
        S_No: index + 1,
        Unique_id: trade.Unique_id,
        Pair: trade.pair,
        Investment: `$${trade.investment.toFixed(2)}`
      }));
      break;

    case "investment_available":
      const totalInvestment = tradeData.reduce((sum, trade) => sum + trade.investment, 0);
      const investmentAvailable = 50000 - totalInvestment;
      filteredData = [
        {
          Total_Investment: `$${totalInvestment.toFixed(2)}`,
          Investment_Available: `$${investmentAvailable.toFixed(2)}`
        }
      ];
      break;

    case "todays_count":
      const today = new Date().toISOString().split("T")[0];
      filteredData = tradeData
        .filter(trade => trade.date === today)
        .map((trade, index) => ({
          S_No: index + 1,
          ...trade
        }));
      break;

    case "yesterdays_count":
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toISOString().split("T")[0];
      filteredData = tradeData
        .filter(trade => trade.date === yesterdayDate)
        .map((trade, index) => ({
          S_No: index + 1,
          ...trade
        }));
      break;

    case "total_profit":
      const totalProfit = tradeData.reduce((sum, trade) => sum + trade.pl_after_comm, 0);
      filteredData = [
        {
          Total_Profit: `$${totalProfit.toFixed(2)}`
        }
      ];
      break;
      case "total_errors":
  filteredData = logData.map((log, index) => ({
    S_No: index + 1,
    Trade_ID: log.trade_id,
    Status: log.status,
    Error_Message: log.error,
    Noticed: log.Noticed ? "✅ Yes" : "❌ No",
    Auto_Resolved: log.auto_resolved ? "✅ Yes" : "❌ No",
    Timestamp: log.timestamp
  }));
  break;

case "active_errors":
  filteredData = logData
    .filter(log => !log.Noticed)
    .map((log, index) => ({
      S_No: index + 1,
      Trade_ID: log.trade_id,
      Status: log.status,
      Error_Message: log.error,
      Noticed: "❌ No",
      Auto_Resolved: log.auto_resolved ? "✅ Yes" : "❌ No",
      Timestamp: log.timestamp
    }));
  break;

case "not_auto_resolved_errors":
  filteredData = logData
    .filter(log => !log.auto_resolved)
    .map((log, index) => ({
      S_No: index + 1,
      Trade_ID: log.trade_id,
      Status: log.status,
      Error_Message: log.error,
      Noticed: log.Noticed ? "✅ Yes" : "❌ No",
      Auto_Resolved: "❌ No",
      Timestamp: log.timestamp
    }));
  break;

    default:
      return null;
  }

  if (filteredData.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No data available</p>;
  }

  return (
    <div className="mt-6 p-6 bg-white shadow-md rounded-lg max-w-full">
      <h2 className="text-xl font-bold">{title.replace(/_/g, " ")} Details</h2>

      {/* ✅ Button to Open in New Page */}
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={() => {
          const reportWindow = window.open("", "_blank", "width=1200,height=600");
          const reportContent = `
            <html>
              <head>
                <title>${title.replace(/_/g, " ")} Report</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .table-container { max-height: 90vh; overflow: auto; border: 1px solid #ddd; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
                  th { background-color: #4CAF50; color: white; position: sticky; top: 0; }
                </style>
              </head>
              <body>
                <h2>${title.replace(/_/g, " ")} Details</h2>
                <div class="table-container">
                  <table>
                    <tr>${Object.keys(filteredData[0] || {}).map(key => `<th>${key.replace(/_/g, " ")}</th>`).join("")}</tr>
                    ${filteredData.map(item => `
                      <tr>${Object.values(item).map(value => `<td>${value}</td>`).join("")}</tr>
                    `).join("")}
                  </table>
                </div>
                <script>
                  setInterval(() => {
                    window.location.reload();
                  }, 5000);
                </script>
              </body>
            </html>
          `;
          reportWindow.document.write(reportContent);
        }}
      >
        Open in New Page
      </button>

      {/* ✅ Fixed Header & Scrollable Table */}
      <div className="overflow-x-auto max-h-[500px] border border-gray-300 rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 sticky top-0 z-10 shadow-md">
            <tr>
              {Object.keys(filteredData[0] || {}).map(key => (
                <th key={key} className="px-4 py-2 text-left border">{key.replace(/_/g, " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-b">
                {Object.entries(item).map(([key, val], i) => (
                  <td key={i} className="px-4 py-2 border">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [tradeData, setTradeData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tradeRes = await fetch("/tradeData.json");
        const clientRes = await fetch("/clients.json");
        const logRes = await fetch("/logs.json");

        const tradeJson = await tradeRes.json();
        const clientJson = await clientRes.json();
        const logJson = await logRes.json();

        setTradeData(tradeJson);
        setClientData(clientJson);
        setLogData(logJson);

        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().split("T")[0];

        setMetrics({
          total_trades: tradeJson.length,
          total_clients: `${clientJson.filter(client => client.Active).length}/${clientJson.length}`, // ✅ Shows Active/Total
          total_buy: tradeJson.filter(trade => trade.action === "BUY").length,
          total_sell: tradeJson.filter(trade => trade.action === "SELL").length,
          total_hedge: tradeJson.filter(trade => trade.hedge).length,
          profit_journey: tradeJson.filter(trade => trade.profit_journey).length,
          active_hedges: tradeJson.filter(trade => trade.hedge_1_1_bool === 0).length,
          hold_hedges: tradeJson.filter(trade => trade.hedge_1_1_bool === 1).length,
          total_investment: `$${tradeJson.reduce((sum, trade) => sum + trade.investment, 0).toFixed(2)}`,
          todays_count: tradeJson.filter(trade => trade.date === today).length,
          yesterdays_count: tradeJson.filter(trade => trade.date === yesterdayDate).length,
          total_profit: `$${tradeJson.reduce((sum, trade) => sum + trade.pl_after_comm, 0).toFixed(2)}`,
          investment_available: `$${(50000 - tradeJson.reduce((sum, trade) => sum + trade.investment, 0)).toFixed(2)}`,
          total_errors: logJson.length,
          active_errors: logJson.filter(log => !log.Noticed).length,  // ✅ Noticed `false` means active error
          not_auto_resolved_errors: logJson.filter(log => !log.auto_resolved).length // ✅ Auto resolved `false`
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Initial Fetch
    fetchData();

    // Set interval for auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const toggleBox = (title) => {
    setSelectedBox(selectedBox === title ? null : title);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={`flex-1 min-h-screen transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} overflow-hidden`}>
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">LAB Dashboard</h1>

          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(metrics).map(([title, value]) => (
                <DashboardCard key={title} title={title} value={value} isSelected={selectedBox === title} onClick={() => toggleBox(title)} />
              ))}
            </div>
          )}

          {selectedBox && (
            <div className="mt-6">
              <TableView title={selectedBox} tradeData={tradeData} clientData={clientData} logData={logData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;