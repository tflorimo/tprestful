// Creo un servidor con express

const express = require('express') // importo express
const app = express() // creo una instancia de express
const port = 4000 // le asigno el puerto 4000
const root = __dirname
app.use(express.static('static')) // le digo a express que use la carpeta static

// inicializo el servidor con el puerto y escribo en consola que el servidor esta corriendo
app.listen(port, () => {
    console.log('Servidor inicializado en el puerto ' + port)
})

// le digo a express que use el metodo get para obtener una ruta default para hacer pruebas
app.get('/', (req, res) => {
    console.log('GET request en /, usuario accede a index')
    res.sendFile(root + '/static/index.html')
})

// Lista a los usuarios
app.get('/usuarios/', (req, res) => {
    console.log('GET request en /usuarios')
    res.sendFile(root + '/static/usuarios.html')
})

// Busca a un usuario con un DNI
app.get('/usuarios/:dni', (req, res) => {
    console.log('GET request en /usuarios/:dni, redireccion a editUser')
    res.send('Editando ' + req.params.dni)
})

// Redirecciona a creacion de usuario
app.get('/crear_usuarios', (req, res) => {
    console.log('GET request en /crear_usuarios, redirecciona a crear_usuarios')
    res.send('Creando usuario')
})