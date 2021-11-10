# Trabajo Practico
Una APIREST que permite la gestion de una base de datos de estudiantes.
Permite dar de alta una persona, siempre y cuando no exista ya en la base de datos.
La persona que doy de alta debe tener un nombre, un apellido, un DNI y una edad.
Busca a todos los estudiantes registrados en la base de datos. 
Busca estudiantes por rango de edad.
Busca estudiante por su DNI. 
Modifica estudiante por su ID.
Borra estudiante por su ID. 


## Documentacion

#### RUTAS
**GET** `/estudiantes/`
Lista a los estudiantes, en formato JSON. En caso de que la lista de estudiantes esté vacía, retornará un status 404 indicando que no se encontraron estudiantes.
**GET** `/estudiantes/:dni`
Busca un estudiante por su DNI. En caso de que no se encuentre el estudiante, retornará un status 404 indicando que no se encontró el estudiante.
**GET** `/estudiantes/:edadInicial/:edadFinal`
Busca a los estudiantes por rango de edad, en formato JSON. En caso de que no se encuentre ningún estudiante, retornará un status 404 indicando que no se encontraron estudiantes en ese rango de edad.
**POST** `/estudiantes/`
Agrega un estudiante a la base de datos. En caso de que el estudiante ya exista, retornará un status 409 indicando que el estudiante ya existe.
**PATCH** `/estudiantes/:id`
Modifica un estudiante por su ID, en formato JSON. En caso de que no se encuentre el estudiante, retornará un status 404 indicando que no se encontró el estudiante. Si encuentra al estudiante, modifica el o los parametros enviados.
**DELETE** `/estudiantes/:id`
Borra un estudiante por su ID. En caso de que no se encuentre el estudiante, retornará un status 404 indicando que no se encontró el estudiante.

****

##### Git Ignore
Excluye la carpeta node_modules.

****

#### Setup
Se espera que estudiantes_bbdd.json sea inicializado con "[]" sin comillas

****
#### Uso
El programa tiene dos formas de inicialiarse:

- La primera es con npm run start para iniciarlo normalmente, o bien,
- La segunda manera, es con nodemon, para que el programa se reinicie con cada cambio. Para ello usamos npm run startNodemon