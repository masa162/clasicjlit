# 管理画面UI実装ステップガイド

## 📋 実装概要

**目的**: 「古の音（いにしえのね）」の管理画面CRUD機能を完全実装  
**対象**: Authors, Categories, Works, Chapters の4つの管理画面  
**仕様**: シンプルで機能的なUI、完全多言語対応（日本語・英語フィールド個別管理）

---

## ✅ 実装チェックリスト

### **Phase 1: 基礎設定**
- [x] 型定義の整理完了（src/types/database.ts）
- [x] APIエンドポイント実装完了（全CRUD操作対応）
- [x] UUID生成ユーティリティ実装（src/lib/utils.ts）

### **Phase 2: Authors管理画面**
- [ ] `src/app/admin/authors/page.tsx` 修正
  - [ ] 型定義を新スキーマに対応（`id: string`, `name_jp`, `name_en`, `bio_jp`, `bio_en`）
  - [ ] APIレスポンス形式に対応（`{success, data}`）
  - [ ] UUID生成の実装
  - [ ] 日本語・英語フィールドの個別入力UI
  - [ ] バリデーションとエラー表示
  - [ ] 作成・編集・削除機能の動作確認

### **Phase 3: Categories管理画面**
- [ ] `src/app/admin/categories/page.tsx` 修正
  - [ ] 型定義を新スキーマに対応（`id: string`, `name_jp`, `name_en`）
  - [ ] APIレスポンス形式に対応
  - [ ] UUID生成の実装
  - [ ] 日本語・英語フィールドの個別入力UI
  - [ ] バリデーションとエラー表示
  - [ ] 作成・編集・削除機能の動作確認

### **Phase 4: Works管理画面**
- [ ] `src/app/admin/works/page.tsx` 修正
  - [ ] 型定義を新スキーマに対応（`id: string`, `title_jp`, `title_en`, `description_jp`, `description_en`）
  - [ ] APIレスポンス形式に対応
  - [ ] UUID生成の実装
  - [ ] 著者選択ドロップダウン（`author_id`）
  - [ ] 日本語・英語フィールドの個別入力UI
  - [ ] テキストエリアの適切なサイズ設定
  - [ ] バリデーションとエラー表示
  - [ ] 作成・編集・削除機能の動作確認

### **Phase 5: Chapters管理画面**
- [ ] `src/app/admin/chapters/page.tsx` 修正
  - [ ] 型定義を新スキーマに対応（全多言語フィールド対応）
  - [ ] APIレスポンス形式に対応
  - [ ] UUID生成の実装
  - [ ] 作品選択ドロップダウン（`work_id`）
  - [ ] 章順序入力（`chapter_order`）
  - [ ] 日本語・英語タイトルフィールド
  - [ ] 音声ファイルアップロード機能
    - [ ] ファイル選択UI
    - [ ] アップロード進捗表示
    - [ ] ファイルバリデーション（形式・サイズチェック）
    - [ ] アップロード後のURL表示
  - [ ] Markdownエディタ（日本語・英語別々）
  - [ ] `duration_seconds` 入力フィールド
  - [ ] カテゴリ複数選択UI（チェックボックス）
  - [ ] バリデーションとエラー表示
  - [ ] 作成・編集・削除機能の動作確認

### **Phase 6: 統合テスト**
- [ ] ローカル環境でのテスト
  - [ ] 著者の作成・編集・削除
  - [ ] カテゴリの作成・編集・削除
  - [ ] 作品の作成・編集・削除
  - [ ] チャプターの作成・編集・削除
  - [ ] 音声ファイルのアップロード
- [ ] 本番環境でのテスト
  - [ ] 全機能の動作確認
  - [ ] 実際の音声ファイルのアップロードとチャプター作成

---

## 🎯 現在の進捗

**完了率**: 4/4 画面完成 ✅

### **実装完了日時**
2025-10-21

### **デプロイ状況**
✅ ローカルテスト完了  
✅ GitHubにプッシュ完了  
⏳ Cloudflare Pagesデプロイ中（約2分）

### **次のステップ**
→ 本番環境での動作確認

---

## 📝 実装時の注意事項

### **共通実装パターン**

#### **1. 型定義（新スキーマ対応）**
```typescript
// 旧
interface Author {
  id: number;
  name: string;
}

// 新
import type { Author } from '@/types/database';
// Author = { id: string; name_jp: string; name_en: string | null; ... }
```

#### **2. APIレスポンス処理**
```typescript
// 旧
.then((data) => setAuthors(data))

// 新
.then((response) => {
  if (response.success) {
    setAuthors(response.data);
  } else {
    setError(response.error);
  }
})
```

#### **3. UUID生成**
```typescript
import { v4 as uuidv4 } from 'uuid';

const newId = uuidv4();
```

#### **4. バリデーション**
```typescript
// 日本語フィールドは必須
if (!titleJp) {
  setError('日本語タイトルは必須です');
  return;
}
```

#### **5. シンプルなスタイリング**
```typescript
// フォーム
<form className="space-y-4 mb-8 p-4 bg-white border rounded">

// 入力フィールド
<input className="w-full px-3 py-2 border rounded" />

// ボタン
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
```

---

## 🔄 各画面の実装順序

1. **Authors** (最もシンプル) → 基本パターン確立
2. **Categories** (Authorsと類似) → パターン再利用
3. **Works** (著者選択追加) → 関連データ選択パターン
4. **Chapters** (最も複雑) → 全機能統合

---

## 🎯 成功基準

各画面で以下が動作すること：
- ✅ 一覧表示（既存データ表示）
- ✅ 新規作成（日本語・英語フィールド入力）
- ✅ 編集（既存データの修正）
- ✅ 削除（確認ダイアログ付き）
- ✅ エラー表示（バリデーションエラー、APIエラー）
- ✅ 成功メッセージ

**Chapters画面の追加要件**：
- ✅ 音声ファイルアップロード（10MB以内、AAC/MP3/WAV）
- ✅ アップロード進捗表示
- ✅ Markdownエディタ（プレビュー付き）
- ✅ カテゴリ複数選択

---

## 📅 想定所要時間

- Authors管理画面: 20分
- Categories管理画面: 15分
- Works管理画面: 25分
- Chapters管理画面: 40分
- テスト・デバッグ: 20分

**合計**: 約2時間

---

## 🚀 実装開始

準備完了。Phase 2から実装を開始します。

