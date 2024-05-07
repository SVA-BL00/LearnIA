# LearnIA
Learn-IA es un recurso complementario a las clases, ofreciendo a los estudiantes la posibilidad de repasar, profundizar e incluso adelantarse en los temas de sus cursos. Learn-IA permite que los estudiantes progresen a su ritmo, consoliden los temas abordados en cada curso y reduzcan la heterogeneidad de los grupos de estudiantes mediante el uso de una herramienta personalizada para la educación. 

## Para correr la aplicación

1. Después de clonar el repositorio, entra a la carpeta de LearnIA
```
cd LearnIA
```
Se debería de ver una organización así
```
C:\Users\John\Documents\Code\LearnIA\LearnIA>
```
En esta dirección podrás correr los comandos de npm en caso de necesitar importar algo, así como toda la aplicación.

2. Correr la aplicación
```
npm run dev
```
## Para hacer commit
Como el .gitignore se encuentra afuera de la carpeta de `LearnIA`, para hacer commit correctamente se necesita **salir** de la carpeta.
1. Apagar todos los procesos (ctrl + c)
```
C:\Users\John\Documents\Code\LearnIA\LearnIA>^C
```
2. Salir de la carpeta `LearnIA`
```
cd ..
```
3. Hacer una nueva branch
```
git checkout -b <issue>
```
4. Agregar todos los cambios
```
git add .
```
4. Agregar mensaje de commit
```
git commit -m "Mensaje"
```
5. Push del branch local al remoto
```
git push --set-upstream origin <issue>
```
## Procesos para testear el código (pruebas estáticas)
Es importante que los siguientes comandos se realicen cuando sea pertinente y *antes* de realizar un commit, para mantener el formato y corregir errores.
### Proceso de lint
```
npm run lint
```
### Proceso de formateo
```
npm run format
```
## Procesos para testear el código (pruebas dinámicas)
LearnIA hace uso de Playwright para los tests E2E y Vitest para los unit tests.
### Proceso de tests E2E
**WIP**
### Proceso de unit tests
***WIP***
