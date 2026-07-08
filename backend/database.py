import sqlite3

def get_connection():
    connect = sqlite3.connect("todo.db", check_same_thread=False)
    connect.execute("PRAGMA foreign_keys = ON")
    return connect
    
connect = get_connection()

def get_cursor():
    return connect.cursor()

cursor = connect.cursor()

cursor.execute(
    '''
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    )
    '''
)
connect.commit()

cursor.execute(
    '''
    CREATE TABLE IF NOT EXISTS task (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES user (id)
    )
    '''
)
connect.commit()


        

