const express = require('express');
const app = express();
const port = 3000;
let max = -1;
const min = 1;
const numerosCarton = 10;
let cartones = []
let numerosSacados = []
let ganadores = []

app.use(express.json());

function NumeroAleatorio(){
    return Math.floor(Math.random() * (max - min)) + 1;
}

function NumeroAleatorio(maximo){
    return Math.floor(Math.random() * (maximo));
}

function crearCartones(num){
    let funciono = -1, numAleatorio, a, cantidad;
    for (let i = 0; i < num; i++) {
        let carton = {
            id: i,
            nombre: null,
            valores: [],
        }
        a = 0
        while(a < numerosCarton) {
            numAleatorio = NumeroAleatorio()
            b = 0
            while(b < i){ // Este while verifica que el numero aleatorio no este ya en el carton
                if(cartones[i].valores[b] == numAleatorio){
                    b = i + 1
                }
                b++
            }
            if(b != i+2){ // si el numero aleatorio no esta en el carton, lo agrega, en caso contrario no hace nada
                carton.valores.push(numAleatorio)
                a++
            }
        }
        cartones.push(carton)
    }
    cantidad = cartones[NumeroAleatorio(num)].valores.length // linea para verificar que la funcion funcione correctamente
    if(cantidad != numerosCarton){
        funciono = 1 // ERROR CODE 1
    }
    return funciono;
}

function iniciarJuego(num){
    if(max == -1){
        max = 99
    }
    let funciono = crearCartones(num);
    return funciono;
}


function obtenerCarton(nombre){
    let faltaEncontrar = true, cartonRandom;
    while(faltaEncontrar){ //busca un carton al azar el cual no pertenezca a ninguna persona
        cartonRandom = NumeroAleatorio(cartones.length);
        if(cartones[cartonRandom].nombre == null){
            faltaEncontrar = false;
        }
    }
    cartones[cartonRandom].nombre = nombre
    return cartones[cartonRandom].valores;
}

function devolverCartones(url){
    if(url == ""){
        return cartones
    }
    else if(url > cartones.length){
        return -1
    }
    else{
        return cartones[url]
    }
}

function sacarNumero(num){
    let numeroRandom, igual
    for(let i = 0; i<num; i++){
        igual = true
        while(igual){ // verifica que el numero sacado no haya salido todavia
            numeroRandom = NumeroAleatorio()
            for(let a = 0; a < numerosSacados.length; a++){ 
                if(numeroRandom == numerosSacados[a]){
                    a = numerosSacados.length + 1
                }
            }
            if(a != (numerosSacados.length + 1)) {
                igual = false
                numerosSacados.push(numeroRandom)
            }
        }
        for(let a = 0; a < cartones.length; a++){ // borra de los cartones el numero que salio
            for(let b = 0; b < cartones[a].length; b++){
                if(cartones[a].valores[b] == numeroRandom){
                    // borrar ese valor
                }
            }
        }
    }
    for(let i = 0; i<cartones.length; i++){
        if(cartones[i].valores.length == 0){
            ganadores.push[cartones[i].id] // agrega el id del carton ganador al array de ganadores
        }
    }
    return numeroRandom
}

function anunciarGanador(){
    let cantGanadores = ganadores.length, ganadoresHumanos = [], ganador
    for(let i = 0; i<cantGanadores; i++){
        if(cartones[ganadores[i]].nombre != null){
            ganadoresHumanos.push(ganadores[i])
        }
    }
    if(ganadoresHumanos.length > 0){
        ganadorAleatorio = NumeroAleatorio(ganadores.length)
        return ("El/la ganador/a del bingo es: " + cartones[ganadoresHumanos[ganadorAleatorio]].nombre + " cuyo id de carton es: " + cartones[ganadoresHumanos[ganadorAleatorio]].id)
    }
    else{
        return ("El premio quedo vacante, juegue de nuevo para ver quien gana. id del carton ganador: " + cartones[ganadores[0]])
    }
}

app.post('/numero_aleatorio', (req, res)=>{
    console.log(req.body.numero);
    max = req.body.max
    let num = NumeroAleatorio();
    res.send(num);
})

app.post('/iniciar_Juego', (req, res)=>{
    console.log(req.body.cantCartones);    
    let y = iniciarJuego(req.body.cantCartones);
    if(y == -1){
        res.send("El juego se inicio correctamente")
    }
    else{
        res.send("ERROR code: " + y)
    }
})

app.get('/obtener_Carton', (req, res)=>{
    console.log(req.body.nombre);
    let nombre = req.body.nombre; 
    let numerosEnCarton = obtenerCarton(nombre);    
    res.send(numerosEnCarton);
})

app.get('/cartones', (req, res)=>{
    console.log(req.body.url);
    let url = req.body.url;
    let cartonesAMostrar = devolverCartones(url)
    if(cartonesAMostrar == -1){
        res.send("Debe enviar un numero entre 0 y " + cartones.length)
    }
    else{

    }
    res.send(cartonesAMostrar);
})

app.get('/sacar_numero', (req, res)=>{
    let numerosASacar = req.body.numerosASacar
    let numeroSacado = sacarNumero(numerosASacar);
    if(ganadores.length == 0){ // Verifica que no haya ningun ganador
        res.send(numeroSacado);
    }
    else{
        mensajeGanador = anunciarGanador()
        res.send(mensajeGanador)
    }
})


app.listen(port, () => {
    console.log(`example app listening on port ${port}`)
});

/*

Valores por default:
    max: 00
    min: 1
    port: 3000
    numerosCarton: 10

Aclaraciones:
    A lo largo del codigo puede haber algunos comentarios con "ERROR CODE", es para que se puedan buscar facilmente

Explicacion corta de como funcionan las funciones (los numeros son los mismos que los de la consigna)
    1) Recibe un numero maximo y busca un random dentro de este rango
    2) Crea los cartones y crea un numero maximo de numeros para los cartones si no fue anteriormente creado. Los cartones son publicos
    3) El programa busca un carton random que no este ocupado por otro jugador y luego le asigna el nombre ingresado por el usuario para luego mostrarle 
    los numeros de su carton
    4) Se fija que la url sea valida y, si lo es, devuelve lo pedido en la consigna
    5) Consigue un numero aleatorio (o la cantidad que haya ingresado el usuario) que no haya salido antes y lo elimina de todos los cartones
    que lo contengan. Luego, verifica si no hay ganadores; en este caso muestra el/los numero/s que salio/salieron. En caso contrario, guarda el id
    de el/los carton/es ganador/es. Acto seguido, verifica si hay ganadores humanos y en caso que haya mas de 1, elije el ganador al azar. Si no hay
    ganadores humanos envia el primer carton ganador de la computadora

*/