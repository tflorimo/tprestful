// Creo un servidor con express

const express = require('express') // importo express
const app = express() // creo una instancia de express
const port = 4000 // le asigno el puerto 4000
const root = __dirname
const fs = require('fs') // importo para la lectura de archivos
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
    res.sendFile(root + '/static/estudiantes.html')
})

// Busca a un usuario con un DNI
app.get('/estudiantes/:dni', (req, res) => {
    console.log('GET request en /estudiantes/:dni, redireccion a editUser')
    res.send('Leyendo estudiante ' + req.params.dni)
})

// Redirecciona a creacion de usuario
app.get('/crear_estudiantes', (req, res) => {
    console.log('GET request en /crear_estudiantes, redirecciona a crear_estudiantes')
    res.sendFile(root + '/static/crear_estudiantes.html')
})

// Redirecciona a creacion de usuario
app.get('/crear_estudiantes_send', (req, res) => {
    if(Object.keys(req.query).length === 0) {
        console.log('No se recibieron parametros a la hora de crear un estudiante')
        res.get('/crear_estudiantes?nodata=1')
    } else {

        console.log('Recibo datos del formulario')

        const estudianteNuevo = {
            dni: req.query.dni,
            nombre: req.query.nombres,
            apellido: req.query.apellidos,
            edad: req.query.edad
        }
        fs.writeFileSync('./estudiantes_bbdd.json', JSON.stringify(estudianteNuevo, 'utf8', 2), {
            flag: 'a' // con este flag no piso el archivo
        })
        res.end('Estudiante creado')
    }
})