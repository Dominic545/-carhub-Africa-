const cars=[
['Toyota Camry','2021','Foreign Used','Lagos','Automatic','Petrol','https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=85'],
['Toyota Corolla','2021','Foreign Used','Abuja','Automatic','Petrol','https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=1000&q=85'],
['Toyota Highlander','2022','Foreign Used','Lagos','Automatic','Petrol','https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85'],
['Toyota Land Cruiser','2021','Foreign Used','Abuja','Automatic','Petrol','https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85'],
['Toyota Venza','2020','Foreign Used','Lagos','Automatic','Hybrid','https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1000&q=85'],
['Lexus RX','2021','Foreign Used','Abuja','Automatic','Petrol','https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85'],
['Lexus GX','2020','Foreign Used','Lagos','Automatic','Petrol','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85'],
['Mercedes-Benz C-Class','2022','Foreign Used','Lagos','Automatic','Petrol','https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85'],
['Mercedes-Benz GLE','2021','Foreign Used','Abuja','Automatic','Petrol','https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85'],
['BMW X5','2022','Foreign Used','Lagos','Automatic','Petrol','https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1000&q=85'],
['Range Rover Sport','2021','Foreign Used','Lagos','Automatic','Petrol','https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85'],
['Honda Accord','2021','Foreign Used','Port Harcourt','Automatic','Petrol','https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1000&q=85'],
['Toyota Prado','2022','Foreign Used','Abuja','Automatic','Diesel','https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85']
];

let currentCarIndex=null;

const key=c=>c[0].toLowerCase().replace(/[^a-z0-9]+/g,'-');

function saved(){
  return JSON.parse(localStorage.getItem('ch_saved')||'[]');
}

function isSaved(c){
  return saved().includes(key(c));
}

function toggleSave(i){
  let s=saved();
  const k=key(cars[i]);

  s=s.includes(k)
    ? s.filter(x=>x!==k)
    : [...s,k];

  localStorage.setItem('ch_saved',JSON.stringify(s));

  render();
  renderSaved();
}

function badgeFor(c,i){
  if(i===0) return 'Featured';
  if(c[1]==='2022') return 'New Arrival';
  if(i===9||i===10) return 'Hot Deal';
  return '';
}

function card(c,i){

  const badge=badgeFor(c,i);

  return `
  <article class="car-card">

    <div class="car-img">

      <img
        src="${c[6]}"
        alt="${c[0]} reference photo"
        loading="lazy"
      >

      <label>${c[1]}</label>

      ${
        badge
        ? `<span class="car-badge">${badge}</span>`
        : ''
      }

      <button
        aria-label="Save ${c[0]}"
        onclick="toggleSave(${i})"
      >
        ${isSaved(c)?'♥':'♡'}
      </button>

      <span class="reference">
        CARHUB AFRICA
      </span>

    </div>

    <div class="card-body">

      <div>
        <h3>${c[0]}</h3>

        <p>
          ${c[4]} · ${c[5]} · ${c[3]}
        </p>
      </div>

      <b>
        Price on request
      </b>

    </div>

    <div class="card-actions">

      <button onclick="openModal(${i})">
        View details
      </button>

      <button
        class="share-btn"
        onclick="shareCar(${i})"
      >
        Share ↗
      </button>

      <a
        href="https://wa.me/2349066547511?text=Hello%20CarHub%20Africa%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(c[0])}."
        target="_blank"
        rel="noopener"
      >
        WhatsApp ↗
      </a>

    </div>

  </article>`;
}

function shareCar(i){

  const c=cars[i];

  const url=
    `${location.origin}${location.pathname}#car-${key(c)}`;

  const text=
    `${c[0]} ${c[1]} — CarHub Africa`;

  if(navigator.share){

    navigator.share({
      title:text,
      text:`Check out this ${c[0]} on CarHub Africa`,
      url:url
    }).catch(()=>{});

  }else if(navigator.clipboard){

    navigator.clipboard
      .writeText(url)
      .then(()=>alert('Car link copied!'))
      .catch(()=>alert(url));

  }else{

    prompt(
      'Copy this car link:',
      url
    );

  }
}

