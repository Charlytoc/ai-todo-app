import { useState, useEffect, useRef } from "react";
// create portal
import toast from "react-hot-toast";
import { convertMarkdownToHTML } from "../utils/lib";
import { TodoForm } from "../components/TodoForm";
import { Link } from "react-router-dom";
import { useStore } from "../utils/store";
// import toast from "react-hot-toast";
function splitStringAtLastOccurrence(
  input: string,
  separator: string
): string[] {
  const lastIndex = input.lastIndexOf(separator);
  if (lastIndex === -1) {
    return [input, ""];
  }
  const firstSection = input.substring(0, lastIndex);
  const secondSection = input.substring(lastIndex + separator.length);
  return [firstSection, secondSection];
}

type TodoDifficulty = "hard" | "easy" | "medium";

type TPendingAction = {
  [key: string]: string;
};
export type TTodo = {
  id: number;
  title: string;
  completed: boolean;
  difficulty?: TodoDifficulty;
  draft: string;
  pendingActions: TPendingAction;
};

type ActionMapper = {
  [key: string]: (actionParam: string) => void;
};

interface TodoProps extends TTodo {
  eventEmitter: any;
  mode: "big" | "small";
}

export default function Todos() {
  const [todos, setTodos] = useState([] as TTodo[]);
  const { socket } = useStore((state) => ({ socket: state.socket }));
  console.log("Todos component");

  useEffect(() => {
    socket.on("todos", (data: TTodo[]) => {
      setTodos(data);
    });

    socket.on("connect", () => {
      console.log("Connected to socket!");
    });

    socket.emit("get", "todos");

    socket.on("disconnect", () => {
      console.log("Disconnected from socket.");
    });
    return () => {
      socket.off("connect");
      socket.off("todos");
      socket.off("disconnect");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const difficulty = formData.get("difficulty") as TodoDifficulty;

    const todo = {
      title,
      completed: false,
      difficulty,
      draft: "",
    };

    socket.emit("add_todo", todo);
    form.reset();
  };

  const eventEmitter = (event: string, data: any) => {
    socket.emit(event, data);
  };

  return (
    <>
      <main className="todo">
        <h1>Todos</h1>
        <TodoForm handleSubmit={handleSubmit} />

        <ul className="todos-container">
          {todos.map((todo, index) => (
            <TodoComponent
              mode="small"
              eventEmitter={eventEmitter}
              {...todo}
              key={index}
            />
          ))}
        </ul>
      </main>
    </>
  );
}

let defaultInputs = ["Extra context to the AI"];

export const TodoComponent = ({
  title,
  difficulty,
  draft,
  id,
  pendingActions,
  eventEmitter,
  mode,
}: TodoProps) => {
  const [inputs, setInputs] = useState([...defaultInputs] as string[]);

  // useRef
  const formRef = useRef(null as any);
  // With this I can controle the frontend actions
  const actionMapper: ActionMapper = {
    ask: (actionParam: string) => {
      try {
        const neededInputs = JSON.parse(actionParam);

        setInputs([...defaultInputs, ...neededInputs]);
      } catch (e) {}
    },
  };

  useEffect(() => {
    if (pendingActions && Object.keys(pendingActions).length > 0) {
      for (const action in pendingActions) {
        if (actionMapper.hasOwnProperty(action)) {
          actionMapper[action](pendingActions[action]);
        }
      }
    }
  }, [pendingActions]);

  const handleDelete = () => {
    eventEmitter("delete_todo", id);
  };

  const generateTodoDraft = () => {
    eventEmitter("generate_todo_draft", id);
  };

  const regenerateDraft = (e: any) => {
    e.preventDefault();
    let action = "ask";
    const form = formRef.current as HTMLFormElement;
    const formData = new FormData(form);
    // get the entries of the form data
    const inputsObject: any = {};

    for (let [key, value] of formData.entries()) {
      inputsObject[key] = value;
    }
    eventEmitter("re_generate", { id, inputsObject, action });
    if (formRef.current) {
      formRef.current.reset();
    }
    setInputs([...defaultInputs]);
  };

  let [first, second] = splitStringAtLastOccurrence(draft, "---");

  const copyDraft = () => {
    navigator.clipboard.writeText(first);
    toast.success("Draft copied to clipboard", { duration: 2000 });
  };
  return (
    <div className={`todo-component ${difficulty}`}>
      <h3>{title}</h3>
      {inputs.length > 0 && draft && (
        <form ref={formRef} onSubmit={regenerateDraft}>
          {inputs.map((input, index) => (
            <input key={index} name={input} placeholder={input} />
          ))}
        </form>
      )}
      {/* <div  className={`difficulty-block ${difficulty}`}></div> */}
      <div
        className={`content ${mode}`}
        dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(first) }}
      ></div>
      <div className="buttons-container">
        <button onClick={handleDelete}>Delete</button>

        {draft ? (
          <button onClick={regenerateDraft}>Regenerate draft</button>
        ) : (
          <button onClick={generateTodoDraft}>Generate draft</button>
        )}
        {mode === "big" ? (
          <button>
            <Link to={`/todos/`}>Come back</Link>
          </button>
        ) : (
          <button>
            <Link to={`/todos/${id}`}>Expand</Link>
          </button>
        )}
        <button onClick={copyDraft}>Copy draft</button>
        {second && (
          <button onClick={() => toast.success(second, { duration: 4000 })}>
            See comments
          </button>
        )}
      </div>
    </div>
  );
};
