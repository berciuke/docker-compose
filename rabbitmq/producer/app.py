from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pika
import json
import os

app = FastAPI()

class ClientRequest(BaseModel):
    clientID: str
    requestType: str = "credit"

def get_rabbitmq_connection():
    rabbitmq_host = os.getenv('RABBITMQ_HOST', 'rabbitmq')
    credentials = pika.PlainCredentials('admin', 'admin')
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=rabbitmq_host, credentials=credentials)
    )
    return connection

@app.get("/")
def root():
    return {"message": "Call Center Backend"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/request-contact")
def request_contact(request: ClientRequest):
    try:
        connection = get_rabbitmq_connection()
        channel = connection.channel()
        
        queues = ['mortgage', 'cash_credit', 'business_credit']
        
        for queue in queues:
            channel.queue_declare(queue=queue, durable=True)
        
        message = {
            "clientID": request.clientID,
            "requestType": request.requestType,
            "timestamp": "2024-01-01T12:00:00Z"
        }
        
        for queue in queues:
            channel.basic_publish(
                exchange='',
                routing_key=queue,
                body=json.dumps(message),
                properties=pika.BasicProperties(delivery_mode=2)
            )
        
        connection.close()
        
        return {
            "status": "success",
            "clientID": request.clientID,
            "message": "Prośba o kontakt została przyjęta"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 