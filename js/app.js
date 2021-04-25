const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima, spinner)
});

function buscarClima(e) {
    e.preventDefault();

    // Toma los valores del formulario
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    // si estan vacios
    if(ciudad === '' || pais === '') {
        // Hubo un error
        mostrarError('Ambos campos son obligatorios');
        
        return;
    }
    // Consultar API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    
    const alerta = document.querySelector('.bg-red-100');

    // si la clase no existe crea el elemento & si existe evita que se cree
    if(!alerta) {
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center')

        alerta.innerHTML = `
            <strong class="font-bold>Error</strong>
            <span class="block">${mensaje}</span>
        `
        container.appendChild(alerta);

        // eliminar alerta
        setTimeout(() => {
            alerta.remove();
        }, 5000)
    }

};

function consultarAPI(ciudad, pais) {
    
    const appId = 'b1727540f4105a676f9a9f145b8b5fe6';
    
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    spinner(); // spinner de carga

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( datos => {
            limpiarHTML(); // limpiar html previo
        
            if(datos.cod === "404") {
                mostrarError('Ciudad no encontrada')
                return;
            }

            // imprime respuesta en html
            mostrarClima(datos);
        })
};

function mostrarClima(datos) {
    const { name, main: {temp, temp_max, temp_min} } = datos;
    
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    
    // creando elementos html
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');
    
    const tempMinima = document.createElement('div');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('text-xl');

    const tempMaxima = document.createElement('div');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    // agregando los elementos a un parent element
    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMinima);
    resultadoDiv.appendChild(tempMaxima);

    // enviando el parent element al documento 
    resultado.appendChild(resultadoDiv);
};

// pasa los valores de la API de grados kelvin a centígrados
const kelvinACentigrados = grados => parseInt(grados - 273.15);

// elimina el texto previo antes de agregar los datos
function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;
    resultado.appendChild(divSpinner);
}