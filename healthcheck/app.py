from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Aplikacja działa poprawnie"}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "rest-api"}

@app.get("/users")
def get_users():
    return {"users": ["jan", "anna", "tomek"]}

@app.get("/products")
def get_products():
    return {"products": ["laptop", "telefon", "tablet"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 