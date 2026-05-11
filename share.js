const API_URL =
'PASTE_SHARE_API_LATER';


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
      !data.success
    ){

      app.innerHTML = `

        <div class="message">

          Listing unavailable

        </div>

      `;

      return;

    }

    renderCar(data.car);

  }

  catch(err){

    app.innerHTML = `

      <div class="message">

        Unable to load listing

      </div>

    `;

  }

}


function renderCar(car){

  const images =
  (car.images || '')
  .split(',');

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

        <img src="${img}">

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

        <span>${car.km}</span>

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