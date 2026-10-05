// The event identifier is carried in the URL, with no browser storage required.
const API_BASE = 'http://localhost:3000/api';
const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');
const message = document.getElementById('detail-message');
const detail = document.getElementById('event-detail');

function addText(parent, tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-AU', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(value.replace(' ', 'T')));
}

function renderEvent(event) {
  detail.replaceChildren();
  if (event.event_image_url) {
    const image = document.createElement('img');
    image.className = 'detail-image';
    image.src = event.event_image_url;
    image.alt = `Photo for ${event.event_title}`;
    image.addEventListener('error', () => image.remove(), { once: true });
    detail.append(image);
  }
  const content = document.createElement('div');
  content.className = 'detail-content';
  addText(content, 'p', 'eyebrow', event.category_name);
  addText(content, 'h1', '', event.event_title);
  const facts = document.createElement('div');
  facts.className = 'event-facts';
  const dateFact = document.createElement('div');
  dateFact.className = 'event-fact';
  addText(dateFact, 'span', 'fact-icon', '◷');
  const dateCopy = document.createElement('div');
  addText(dateCopy, 'span', 'fact-label', 'WHEN');
  addText(dateCopy, 'strong', '', formatDateTime(event.event_start_datetime));
  addText(dateCopy, 'span', 'fact-subtext', `Until ${formatDateTime(event.event_end_datetime)}`);
  dateFact.append(dateCopy);
  const placeFact = document.createElement('div');
  placeFact.className = 'event-fact';
  addText(placeFact, 'span', 'fact-icon', '⌖');
  const placeCopy = document.createElement('div');
  addText(placeCopy, 'span', 'fact-label', 'WHERE');
  addText(placeCopy, 'strong', '', event.location_name);
  addText(placeCopy, 'span', 'fact-subtext', event.location_suburb);
  placeFact.append(placeCopy);
  facts.append(dateFact, placeFact);
  content.append(facts);
  addText(content, 'h2', '', 'About this event');
  addText(content, 'p', 'detail-description', event.full_description);

  const support = document.createElement('section');
  support.className = 'support-panel';
  addText(support, 'p', 'eyebrow', 'Your support matters');
  const ticketPrice = Number(event.ticket_price);
  addText(support, 'p', 'ticket-price', ticketPrice === 0 ? 'FREE EVENT' : `Ticket Price: $${ticketPrice.toFixed(2)} AUD`);
  const goal = Number(event.charity_funding_goal);
  const raised = Number(event.current_funding_raised);
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  const fundingLabel = document.createElement('p');
  fundingLabel.className = 'funding-label';
  addText(fundingLabel, 'strong', '', `$${raised.toLocaleString('en-AU')}`);
  addText(fundingLabel, 'span', '', ` raised of $${goal.toLocaleString('en-AU')} goal`);
  support.append(fundingLabel);
  const progress = document.createElement('progress');
  progress.className = 'funding-progress';
  progress.max = goal || 1;
  progress.value = Math.min(raised, goal);
  progress.setAttribute('aria-label', 'Charity funding progress');
  support.append(progress);
  addText(support, 'p', 'funding-percent', `${percent}% of the goal reached`);
  const actions = document.createElement('div');
  actions.className = 'detail-actions';
  const register = document.createElement('button');
  register.className = 'button';
  register.type = 'button';
  register.textContent = 'I’d like to join';
  register.addEventListener('click', () => window.alert('This feature is currently under construction.'));
  const share = document.createElement('button');
  share.className = 'button button-light';
  share.type = 'button';
  share.textContent = 'Share this event';
  share.addEventListener('click', async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: event.event_title, text: 'Join me at this Community Hope event.', url: window.location.href });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        share.textContent = 'Link copied!';
        window.setTimeout(() => { share.textContent = 'Share this event'; }, 1800);
      } else {
        share.textContent = 'Copy the page link from your address bar';
      }
    } catch (error) {
      if (error.name !== 'AbortError') share.textContent = 'Copy the page link from your address bar';
    }
  });
  actions.append(register, share);
  support.append(actions);
  content.append(support);

  const org = document.createElement('section');
  org.className = 'organisation-note';
  addText(org, 'h2', '', event.org_name);
  addText(org, 'p', '', event.mission);
  const contact = document.createElement('p');
  const email = document.createElement('a');
  email.href = `mailto:${event.contact_email}`;
  email.textContent = event.contact_email;
  contact.append(email);
  if (event.contact_phone) {
    contact.append(document.createTextNode(' · '));
    const phone = document.createElement('a');
    phone.href = `tel:${event.contact_phone.replace(/\s/g, '')}`;
    phone.textContent = event.contact_phone;
    contact.append(phone);
  }
  org.append(contact);
  content.append(org);
  detail.append(content);
  detail.hidden = false;
  message.textContent = '';
  document.title = `${event.event_title} | Community Hope Australia`;
}

if (!eventId || !/^\d+$/.test(eventId)) {
  message.textContent = 'Event not found.';
} else {
  fetch(`${API_BASE}/events/${encodeURIComponent(eventId)}`)
    .then((response) => { if (response.status === 404) throw new Error('not-found'); if (!response.ok) throw new Error('network'); return response.json(); })
    .then(renderEvent)
    .catch((error) => { message.textContent = error.message === 'not-found' ? 'Event not found.' : 'We could not load this event. Please check your connection and try again.'; });
}
