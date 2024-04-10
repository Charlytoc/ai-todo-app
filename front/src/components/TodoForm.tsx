type TodoFormProps = {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const TodoForm = ({handleSubmit}: TodoFormProps) => {
  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input placeholder="Todo title" name="title" type="text" />
      <select name="difficulty">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button>Add todo</button>
    </form>
  );
};
