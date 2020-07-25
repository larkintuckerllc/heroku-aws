const express = require('express');
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

if (DATABASE_URL === undefined) {
  console.log('missing environment variables');
  process.exit(1);
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  try {
    await client.connect();
    const app = express();

    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/db', async (req, res) => {
      try {
        const result = await client.query('SELECT $1::text as message', ['Hello db!']);
        const message = result.rows[0].message;
        res.send(message);
      } catch (queryErr) {
        console.log(queryErr);
        res.status(500).send('query failed');
      }
    });

    app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
  } catch (connectErr) {
    console.log(connectErr);
    process.exit(1);
  }
})();

