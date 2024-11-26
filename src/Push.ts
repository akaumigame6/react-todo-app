type Props = {
  uncompletedCount: number;
};

const Push = (props: Props) => {
  if ("Notification" in window) {
    const S = "残りのタスクは" + props.uncompletedCount + "です！";
    const notif = new Notification(S);
    // プッシュ通知が表示された時に起きるイベント
    notif.addEventListener("show", () => {});
  }
};

export default Push;
