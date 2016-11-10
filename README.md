# Ascent (V 0.0.1)
Aplición educativa para ayudar a ascender a los policias (oficiales , sub-oficiales) en su carrera.

## Descarga
Para descargar en proyecto con todo el avance y ramas, necesitas bajarlo con git, desde la consola.
```
git clone https://github.com/Fernandocq16/Ascent.git
```

## Instalación
Para iniciar el proyecto, necesitamos tener instalado [NodeJs](https://nodejs.org/en/download/) v4.4.2. Versión estable para correrla en producción.
Por el momento también es necesario descargar [MongoDB](https://www.mongodb.org/), para correrlo en local.

## Start Development
En el proyecto trabajamos con tres ramas principales, en git:
- dev : rama de desarrollo
- master : rama de producción
- test : rama de pruebas, antes de lanzar a producción

El desarrollo del proyecto se trabaja sobre dev, no ejecutar sobre master ni test.

Teniendo todo listo solo corremos en una consola:
```
mongod
```
Luego en otra consola, ejecutaremos:
```
npm start
```
Este proceso corre nodejs

##Desarrollo
Para el desarrollo:
- Corrar MongoDB
```
mongod
```
- Correr Nodejs
```
npm start
```
- Construir JS en Frontend, usando ECS6
```
npm build-js
```
- Constuir JS en Backend, usando ECS6
```
npm build-node
```

## Stack Development
- Frontend
 - JavaScript
 - Angular
 - Librerias NPM (en package.json)

- Backend 
 - Nodejs
 - MongoDB
 - Librerias Npm (en package.json)
 


