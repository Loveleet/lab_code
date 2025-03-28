import pyodbc
import pandas as pd

# ✅ Database Connection
server = "4.240.115.57"
database = "labDB"
username = "sa"
password = "IndiaNepal-1"
driver = "ODBC Driver 17 for SQL Server"

conn_str = f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}"

try:
    conn = pyodbc.connect(conn_str)
    print("✅ Connected to SQL Server")

    # 🔹 Query to Fetch All Trades
    query = "SELECT MachineId, Unique_id, Type, Profit_journey, PL_after_comm, Action FROM AllTradeRecords;"
    df = pd.read_sql(query, conn)

    # 🔹 Check Distinct Values in 'Type' and 'Profit_journey'
    print("\n📊 Trade Type Distribution:")
    print(df["Type"].value_counts())

    print("\n✅ Profit Journey Column Unique Values:")
    print(df["Profit_journey"].unique())  # Expecting [0, 1]

    # 🔹 Fetch Only Profit Trades
    profit_query = "SELECT * FROM AllTradeRecords WHERE Profit_journey = 1;"
    profit_df = pd.read_sql(profit_query, conn)

    print(f"\n✅ Total Trades with Profit Journey = 1: {len(profit_df)}")
    if not profit_df.empty:
        print("\n📊 Sample Profit Trades:")
        print(profit_df.head(10))

    # 🔹 Fetch All Unique 'Type' Values
    type_query = "SELECT DISTINCT Type FROM AllTradeRecords;"
    type_df = pd.read_sql(type_query, conn)

    print("\n✅ Unique Type Values in Database:")
    print(type_df)

except Exception as e:
    print("❌ Database Error:", e)