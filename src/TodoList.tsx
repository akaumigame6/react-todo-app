import { Todo } from "./types";
import TodoItem from "./TodoItem";

type Props = {
  sort: string;
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const TodoList = (props: Props) => {
  let todos = props.todos;
  if (props.sort === "優先順") {
    todos = [...props.todos].sort((a, b) => {
      if (a.isDone !== b.isDone) {
        return a.isDone ? 1 : -1;
      }
      if (a.priority === b.priority) {
        if (a.deadline === null) {
          return 1;
        } else if (b.deadline === null) {
          return -1;
        } else return a.priority - b.priority;
      } else return a.priority - b.priority;
    });
  } else if (props.sort === "期限に近い順") {
    let nullDeadline = [...props.todos].filter(
      (todo) => todo.deadline === null
    );
    let notNullDeadline = [...props.todos].filter(
      (todo) => todo.deadline !== null
    );
    nullDeadline = nullDeadline.sort((a, b) => {
      if (a.isDone !== b.isDone) {
        return a.isDone ? 1 : -1;
      } else return a.priority - b.priority;
    });
    notNullDeadline = notNullDeadline.sort((a, b) => {
      if (a.isDone !== b.isDone) {
        return a.isDone ? 1 : -1;
      } else if (a.deadline !== null && b.deadline !== null) {
        return a.deadline.getTime() - b.deadline.getTime();
      } else return a.priority - b.priority;
    });
    const alltodo = [notNullDeadline, nullDeadline];
    todos = alltodo.reduce((pre, current) => {
      return pre.concat(current);
    });
  }

  if (todos.length === 0) {
    return (
      <div className="text-red-500">
        現在、登録されているタスクはありません。
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          remove={props.remove}
          updateIsDone={props.updateIsDone}
        />
      ))}
    </div>
  );
};

export default TodoList;
