// Creo un servidor con express

const express = require('express') // importo express
const app = express() // creo una instancia de express
const port = 4000 // le asigno el puerto 4000
const root = __dirname
app.use(express.static('static')) // le digo a express que use la carpeta static

// inicializo el servidor con el puerto y escribo en consola que el servidor esta corriendo
const servidor = app.listen(port, () => {
    console.log('Servidor inicializado en el puerto ' + port)
})

// le digo a express que use el metodo get para obtener una ruta default para hacer pruebas
app.get('/', (req, res) => {
    console.log('GET request en /, usuario accede a index')
    res.sendFile(root + '/static/usuarios.html')
})

app.get('/usuarios/', (req, res) => {
    console.log('GET request en /usuarios')
    res.sendFile(root + '/static/usuarios.html')
})

app.get('/usuarios/:id', (req, res) => {
    console.log('GET request en /usuarios/ CON PARAMETRO ' + req.params.id)
    res.send("llega un request con el id " + req.params.id)
    // res.sendFile(' /static/usuarios.html')
})
