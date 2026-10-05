// Read-only API: every event query excludes suspended events at the database.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./event_db');
const eventImages = require('./event-images');

const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(cors());
app.use(express.json());
// Serve the vanilla HTML/CSS/JS client from the same local server as the API.
app.use(express.static(path.join(__dirname, '..', 'client')));

function withEventPhotography(events) {
  return events.map((event) => ({
    ...event,
    event_image_url: eventImages[event.event_id] || event.event_image_url
  }));
}

app.get('/api/home/events', async (_req, res) => {
  try {
    const [rows] = await pool.execute(`SELECT e.event_id, e.event_title, e.short_summary,
      e.event_start_datetime, e.event_end_datetime, e.location_suburb, e.event_image_url,
      c.category_name FROM charity_events e JOIN event_categories c ON e.category_id=c.category_id
      WHERE e.is_suspended=0 ORDER BY e.event_start_datetime`);
    res.json(withEventPhotography(rows));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Unable to load events.' }); }
});

app.get('/api/categories', async (_req, res) => {
  try {
    const [rows] = await pool.execute('SELECT category_id, category_name FROM event_categories ORDER BY category_name');
    res.json(withEventPhotography(rows));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Unable to load categories.' }); }
});

app.get('/api/events/search', async (req, res) => {
  const { date, location_suburb: suburb, category_id: categoryId } = req.query;
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'Date must use YYYY-MM-DD format.' });
  if (categoryId && !/^\d+$/.test(categoryId)) return res.status(400).json({ error: 'Category ID must be a number.' });
  const filters = ['e.is_suspended=0'];
  const values = [];
  if (date) { filters.push('DATE(e.event_start_datetime)=?'); values.push(date); }
  if (suburb && suburb.trim()) { filters.push('e.location_suburb LIKE ?'); values.push(`%${suburb.trim()}%`); }
  if (categoryId) { filters.push('e.category_id=?'); values.push(categoryId); }
  try {
    const [rows] = await pool.execute(`SELECT e.event_id, e.event_title, e.short_summary,
      e.event_start_datetime, e.event_end_datetime, e.location_suburb, e.event_image_url,
      c.category_name FROM charity_events e JOIN event_categories c ON e.category_id=c.category_id
      WHERE ${filters.join(' AND ')} ORDER BY e.event_start_datetime`, values);
    res.json(rows);
  } catch (error) { console.error(error); res.status(500).json({ error: 'Unable to search events.' }); }
});

app.get('/api/events/:event_id', async (req, res) => {
  if (!/^\d+$/.test(req.params.event_id)) return res.status(404).json({ error: 'Event not found.' });
  try {
    const [rows] = await pool.execute(`SELECT e.*, c.category_name, o.org_name, o.mission,
      o.contact_email, o.contact_phone, o.address AS organisation_address
      FROM charity_events e JOIN event_categories c ON e.category_id=c.category_id
      JOIN charity_organisations o ON e.org_id=o.org_id
      WHERE e.event_id=? AND e.is_suspended=0`, [req.params.event_id]);
    if (!rows.length) return res.status(404).json({ error: 'Event not found.' });
    res.json(withEventPhotography(rows)[0]);
  } catch (error) { console.error(error); res.status(500).json({ error: 'Unable to load event details.' }); }
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
app.listen(port, () => console.log(`Community Hope API listening on port ${port}`));
