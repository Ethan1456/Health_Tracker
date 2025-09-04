import pymysql
from dotenv import load_dotenv
import os
from fastapi import FastAPI,HTTPException
app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()
from pydantic import BaseModel

class Entry(BaseModel):
    type:str
    name:str
    calories:int
    date:str



DB_NAME = os.getenv("DBNAME")
DB_HOST = os.getenv("DBHOST")
DB_USER = os.getenv("DBUSER")
DB_PASSWORD = os.getenv("DBPASS")


# add this to show up in table as stops browser blocking
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

# connecting to database
def get_connection():
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,  # directly connect to DB
            cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except pymysql.MySQLError as e:
        print(f"Error connecting to MySQL: {e}")
        return None
    

# get request
@app.get("/healthData")
def read_entries():
    conn = get_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM entries")
                result = cursor.fetchall()
                return {"entries": result}
        finally:
            conn.close()
    return {"error": "Failed to connect to the database"}

@app.post("/sendData")
def send_data(entry:Entry):
    # send data to database
    conn = get_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("INSERT INTO entries (type, name, calories, date) VALUES (%s, %s, %s, %s)", (entry.type, entry.name, entry.calories, entry.date))
                conn.commit()
                return {"message": "Data sent successfully"}
        except pymysql.MySQLError as e:
            print(f"Error sending data to MySQL: {e}")
            return {"error": "Failed to send data to the database"}
        finally:
            conn.close()
    return {"error": "Failed to connect to the database"}


@app.delete("/deleteEntry/{entry_id}")
def delete_entry(entry_id: int):
    conn = get_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM entries WHERE id = %s", (entry_id,))
                conn.commit()
                return {"message": f"Entry {entry_id} deleted successfully"}
        except pymysql.MySQLError as e:
            print(f"Error deleting entry: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete entry")
        finally:
            conn.close()
    raise HTTPException(status_code=500, detail="Database connection failed")



