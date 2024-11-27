import { Todo } from "./types";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faClock,
  faFaceGrinWide,
  faSkull,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

const num2star = (n: number): string => "★".repeat(4 - n);

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  isModalOpen: boolean;
  toggleModal: () => void;
  onEdit: (todo: Todo) => void;
};

const TodoItem = (props: Props) => {
  const todo = props.todo;

  const pushEdit = (todo: Todo) => {
    props.onEdit(todo);
    props.toggleModal();
  };

  return (
    <div
      key={todo.id}
      className={twMerge(
        "rounded-md border border-slate-500 bg-white px-3 py-2 drop-shadow-md",
        todo.isDone && "bg-emerald-50 opacity-50"
      )}
    >
      {todo.isDone && (
        <div className="mb-1 rounded bg-emerald-400 px-2 py-0.5 text-center text-xs text-white">
          <FontAwesomeIcon icon={faFaceGrinWide} className="mr-1.5" />
          完了済み
          <FontAwesomeIcon icon={faFaceGrinWide} className="ml-1.5" />
        </div>
      )}

      {todo.deadline != null &&
        dayjs().isAfter(dayjs(todo.deadline)) &&
        !todo.isDone && (
          <div className="mb-1 rounded bg-red-600 px-2 py-0.5 text-center text-xs text-white">
            <FontAwesomeIcon icon={faSkull} className="mr-1.5" />
            期限切れ
            <FontAwesomeIcon icon={faSkull} className="ml-1.5" />
          </div>
        )}

      <div className="flex items-baseline text-slate-700">
        <FontAwesomeIcon icon={faFile} flip="horizontal" className="mr-1" />
        <div
          className={twMerge(
            "text-lg font-bold",
            todo.isDone && "line-through decoration-2"
          )}
        >
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
            className="mr-1.5 cursor-pointer"
          />

          {todo.name}
        </div>
        <div className="ml-2">優先度 </div>
        <div className="ml-2 text-orange-400">{num2star(todo.priority)}</div>
        <div className="ml-auto">
          <button
            onClick={() => pushEdit(todo)}
            className=" mr-2 rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-slate-500"
          >
            設定
          </button>
          <button
            onClick={() => props.remove(todo.id)}
            className=" rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500"
          >
            削除
          </button>
        </div>
      </div>
      {todo.deadline && (
        <div className="ml-4 flex items-center text-sm text-slate-500">
          <FontAwesomeIcon
            icon={faClock}
            flip="horizontal"
            className="mr-1.5"
          />
          <div className={twMerge(todo.isDone && "line-through")}>
            期限: {dayjs(todo.deadline).format("YYYY年M月D日 H時m分")}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
