import pika
import json
import os
import time

def callback(ch, method, properties, body):
    try:
        message = json.loads(body)
        print(f"[KREDYTY GOTÓWKOWE] Otrzymano prośbę: ClientID={message['clientID']}, Typ={message['requestType']}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"[KREDYTY GOTÓWKOWE] Błąd: {e}")

def main():
    rabbitmq_host = os.getenv('RABBITMQ_HOST', 'rabbitmq')
    
    while True:
        try:
            credentials = pika.PlainCredentials('admin', 'admin')
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=rabbitmq_host, credentials=credentials)
            )
            channel = connection.channel()
            channel.queue_declare(queue='cash_credit', durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue='cash_credit', on_message_callback=callback)
            
            print("[KREDYTY GOTÓWKOWE] Oczekiwanie na wiadomości...")
            channel.start_consuming()
            
        except Exception as e:
            print(f"[KREDYTY GOTÓWKOWE] Błąd połączenia: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main() 