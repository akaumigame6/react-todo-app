import { useState, useEffect } from "react";
import "./modal.css";

import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Todo } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingTodo: Todo | undefined;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo | undefined>>;
}

const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  editingTodo,
  todos,
  setTodos,
  isModalOpen,
  setModalOpen,
  setEditingTodo,
}) => {
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | undefined>(
    undefined
  );
  const [newTodoNameError, setNewTodoNameError] = useState("");

  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    // あとでバリデーションなどの処理をここに追加する
    setNewTodoNameError(isValidTodoName(e.target.value)); // ◀◀ 追加
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value)); // 数値型に変換
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value; // UIで日時が未設定のときは空文字列 "" が dt に格納される
    console.log(`UI操作で日時が "${dt}" (${typeof dt}型) に変更されました。`);
    setNewTodoDeadline(dt === "" ? undefined : new Date(dt));
  };

  const handleSubmit = () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }

    if (editingTodo) {
      const updatedTodo: Todo = {
        ...editingTodo,
        name: newTodoName,
        priority: newTodoPriority,
        deadline: newTodoDeadline,
      };
      setTodos((prevTodos) =>
        prevTodos.map(
          (todo) => (todo.id === updatedTodo.id ? updatedTodo : todo) // IDが一致する場合のみ更新
        )
      );
    } else {
      const newTodo: Todo = {
        id: uuid(),
        name: newTodoName,
        isDone: false,
        priority: newTodoPriority,
        deadline: newTodoDeadline,
      };
      // スプレッド構文を使って、末尾に新タスクを追加した配列を作成
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos); // 作成した配列をtodosにセット
      setNewTodoName("");
      setNewTodoPriority(3);
      setNewTodoDeadline(undefined);
      setEditingTodo(undefined);
      toggleModal();
    }
    onClose();
  };
  // モーダルが開かれるときに初期化
  useEffect(() => {
    if (editingTodo) {
      setNewTodoName(editingTodo.name);
      setNewTodoPriority(editingTodo.priority);
      setNewTodoDeadline(editingTodo.deadline);
    } else {
      resetForm();
    }
  }, [editingTodo, isOpen]);

  const resetForm = () => {
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(undefined);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  if (!isOpen) return null;

  const num2star = (n: number): string => "★".repeat(4 - n);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div>
          <h2 className="text-lg font-bold">
            {editingTodo ? "タスクを編集" : "新しいタスクの追加"}
          </h2>
          {/* 編集: ここから... */}
          <div>
            <div className="mt-2 flex items-center space-x-2">
              <label className="font-bold" htmlFor="newTodoName">
                名前
              </label>
              <input
                id="newTodoName"
                type="text"
                value={newTodoName}
                onChange={updateNewTodoName}
                className={twMerge(
                  "grow rounded-md border p-2",
                  newTodoNameError && "border-red-500 outline-red-500"
                )}
                placeholder="2文字以上、32文字以内で入力してください"
              />
            </div>
            {newTodoNameError && (
              <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500 ">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="mr-0.5"
                />
                <div>{newTodoNameError}</div>
              </div>
            )}
          </div>
          {/* ...ここまで */}

          {/* ラジオボタンの実装 ここから... */}
          <div className="mt-2 flex gap-5">
            <div className="font-bold">優先度</div>
            {[1, 2, 3].map((value) => (
              <label
                key={value}
                className="flex items-center space-x-1 text-yellow-500"
              >
                <input
                  id={`priority-${value}`}
                  name="priorityGroup"
                  type="radio"
                  value={value}
                  checked={newTodoPriority === value}
                  onChange={updateNewTodoPriority}
                />
                <span>{num2star(value)}</span>
              </label>
            ))}
          </div>
          {/* ...ここまで */}

          {/* DateTimeUIの実装 ここから... */}
          <div className="mt-2 flex items-center gap-x-2 ">
            <label htmlFor="deadline" className="font-bold">
              期限
            </label>
            <input
              type="datetime-local"
              id="deadline"
              value={
                newTodoDeadline
                  ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                  : ""
              }
              onChange={updateDeadline}
              className="rounded-md border border-gray-400 px-2 py-0.5"
            />
          </div>
          {/* ...ここまで */}
          <div className="ml-auto mt-2">
            <button
              type="button"
              onClick={handleSubmit} // ボタンを押下したときの処理
              className={twMerge(
                "mr-2 rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
                newTodoNameError && "cursor-not-allowed opacity-50"
              )}
            >
              {editingTodo ? "更新" : "追加"}
            </button>
            <button
              onClick={toggleModal}
              className={twMerge(
                "rounded-md bg-slate-500 px-3 py-1 font-bold text-white hover:bg-slate-600",
                newTodoNameError && "cursor-not-allowed opacity-50"
              )}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
