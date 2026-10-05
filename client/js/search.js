// Search filters are sent as query parameters; clearing resets both form and results.
const API_BASE = 'http://localhost:3000/api';
const form = document.getElementById('search-form');
const categorySelect = document.getElementById('category_id');
const categoryChips = document.getElementById('category-chips');
const resultsList = document.getElementById('search-results-list');
const message = document.getElementById('search-message');
const resultCount = document.getElementById('result-count');
const submitButton = form.querySelector('button[type="submit"]');
const ENGLISH_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dateDisplay = document.getElementById('date-display');
const dateValue = document.getElementById('date');
const calendar = document.getElementById('date-calendar');
const calendarToggle = document.querySelector('.calendar-toggle');
const calendarLabel = document.getElementById('calendar-month-label');
const calendarDays = document.getElementById('calendar-days');
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function setDate(year, month, day) {
  dateValue.value = isoDate(year, month, day);
  dateDisplay.value = `${String(day).padStart(2, '0')} / ${String(month + 1).padStart(2, '0')} / ${year}`;
  calendarMonth = new Date(year, month, 1);
  renderCalendar();
  closeCalendar();
}

function renderCalendar() {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  calendarLabel.textContent = new Intl.DateTimeFormat('en-AU', { month: 'long', year: 'numeric' }).format(calendarMonth);
  calendarDays.replaceChildren();
  const offset = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  for (let blank = 0; blank < offset; blank += 1) {
    const spacer = document.createElement('span');
    spacer.className = 'calendar-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    calendarDays.append(spacer);
  }
  for (let day = 1; day <= count; day += 1) {
    const button = document.createElement('button');
    const value = isoDate(year, month, day);
    button.type = 'button';
    button.className = 'calendar-day';
    button.textContent = String(day);
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', `${day} ${ENGLISH_MONTHS[month]} ${year}`);
    if (value === dateValue.value) button.setAttribute('aria-selected', 'true');
    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) button.classList.add('today');
    button.addEventListener('click', () => setDate(year, month, day));
    calendarDays.append(button);
  }
}

function closeCalendar() {
  calendar.hidden = true;
  calendarToggle.setAttribute('aria-expanded', 'false');
}

function syncManualDate() {
  const match = dateDisplay.value.trim().match(/^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/);
  if (!match) { dateValue.value = ''; return; }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
    dateValue.value = isoDate(year, month - 1, day);
    dateDisplay.value = `${String(day).padStart(2, '0')} / ${String(month).padStart(2, '0')} / ${year}`;
  } else dateValue.value = '';
}

calendarToggle.addEventListener('click', () => {
  const opening = calendar.hidden;
  if (opening) {
    syncManualDate();
    if (dateValue.value) {
      const [year, month] = dateValue.value.split('-').map(Number);
      calendarMonth = new Date(year, month - 1, 1);
    }
    renderCalendar();
    calendar.hidden = false;
    calendarToggle.setAttribute('aria-expanded', 'true');
  } else closeCalendar();
});
calendar.querySelectorAll('[data-month-step]').forEach((button) => button.addEventListener('click', () => {
  calendarMonth.setMonth(calendarMonth.getMonth() + Number(button.dataset.monthStep));
  renderCalendar();
}));
document.getElementById('calendar-clear').addEventListener('click', () => {
  dateDisplay.value = '';
  dateValue.value = '';
  closeCalendar();
  dateDisplay.focus();
});
dateDisplay.addEventListener('input', syncManualDate);
dateDisplay.addEventListener('blur', syncManualDate);
document.addEventListener('click', (event) => {
  if (!event.target.closest('.date-picker')) closeCalendar();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !calendar.hidden) { closeCalendar(); calendarToggle.focus(); }
});
renderCalendar();

function eventDateParts(value) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return { year, month: ENGLISH_MONTHS[month - 1], day };
}

