# TodoApp

React、TypeScript、Tailwind CSS を使用し、ローカルストレージでデータを永続化した「Todoアプリ」です。
また、PWAにも対応しています。
所要時間：約70時間（多くはPush通知を調べた時間）

## 開発履歴

- 2024年10月24日:プロジェクト開始
- 2024年11月20日:Push通知のお試しボタンを追加
- 2024年11月26日:Todoリストの順番を変更できるラジオボタンを追加
- 2024年11月27日:Todoの編集、Modalの実装、PWA化
- 2024年12月11日:タスクを編集すると新しいタスクを追加することが出来なくなっていたのを改善

## 仕様技術スタック

- **フロントエンド**:React(TypeScript)+Vite
- **スタイリング**:Tailwind CSS
- **主要ライブラリ**:
  - uuid
  - FontAwesome
  - dayjs
  - date-fns

## アプリの使用方法

### リストの並び

- 優先順:優先度が高い順にTodoリストを並べます
- 期限に近い順:期限が近い、もしくは切れている順にTodoリストを並べます
- 追加順:Todoが追加された順にTodoリストを並べます

### Todoリストの機能

- チェックボックス:Todoを完了済みにする
- 設定:すでにあるTodoを編集できるモーダルウィンドウが表示されます。
- 削除:Todoを個別に削除することが出来ます。

### 完了済みのタスクを削除

チェックボックスで完了済みにしたTodoを纏めて消します

### 新しいタスクの追加

新しいタスクを追加するモーダルウィンドウが表示されます
名前を2~32文字入力し、ラジオボックスで優先度を選択したのち、任意で期限を追加して”追加”ボタンを押すとTodoを追加できます。
”閉じる”ボタンや×ボタンを押すとモーダルウィンドウが閉じます。

### Push通知（仮）

通知を許可にしていると、残りのタスクが何個かプッシュ通知を送ることが出来るボタンです。
今後Next.jsやGASで一日一回通知を送る機能を追加する予定です。

## 工夫点

- Todoリストの並び替え
  - ぱっと見自然になるようにソートキーを工夫した。
- PWA化
  - PWAに対応してスマホでも許可があればPush通知が受け取れるようにした。
  - ダウンロードさえすればネットにつながっていなくても使えるようにした。
- 視認性
  - 期限が切れるとTodoが赤くなることによって目視で期限切れか確認しやすくした。

## 苦労した点

- モーダルウィンドウの実装（特に、編集か追加によって処理を変えるところ）
- PWAやPush通知について調べたこと。

## 改善点

- Push通知の追加
  - iosは通知の許可を確認できなかったためまた考える。
- スマホ版だとUIが崩れるのを改善

## インストール

# リポジトリのクローン

`git clone https://github.com/akaumigame6/react-todo-app.git `

# PWAとしてインストールする

ブラウザで`https://akaumigame6.github.io/react-todo-app/`を開く
PC版なら上側に「Todo　Appをダウンロードします」と出るのでそこからダウンロード
Android版ならメニューを開き、「アプリをインストール」からダウンロード
iOS版なら共有アイコンを開き、「ホーム画面に追加」からダウンロード

## ライセンス

MIT License

Copyright (c) 2024 I M

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
