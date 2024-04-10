import { useLoaderData } from "react-router-dom";
import { useStore } from "../utils/store";
import { useEffect, useState } from "react";
import { TTodo, TodoComponent } from "./Todos";

// add typescript to the lodaer founction

type LoaderData = {
  id: string;
};
export const loader = async ({ params }: any): Promise<LoaderData> => {
  return { id: params.id };
};

const defaultTodo = {
  id: 0,
  title: "",
  completed: false,
  draft: "",
  pendingActions: {},
};

export default function Document() {
  const { id } = useLoaderData() as LoaderData;
  const { socket } = useStore((state) => ({ socket: state.socket }));
  const [todo, setTodo] = useState(defaultTodo as TTodo);
  useEffect(() => {
    socket.on(`todo_${id}`, (data: any) => {
      setTodo(data);
    });
    
    socket.emit("get_todo", id);
  }, []);

  const eventEmitter = (event: string, data: any) => {
    socket.emit(event, data);
  };
  return (
    <div>
      <TodoComponent mode={"big"} {...todo} eventEmitter={eventEmitter} />
    </div>
  );
}
