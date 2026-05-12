// share.js - FIXED: converts Google Drive IDs to working image URLs

const API_URL = "https://script.google.com/macros/s/AKfycbz8hbybFJOHB2Wn9tSdU-xsS7M7hCo5b2Rpljqs4us0MNvCVF4-Agx1PK7aTVHx-l2k/exec";
const API_KEY = "BWM@2026";  // optional, but added for consistency

const params = new URLSearchParams(location.search);
const token = params.get('s');
const app = document.getElementById('app');

// ========== IMAGE CONVERTER (copied from main app) ==========
function getOptimizedImage(url, size = 1200) {
  if (!url) return '';
  if (url.includes('googleusercontent.com') || url.includes('lh3.google')) return url;
  // Extract Google Drive file ID from any string
  const match = url.match(/[-\w]{25,}/);
  if (!match) return url;
  return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w${size}`;
}

// ========== LOAD CAR DATA ==========
async function loadCar() {
  if (!token) {
    app.innerHTML = `<div class="message">Invalid share link</div>`;
    return;
  }

  try {
    // Add API key and cache-buster
    const response = await fetch(`${API_URL}?key=${API_KEY}&share=${token}&_=${Date.now()}`);
    const data = await response.json();

    if (!data.car) {
      app.innerHTML = `<div class="message">Listing unavailable or expired (7 days)</div>`;
      return;
    }

    renderCar(data.car, data.images || []);
  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="message">Unable to load listing. Please try again later.</div>`;
  }
}

// ========== RENDER WITH CONVERTED IMAGES ==========
function renderCar(car, selectedImages) {
  // Get image array – either from share storage or from car.images string
  let images = [];
  if (selectedImages.length) {
    images = selectedImages;
  } else if (car.images) {
    if (Array.isArray(car.images)) {
      images = car.images;
    } else if (typeof car.images === 'string') {
      images = car.images.split(',').map(i => i.trim()).filter(Boolean);
    }
  }

  // CONVERT each image URL to a working thumbnail
  const convertedImages = images.map(img => getOptimizedImage(img, 1200));

  // Format price nicely
  const formattedPrice = formatPrice(car.price);

  app.innerHTML = `
    <div class="top">
      <img src="./logo.png" class="logo" alt="Blue Wave Motors">
      <div>
        <div class="brand">BLUE WAVE MOTORS</div>
        <div class="sub">Premium Pre-Owned Luxury Cars</div>
      </div>
    </div>

    <div class="gallery">
      ${convertedImages.map(img => `
        <img src="${img}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Available'">
      `).join('')}
    </div>

    <div class="content">
      <div class="title">${car.brand || ''} ${car.model || ''}</div>
      <div class="variant">${car.variant || ''}</div>
      <div class="meta">
        <span>${car.year || '-'}</span> •
        <span>${car.fuel || '-'}</span> •
        <span>${Number(car.km || 0).toLocaleString('en-IN')} km</span> •
        <span>Owner ${car.owner || '-'}</span>
      </div>
      <div class="price">${formattedPrice}</div>
      <div class="cta">
        <button class="btn call" onclick="location.href='tel:+918943338111'">Call</button>
        <button class="btn whatsapp" onclick="location.href='https://wa.me/918943338111'">WhatsApp</button>
      </div>
    </div>
  `;
}

// ========== PRICE FORMATTER (from main app) ==========
function parsePrice(price) {
  if (!price) return 0;
  let text = price.toString().toLowerCase().replace(/,/g, '');
  const match = text.match(/[\d.]+/);
  if (!match) return 0;
  let number = parseFloat(match[0]);
  if (text.includes('crore')) return number * 10000000;
  if (text.includes('lakh') || text.includes('l')) return number * 100000;
  return number;
}

function formatPrice(price) {
  const n = parsePrice(price);
  if (!n) return price || 'Price on request';
  if (n >= 10000000) return '₹ ' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹ ' + (n / 100000).toFixed(2) + ' Lakh';
  return '₹ ' + n.toLocaleString('en-IN');
}

// START
loadCar();