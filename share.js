const API_URL =
"https://script.google.com/macros/s/AKfycbz8hbybFJOHB2Wn9tSdU-xsS7M7hCo5b2Rpljqs4us0MNvCVF4-Agx1PK7aTVHx-l2k/exec";


const params =
new URLSearchParams(
  location.search
);

const token =
params.get('s');


const app =
document.getElementById('app');


async function loadCar() {

  if(!token){

    app.innerHTML = `

      <div class="message">

        Invalid share link

      </div>

    `;

    return;

  }

  try{

    const response =
    await fetch(
      API_URL +
      '?share=' +
      token
    );

    const data =
    await response.json();

    if(
      !data.car
    ){

      app.innerHTML = `

        <div class="message">

          Listing unavailable

        </div>

      `;

      return;

    }

    renderCar(
      data.car,
      data.images || []
    );

  }

  catch(err){

    app.innerHTML = `

      <div class="message">

        Unable to load listing

      </div>

    `;

  }

}


function renderCar(
    car,
    selectedImages
  ){

  const images =
  selectedImages.length

  ? selectedImages

  : (car.images || '')
    .split(',')
    .map(i => i.trim())
    .filter(Boolean);

  app.innerHTML = `

    <div class="top">

      <img
        src="./logo.png"
        class="logo"
      >

      <div>

        <div class="brand">

          BLUE WAVE MOTORS

        </div>

        <div class="sub">

          Premium Pre-Owned Luxury Cars

        </div>

      </div>

    </div>

    <div class="gallery">

      ${images.map(img => `
        <img src="${img.trim()}">
      `).join('')}

    </div>

    <div class="content">

      <div class="title">

        ${car.brand}
        ${car.model}

      </div>

      <div class="variant">

        ${car.variant || ''}

      </div>

      <div class="meta">
        <span>${car.year}</span>

        <span>•</span>

        <span>${car.fuel}</span>

        <span>•</span>

        <span>
          ${Number(car.km || 0)
          .toLocaleString('en-IN')} km
        </span>
      </div>

      <div class="price">

        ${car.price}

      </div>

      <div class="cta">

        <button
          class="btn call"
          onclick="location.href='tel:+918943338111'"
        >
          Call
        </button>

        <button
          class="btn whatsapp"
          onclick="location.href='https://wa.me/918943338111'"
        >
          WhatsApp
        </button>

      </div>

    </div>

  `;

}


loadCar();