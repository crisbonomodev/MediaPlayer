const VERSION_CACHE = 'v1';
//self es un this especifico para service workers
//el evento install se ejecutara cuando el sw sea instalado.
self.addEventListener('install',event => {
    event.waitUntil(precache())
})
//ahora agregamos un event listener para que capture los fetch y busque en el cache
self.addEventListener('fetch', event => {
    //traemos la peticion
    const request = event.request;
    //Si el metodo no es un GET, que siga su curso online
    if(request.method != 'GET') {
        return;
    }
    //buscar en cache
    event.respondWith(cachedResponse(request));

    //actualizar el cache para evitar que el usuario mantenga copias viejas
    event.waitUntil(updateCache(request));
})

async function precache() {
    //vamos a usar una API del DOM para caches, y abrimos un cache especifico. Esta es una funcion asincrona
    //que devuelve una promesa, asi que usamos async/await
    const cache = await caches.open(VERSION_CACHE);
    //una vez realizada, agregamos los componentes
    return cache.addAll([
       /*  '/',
        '/index.html',
        '/assets/index.js',
        '/assets/MediaPlayer.js',
        '/assets/plugins/AutoPlay.js',
        '/assets/plugins/AutoPause.js',
        '/assets/index.css',
        '/assets/BigBuckBunny.mp4', */
    ])
}

//funcion para buscar en cache
async function cachedResponse(request) {
    //traemos el cache
    const cache = await caches.open(VERSION_CACHE);
    //verificamos si ya tenemos una copia del cache
    const response = await cache.match(request);
    //devolvemos la respuesta, o, si es undefined, devolvemos un pedido de fetch del request
    return response || fetch(request);
}

async function updateCache(request) {
    //traemos el cache
    const cache = await caches.open(VERSION_CACHE);
    //pedimos una version actualizada
    const response = await fetch(request);
    //la insertamos en el request
    return cache.put(request, response);
}

