import { useState, useEffect } from "react";
import { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import Modal from "./Modal";
import { v4 as uuid } from "uuid";
import Push from "./Push";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | undefined>(
    undefined
  );
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [sort, setSort] = useState("追加順");
  const localStorageKey = "TodoApp";

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // App コンポーネントの初回実行時のみLocalStorageからTodoデータを復元
  useEffect(() => {
    const todoJsonStr = localStorage.getItem(localStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : undefined,
      }));
      setTodos(convertedTodos);
    }
    setInitialized(true);
    if ("Notification" in window) {
      // 通知が許可されていたら早期リターン
      const permission = Notification.permission;
      if (permission === "denied" || permission === "granted") {
        return;
      }
      // 通知の許可を求める
      Notification.requestPermission().then(() => new Notification("テスト"));
    }
  }, []);

  // 状態 todos または initialized に変更があったときTodoデータを保存
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

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

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value }; // スプレッド構文
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
  };

  const updateSort = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSort(e.target.value);
  };

  const addNewTodo = () => {
    // ▼▼ 編集
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
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
    toggleModal();
    setEditingTodo(undefined);
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const num2star = (n: number): string => "★".repeat(4 - n);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setModalOpen(true); // モーダルを表示
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
      <div className="mb-4">
        <WelcomeMessage name="萱島ウサギ" uncompletedCount={uncompletedCount} />
      </div>
      <div className="flex gap-5">
        <div className="font-bold">リストの並び</div>
        {["優先順", "期限に近い順", "追加順"].map((value) => (
          <label key={value} className="flex items-center space-x-1 ">
            <input
              id={`sort-${value}`}
              name="sortGroup"
              type="radio"
              value={value}
              checked={sort === value}
              onChange={updateSort}
            />
            <span>{value}</span>
          </label>
        ))}
      </div>
      <TodoList
        sort={sort}
        todos={todos}
        updateIsDone={updateIsDone}
        remove={remove}
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        onEdit={handleEditTodo}
      />
      <button
        type="button"
        onClick={removeCompletedTodos}
        className={
          " mt-5 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
        }
      >
        完了済みのタスクを削除
      </button>
      <button
        type="button"
        onClick={toggleModal}
        className={
          " ml-2 mt-5 rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600"
        }
      >
        新しいタスクの追加
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        todos={todos}
        setTodos={setTodos}
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        editingTodo={editingTodo}
        setEditingTodo={setEditingTodo}
      ></Modal>

      {/* 追加 */}
      <div className="mb-2 mt-10">
        <p>push通知のお試しです</p>
      </div>
      <div className="flex space-x-2">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => Push({ uncompletedCount })}
        >
          PUSH
        </button>
      </div>
    </div>
  );
};

export default App;
