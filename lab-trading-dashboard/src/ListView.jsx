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
        Unique_ID: trade.Unique_id,
        Pair: trade.pair,
        Investment: `$${trade.investment.toFixed(2)}`,
        Interval: trade.interval,
        Stop_Price: `$${trade.stop_price}`,
        Save_Price: `$${trade.save_price}`,
        Min_Comm: trade.min_comm.toFixed(5),
        Hedge: trade.hedge ? "✅ Yes" : "❌ No",
        Hedge_1_1_Bool: trade.hedge_1_1_bool ? "✅ Yes" : "❌ No",
        Quantity: trade.quantity,
        Action: trade.action,
        Buy_Qty: trade.buy_qty,
        Buy_Price: `$${trade.buy_price}`,
        Buy_PL: `$${trade.buy_pl}`,
        Sell_Qty: trade.sell_qty,
        Sell_Price: `$${trade.sell_price}`,
        Sell_PL: `$${trade.sell_pl}`,
        Commission: `$${trade.commission}`,
        PL_After_Comm: `$${trade.pl_after_comm}`,
        Profit_Journey: trade.profit_journey ? "✅ Yes" : "❌ No",
        Min_Profit: `$${trade.min_profit}`,
        Hedge_Order_Size: trade.hedge_order_size,
        Timestamp: trade.timestamp,
        Date: trade.date
      }));
      break;

    case "total_buy":
      filteredData = tradeData
        .filter(trade => trade.action === "BUY")
        .map((trade, index) => ({
          S_No: index + 1,
        Unique_ID: trade.Unique_id,
        Pair: trade.pair,
        Investment: `$${trade.investment.toFixed(2)}`,
        Interval: trade.interval,
        Stop_Price: `$${trade.stop_price}`,
        Save_Price: `$${trade.save_price}`,
        Min_Comm: trade.min_comm.toFixed(5),
        Hedge: trade.hedge ? "✅ Yes" : "❌ No",
        Hedge_1_1_Bool: trade.hedge_1_1_bool ? "✅ Yes" : "❌ No",
        Quantity: trade.quantity,
        Action: trade.action,
        Buy_Qty: trade.buy_qty,
        Buy_Price: `$${trade.buy_price}`,
        Buy_PL: `$${trade.buy_pl}`,
        Sell_Qty: trade.sell_qty,
        Sell_Price: `$${trade.sell_price}`,
        Sell_PL: `$${trade.sell_pl}`,
        Commission: `$${trade.commission}`,
        PL_After_Comm: `$${trade.pl_after_comm}`,
        Profit_Journey: trade.profit_journey ? "✅ Yes" : "❌ No",
        Min_Profit: `$${trade.min_profit}`,
        Hedge_Order_Size: trade.hedge_order_size,
        Timestamp: trade.timestamp,
        Date: trade.date
        }));
      break;

    case "total_sell":
      filteredData = tradeData
        .filter(trade => trade.action === "SELL")
        .map((trade, index) => ({
         S_No: index + 1,
        Unique_ID: trade.Unique_id,
        Pair: trade.pair,
        Investment: `$${trade.investment.toFixed(2)}`,
        Interval: trade.interval,
        Stop_Price: `$${trade.stop_price}`,
        Save_Price: `$${trade.save_price}`,
        Min_Comm: trade.min_comm.toFixed(5),
        Hedge: trade.hedge ? "✅ Yes" : "❌ No",
        Hedge_1_1_Bool: trade.hedge_1_1_bool ? "✅ Yes" : "❌ No",
        Quantity: trade.quantity,
        Action: trade.action,
        Buy_Qty: trade.buy_qty,
        Buy_Price: `$${trade.buy_price}`,
        Buy_PL: `$${trade.buy_pl}`,
        Sell_Qty: trade.sell_qty,
        Sell_Price: `$${trade.sell_price}`,
        Sell_PL: `$${trade.sell_pl}`,
        Commission: `$${trade.commission}`,
        PL_After_Comm: `$${trade.pl_after_comm}`,
        Profit_Journey: trade.profit_journey ? "✅ Yes" : "❌ No",
        Min_Profit: `$${trade.min_profit}`,
        Hedge_Order_Size: trade.hedge_order_size,
        Timestamp: trade.timestamp,
        Date: trade.date
        }));
      break;

    case "total_hedge":
      filteredData = tradeData
        .filter(trade => trade.hedge)
        .map((trade, index) => ({
          S_No: index + 1,
          Unique_ID: trade.Unique_id,
          Pair: trade.pair,
          Investment: `$${trade.investment.toFixed(2)}`,
          Interval: trade.interval,
          Stop_Price: `$${trade.stop_price}`,
          Save_Price: `$${trade.save_price}`,
          Min_Comm: trade.min_comm.toFixed(5),
          Hedge: trade.hedge ? "✅ Yes" : "❌ No",
          Hedge_1_1_Bool: trade.hedge_1_1_bool ? "✅ Yes" : "❌ No",
          Quantity: trade.quantity,
          Action: trade.action,
          Buy_Qty: trade.buy_qty,
          Buy_Price: `$${trade.buy_price}`,
          Buy_PL: `$${trade.buy_pl}`,
          Sell_Qty: trade.sell_qty,
          Sell_Price: `$${trade.sell_price}`,
          Sell_PL: `$${trade.sell_pl}`,
          Commission: `$${trade.commission}`,
          PL_After_Comm: `$${trade.pl_after_comm}`,
          Profit_Journey: trade.profit_journey ? "✅ Yes" : "❌ No",
          Min_Profit: `$${trade.min_profit}`,
          Hedge_Order_Size: trade.hedge_order_size,
          Timestamp: trade.timestamp,
          Date: trade.date
        }));
      break;

    case "profit_journey":
      filteredData = tradeData
        .filter(trade => trade.profit_journey)
        .map((trade, index) => ({
          S_No: index + 1,
          Unique_ID: trade.Unique_id,
          Pair: trade.pair,
          Investment: `$${trade.investment.toFixed(2)}`,
          Interval: trade.interval,
          Stop_Price: `$${trade.stop_price}`,
          Save_Price: `$${trade.save_price}`,
          Min_Comm: trade.min_comm.toFixed(5),
          Hedge: trade.hedge ? "✅ Yes" : "❌ No",
          Hedge_1_1_Bool: trade.hedge_1_1_bool ? "✅ Yes" : "❌ No",
          Quantity: trade.quantity,
          Action: trade.action,
          Buy_Qty: trade.buy_qty,
          Buy_Price: `$${trade.buy_price}`,
          Buy_PL: `$${trade.buy_pl}`,
          Sell_Qty: trade.sell_qty,
          Sell_Price: `$${trade.sell_price}`,
          Sell_PL: `$${trade.sell_pl}`,
          Commission: `$${trade.commission}`,
          PL_After_Comm: `$${trade.pl_after_comm}`,
          Profit_Journey: trade.profit_journey ? "✅ Yes" : "❌ No",
          Min_Profit: `$${trade.min_profit}`,
          Hedge_Order_Size: trade.hedge_order_size,
          Timestamp: trade.timestamp,
          Date: trade.date
        }));
      break;

    case "active_hedges":
      filteredData = tradeData
        .filter(trade => trade.hedge_1_1_bool === 0)
        .map((trade, index) => ({
          S_No: index + 1,
          Unique_ID: trade.Unique_id,
          Pair: trade.pair,
          Investment: `$${trade.investment.toFixed(2)}`,
          Interval: trade.interval,
          Stop_Price: `$${trade.stop_price}`,
          Save_Price: `$${trade.save_price}`,
          Min_Comm: trade.min_comm.toFixed(5),
          Hedge: trade.hedge ? "✅ Yes" : "❌ No",
          Hedge_1_1_Bool: trade.hedge_1_1_bool ? "✅ Yes" : "❌ No",
          Quantity: trade.quantity,
          Action: trade.action,
          Buy_Qty: trade.buy_qty,
          Buy_Price: `$${trade.buy_price}`,
          Buy_PL: `$${trade.buy_pl}`,
          Sell_Qty: trade.sell_qty,
          Sell_Price: `$${trade.sell_price}`,
          Sell_PL: `$${trade.sell_pl}`,
          Commission: `$${trade.commission}`,
          PL_After_Comm: `$${trade.pl_after_comm}`,
          Profit_Journey: trade.profit_journey ? "✅ Yes" : "❌ No",
          Min_Profit: `$${trade.min_profit}`,
          Hedge_Order_Size: trade.hedge_order_size,
          Timestamp: trade.timestamp,
          Date: trade.date
        }));
      break;

    case "hold_hedges":
      filteredData = tradeData
        .filter(trade => trade.hedge_1_1_bool === 1)
        .map((trade, index) => ({
          S_No: index + 1,
          Unique_ID: trade.Unique_id,
          Pair: trade.pair,
          Investment: `$${trade.investment.toFixed(2)}`,
          Interval: trade.interval,
          Stop_Price: `$${trade.stop_price}`,
          Save_Price: `$${trade.save_price}`,
          Min_Comm: trade.min_comm.toFixed(5),
          Hedge: trade.hedge ? "✅ Yes" : "❌ No",
          Hedge_1_1_Bool: trade.hedge_1_1_bool ? "✅ Yes" : "❌ No",
          Quantity: trade.quantity,
          Action: trade.action,
          Buy_Qty: trade.buy_qty,
          Buy_Price: `$${trade.buy_price}`,
          Buy_PL: `$${trade.buy_pl}`,
          Sell_Qty: trade.sell_qty,
          Sell_Price: `$${trade.sell_price}`,
          Sell_PL: `$${trade.sell_pl}`,
          Commission: `$${trade.commission}`,
          PL_After_Comm: `$${trade.pl_after_comm}`,
          Profit_Journey: trade.profit_journey ? "✅ Yes" : "❌ No",
          Min_Profit: `$${trade.min_profit}`,
          Hedge_Order_Size: trade.hedge_order_size,
          Timestamp: trade.timestamp,
          Date: trade.date
        }));
      break;

    case "total_investment":
      filteredData = tradeData.map((trade, index) => ({
        S_No: index + 1,
        Unique_ID: trade.Unique_id,
        Pair: trade.pair,
        Investment: `$${trade.investment.toFixed(2)}`,
        Interval: trade.interval,
        Stop_Price: `$${trade.stop_price}`,
        Save_Price: `$${trade.save_price}`,
        Min_Comm: trade.min_comm.toFixed(5),
        Hedge: trade.hedge ? "✅ Yes" : "❌ No",
        Hedge_1_1_Bool: trade.hedge_1_1_bool ? "✅ Yes" : "❌ No",
        Quantity: trade.quantity,
        Action: trade.action,
        Buy_Qty: trade.buy_qty,
        Buy_Price: `$${trade.buy_price}`,
        Buy_PL: `$${trade.buy_pl}`,
        Sell_Qty: trade.sell_qty,
        Sell_Price: `$${trade.sell_price}`,
        Sell_PL: `$${trade.sell_pl}`,
        Commission: `$${trade.commission}`,
        PL_After_Comm: `$${trade.pl_after_comm}`,
        Profit_Journey: trade.profit_journey ? "✅ Yes" : "❌ No",
        Min_Profit: `$${trade.min_profit}`,
        Hedge_Order_Size: trade.hedge_order_size,
        Timestamp: trade.timestamp,
        Date: trade.date
      }));
      break;

    case "total_profit":
      filteredData = tradeData.map((trade, index) => ({
        S_No: index + 1,
        Unique_ID: trade.Unique_id,
        Pair: trade.pair,
        Investment: `$${trade.investment.toFixed(2)}`,
        Interval: trade.interval,
        Stop_Price: `$${trade.stop_price}`,
        Save_Price: `$${trade.save_price}`,
        Min_Comm: trade.min_comm.toFixed(5),
        Hedge: trade.hedge ? "✅ Yes" : "❌ No",
        Hedge_1_1_Bool: trade.hedge_1_1_bool ? "✅ Yes" : "❌ No",
        Quantity: trade.quantity,
        Action: trade.action,
        Buy_Qty: trade.buy_qty,
        Buy_Price: `$${trade.buy_price}`,
        Buy_PL: `$${trade.buy_pl}`,
        Sell_Qty: trade.sell_qty,
        Sell_Price: `$${trade.sell_price}`,
        Sell_PL: `$${trade.sell_pl}`,
        Commission: `$${trade.commission}`,
        PL_After_Comm: `$${trade.pl_after_comm}`,
        Profit_Journey: trade.profit_journey ? "✅ Yes" : "❌ No",
        Min_Profit: `$${trade.min_profit}`,
        Hedge_Order_Size: trade.hedge_order_size,
        Timestamp: trade.timestamp,
        Date: trade.date
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8010/proxy/get_pairs");
        const jsonData = await response.json();
  
        console.log("API Response:", jsonData); // ✅ Debugging step
  
        // Extract 'pairs' array from the API response
        if (!jsonData.pairs || !Array.isArray(jsonData.pairs)) {
          console.error("Unexpected API response format:", jsonData);
          return;
        }
  
        const tradeJson = jsonData.pairs; // ✅ Correctly extract the trade data
  
        setTradeData(tradeJson);
  
        // ✅ Calculate metrics
        setMetrics({
          total_trades: tradeJson.length,
          total_buy: tradeJson.filter(trade => trade.action === "BUY").length,
          total_sell: tradeJson.filter(trade => trade.action === "SELL").length,
          total_hedge: tradeJson.filter(trade => trade.hedge).length,
          profit_journey: tradeJson.filter(trade => trade.profit_journey).length,
          active_hedges: tradeJson.filter(trade => trade.hedge_1_1_bool === 0).length,
          hold_hedges: tradeJson.filter(trade => trade.hedge_1_1_bool === 1).length,
          total_investment: `$${tradeJson.reduce((sum, trade) => sum + (trade.investment || 0), 0).toFixed(2)}`,
          total_profit: `$${tradeJson.reduce((sum, trade) => sum + (trade.pl_after_comm || 0), 0).toFixed(2)}`,
          investment_available: `$${(50000 - tradeJson.reduce((sum, trade) => sum + (trade.investment || 0), 0)).toFixed(2)}`
        });
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Fetch data initially
    fetchData();
  
    // Set interval for auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  console.log("Metrics State:", metrics);
  return (
    
    <div className="flex">
      <div className={`fixed h-screen bg-gray-800 text-white transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>Toggle Sidebar</button>
      </div>
      
      <div className={`flex-1 min-h-screen transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} overflow-hidden`}>
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">LAB Dashboard</h1>
          
          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(metrics).map(([title, value]) => (
                <DashboardCard key={title} title={title} value={value} isSelected={selectedBox === title} onClick={() => setSelectedBox(title)} />
              ))}
            </div>
          )}

          {selectedBox && (
            <div className="mt-6">
              <TableView title={selectedBox} tradeData={tradeData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;