
const fs = require('fs') // importo para la lectura de archivos

// Recibe un DNI como parámetro y busca al estudiante en el JSON de la base de datos, retorna NULL si no lo encuentra y retorna el
const buscarEstudiante = (dni) => {
    let estudiantesCargados = fs.readFileSync('./estudiantes_bbdd.json', 'utf8')
    // Retorno null si estudiantesCargados no tiene datos
    if(estudiantesCargados.length == 0) return null;
    // En caso de que estudiantes cargados tenga valores dentro, la función continúa
    estudiantesCargados = JSON.parse(estudiantesCargados)
    return estudiantesCargados.find(estudiante => estudiante.dni === dni)
}


// Lista los estudiantes del JSON

const obtenerEstudiantes = () => {

    let estudiantesCargados = fs.readFileSync('./estudiantes_bbdd.json', 'utf8')
    if(estudiantesCargados.length == 0) return null;

    return estudiantesCargados = JSON.parse(estudiantesCargados)
}


module.exports = {
    buscarEstudiante,
    obtenerEstudiantes
}