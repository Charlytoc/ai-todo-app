import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Todos from "./routes/Todos.tsx";
import Document from "./routes/Document.tsx";
import { loader as documentLoader } from "./routes/Document.tsx";
import { Toaster } from "react-hot-toast";
import { useStore } from "./utils/store.tsx";

const Listener = () => {
  const { setListeners } = useStore((state) => ({
    setListeners: state.setListeners,
  }));
  setListeners();
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/todos",
    element: <Todos />,
  },
  {
    path: "/todos/:id",
    element: <Document />,
    loader: documentLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
    <Listener />
    <RouterProvider router={router} />
  </React.StrictMode>
);
