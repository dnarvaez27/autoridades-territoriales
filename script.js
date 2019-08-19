'use strict';

let map;
let directionsService;
let directionsRenderer;
let directions;
let closest10;
let pos;

let state;
let timeout = [undefined];

function home() {
  if (!state || state !== 1) {
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
  if (!state || state !== 2) {
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


function aboutme() {
  if (!state || state !== 3) {
    state = 3;

    const config = {
      size: { width: 500, height: 300 },
      numParticles: 18,
      radius: { min: 60, max: 120 },
      speed: 1,
      fps: 60
    };

    const random = {
      range: (min, max) => Math.floor(Math.random() * (max - min)) + min,
      simetricalRange: (a) => ((Math.random() > 0.5) ? -1 : 1) * ((Math.random() * a) + 1)
    }

    class Particle {
      constructor(x, y, vx, vy, radius, key = undefined) {
        this.x = x || 0;
        this.y = y || 0;
        this.vx = vx || 0;
        this.vy = vy || 0;
        this.radius = radius;
        this.key = key;
      }

      update = (vx, vy) => {
        this.x += this.vx + (vx || 0);
        this.y += this.vy + (vy || 0);
      }
    }

    class Generator {
      constructor() {
        const particles = [];
        for (let i = 0; i < config.numParticles; i++) {
          const x = config.size.width / 2;
          const y = config.size.height / 2;
          const vx = random.simetricalRange(config.speed);
          const vy = random.simetricalRange(config.speed);
          const radius = random.range(config.radius.min, config.radius.max)
          const key = i;
          const particle = new Particle(x, y, vx, vy, radius, key);
          particles.push(particle);
        }

        this.particles = particles;
      }

      update = () => {
        this.particles.forEach(particle => {
          if (particle.x - particle.radius < 0) { particle.vx = -particle.vx; }
          if (particle.x + particle.radius > config.size.width) { particle.vx = -particle.vx; }
          if (particle.y - particle.radius < 0) { particle.vy = -particle.vy; }
          if (particle.y + particle.radius > config.size.height) { particle.vy = -particle.vy; }
          particle.update();
        })
      };
    }

    const filterGooeyColorBlending = (svg, id) => {
      const defs = svg
        .append("defs");
      const filter = defs
        .append("filter")
        .attr("id", id);

      filter
        .append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", "10")
        .attr("color-interpolation-filters", "sRGB")
        .attr("result", "blur");

      filter.append("feColorMatrix")
        .attr("in", "blur")
        .attr("mode", "matrix")
        .attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9")
        .attr("result", "gooey");
    }

    const redraw = (g, particles) => {
      const particle = g
        .selectAll("circle.particle")
        .data(particles, d => d.key);

      const color = d3
        .scaleLinear()
        .domain([0, particles.length])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#007AFF"), d3.rgb('#e91e63')]);

      // Setup
      particle
        .enter()
        .append("circle")
        .attr("class", "particle")
        .attr("r", d => d.radius)
        .attr('fill', (_, i) => color(i));
      // .attr('fill', 'black');

      // Update
      particle
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      particle
        .exit()
        .remove();
    }

    document.getElementById('see-route').classList.add('hidden');
    const data = document.getElementById('data');
    data.classList.add('home');
    data.innerHTML = '';

    const div = document.createElement('div');
    div.setAttribute('id', 'aboutme-container');

    const span = document.createElement('span');
    span.appendChild(document.createTextNode('David Narvaez Guerrero'));

    const span1 = document.createElement('span');
    span1.appendChild(document.createTextNode('Estudiante de Ingeniería de Sistemas y Computación'));

    const span2 = document.createElement('span');
    span2.appendChild(document.createTextNode('Universidad de Los Andes'));

    const alink = document.createElement('a');
    alink.appendChild(document.createTextNode('Página Web'));
    alink.setAttribute('href', 'https://dnarvaez27.github.io');
    alink.setAttribute('target', '_blank');

    div.appendChild(span);
    div.appendChild(span1);
    div.appendChild(span2);
    div.appendChild(alink);

    data.appendChild(div);

    (function () {

      const gen = new Generator();

      window.requestAnimFrame = (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        (callback => window.setTimeout(callback, 1000 / config.fps))
      );

      // clearTimeout(timeout[0]);
      window.cancelAnimationFrame(timeout[0])

      const _id = 'gooeyCodeFilter';

      const svg = d3
        .select('#aboutme-container')
        .append('svg');

      filterGooeyColorBlending(svg, _id);

      const g = svg.append('g')
        .style("filter", `url(#${_id})`);

      const tick = () => {
        gen.update();
        redraw(g, gen.particles);
        // timeout[0] = window.setTimeout(tick, 1000/config.fps);
        timeout[0] = window.requestAnimFrame(tick);
      };

      tick();
      return svg.node()
    })();
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
