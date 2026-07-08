from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from database import connect, get_cursor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

class User(BaseModel):
    name: str
    email: str
    password: str

class Tasks(BaseModel):
    title: str
    description: str
    status: str
    user_id: int

@app.get('/')
def home():
    return {"message": "Welcome to my to do app"}


@app.post('/register')
def add_user(user: User):
    cursor = get_cursor()
    
    cursor.execute("SELECT * FROM user WHERE email = ?", (user.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    cursor.execute(
        "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
        (user.name, user.email, user.password),
    )
    connect.commit()
    
    return {"message": "User registered successfully"}


@app.post('/login')
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    FIXED: Uses OAuth2PasswordRequestForm to match the 
    URLSearchParams form data sent by your login.jsx file.
    """
    cursor = get_cursor()
    
    cursor.execute("SELECT * FROM user WHERE email = ?", (form_data.username,))
    db_user = cursor.fetchone()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    stored_password = db_user[3]

    if form_data.password != stored_password:
        raise HTTPException(status_code=400, detail="Wrong password")

    return {
        "access_token": "mock_login_token_success", 
        "token_type": "bearer",
        "message": "Login Successful"
    }

@app.post('/add_task')
def add_task(text: Tasks):
    try:
        cursor = get_cursor()
        cursor.execute(
            "INSERT INTO task (title, description, status, user_id) VALUES (?, ?, ?, ?)",
            (text.title, text.description, text.status, text.user_id),
        )
        connect.commit()
        return {"message": "Task added successfully"}
    except Exception as e:
        print(f"Database Crash Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database operational error: {str(e)}")


@app.get('/view_task')
def view_task():
    cursor = get_cursor()
    cursor.execute("SELECT * FROM task")
    db_tasks = cursor.fetchall()
    return {"tasks": db_tasks}

@app.put('/edit/{task_id}')
def edit_task(task_id: int, update: Tasks):
    cursor = get_cursor()
    cursor.execute(
        "UPDATE task SET title = ?, description = ?, status = ? WHERE id = ?",
        (update.title, update.description, update.status, task_id)
    )
    connect.commit()
    return {"message": "Task updated successfully"}

@app.delete('/remove/{task_id}')
def remove_task(task_id: int):
    cursor = get_cursor()
    cursor.execute("DELETE FROM task WHERE id = ?", (task_id,))
    connect.commit()
    return {"message": "Task deleted successfully"}
