const express = require("express");
const redis = require("redis");

const app = express();
const port = 3000; 

app.use(express.json());


const redisClient = redis.createClient({
  url: "redis://redis:6379", 
});


redisClient.on("error", (err) => {
  console.error("redis error:", err);
});

async function initializeApp() {
  try {
    await redisClient.connect();
    console.log("połączono z Redis");
    app.get("/", (req, res) => {
      res.send(
        "express z redis działa,\nużyj POST /messages i GET /messages."
      );
    });

    app.post("/messages", async (req, res) => {
      const { message } = req.body; 
      if (!message) {
        return res
          .status(400)
          .json({ error: 'Pole "message" jest wymagane.' });
      }
      try {
        const result = await redisClient.lPush("messages", message);
        console.log(
          `Dodano wiadomość: "${message}".\n Nowa długość listy: ${result}`
        );
        res
          .status(201)
          .json({ status: "Wiadomość dodana pomyślnie", message: message });
      } catch (err) {
        console.error("Błąd podczas dodawania wiadomości do Redis:", err);
        res
          .status(500)
          .json({
            error: "Wystąpił błąd serwera podczas dodawania wiadomości.",
          });
      }
    });

    app.get("/messages", async (req, res) => {
      try {
        const messages = await redisClient.lRange("messages", 0, -1);
        console.log("Pobrano wiadomości:", messages);
        res.status(200).json(messages); 
      } catch (err) {
        console.error("Błąd podczas pobierania wiadomości z Redis:", err);
        res
          .status(500)
          .json({
            error: "Wystąpił błąd serwera podczas pobierania wiadomości.",
          });
      }
    });

    app.listen(port, () => {
      console.log(
        `Serwer Express nasłuchuje na porcie ${port} wewnątrz kontenera.`
      );
      console.log(
        `API dostępne na http://localhost:3000 (po mapowaniu portów przez Docker Compose)`
      );
    });
  } catch (err) {
    console.error(
      "Nie udało się połączyć z Redis. Aplikacja nie zostanie uruchomiona.",
      err
    );
    process.exit(1); ło
  }
}


initializeApp();