function shareCurrentCar(){

  if(currentCarIndex!==null){
    shareCar(currentCarIndex);
  }

}

function matches(c){

  const q=
    document.getElementById('query')
    .value
    .trim()
    .toLowerCase();

  const loc=
    document.getElementById('location').value;

  const brand=
    document.getElementById('brandFilter').value;

  const condition=
    document.getElementById('conditionFilter').value;

  const year=
    document.getElementById('yearFilter').value;

  return (
    (!q || c[0].toLowerCase().includes(q)) &&
    (!loc || c[3]===loc) &&
    (!brand || c[0].toLowerCase().startsWith(brand.toLowerCase())) &&
    (!condition || c[2]===condition) &&
    (!year || c[1]===year)
  );
}

function render(){

  const a=
    cars
      .map((c,i)=>[c,i])
      .filter(x=>matches(x[0]));

  document.getElementById('grid').innerHTML=
    a.map(x=>card(x[0],x[1])).join('');

  document.getElementById('count').textContent=
    `${a.length} vehicle${a.length===1?'':'s'}`;

  document.getElementById('empty').style.display=
    a.length?'none':'block';
}

function filterCars(scroll=false){

  render();

  if(scroll){
    document
      .getElementById('cars')
      .scrollIntoView({
        behavior:'smooth'
      });
  }
}

function resetCars(){

  [
    'query',
    'brandFilter',
    'conditionFilter',
    'yearFilter'
  ].forEach(id=>{
    document.getElementById(id).value='';
  });

  document.getElementById('location').value='';

  render();
}

function brand(b){

  document.getElementById('brandFilter').value=b;

  filterCars(true);
}

function renderSaved(){

  const s=saved();

  const a=
    cars
      .map((c,i)=>[c,i])
      .filter(x=>s.includes(key(x[0])));

  document.getElementById('savedGrid').innerHTML=
    a.map(x=>card(x[0],x[1])).join('');

  document.getElementById('savedEmpty').style.display=
    a.length?'none':'block';
}

function openModal(i){

  currentCarIndex=i;

  const c=cars[i];

  document.getElementById('modalImg').src=c[6];

  document.getElementById('modalCondition').textContent=
    `${c[1]} · ${c[2]} · ${c[3]}`;

  document.getElementById('modalName').textContent=
    c[0];

  document.getElementById('modalMeta').textContent=
    'Vehicle details';

  document.getElementById('modalSpecs').innerHTML=`

    <span>
      Transmission
      <strong>${c[4]}</strong>
    </span>

    <span>
      Fuel
      <strong>${c[5]}</strong>
    </span>

    <span>
      Location
      <strong>${c[3]}</strong>
    </span>

    <span>
      Year
      <strong>${c[1]}</strong>
    </span>

  `;

  document.getElementById('modalWA').href=
    `https://wa.me/2349066547511?text=Hello%20CarHub%20Africa%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(c[0])}.`;

  document.getElementById('modal')
    .classList.add('open');

  document.getElementById('modal')
    .setAttribute('aria-hidden','false');
}

function closeModal(){

  document.getElementById('modal')
    .classList.remove('open');

  document.getElementById('modal')
    .setAttribute('aria-hidden','true');

  currentCarIndex=null;
}

document
  .getElementById('modal')
  .addEventListener('click',e=>{
    if(e.target.id==='modal'){
      closeModal();
    }
  });

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closeModal();
  }
});

function openHashCar(){

  const hash=location.hash;

  if(!hash.startsWith('#car-')) return;

  const slug=hash.slice(5);

  const i=
    cars.findIndex(
      c=>key(c)===slug
    );

  if(i>-1){
    openModal(i);
  }
}

window.addEventListener(
  'hashchange',
  openHashCar
);

render();
renderSaved();
openHashCar();
