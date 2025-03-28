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

    # ✅ Query to get all table names
    cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';")
    tables = [row[0] for row in cursor.fetchall()]
    
    print("\n🚀 Available Tables in Database:")
    for table in tables:
        print(f"- {table}")

    # ✅ Fetch first few rows from each table
    for table in tables:
        query = f"SELECT TOP 5 * FROM [{table}];"  # ✅ Use TOP instead of LIMIT
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            print(f"\n✅ Data from {table} (First 5 Rows):")
            for row in rows:
                print(row)
        except Exception as e:
            print(f"\n⚠️ Skipping {table} due to error: {e}")

    # ✅ Close the connection
    conn.close()
    print("\n🚀 All queries executed successfully!")

except Exception as e:
    print("\n❌ Error:", str(e))