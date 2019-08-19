'use strict';

let map;
let directionsService;
let directionsRenderer;
let directions;
let closest10;
let pos;

let state;

function home() {
  if (!state || state === 2) {
    state = 1;
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      directions = undefined;
    }

    document.getElementById('see-route').classList.add('hidden');

    const data = document.getElementById('data');
    data.classList.add('home');
    data.innerHTML = '';

    const loader = document.createElement('div');
    loader.classList.add('loading6');
    data.appendChild(loader);

    setTimeout(() => {
      data.innerHTML = '';
      const div1 = document.createElement('div');

      const h1 = document.createElement('h1');
      h1.appendChild(document.createTextNode('Autoridades Territoriales 2019'));

      const span = document.createElement('span');
      span.appendChild(document.createTextNode('La registraduría nacional del estado civíl de Colombia ofrece un sistema de puestos de inscripción para las próximas votaciones.'));
      const span1 = document.createElement('span');
      span1.appendChild(document.createTextNode('Sin embargo, no provee el servicio de localización del puesto más cercano ni su referencia geográfica.'));
      const span2 = document.createElement('span');
      span2.appendChild(document.createTextNode('Esta herramienta fue creada con el fin que sea más fácil la identificación de los puestos para inscripción de cédulas para los puestos de votación.'));

      const div = document.createElement('div');
      const button = document.createElement('button');
      button.appendChild(document.createTextNode('Ver autoridades territoriales'));
      button.addEventListener('click', goToMap);
      div.appendChild(button);


      div1.appendChild(h1);
      div1.appendChild(span);
      div1.appendChild(span1);
      div1.appendChild(span2);
      div1.appendChild(div);

      data.appendChild(div1);
    }, state ? 1000 : 0);
  }
}


function goToMap() {
  if (!state || state === 1) {
    state = 2;
    document.getElementById('see-route').classList.remove('hidden');

    const data = document.getElementById('data');
    data.classList.remove('home');
    data.innerHTML = '';

    const loader = document.createElement('div');
    loader.classList.add('loading6');
    data.appendChild(loader);

    setTimeout(() => {
      data.innerHTML = '';
      const h2 = document.createElement('h2');
      h2.appendChild(document.createTextNode('Lugares cercanos'));
      const span = document.createElement('span');
      span.appendChild(document.createTextNode('Los 10 lugares más cercanos de acuerdo a su ubicación.'));

      data.appendChild(h2);
      data.appendChild(span);

      if (closest10) {
        closest10.forEach((closest, index) => {
          const container = document.createElement('button');

          container.addEventListener('click', () => {
            direction(`${pos.coords.latitude}, ${pos.coords.longitude}`, `${closest.location.latitude}, ${closest.location.longitude}`);
          });

          const name = document.createElement('span');
          name.appendChild(document.createTextNode(`${index + 1}. ${closest.name}`));
          container.appendChild(name);

          const address = document.createElement('span');
          address.appendChild(document.createTextNode(closest.address));
          container.appendChild(address);

          data.appendChild(container);
        });
      }
    }, 1000);
  }
}


function getLocation(cb, err) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(cb);
  } else {
    err('Unsupported Geolocalitation');
  }
}


function getCloser(curPos, places) {
  const pl = places.filter(p => p.open);

  pl.sort((a, b) => {
    const distance = (p) => {
      const x = Math.abs(p.location.latitude - curPos.latitude);
      const y = Math.abs(p.location.longitude - curPos.longitude);
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    };
    return distance(a) - distance(b);
  });

  return pl.slice(0, 10);
}


function initMap() {
  const google = window.google;
  getLocation(async (_pos) => {
    pos = _pos;

    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      zoom: 15
    });

    const req = await fetch('./data.json');
    const data = await req.json();

    new google.maps.Marker({
      position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      icon: 'http://maps.google.com/mapfiles/ms/icons/homegardenbusiness.png',
      map
    });

    data.forEach(entry => {
      if (!entry.open) {
        return;
      }
      const marker = new google.maps.Marker({
        position: {
          lat: entry.location.latitude,
          lng: entry.location.longitude,
        },
        icon: (entry.open ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'),
        map
      });
      marker.addListener('click', function () {
        console.log(entry);
      });
    });

    closest10 = getCloser(pos.coords, data);

    if (state === 2) {
      state = undefined;
      goToMap();
    }
  });
  home();
}


function direction(origin, destination) {
  const google = window.google;

  if (directionsRenderer) {
    directionsRenderer.setMap(null);
  }
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer.setMap(map);

  const calculateAndDisplayRoute = (origin, destination) => {
    directionsService.route({
      origin: { query: origin },
      destination: { query: destination },
      travelMode: 'WALKING'
    }, (response, status) => {
      if (status === 'OK') {
        directions = response
          .routes[0]
          .legs[0]
          .steps
          .map(a => ({ distance: a.distance, duration: a.duration, instructions: a.instructions }));
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  };

  calculateAndDisplayRoute(origin, destination);
}


function exportDirections() {
  const modal = document.getElementById('modal');
  modal.classList.remove('hidden');

  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = '';

  if (directions && directions.length !== 0) {
    directions.forEach(d => {
      const div = document.createElement('div');
      const instruction = document.createElement('span');
      instruction.innerHTML = d.instructions;

      const distance = document.createElement('span');
      const distanceIcon = document.createElement('i');
      distanceIcon.classList.add('fas');
      distanceIcon.classList.add('fa-road');
      distance.appendChild(distanceIcon);
      distance.appendChild(document.createTextNode(` ${d.distance.text}`));

      const duration = document.createElement('span');
      const durationIcon = document.createElement('i');
      durationIcon.classList.add('far');
      durationIcon.classList.add('fa-clock');
      duration.appendChild(durationIcon);
      duration.appendChild(document.createTextNode(`  ${d.duration.text}`));

      div.appendChild(instruction);
      div.appendChild(distance);
      div.appendChild(duration);

      modalBody.appendChild(div);
    });
  } else {
    const span = document.createElement('span');
    span.appendChild(document.createTextNode('Seleccione un lugar para ver la ruta desde su ubicación.'));

    const span1 = document.createElement('span');
    span1.appendChild(document.createTextNode('Podrá regresar a este botón para ver la ruta detallada.'));

    modalBody.appendChild(span);
    modalBody.appendChild(span1);
  }
}


function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
}