# mysql database
import pymysql
from pymysql import OperationalError, InternalError
from dotenv import load_dotenv
import os


load_dotenv()

db_name = os.getenv("DBNAME")
db_host = os.getenv("DBHOST")
db_user = os.getenv("DBUSER")
db_pass = os.getenv("DBPASS")


def create_database(connection, db_name):
    """
    Creates a database if it doesn't already exist.
    """
    try:
        cursor = connection.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        print(f"Database '{db_name}' created or already exists.")
        cursor.close()
    except OperationalError as e:
        print(f"Error: '{e}'")

def create_tables(connection, db_name):
    """
    Creates necessary tables in the specified database.
    """
    cursor = connection.cursor()
    try:
        connection.database = db_name
        # drop to avoid potential duplicate table errors
        cursor.execute("DROP TABLE IF EXISTS entries")
        # Create entries table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS entries (
               id INT AUTO_INCREMENT PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                name VARCHAR(100) NOT NULL,
                calories INT NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP

            )
        """)
        print("Table 'entries' created or already exists.")
    except OperationalError as e:
        print(f"Error: '{e}'")
    finally:
        cursor.close()
