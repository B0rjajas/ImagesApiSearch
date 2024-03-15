const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const registroPagina = 4;
let totalPaginas;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

const validarFormulario = (e) => {
    e.preventDefault();
    const busquedaInput = document.querySelector('#text-input').value;
    if (busquedaInput === "") {
        mostrarAlerta('El campo está vacío');
        return;
    };
    buscarImagenes(busquedaInput);
};

const mostrarAlerta = (mensaje) => {
    const alertaExist = document.querySelector('.bg-red-100');
    if (!alertaExist) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'rounded',
            'px-4', 'py-3', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong class="font-bold">Error</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }
};

const buscarImagenes = (termino) => {
    const key = "42853146-0bf73469a4883024f5b6bc385";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPagina}&page=${paginaActual}`;
    fetch(url)
        .then(data => data.json())
        .then(respuesta => {
            totalPaginas = calcularPaginas(respuesta.totalHits);
            mostrarImages(respuesta.hits);
        })
        .catch(error => {
            console.error('Error al obtener imágenes:', error);
        });
};

const mostrarImages = (arrayImages) => {
    resultado.innerHTML = '';
    arrayImages.forEach(image => {
        const { previewURL, likes, views, largeImageURL } = image;
        resultado.innerHTML += `
            <div class="mx-auto w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <img class="w-full" src="${previewURL}" alt="Imagen">
                <div class="px-6 py-4">
                    <p class="text-gray-700 text-base">Likes: ${likes}</p>
                    <p class="text-gray-700 text-base">Views: ${views}</p>
                </div>
                <div class="px-6 pt-4 pb-2">
                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank">Ver imagen grande</a>
                </div>
            </div>
        `;
    });
    paginacionDiv.innerHTML = '';
    if (arrayImages.length > registroPagina) {
        mostrarAlerta('Limitado por carga de datos');
    } else {
        mostrarAlerta('No hay muchas imágenes');
    }
    imprimirPaginador();
};

const calcularPaginas = (total) => {
    return Math.ceil(total / registroPagina);
};

const imprimirPaginador = () => {
    const limitePaginacion = 5; // Limite de botones de paginación mostrados
    const inicio = Math.max(1, paginaActual - Math.floor(limitePaginacion / 2));
    const fin = Math.min(totalPaginas, inicio + limitePaginacion - 1);

    for (let i = inicio; i <= fin; i++) {
        const boton = document.createElement('a');
        boton.href = '#';
        boton.textContent = i;
        boton.classList.add('paginacion-btn', 'bg-yellow-400', 'px-4',
            'py-1', 'mr-2', 'font-bold', 'rounded');
        if (i === paginaActual) {
            boton.classList.add('pagina-actual');
        }
        boton.onclick = () => {
            paginaActual = i;
            buscarImagenes(document.querySelector('#text-input').value);
        };
        paginacionDiv.appendChild(boton);
    }
};
