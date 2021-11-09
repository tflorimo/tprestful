
const fs = require('fs') // importo para la lectura de archivos

// Recibe un DNI como parámetro y busca al estudiante en el JSON de la base de datos, retorna NULL si no lo encuentra y retorna el estudiante si lo encuentra
const buscarEstudiantePorDNI = (dni) => {
    let estudiantesCargados = fs.readFileSync('./estudiantes_bbdd.json', 'utf8') || []
    // Retorno null si estudiantesCargados no tiene datos
    if(estudiantesCargados.length == 0) return null;
    // En caso de que estudiantes cargados tenga valores dentro, la función continúa
    estudiantesCargados = JSON.parse(estudiantesCargados)
    return estudiantesCargados.find(estudiante => estudiante.dni === dni)
}

// Recibe un numero como parámetro y busca al estudiante en el JSON de la base de datos, retorna NULL si no lo encuentra y retorna el estudiante si lo encuentra
const buscarEstudiantePorId = (id) => {
    let estudiantesCargados = fs.readFileSync('./estudiantes_bbdd.json', 'utf8') || []
    // Retorno null si estudiantesCargados no tiene datos
    if(estudiantesCargados.length == 0) return null;
    // En caso de que estudiantes cargados tenga valores dentro, la función continúa
    estudiantesCargados = JSON.parse(estudiantesCargados)
    return estudiantesCargados.find(estudiante => estudiante.id == id)
}

/************   Lo de arriba debería poder resolverse con sobrecarga de funciones pero JS no lo soporta   **************/

// Lista los estudiantes del JSON
const obtenerEstudiantes = () => {
    let estudiantesCargados = fs.readFileSync('./estudiantes_bbdd.json', 'utf8')
    if(estudiantesCargados.length == 0) return null;
    return estudiantesCargados = JSON.parse(estudiantesCargados)
}

// Me fijo la cantidad de estudiantes que hay en la base de datos, para obtener el ID. El id va a ser la cantidad + 1.
// Si no hay estudiantes cargados, el id va a ser 1.
const obtenerSiguienteId = () => {
    let estudiantesCargados = fs.readFileSync('./estudiantes_bbdd.json', 'utf8')
    if(estudiantesCargados.length == 0) return 1;
    estudiantesCargados = JSON.parse(estudiantesCargados)
    return estudiantesCargados.length + 1
}

module.exports = {
    buscarEstudiantePorDNI,
    buscarEstudiantePorId,
    obtenerSiguienteId,
    obtenerEstudiantes
}