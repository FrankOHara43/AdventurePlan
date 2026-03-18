let authToken = localStorage.getItem('token');
let allTours = [];

const API_BASE = 'https://adventureplan.onrender.com/api/v1';

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  return headers;
}

function getTourImage(tour) {
  if (tour && tour.imageCover) return `/img/tours/${tour.imageCover}`;
  return '/img/tours/tour-1-cover.jpg';
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function fetchTours() {
  try {
    const response = await fetch(`${API_BASE}/tours`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to fetch tours');

    const data = await response.json();
    return data.data.tours || [];
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

function renderTours(tours) {
  const toursContainer = document.getElementById('tours-container');
  if (!toursContainer) return;

  toursContainer.innerHTML = '';

  if (!tours.length) {
    toursContainer.innerHTML = '<p class="tour-empty">No tours found</p>';
    return;
  }

  tours.forEach((tour) => {
    const tourCard = document.createElement('div');
    tourCard.className = 'tour-card';
    tourCard.innerHTML = `
      <div class="tour-card__image">
        <img src="${getTourImage(tour)}" alt="${tour.name}" onerror="this.onerror=null;this.src='/img/tours/tour-1-cover.jpg'" />
      </div>
      <div class="tour-card__content">
        <h3 class="tour-card__title">${tour.name}</h3>
        <p class="tour-card__summary">${tour.summary || ''}</p>
        <div class="tour-card__info">
          <span class="tour-card__duration">⏱ ${tour.duration} days</span>
          <span class="tour-card__difficulty">🎯 ${tour.difficulty}</span>
          <span class="tour-card__size">👥 ${tour.maxGroupSize} people</span>
        </div>
        <div class="tour-card__rating">
          <span class="tour-card__rating-avg">⭐ ${tour.ratingsAverage}</span>
          <span class="tour-card__rating-qty">(${tour.ratingsQuantity} reviews)</span>
        </div>
        <div class="tour-card__footer">
          <span class="tour-card__price">$${tour.price}</span>
          <a href="/tour.html?id=${tour._id}" class="tour-card__link">View Details</a>
        </div>
      </div>
    `;
    toursContainer.appendChild(tourCard);
  });
}

function setupSearch() {
  const searchForm = document.querySelector('.nav__search');
  const searchInput = document.querySelector('.nav__search-input');
  if (!searchForm || !searchInput) return;

  const runSearch = () => {
    const term = searchInput.value.trim().toLowerCase();

    if (!document.getElementById('tours-container')) {
      const query = encodeURIComponent(term);
      window.location.href = term
        ? `/overview.html?search=${query}`
        : '/overview.html';
      return;
    }

    if (!term) {
      renderTours(allTours);
      return;
    }

    const safeTerm = escapeRegExp(term);
    const matcher = new RegExp(safeTerm, 'i');

    const filteredTours = allTours.filter((tour) => {
      return (
        matcher.test(tour.name || '') ||
        matcher.test(tour.summary || '') ||
        matcher.test(tour.difficulty || '')
      );
    });

    renderTours(filteredTours);
  };

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    runSearch();
  });

  searchInput.addEventListener('input', runSearch);
}

async function signup(name, email, password, passwordConfirm) {
  try {
    const response = await fetch(`${API_BASE}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, passwordConfirm }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Signup failed');

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.data?.user?.name || 'User');
      authToken = data.token;
      window.location.href = '/overview.html';
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    alert(`Signup error: ${error.message}`);
  }
}

async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.data?.user?.name || 'User');
      authToken = data.token;
      window.location.href = '/overview.html';
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    alert(`Login error: ${error.message}`);
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  authToken = null;
  window.location.href = '/overview.html';
}

function isLoggedIn() {
  return !!authToken;
}

function updateAuthUI() {
  const loginBtn = document.querySelector('[data-auth="login"]');
  const signupBtn = document.querySelector('[data-auth="signup"]');
  const logoutBtn = document.querySelector('[data-auth="logout"]');
  const bookingsBtn = document.querySelector('[data-auth="bookings"]');
  const profileBtn = document.querySelector('[data-auth="profile"]');
  const profileName = document.querySelector('[data-auth="profile-name"]');

  if (profileName) {
    profileName.textContent = localStorage.getItem('userName') || 'User';
  }

  if (isLoggedIn()) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    if (bookingsBtn) bookingsBtn.style.display = 'inline-flex';
    if (profileBtn) profileBtn.style.display = 'inline-flex';
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (signupBtn) signupBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (bookingsBtn) bookingsBtn.style.display = 'none';
    if (profileBtn) profileBtn.style.display = 'none';
  }
}

async function fetchTourById(tourId) {
  try {
    const response = await fetch(`${API_BASE}/tours/${tourId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to fetch tour');

    const data = await response.json();
    return data.data.tour;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

async function createBooking(tourId) {
  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ tourId }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create booking');

    return data.data.booking;
  } catch (error) {
    console.error('Create booking error:', error);
    throw error;
  }
}

async function fetchMyBookings() {
  try {
    const response = await fetch(`${API_BASE}/bookings/my-bookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load bookings');

    return data.data.bookings || [];
  } catch (error) {
    console.error('Fetch bookings error:', error);
    throw error;
  }
}

function renderMyBookings(bookings) {
  const bookingsContainer = document.getElementById('bookings-container');
  if (!bookingsContainer) return;

  bookingsContainer.innerHTML = '';

  if (!bookings.length) {
    bookingsContainer.innerHTML = '<p class="tour-empty">No bookings yet. Book your first tour!</p>';
    return;
  }

  bookings.forEach((booking) => {
    const tour = booking.tour;
    if (!tour) return;

    const bookingCard = document.createElement('div');
    bookingCard.className = 'tour-card';
    bookingCard.innerHTML = `
      <div class="tour-card__image">
        <img src="${getTourImage(tour)}" alt="${tour.name}" onerror="this.onerror=null;this.src='/img/tours/tour-1-cover.jpg'" />
      </div>
      <div class="tour-card__content">
        <h3 class="tour-card__title">${tour.name}</h3>
        <p class="tour-card__summary">${tour.summary || ''}</p>
        <div class="tour-card__info">
          <span class="tour-card__duration">⏱ ${tour.duration} days</span>
          <span class="tour-card__difficulty">🎯 ${tour.difficulty}</span>
          <span class="tour-card__size">👥 ${tour.maxGroupSize} people</span>
        </div>
        <div class="tour-card__rating">
          <span class="tour-card__rating-avg">⭐ ${tour.ratingsAverage}</span>
          <span class="tour-card__rating-qty">(${tour.ratingsQuantity} reviews)</span>
        </div>
        <div class="tour-card__footer">
          <span class="tour-card__price">$${booking.price}</span>
          <a href="/tour.html?id=${tour._id}" class="tour-card__link">View Tour</a>
        </div>
      </div>
    `;
    bookingsContainer.appendChild(bookingCard);
  });
}

function renderTourDetail(tour) {
  const detailContainer = document.getElementById('tour-detail');
  if (!detailContainer) return;

  detailContainer.classList.add('tour-detail');
  detailContainer.innerHTML = `
    <div class="tour-detail__header">
      <h1>${tour.name}</h1>
      <p class="tour-detail__description">${tour.description || tour.summary || ''}</p>
    </div>
    <div class="tour-detail__content">
      <div class="tour-detail__image">
        <img src="${getTourImage(tour)}" alt="${tour.name}" onerror="this.onerror=null;this.src='/img/tours/tour-1-cover.jpg'" />
      </div>
      <div class="tour-detail__info">
        <h2>Tour Details</h2>
        <ul>
          <li><strong>Duration:</strong> ${tour.duration} days</li>
          <li><strong>Max Group Size:</strong> ${tour.maxGroupSize} people</li>
          <li><strong>Difficulty:</strong> ${tour.difficulty}</li>
          <li><strong>Average Rating:</strong> ${tour.ratingsAverage}⭐ (${tour.ratingsQuantity} reviews)</li>
          <li><strong>Price:</strong> $${tour.price}</li>
          ${tour.priceDiscount ? `<li><strong>Discount Price:</strong> $${tour.priceDiscount}</li>` : ''}
          <li><strong>Starting Dates:</strong> ${(tour.startDates || []).map((date) => new Date(date).toLocaleDateString()).join(', ') || 'N/A'}</li>
        </ul>
        <button class="btn btn--green" data-book-tour="${tour._id}">Book Tour</button>
      </div>
    </div>
  `;

  const bookButton = detailContainer.querySelector('[data-book-tour]');
  if (bookButton) {
    bookButton.addEventListener('click', () => bookTour(tour._id));
  }
}

async function bookTour(tourId) {
  if (!isLoggedIn()) {
    alert('Please log in to book a tour');
    window.location.href = '/login.html';
    return;
  }

  try {
    await createBooking(tourId);
    alert('Tour booked successfully!');
    window.location.href = '/bookings.html';
  } catch (error) {
    alert(`Booking failed: ${error.message}`);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  updateAuthUI();

  if (document.getElementById('tours-container')) {
    allTours = await fetchTours();
    const initialQuery = new URLSearchParams(window.location.search).get('search');
    renderTours(allTours);
    setupSearch();

    if (initialQuery) {
      const searchInput = document.querySelector('.nav__search-input');
      if (searchInput) {
        searchInput.value = initialQuery;
        searchInput.dispatchEvent(new Event('input'));
      }
    }
  } else {
    setupSearch();
  }

  if (document.getElementById('tour-detail')) {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');
    if (tourId) {
      const tour = await fetchTourById(tourId);
      if (tour) renderTourDetail(tour);
    }
  }

  if (document.getElementById('bookings-container')) {
    if (!isLoggedIn()) {
      window.location.href = '/login.html';
      return;
    }

    try {
      const bookings = await fetchMyBookings();
      renderMyBookings(bookings);
    } catch (error) {
      const bookingsContainer = document.getElementById('bookings-container');
      if (bookingsContainer) {
        bookingsContainer.innerHTML = `<p class="tour-empty">${error.message}</p>`;
      }
    }
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;
      signup(name, email, password, passwordConfirm);
    });
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }

  const logoutBtn = document.querySelector('[data-auth="logout"]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      logout();
    });
  }
});
