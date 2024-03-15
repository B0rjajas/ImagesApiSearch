const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registroPagina = 4;
let totalPaginas; 

let iterador;



window.onload = () =>{
    formulario.addEventListener('submit', validarFormulario);
}




function validarFormulario(e){
    e.preventDefault() 
    //console.log('funsiona')
    const busquedaInput = document.querySelector('#text-input').value;

    if(busquedaInput === ""){
        mostrarAlerta('el campo esta vacio');
        return;
    };

    buscarImagenes(); 
    
};


//MOstrar ALerta
function mostrarAlerta(mensaje){

        const alertaExist = document.querySelector('.bg-red-100');

        if(!alertaExist){
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700','rounder',
        'px-4', 'py-3', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        
        //alerta.textContent = mensaje;
        alerta.innerHTML = `
            <strong class="font-bold">Error</strong>
            <span class="block sm:inline">${mensaje}</span>
        
        `;
        formulario.appendChild(alerta);

        setTimeout(()=> {
            alerta.remove();
        },2000)

        }

        

}

function buscarImagenes(termino) {
    const key = "42853146-0bf73469a4883024f5b6bc385";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPagina}`; // Agregar & antes de per_page

    console.log(url);

    fetch(url)
        .then(data => data.json())
        .then(respuesta => {
            totalPaginas = calcularPaginas(respuesta.totalHits);
            mostrarImages(respuesta.hits);
        })
        .catch(error => {
            console.error('Error al obtener imágenes:', error);
        });
}


//Generador funcion con ASterisco

function *crearPaginador(total){
    for(let i = 1; i<= total; i++){
        yield i;
    }
}



function mostrarImages(arrayImages) {
    // Limpiar el contenido previo de resultado
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el array de imágenes y construir el HTML
    arrayImages.forEach(imagesId => {
        const { previewURL, likes, views, largeImageURL } = imagesId;
        resultado.innerHTML += `
            <div class="mx-auto w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <img class="w-full" src="${previewURL}" alt="Imagen">
                <div class="px-6 py-4">
                    <p class="text-gray-700 text-base">Likes: ${likes}</p>
                    <p class="text-gray-700 text-base">Views: ${views}</p>
                </div>
                <div class="px-6 pt-4 pb-2">
                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" class="text-indigo-600 hover:text-indigo-900">Ver imagen grande</a>
                </div>
            </div>
        `;
    });

    //Limpiar el paginador pevio
    while(paginacionDiv.firstChild){
        paginacionDiv.replaceChild(paginacionDiv.firstChild);
    }

    //Limitra BUsqueda
    limitarBusqueda(arrayImages);

    imprimirPaginador();
    
}



function limitarBusqueda(arrayImages){
    const cantidad = arrayImages.length;
    if(cantidad > registroPagina){
        mostrarAlerta('Limitado por Cargar de datos')
    }else{
        mostrarAlerta('No hay mucha imegenes')
    }

    
}

function calcularPaginas(total){
    return parseInt(Math.ceil( total / registroPagina));
}

function imprimirPaginador(){
     //Iterador/Generador
     iterador = crearPaginador(totalPaginas);
     while(true){
        const { value, done } = iterador.next();
        if(done) return;


        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4',
        'py-1', 'mr-2', 'font-bold', 'mb-10', 'uppercase', 'rounded')


        paginacionDiv.appendChild(boton);
    }
}

