# README

オブジェクトをできるだけ正確に整列します。

<div class="fig center" style="margin-bottom: 20px;"><img src="http://www.graphicartsunit.com/saucer/images/align-objects-plus/eye.png" alt="イメージ" class="noshadow"></div>

### 更新履歴

* 0.5.6：option（Alt）キーによる強制ダイアログ表示に対応／return（enter）キーでの実行に対応（公開）
* 0.5.5：整列の基準のUIをラジオボタンに変更
* 0.5.1：CS5でのチェックボックスの挙動を改善
* 0.5.0：新規作成

----

### 対応バージョン

* Illustrator CS5／CS6／CC／CC 2014／CC 2015／CC 2015.3／CC 2017

----

### ダウンロード

* [スクリプトをダウンロードする](https://github.com/gau/align-objects-plus/archive/master.zip)

----

### インストール方法

1. ダウンロードしたファイルを解凍します。
2. 所定の場所に「オブジェクトを整列Plus.jsx」をコピーします。Windows版ではお使いのIllustratorの種類によって保存する場所が異なりますのでご注意ください。
3. Illustratorを再起動します。
4. `ファイル` → `スクリプト` → `オブジェクトを整列Plus`と表示されていればインストール成功です。

#### ファイルをコピーする場所

| OS | バージョン | フォルダの場所 |
|:-----|:-----|:-----|
| Mac | 全 | /Applications/Adobe Illustrator *(ver)*/Presets/ja_JP/スクリプト/ |
| 32bit Win | CS5まで | C:\Program Files\Adobe\Adobe Illustrator *(ver)*\Presets\ja_JP\スクリプト\ |
| 64bit Win | CS5, CS6（32bit版） | C:\Program Files (x86)\Adobe\Adobe Illustrator *(ver)*\Presets\ja_JP\スクリプト\ |
| 64bit Win | CS6（64bit版）以降 | C:\Program Files\Adobe\Adobe Illustrator *(ver)* (64 Bit)\Presets\ja_JP\スクリプト\ |

* *(ver)*にはお使いのIllustratorのバージョンが入ります
* 本スクリプトは、CS4以前では動作を検証しておりません

----

### 標準の整列機能ではテキストオブジェクトが正確に揃わない

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/align-objects-plus/fig01.png" alt="標準の整列機能ではテキストオブジェクトが正確に揃わない" class="noshadow"></div>

Illustrator標準の整列機能を使ってテキストオブジェクトを揃えようとすると、以下2つの問題にぶつかります。

* 横書きテキストの場合、下に隙間ができてしまう（期待する位置より上に揃う）
* トラッキングされた文字の場合、右端（下端）にトラッキング分の隙間ができてしまう（期待するより左、または上に揃う）

いずれも、テキストのバウンディングボックス基準で整列位置が計算される仕様に基づくもので、Illustratorの整列がデタラメに処理されているわけではないのですが、おそらく現実として期待する結果になってないと感じることが多いのではないでしょうか。

----

### このスクリプトを使うと

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/align-objects-plus/fig02.png" alt="このスクリプトを使うと" class="noshadow"></div>

文字の（仮想）ボディのサイズを想定してテキストオブジェクトの大きさを再計算し、それに基づいて整列を行います。バウンディングボックスで文字の下に大きな隙間ができてしまうフォント（源ノ角ゴシックなど）や、トラッキングが設定されたテキストオブジェクトでも比較的正確な整列が可能です。

なお、Illustratorとテキストのバウンディングボックスの関係について興味のある方は、[ものかの](http://tama-san.com/)さんさんのブログ記事を参考にしてみてください。

* [IllustratorでSource Han Sansのバウンディングボックスが縦長になる理由](http://tama-san.com/illustrator-boundingbox/)

----

### 使い方

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/align-objects-plus/fig03.png" alt="使い方" class="noshadow"></div>

1. オブジェクトを選択してスクリプトを実行すると、整列のダイアログが開きます
2. ［水平方向］、［垂直方向］で、整列したい位置のチェックボックスをクリックします。整列をしたくないときは、オンになっているチェックボックスを再度クリックして、チェックをオフにします
3. ［基準の範囲］から、整列の基準としたい対象を選択します。`アートボード`、`選択範囲`、`最背面オブジェクト`、`最前面オブジェクト`の4つから選択可能です
4. 整列基準の範囲を確認したいときは`整列の範囲をハイライト`のチェックをオンにします。対象範囲がピンクにハイライトされます
5. `実行`をクリックすると整列を実行します

#### 基準となる範囲の詳細

| 項目 | 説明 |
|:-----|:-----|:-----|
| アートボード | 現在アクティブなアートボードの大きさ |
| 選択範囲 | 選択されたオブジェクト全体の範囲 |
| 最前面オブジェクト | 選択された中で最も前面にあるオブジェクトの大きさ |
| 最背面オブジェクト | 選択された中で最も背面にあるオブジェクトの大きさ |

----

### ダイアログについて

スクリプトは最後に実行したダイアログの状態を記憶しますので、スクリプトを起動したあとにすぐreturn（enter）キーを押せば前回と同じ設定で整列を実行できます。さらに、スクリプトの設定をカスタマイズすれば、ダイアログを省略して整列を実行することも可能です（次項参照）。

----

### カスタマイズ

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/align-objects-plus/fig04.png" alt="カスタマイズ" class="noshadow"></div>

10行目あたりにある`settings`の各値を変更することで、ダイアログを省略した整列ができます。ダイアログを省略するには、`showDialog`を`false`にしたうえで、その他の値を希望する挙動に合わせておきます。また、`withAltKey`を`true`にしておくことで、ダイアログ省略設定時でも一時的に表示可能です。下記を参考に、テキストエディタでスクリプトを直接編集してください。

| キー | 型 | 説明 | 値 |
|:-----|:-----|:-----|:-----|
| vertical | Number | 水平方向の揃え | -1：移動なし｜0：左｜1：中央｜2：右 |
| horizontal | Number | 垂直方向の揃え | -1：移動なし｜0：左｜1：中央｜2：右 |
| base | Number | 整列の基準 | 0：アートボード｜1：選択範囲｜2：最前面オブジェクト｜3：最背面オブジェクト |
| previewArea | Boolean | 整列基準範囲のハイライト表示 | false：しない｜true：する |
| showDialog | Boolean | ダイアログを表示 | false：しない｜true：する |
| withAltKey | Boolean | option（Alt）キーを押しながら実行でダイアログを強制表示 | false：しない｜true：する |

* ダイアログ表示をカットしたい場合は、`showDialog`を`false`にしてください
* `withAltKey`の値は`showDialog`が`false`のときのみ有効です

----

### キーボードショートカットのすすめ

ダイアログを省略して実行するときは特にですが、スクリプトをキーボードショートカットで実行できるようにしておくことをおすすめします。Illustrator標準ではスクリプトにショートカットキーを割り当てできないので、Macの方は、[ものかの](http://tama-san.com/)さんの「SPAi」や、Keyboard Maestroなどのツールを使うといいでしょう。Keyboard Maestroは、[三階ラボ](http://3fl.jp/)さんの記事が詳しくて参考になります。Windowsの方は……なんとか頑張ってください！（ツールがあるのかどうか知らないです。すみません）

* [SPAi | Script Panel for Illstrator](http://tama-san.com/spai/)
* [3flab inc. | Keyboard Maestro の使い方 – 基本機能の説明編](http://3fl.jp/nkm001)

なお、ショートカットキーの中にoption（Alt）キーが含まれる場合、強制的にダイアログが表示されます。強制表示を無効にしたいときは、カスタマイズで`withAltKey`を`false`に設定してください。ただし、この場合はダイアログの強制表示機能は使えませんのでご注意ください。

----

### その他

* クリッピングマスクされたオブジェクトは、クリッピングパスの大きさを基準とします
* エリア内文字はテキストエリアを整列の基準とします

----

### 注意

* CS6ではダイアログ表示直後のプレビューが乱れることがありますが、何かの設定を一度変更すれば正常に戻ります
* 必要なオブジェクトが選択されていないときは、警告を表示して処理を中断します
* オブジェクトの種類や構造によって意図しない結果になる可能性もゼロではありません
* 大量のオブジェクトでは処理に時間がかかることがあります

----

### 免責事項

* このスクリプトを使って起こったいかなる現象についても制作者は責任を負えません。すべて自己責任にてお使いください。
* CS5からCC 2017（いずれもMac版）で動作の確認はしましたが、OSのバージョンやその他の状況によって実行できないことがあるかもしれません。もし動かなかったらごめんなさい。

----

### ライセンス

* オブジェクトを整列Plus.jsx
* Copyright (c) 2017 Toshiyuki Takahashi
* Released under the MIT license
* [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)
* Created by Toshiyuki Takahashi ([Graphic Arts Unit](http://www.graphicartsunit.com/))
* [Twitter](https://twitter.com/gautt)