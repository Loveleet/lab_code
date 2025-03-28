import pyodbc

# ✅ Define your connection details
server = '4.240.115.57,1433'  # Your Cloud SQL Server IP and port
database = 'labDB'            # Your actual database name
username = 'sa'
password = 'IndiaNepal-1'

# ✅ Create the connection string
conn_str = (
    f"DRIVER={{ODBC Driver 17 for SQL Server}};"
    f"SERVER={server};"
    f"DATABASE={database};"
    f"UID={username};"
    f"PWD={password};"
)

try:
    # ✅ Connect to SQL Server
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()

    # ✅ Query 1: Fetch active machines with declineCounter < 5
    query1 = """
        SELECT M.MachineId, MTC.MachineId, MTC.declineCounter, MTC.TotalTradeCounter
        FROM Machines M
        INNER JOIN MachineTradeCount MTC
        ON M.MachineId = MTC.MachineId
        WHERE M.Active = 1 AND MTC.declineCounter < 5 
        ORDER BY M.MachineId ASC;
    """
    cursor.execute(query1)
    print("\n✅ Query 1 - Active Machines:")
    for row in cursor.fetchall():
        print(row)

    # ✅ Query 2-4: Fetch trades where Profit_journey = 1
    tables = ['M1', 'M2', 'M3']
    for table in tables:
        query = f"""
            SELECT Pair, Action, fetcher_trade_time, Operator_Trade_time, Operator_Close_time,
                   Interval, Stop_price, Save_price, Action, Buy_price, Pl_after_comm,
                   Commision_journey, Profit_journey, Type, signalFrom
            FROM {table}
            WHERE Profit_journey = 1
            ORDER BY Pl_after_comm ASC;
        """
        cursor.execute(query)
        print(f"\n✅ Query 2 - Profit Trades from {table}:")
        for row in cursor.fetchall():
            print(row)

    # ✅ Query 5: Total Profit per Machine
    query5 = """
        select Pair,aCTION, fetcher_trade_time,Operator_Trade_time,Operator_Close_time,Interval,Stop_price,Save_price,Action,Buy_price,Pl_after_comm,Commision_journey,Profit_journey,Type,signalFrom from M1 where Profit_journey=1 and type='running' ORDER BY Pl_after_comm asc
select Pair,aCTION,fetcher_trade_time,Operator_Trade_time,Operator_Close_time,Interval,Stop_price,Save_price,Action,Buy_price,Pl_after_comm,Commision_journey,Profit_journey,Type,signalFrom from M2 where Profit_journey=1 and type='running' ORDER BY Pl_after_comm asc
select Pair,aCTION,fetcher_trade_time,Operator_Trade_time,Operator_Close_time,Interval,Stop_price,Save_price,Action,Buy_price,Pl_after_comm,Commision_journey,Profit_journey,Type,signalFrom from M3 where Profit_journey=1 and type='running' ORDER BY Pl_after_comm asc

    """
    cursor.execute(query5)
    print("\n✅ Query 5 - Total Profit per Machine:")
    for row in cursor.fetchall():
        print(row)

    # ✅ Query 6: Grand Total Profit
    query6 = """
        SELECT 
            (SELECT COALESCE(SUM(Pl_after_comm), 0) FROM M1) +
            (SELECT COALESCE(SUM(Pl_after_comm), 0) FROM M2) +
            (SELECT COALESCE(SUM(Pl_after_comm), 0) FROM M3) 
            AS grand_total;
    """
    cursor.execute(query6)
    print("\n✅ Query 6 - Grand Total Profit:")
    print(cursor.fetchone()[0])

    # ✅ Query 7: Count of Profit Trades
    query7 = """
        SELECT 
            (SELECT COALESCE(COUNT(Pl_after_comm), 0) FROM M1) +
            (SELECT COALESCE(COUNT(Pl_after_comm), 0) FROM M2) +
            (SELECT COALESCE(COUNT(Pl_after_comm), 0) FROM M3) 
            AS grand_total;
    """
    cursor.execute(query7)
    print("\n✅ Query 7 - Total Profit Trades Count:")
    print(cursor.fetchone()[0])

    # ✅ Query 8: Grand Total for Running Trades
    query8 = """
        SELECT 
            (SELECT COALESCE(SUM(Pl_after_comm), 0) FROM M1 WHERE Type = 'running') +
            (SELECT COALESCE(SUM(Pl_after_comm), 0) FROM M2 WHERE Type = 'running') +
            (SELECT COALESCE(SUM(Pl_after_comm), 0) FROM M3 WHERE Type = 'running') 
            AS grand_total;
    """
    cursor.execute(query8)
    print("\n✅ Query 8 - Total Running Trades Profit:")
    print(cursor.fetchone()[0])

    # ✅ Close the connection
    conn.close()
    print("\n🚀 All queries executed successfully!")

except Exception as e:
    print("\n❌ Error:", str(e))