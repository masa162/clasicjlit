-- Sample data for Inishie no Ne (古の音)
-- This file contains sample classical Japanese literature data

-- Insert sample authors
INSERT INTO authors (id, name_jp, name_en, bio_jp, bio_en) VALUES
  ('author-001', '紫式部', 'Murasaki Shikibu', '平安時代の女性作家。『源氏物語』の作者として知られる。', 'Heian period female author, known for The Tale of Genji.'),
  ('author-002', '清少納言', 'Sei Shonagon', '平安時代の女性作家。『枕草子』の作者。', 'Heian period female author, known for The Pillow Book.'),
  ('author-003', '作者不詳', 'Unknown', '平家物語の作者は不明。', 'The author of The Tale of the Heike is unknown.');

-- Insert sample categories
INSERT INTO categories (id, name_jp, name_en) VALUES
  ('cat-001', '物語', 'Monogatari (Tales)'),
  ('cat-002', '随筆', 'Zuihitsu (Essays)'),
  ('cat-003', '軍記物語', 'Gunki Monogatari (War Tales)');

-- Insert sample works
INSERT INTO works (id, author_id, title_jp, title_en, description_jp, description_en) VALUES
  ('work-001', 'author-001', '源氏物語', 'The Tale of Genji', '平安時代中期に成立した長編物語。光源氏の生涯と、その子孫の物語を描く。', 'A classic work of Japanese literature written in the early 11th century, telling the story of Hikaru Genji and his descendants.'),
  ('work-002', 'author-002', '枕草子', 'The Pillow Book', '平安時代中期の随筆。清少納言による宮廷生活の観察と随想。', 'A collection of essays and observations from court life in the Heian period.'),
  ('work-003', 'author-003', '平家物語', 'The Tale of the Heike', '鎌倉時代初期に成立した軍記物語。平家の栄華と没落を描く。', 'An epic account of the struggle between the Taira and Minamoto clans in 12th century Japan.');

-- Insert sample chapters (Note: audio_url is a placeholder - you need to upload actual audio files)
INSERT INTO chapters (id, work_id, chapter_order, title_jp, title_en, audio_url, content_jp, content_en, duration_seconds) VALUES
  ('chapter-001', 'work-001', 1, '桐壺', 'Kiritsubo (The Paulownia Court)', '/placeholder-audio.aac', 
   '## 桐壺

いづれの御時にか、女御、更衣あまたさぶらひたまひける中に、いとやむごとなき際にはあらぬが、すぐれて時めきたまふありけり。

光源氏の誕生と、その母である桐壺更衣の物語が始まります。', 
   '## Kiritsubo (The Paulownia Court)

In a certain reign there was a lady not of the first rank whom the emperor loved more than any of the others.

The story begins with the birth of Hikaru Genji and the tale of his mother, Lady Kiritsubo.', 
   480),
  
  ('chapter-002', 'work-001', 2, '帚木', 'Hahakigi (The Broom Tree)', '/placeholder-audio.aac',
   '## 帚木

光源氏が十七歳の夏のこと。雨の降る夜、頭中将らと女性についての談義を行う。

いわゆる「雨夜の品定め」の段。', 
   '## Hahakigi (The Broom Tree)

On a rainy night when Genji was seventeen, he and his friends held a discussion about women.

This is the famous "rainy night discussion" scene.',
   360),

  ('chapter-003', 'work-002', 1, '春はあけぼの', 'Spring is Dawn', '/placeholder-audio.aac',
   '## 春はあけぼの

春はあけぼの。やうやう白くなりゆく山際、少し明かりて、紫だちたる雲の細くたなびきたる。

清少納言による四季の美しさの描写。', 
   '## Spring is Dawn

In spring, the dawn. Gradually the hills become whiter, and the thin clouds trailing purple across them.

Sei Shonagon describes the beauty of the four seasons.',
   180),

  ('chapter-004', 'work-003', 1, '祇園精舎', 'Gion Shoja', '/placeholder-audio.aac',
   '## 祇園精舎

祇園精舎の鐘の声、諸行無常の響きあり。沙羅双樹の花の色、盛者必衰の理をあらはす。

平家物語の有名な冒頭部分。', 
   '## Gion Shoja

The sound of the Gion Shoja bells echoes the impermanence of all things. The color of the sala flowers reveals the truth that the prosperous must decline.

The famous opening of The Tale of the Heike.',
   240);

-- Insert chapter-category relationships
INSERT INTO chapter_categories (chapter_id, category_id) VALUES
  ('chapter-001', 'cat-001'),
  ('chapter-002', 'cat-001'),
  ('chapter-003', 'cat-002'),
  ('chapter-004', 'cat-003');

