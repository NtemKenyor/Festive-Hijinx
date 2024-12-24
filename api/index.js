const { Keypair } = require('@solana/web3.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./wallets.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS wallets (id INTEGER PRIMARY KEY, address TEXT, privateKey TEXT)`);

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();
    const privateKey = keypair.secretKey.toString('base64');

    db.run(
      `INSERT INTO wallets (address, privateKey) VALUES (?, ?)`,
      [publicKey, privateKey],
      (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ address: publicKey });
      }
    );
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
