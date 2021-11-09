// Creo un servidor con express

const express = require('express') // importo express
const app = express() // creo una instancia de express
const port = 4000 // le asigno el puerto 4000
const root = __dirname
const fs = require('fs') // importo para la lectura de archivos
const {buscarEstudiantePorDNI, buscarEstudiantePorId, obtenerEstudiantes, obtenerSiguienteId} = require('./estudiante')
app.use(express.static('static')) // le digo a express que use la carpeta static

// inicializo el servidor con el puerto y escribo en consola que el servidor esta corriendo
app.listen(port, () => {
    console.log('Servidor inicializado en el puerto ' + port)
})

// necesario para funcione el formulario html
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// le digo a express que use el metodo get para obtener una ruta default para hacer pruebas
app.get('/', (req, res) => {
    console.log('GET request en /, usuario accede a index')
    res.sendFile(root + '/static/index.html')
})

// Lista a los estudiantes, si no hay estudiantes devuelve un response 204
app.get('/estudiantes/', (req, res) => {
    console.log('GET request en /estudiantes, se deben listar los estudiantes')

    // obtengo los estudiantes del archivo json

    let estudiantes = obtenerEstudiantes()
    let listado = "<h2>Listado de estudiantes</h2>"
    listado += "<ul>"
    for (let i = 0; i < estudiantes.length; i++) {
        listado += "<li>" + estudiantes[i].id + ") " + estudiantes[i].nombre + " " + estudiantes[i].apellido + " -  DNI: " + estudiantes[i].dni + " - Edad: " + estudiantes[i].edad + "</li>"
    }
    listado += "</ul>"

    if(estudiantes.length > 0) {
        res.status(200).send(listado)    
    } else {
        //Podría enviar 404 de "no se encontraron estudiantes" pero en realidad, la ruta existe, por ende no hace falta enviar un 404, con 204 de "no hay contenido" es suficiente
        res.status(204).send("No hay estudiantes")
    }

})

// Busca a un usuario con un DNI y lo escribe en pantalla, si no lo encuentra, responde un error 404 indicando que no se encontró lo buscado
app.get('/estudiantes/:dni', (req, res) => {
    console.log('GET request en /estudiantes/:dni, se debe buscar un estudiante')
    
    if(estudiante = buscarEstudiantePorDNI(req.params.dni)){
        let estudianteMostrado = "<h3>" + estudiante.nombre + " " + estudiante.apellido + "</h3>"
        estudianteMostrado += "<p>DNI: " + estudiante.dni + "</p>"
        estudianteMostrado += "<p>Edad: " + estudiante.edad + "</p>"
        res.status(200).send(estudianteMostrado)
    } else {
        res.status(404).send("No se encontró un estudiante con DNI " + req.params.dni)
    }

})

// Redirecciona a creacion de usuario
app.get('/crear_estudiantes', (req, res) => {
    console.log('GET request en /crear_estudiantes, redirecciona a crear_estudiantes')
    res.sendFile(root + '/static/crear_estudiantes.html')
})

// Procesa la creación del usuario
app.get('/crear_estudiantes_send', (req, res) => {
    console.log("GET request en crear_estudiantes_send, backend de creación de estudiante")
    if(Object.keys(req.query).length === 0) {
        res.status(204).send("No se enviaron datos para cargar el estudiante") // envia el status 204 de no hay contenido
    } else {

        const estudianteNuevo = {
            id: obtenerSiguienteId(),
            dni: req.query.dni,
            nombre: req.query.nombres,
            apellido: req.query.apellidos,
            edad: req.query.edad
        }
        // Busco si existe ese DNI en la base de datos, si existe no cargo el estudiante y cierro el request

        if(buscarEstudiantePorDNI(estudianteNuevo.dni) ) {
            res.end("Ese DNI ya existe en la base de datos")
        } else {
            // Levanto la base de datos, si viene vacía, a estudiantesJson la inicializo como un array vacío
            let estudiantesJson = fs.readFileSync('./estudiantes_bbdd.json', 'utf8') || []
            // creo la variable "estudiantes", si el json está vacío le asigno estudiantesJson sin parsear, lo que sería un array vacío
            let estudiantes = estudiantesJson.length > 0 ? JSON.parse(estudiantesJson) : estudiantesJson
            estudiantes.push(estudianteNuevo)
            estudiantesJson = JSON.stringify(estudiantes, null, 4)
            fs.writeFileSync('./estudiantes_bbdd.json',estudiantesJson,'utf-8')
            res.status(200).send("Estudiante cargado")
        }

    }
})

