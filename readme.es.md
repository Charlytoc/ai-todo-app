# Bienvenido a este repositorio!

Mi nombre es Charly, he pasado mucho tiempo construyendo diferentes aplicaciones de IA. Hoy quiero mostrarte esta aplicación, que puedes personalizar y hacer tu propia versión.

Para comenzar a usar la aplicación localmente, sigue estos pasos:
1. Clona el repositorio:
```bash
git clone https://github.com/Charlytoc/ai-todo-app.git
```

2. Cambia el directorio:
```bash
cd ai-todo-app
```

3. Instala las dependencias:
```bash
npm install
```
4. Copia el archivo .env y agrega tus propios valores a las variables de entorno:
```bash
cp .env.example .env
```

5. Ejecuta el servidor:
```bash
npm run dev 
```
El comando dev, que puedes encontrar en el package.json, ejecuta el servidor de desarrollo tanto para el frontend como para el backend.

## ¿Cómo funciona este proyecto?
En este proyecto, utilicé diferentes tecnologías para hacerlo escalable y personalizable. El backend está construido con `Node.js` y `Express`, también utiliza `Socket.io` para que la aplicación reaccione en tiempo real. El frontend está construido con `ViteJs`, `Socket.io-client`, `Zustand`, `ReactJs` y `TypeScript`.

La aplicación es una simple lista de tareas, pero con un giro. Puedes agregar una tarea y la IA puede ayudarte a hacer un borrador de la tarea, dentro de la aplicación, una tarea es un término maleable, puede ser, por ejemplo:

* Escribir una entrada de blog
* Hacer un guion de video
* Crear un nuevo proyecto

Puede ser cualquier cosa, y la IA intentará ayudarte a hacer un borrador de la tarea, para que puedas comenzar a trabajar en ella. Además, estoy usando `prompting` para permitir que la IA comprenda una capacidad adicional que agregué: La IA puede hacerte preguntas, y puedes responderlas, para que la IA pueda entender mejor lo que quieres hacer.

Entonces, en lugar de construir un super prompt para hacer algo, la IA puede guiarte para mejorar el resultado, y siempre puedes dar más contexto.

¡Espero que lo disfrutes!

Cualquier pregunta en mi [Linkedin](https://www.linkedin.com/in/charlytoc/)