// Sync the verified photo selections to the active database and SQL seed file.
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');
const eventImages = require('./event-images');
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'charityevents_db'
};

(async () => {
  const db = await mysql.createConnection(config);
  try {
    let updatedRows = 0;
    for (const [eventId, imageUrl] of Object.entries(eventImages)) {
      const [result] = await db.execute(
        'UPDATE charity_events SET event_image_url=? WHERE event_id=? AND is_suspended=0',
        [imageUrl, eventId]
      );
      updatedRows += result.affectedRows;
    }
    const sqlPath = path.join(__dirname, 'charityevents_db.sql');
    const updatedSql = fs.readFileSync(sqlPath, 'utf8').split(/\r?\n/).map((line) => {
      const match = line.match(/^\((\d+),1,/);
      if (!match || !eventImages[match[1]]) return line;
      return line.replace(/(?:'https?:\/\/[^']*'|'\/images\/[^']*'|NULL),([01])(\)[,;]?)$/, `'${eventImages[match[1]]}',$1$2`);
    }).join('\n');
    fs.writeFileSync(sqlPath, updatedSql, 'utf8');
    console.log(`Updated ${updatedRows} active event photos and the SQL seed file.`);
  } finally {
    await db.end();
  }
})().catch((error) => {
    console.error('Could not update event photo references:', error.code || error.message);
  process.exitCode = 1;
});