// Modifica el estudiante segun su ID recibiendo los parámetros por get
app.get('/modificar_estudiante/:id', (req, res) => {
    console.log('GET request en /modificar_estudiante/:id, backend de modificacion de estudiante')

    if(req.params.id === null) {
        res.status(204).send("No se recibió el ID del estudiante a modificar") // envia el status 204 de no hay contenido
    } else { 
        // si encuentra al estudiante, modifica solo los valores que recibe por get
        if(estudiante = buscarEstudiantePorId(req.params.id)) {
            // formato: valor = valor que llega || valor original, evalúa el valor que llega para ver si existe, en caso de que exista se lo asigna.
            // el ID no lo modifico
            estudiante.dni = req.query.dni || estudiante.dni
            estudiante.nombre = req.query.nombre || estudiante.nombre
            estudiante.apellido = req.query.apellido || estudiante.apellido
            estudiante.edad = req.query.edad || estudiante.edad
        }

        // actualiza el archivo json con el estudiante modificado
        // para ello debe leer el archivo, buscar el estudiante por ID y modificarlo
        let estudiantes = obtenerEstudiantes()

        for(let i = 0; i < estudiantes.length; i++) {
            // si encuentro el estudiante con la id que estoy modificando, lo pisa con el "nuevo que acabo de crear"
            if(estudiantes[i].id == req.params.id) {
                estudiantes[i] = estudiante
            }
        }

        // actualizo el archivo json con el estudiante modificado
        estudiantesJson = JSON.stringify(estudiantes, null, 4)
        fs.writeFileSync('./estudiantes_bbdd.json',estudiantesJson,'utf-8')

        res.status(200).send("Estudiante modificado")

    }

})

// Si encuentra el estudiante lo saca del json, luego vuelve a guardar el json, sin el estudiante
app.get('/borrar_estudiante/:id', (req, res) => {
    console.log('GET request en /borrar_estudiante/:id, backend de borrado de estudiante')

    if(req.params.id == null) {
        res.status(204).send("No se recibió el ID del estudiante a borrar") // envia el status 204 de no hay contenido
    } else { 
        // si encuentra al estudiante, lo saca del json
        if(estudiante = buscarEstudiantePorId(req.params.id)) {
            let estudiantes = obtenerEstudiantes()
            for(let i = 0; i < estudiantes.length; i++) {
                // si encuentro el estudiante con la id que estoy modificando, lo saca del array en la posición i (en la que está)
                if(estudiantes[i].id == estudiante.id) {
                    estudiantes.splice(i, 1)
                }
            }
            // actualizo el archivo json con la lista de estudiantes sin el estudiante borrado
            estudiantesJson = JSON.stringify(estudiantes, null, 4)
            fs.writeFileSync('./estudiantes_bbdd.json',estudiantesJson,'utf-8')
            res.status(200).send("Estudiante eliminado") // envia el status 200 de OK
        }
    }
})

// Solo lista a los estudiantes cuya edad se encuentre entre edadInicial y edadFinal
app.get('/estudiantes/:edadInicial/:edadFinal', (req, res) => {

    if(req.params.edadInicial === null || req.params.edadFinal === null) {
        res.status(204).send("No se recibió la edad inicial o final")
    } else {

        let estudiantes = obtenerEstudiantes()

        let estudiantesFiltrados = estudiantes.filter(estudiante => {
            return estudiante.edad >= req.params.edadInicial && estudiante.edad <= req.params.edadFinal
        })

        let listado = "<h2>Estudiantes entre " + req.params.edadInicial + " y " + req.params.edadFinal + " años </h2>"
        listado += "<ul>"
        for (let i = 0; i < estudiantesFiltrados.length; i++) {
            listado += "<li>" + estudiantesFiltrados[i].id + ") " + estudiantesFiltrados[i].nombre + " " + estudiantesFiltrados[i].apellido + " -  DNI: " + estudiantesFiltrados[i].dni + " - Edad:" + estudiantesFiltrados[i].edad + "</li>"
        }

        listado += "</ul>"
        res.status(200).send(listado)  

    }


})