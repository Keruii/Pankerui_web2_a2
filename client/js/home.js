// Home page event cards use only DOM APIs and the public read-only API.
const API_BASE = 'http://localhost:3000/api';
const eventList = document.getElementById('event-list');
const message = document.getElementById('home-message');

function formatDate(value) {
  return new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium' }).format(new Date(value.replace(' ', 'T')));
}

function createEventCard(event) {
  const card = document.createElement('article');
  card.className = 'event-card home-event-card';
  const imageWrap = document.createElement('div');
  imageWrap.className = 'event-card-image';
  if (event.event_image_url) {
    const image = document.createElement('img');
    image.src = event.event_image_url;
    image.alt = `Photo for ${event.event_title}`;
    image.loading = 'lazy';
    image.addEventListener('error', () => image.remove(), { once: true });
    imageWrap.append(image);
  }
  const status = new Date(event.event_end_datetime.replace(' ', 'T')) >= new Date() ? 'Upcoming' : 'Past';
  const badge = document.createElement('span');
  badge.className = `event-status ${status.toLowerCase()}`;
  badge.textContent = status;
  imageWrap.append(badge);
  card.append(imageWrap);
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
  const location = document.createElement('span');
  location.textContent = `⌖ ${event.location_suburb}`;
  const date = document.createElement('span');
  date.textContent = `◷ ${formatDate(event.event_start_datetime)}`;
  meta.append(location, date);
  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = `eventdetail.html?id=${encodeURIComponent(event.event_id)}`;
  link.textContent = 'See the event';
  body.append(badge, category, title, summary, meta, link);
  card.append(body);
  return card;
}

fetch(`${API_BASE}/home/events`)
  .then((response) => { if (!response.ok) throw new Error('Events could not be loaded.'); return response.json(); })
  .then((events) => {
    message.textContent = events.length ? '' : 'There are no events to show right now. Please check back soon.';
    events.forEach((event) => eventList.append(createEventCard(event)));
  })
  .catch(() => { message.textContent = 'We could not load events. Please check your connection and try again.'; });
