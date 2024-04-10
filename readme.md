# Welcome to this repo!
My name is Charly, I;ve spend a lot of time building different AI applications. Today I want to show you this app, that you can customize and make your own version.

To start using the app locally, follow these steps:
1. Clone the repository:
```bash
git clone https://github.com/Charlytoc/ai-todo-app.git
```

2. Change the directory:
```bash
cd ai-todo-app
```

3. Install the dependencies:
```bash
npm install
```
4. Copy the .env file and add your own values to the environment variables:
```bash
cp .env.example .env
```

5. Run the server:
```bash
npm run dev 
```
The dev command, that you can find in the package.json, run the development server for both, the frontend and the backend servers.


## How this project works?
In this project, I used some different technologies to make it scalable and customizable. The backend is built with `Node.js `and `Express`, it also uses `Socket.io` to make the app react in real-time. The frontend is built with `ViteJs`, `Socket.io-client`, `Zustand`, `ReactJs` and `TypeScript`.

The app is a simple todo app, but with a twist. You can add a task and the AI can help you make a draft of the todo, within the app, a todo is a maleable term, it can be, for example:

* Write a blog post
* Make a video script
* Create a new project

It can be anything, and the AI will try to help you make a draft of the todo, so you can start working on it. Also, I using `prompting` to let the AI understand an extra capability I added: The AI can ask you questions, and you can answer them, so the AI can understand better what you want to do.

So, instead of building a super prompt to make something, the AI can guide you to improve the result, and you can always give more context to it.

I hope you enjoy it!

Any questions in my [Linkedin](https://www.linkedin.com/in/charlytoc/)