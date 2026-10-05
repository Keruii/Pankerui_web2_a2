# Community Hope Australia — PROG2002 Assessment 2

A public charity event website with a read-only Express/MySQL API and three vanilla JavaScript pages. Assessment 2 scope includes GET endpoints only; event registration is a placeholder alert.

## Run the API

1. Import `api/charityevents_db.sql` in MySQL Workbench (it creates and seeds `charityevents_db`).
2. Ensure MySQL Server is running on `127.0.0.1:3306` and has a `root` account with a blank password. The project does not set or require a database password. This Windows setup stores its database files in the ignored `.mysql-data` folder.
3. Install dependencies once with `cd api` and `npm install`. To run the project, open two PowerShell windows. In the first, run `cd C:\Users\Administrator\Desktop\web2\api` then `& 'C:\mysql-8.4.11\bin\mysqld.exe' --defaults-file='C:\Users\Administrator\Desktop\web2\api\mysql-local.ini' --console`. Leave it open. In the second, run `cd C:\Users\Administrator\Desktop\web2\api` then `npm start`. If your MySQL defaults differ, optionally copy `.env.example` to `.env` and adjust the host or username; leave `DB_PASSWORD` blank.
4. Open `http://localhost:3000` in your browser. Express serves the `client` directory and the API from the same server.

## API routes

- `GET /api/home/events` — all public events and category names.
- `GET /api/categories` — category options.
- `GET /api/events/search?date=YYYY-MM-DD&location_suburb=Brisbane&category_id=1` — optional filters.
- `GET /api/events/:event_id` — full details and organisation contact, or a 404.

All event routes exclude suspended records in SQL. Dates in the sample database include past and upcoming events. No POST, PUT, or DELETE routes are implemented.

The client filenames follow the assessment structure: `client/eventdetail.html` and `client/js/eventdetail.js`.

## Report template

`PROG2002 A2 Report.docx` is a provided template stored outside this project folder. Complete its student details and report sections before submission; the implementation can be documented there under motivation, problem, solution, UX, data schema, and API design.
