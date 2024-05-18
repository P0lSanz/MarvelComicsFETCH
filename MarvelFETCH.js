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

      const lista = document.createElement('div');
      lista.classList.add('lista-comics');
      comics.forEach((comic, index) => {
        const item = document.createElement('div');
        item.classList.add('item-comic');
        const imageUrl = (comic.thumbnail.path === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available')
          ? 'https://e0.pxfuel.com/wallpapers/736/189/desktop-wallpaper-marvel-logo-vertical-marvel.jpg'
          : `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
        
        item.innerHTML = `
          <h3 class="comic-title">${comic.title}</h3>
          <img class="comic-image" src="${imageUrl}" alt="${comic.title}" />
        `;

        item.addEventListener('click', async () => {
          try {
            const personajesUrl = comic.characters.collectionURI.replace('http:', 'https:') + `?ts=${ts}&apikey=${apiKey}&hash=${hash}`;
            const creadoresUrl = comic.creators.collectionURI.replace('http:', 'https:') + `?ts=${ts}&apikey=${apiKey}&hash=${hash}`;

            const [personajesResponse, creadoresResponse] = await Promise.all([
              fetch(personajesUrl).then(res => res.json()),
              fetch(creadoresUrl).then(res => res.json())
            ]);

            const nombresPersonajes = personajesResponse.data.results.map(personaje => personaje.name).join(', ');
            const nombresCreadores = creadoresResponse.data.results.map(creador => `${creador.firstName} ${creador.lastName}`).join(', ');

            const menuLateral = document.getElementById('menu-lateral');
            menuLateral.classList.add('menu-lateral-abierto');
            document.getElementById('titulo-comic').innerHTML = comic.title;
            document.getElementById('imagen-comic').src = imageUrl;
            document.getElementById('descripcion-comic').innerHTML = comic.description || 'No description available.';
            document.getElementById('creadores-comic').innerHTML = nombresCreadores || 'No creators available.';
            document.getElementById('personajes-comic').innerHTML = nombresPersonajes || 'No characters available.';
          } catch (error) {
            console.error('Failed to fetch additional comic information:', error);
          }
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
