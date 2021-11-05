// Creo un servidor con express

const express = require('express') // importo express
const app = express() // creo una instancia de express
const port = 4000 // le asigno el puerto 4000
const root = __dirname
const fs = require('fs') // importo para la lectura de archivos
const {buscarEstudiante, obtenerEstudiantes} = require('./estudiante')
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

// Lista a los estudiantes
app.get('/estudiantes/', (req, res) => {
    console.log('GET request en /estudiantes')

    // obtengo los estudiantes del archivo json

    let estudiantes = obtenerEstudiantes()
    let listado = "<h2>Listado de estudiantes</h2>"
    listado += "<ul>"
    for (let i = 0; i < estudiantes.length; i++) {
        listado += "<li>" + estudiantes[i].nombre + " " + estudiantes[i].apellido + " -  DNI: " + estudiantes[i].dni + "</li>"
    }

    listado += "</ul>"
    res.send(listado)    
})

// Busca a un usuario con un DNI y lo escribe en pantalla
app.get('/estudiantes/:dni', (req, res) => {

    let estudiante = buscarEstudiante(req.params.dni)

    let estudianteMostrado = "<h3>" + estudiante.nombre + " " + estudiante.apellido + "</h3>"
    estudianteMostrado += "<p>DNI: " + estudiante.dni + "</p>"
    estudianteMostrado += "<p>Edad: " + estudiante.edad + "</p>"

    // res.send('Leyendo estudiante ' + req.params.dni)
    res.send(estudianteMostrado)
})

// Redirecciona a creacion de usuario
app.get('/crear_estudiantes', (req, res) => {
    console.log('GET request en /crear_estudiantes, redirecciona a crear_estudiantes')
    res.sendFile(root + '/static/crear_estudiantes.html')
})

// Procesa la creación del usuario
app.get('/crear_estudiantes_send', (req, res) => {
    
    if(Object.keys(req.query).length === 0) {
        res.end("No se enviaron datos para cargar el estudiante")
    } else {

        const estudianteNuevo = {
            dni: req.query.dni,
            nombre: req.query.nombres,
            apellido: req.query.apellidos,
            edad: req.query.edad
        }

        // Busco si existe ese DNI en la base de datos, si existe no cargo el estudiante y cierro el request

        if(buscarEstudiante(estudianteNuevo.dni) ) {
            res.end("Ese DNI ya existe en la base de datos")
        } else {
            // Levanto la base de datos, si viene vacía, a estudiantesJson la inicializo como un array vacío
            let estudiantesJson = fs.readFileSync('./estudiantes_bbdd.json', 'utf8') || []
            // creo la variable "estudiantes", si el json está vacío le asigno estudiantesJson sin parsear, lo que sería un array vacío
            let estudiantes = estudiantesJson.length > 0 ? JSON.parse(estudiantesJson) : estudiantesJson
            estudiantes.push(estudianteNuevo)
            estudiantesJson = JSON.stringify(estudiantes, null, 4)
            fs.writeFileSync('./estudiantes_bbdd.json',estudiantesJson,'utf-8')
            res.end("Estudiante cargado")
        }

    }
})