function addEventResult(event) {
  const card = document.createElement('article');
  card.className = 'event-card compact-card search-event-card';
  const visual = document.createElement('div');
  visual.className = 'search-event-visual';
  if (event.event_image_url) {
    const image = document.createElement('img');
    image.src = event.event_image_url;
    image.alt = `Photo for ${event.event_title}`;
    image.loading = 'lazy';
    image.addEventListener('error', () => image.remove(), { once: true });
    visual.append(image);
  }
  const dateParts = eventDateParts(event.event_start_datetime);
  const dateStamp = document.createElement('time');
  dateStamp.className = 'date-stamp';
  dateStamp.dateTime = event.event_start_datetime.replace(' ', 'T');
  dateStamp.setAttribute('aria-label', `${dateParts.day} ${dateParts.month} ${dateParts.year}`);
  const month = document.createElement('span');
  month.textContent = dateParts.month.slice(0, 3).toUpperCase();
  const day = document.createElement('strong');
  day.textContent = dateParts.day;
  const year = document.createElement('small');
  year.textContent = dateParts.year;
  dateStamp.append(month, day, year);
  visual.append(dateStamp);
  card.append(visual);
  const body = document.createElement('div');
  body.className = 'event-card-body';
  const category = document.createElement('p');
  category.className = 'event-category';
  category.textContent = event.category_name;
  const title = document.createElement('h3');
  title.textContent = event.event_title;
  const summary = document.createElement('p');
  summary.className = 'event-summary';
  summary.textContent = event.short_summary;
  const meta = document.createElement('p');
  meta.className = 'event-meta';
  meta.textContent = `⌖ ${event.location_suburb}`;
  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = `eventdetail.html?id=${encodeURIComponent(event.event_id)}`;
  link.textContent = 'See the event';
  body.append(category, title, summary, meta, link);
  card.append(body);
  resultsList.append(card);
}

function showRequestError(error) {
  if (error.message === 'database') {
    message.textContent = 'The API is running but cannot access event data. Start MySQL, import api/charityevents_db.sql, and check the database settings in api/.env.';
  } else if (error instanceof TypeError) {
    message.textContent = 'The event service is not responding. Start the API with npm start, then try again.';
  } else {
    message.textContent = 'The request could not be completed. Please check your filters and try again.';
  }
}

function readJson(response) {
  return response.json().catch(() => ({})).then((data) => {
    if (!response.ok) throw new Error(response.status >= 500 ? 'database' : (data.error || 'request'));
    return data;
  });
}

function searchEvents() {
  resultsList.replaceChildren();
  resultCount.textContent = '';
  message.textContent = 'Finding good things near you…';
  submitButton.disabled = true;
  submitButton.classList.add('is-loading');
  const params = new URLSearchParams();
  for (const [key, value] of new FormData(form).entries()) if (value.trim()) params.set(key, value.trim());
  fetch(`${API_BASE}/events/search?${params.toString()}`)
    .then(readJson)
    .then((events) => {
      if (!events.length) {
        message.textContent = 'No events match your search criteria. Please adjust filters.';
        return;
      }
      message.textContent = '';
      resultCount.textContent = `${events.length} ${events.length === 1 ? 'event' : 'events'} to explore`;
      events.forEach(addEventResult);
      document.getElementById('results-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
    .catch(showRequestError)
    .finally(() => {
      submitButton.disabled = false;
      submitButton.classList.remove('is-loading');
    });
}

fetch(`${API_BASE}/categories`)
  .then(readJson)
  .then((categories) => categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.category_id;
    option.textContent = category.category_name;
    categorySelect.append(option);

    const chip = document.createElement('button');
    chip.className = 'category-chip';
    chip.type = 'button';
    chip.textContent = category.category_name;
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      categorySelect.value = category.category_id;
      categoryChips.querySelectorAll('.category-chip').forEach((item) => {
        const active = item === chip;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      searchEvents();
    });
    categoryChips.append(chip);
  }))
  .catch(showRequestError);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  syncManualDate();
  if (dateDisplay.value.trim() && !dateValue.value) {
    message.textContent = 'Enter a valid date as DD / MM / YYYY, or choose a date from the calendar.';
    dateDisplay.focus();
    return;
  }
  categoryChips.querySelectorAll('.category-chip').forEach((item) => {
    const active = item.textContent === categorySelect.selectedOptions[0]?.textContent && categorySelect.value !== '';
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  searchEvents();
});

form.addEventListener('reset', () => {
  resultsList.replaceChildren();
  resultCount.textContent = '';
  message.textContent = '';
  dateDisplay.value = '';
  dateValue.value = '';
  closeCalendar();
  categoryChips.querySelectorAll('.category-chip').forEach((item) => {
    item.classList.remove('active');
    item.setAttribute('aria-pressed', 'false');
  });
});
