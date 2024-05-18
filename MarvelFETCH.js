async function buscarComics() {
  const apiKey = 'ff84a307bf8a1a1e7ad51f0ef7c44e8a';
  const ts = '1';
  const hash = 'f747b8341caa98c782207ab72203a7a0';
  const urlBase = 'https://gateway.marvel.com:443/v1/public/comics';
  const nombreSuperheroe = document.getElementById('superhero').value;
  const url = `${urlBase}?titleStartsWith=${nombreSuperheroe}&ts=${ts}&apikey=${apiKey}&hash=${hash}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200) {
      const comics = data.data.results;
      // const promesas = comics.map(comic => {
      //   const personajesUrl = comic.characters.collectionURI + `?ts=${ts}&apikey=${apiKey}&hash=${hash}`;
      //   const personajesPromise = fetch(personajesUrl).then(response => response.json());
        
      //   const creadoresUrl = comic.creators.collectionURI + `?ts=${ts}&apikey=${apiKey}&hash=${hash}`;
      //   const creadoresPromise = fetch(creadoresUrl).then(response => response.json());

      //   return Promise.all([personajesPromise, creadoresPromise]);
      // });
      // const promesas2 = comics.map(comic => fetch(comic.characters.collectionURI + `?ts=${ts}&apikey=${apiKey}&hash=${hash}`));
      // const respuesta = await Promise.race(promesas);
      // const personajes = await respuesta.json();

      // const nombresPersonajes = personajes.data.results.map(personaje => personaje.name).join(', ');

      const lista = document.createElement('div');
      lista.classList.add('lista-comics');
      comics.forEach((comic, index) => {
        const item = document.createElement('div');
        item.classList.add('item-comic');
        if (comic.thumbnail.path === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
          item.innerHTML = `
            <h3 class="comic-title">${comic.title}</h3>
            <img class="comic-image" src="https://e0.pxfuel.com/wallpapers/736/189/desktop-wallpaper-marvel-logo-vertical-marvel.jpg" alt="${comic.title}" />
          `;
        } else {
          item.innerHTML = `
            <h3 class="comic-title">${comic.title}</h3>
            <img class="comic-image" src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}" />
          `;
        }

        item.addEventListener('click', async () => {
          const respuesta = await fetch(comic.characters.collectionURI + `?ts=${ts}&apikey=${apiKey}&hash=${hash}`);
          const personajes = respuesta.data.results;
          const nombresPersonajes = personajes.map(personaje => personaje.name).join(', ');
          const creadoresUrl = comic.creators.collectionURI + `?ts=${ts}&apikey=${apiKey}&hash=${hash}`;
          const creadoresPromise = fetch(creadoresUrl).then(response => response.json());
          const creadores = await creadoresPromise;
          const nombresCreadores = creadores.data.results.map(creador => `${creador.firstName} ${creador.lastName}`).join(', ');
          const menuLateral = document.getElementById('menu-lateral');
          menuLateral.classList.add('menu-lateral-abierto');
          document.getElementById('titulo-comic').innerHTML = comic.title;
          if (comic.thumbnail.path === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
            document.getElementById('imagen-comic').src = 'https://e0.pxfuel.com/wallpapers/736/189/desktop-wallpaper-marvel-logo-vertical-marvel.jpg';
          } else {
          document.getElementById('imagen-comic').src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
          }
          document.getElementById('descripcion-comic').innerHTML = comic.description;
          document.getElementById('creadores-comic').innerHTML = nombresCreadores;
          console.log(nombresPersonajes)
          document.getElementById('personajes-comic').innerHTML = nombresPersonajes;
        });
        lista.appendChild(item);
      });
      document.getElementById('resultados').innerHTML = '';
      document.getElementById('resultados').appendChild(lista);
    } else {
      document.getElementById('resultados').innerHTML = `Error: ${data.code} - ${data.status}`;
    }
  } catch (error) {
    console.error(error);
    document.getElementById('resultados').innerHTML = 'Ha habido un error en la búsqueda';
  }
}

function cerrarMenu() {
  const menuLateral = document.getElementById('menu-lateral');
  menuLateral.classList.remove('menu-lateral-abierto');
}