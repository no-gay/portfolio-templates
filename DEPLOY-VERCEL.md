# Деплой liaqil.space на Vercel (бесплатно, работает в РФ без VPN)

> Цель: уйти с нестабильного GitHub Pages на Vercel — сайт будет открываться
> из России стабильно и без VPN. Бесплатно навсегда.
> Репозиторий: `github.com/no-gay/portfolio-templates` (ветка `main`)

---

## Почему Vercel, а не GitHub Pages
- GitHub Pages из РФ нестабилен (долгий отклик, обрывы).
- Vercel в РФ **не заблокирован** (федеральной блокировки нет на 2026 год),
  глобальный CDN — быстро.
- Бесплатно: SSL, кастомный домен, автодеплой из git, неограниченный трафик
  для статичных сайтов.

> ⚠️ Cloudflare и Cloudflare Pages использовать **нельзя** — с июня 2025
> РКН массово режет трафик Cloudflare в РФ.

---

## Шаг 1. Регистрация на Vercel (~2 мин)

1. Откройте **https://vercel.com/signup**
2. Нажмите **«Sign Up With GitHub»** (используйте тот же аккаунт,
   где лежит `portfolio-templates`).
3. Подтвердите доступ к GitHub — Vercel увидит ваши репозитории.

---

## Шаг 2. Импорт репозитория (~3 мин)

1. В дашборде Vercel → **«Add New…» → «Project»**.
2. В списке **«Import Git Repository»** найдите `no-gay/portfolio-templates`.
3. Нажмите **«Import»**.
4. В блоке **«Configure Project»** проверьте настройки:

   | Поле | Значение |
   |---|---|
   | Framework Preset | **Other** (статичный сайт) |
   | Root Directory | **./** (корень репо — index.html уже в корне) |
   | Build Command | **оставить пустым** |
   | Output Directory | **оставить пустым** |
   | Install Command | **оставить пустым** |

5. Нажмите **«Deploy»**.

Через ~30–60 сек сайт поднимется на временном адресе вида
`portfolio-templates-xxxx.vercel.app`. Проверьте, что открываются
главная и все 8 шаблонов (`/restaurant/`, `/dentist/` и т.д.).

---

## Шаг 3. Подключение домена liaqil.space (~15 мин)

1. В проекте Vercel → вкладка **«Settings» → «Domains»**.
2. Введите **`liaqil.space`** → **«Add»**.
3. Добавьте также **`www.liaqil.space`** (редирект на основной).
4. Vercel покажет DNS-записи, которые нужно прописать у регистратора домена:

   **A-запись (для корня домена `liaqil.space`):**
   ```
   @  →  76.76.21.21   (или другой IP из подсказки Vercel)
   ```

   **CNAME (для `www.liaqil.space`):**
   ```
   www  →  cname.vercel-dns.com
   ```

5. Зайдите в панель управления доменом **`liaqil.space`**
   (там, где вы его покупали — Namecheap / GoDaddy / Reg.ru / и т.п.)
   и пропишите эти записи. **Старые A-записи на GitHub Pages удалите.**

6. Подождите 5–60 минут (распространение DNS). Vercel сам выдаст
   бесплатный SSL (Let's Encrypt) — ничего настраивать не надо.

---

## Шаг 4. Проверка

Откройте с телефона/компьютера в РФ **без VPN**:
- ✅ `https://liaqil.space` — главная
- ✅ `https://liaqil.space/restaurant/` — шаблон
- ✅ Все формы работают (telegram-form.js)
- ✅ В браузере виден замок (валидный SSL)

Если что-то не открылось — проверьте вкладку **«Domains»** в Vercel:
напротив домена должна быть зелёная галочка «Valid Configuration».

---

## Как работают дальнейшие обновления

После настройки **любой `git push` в `main`** автоматически деплоит
новую версию на Vercel. Делать ничего больше не нужно.

```bash
# локально, из папки portfolio/
git add .
git commit -m "обновление"
git push origin main
# → через ~1 минута изменения уже на liaqil.space
```

---

## ⚠️ Безопасность: убрать токен из remote URL

Сейчас remote содержит захардкоженный GitHub-токен:
```
origin → https://...:ghp_xxx@github.com/no-gay/portfolio-templates.git
```
Это небезопасно. Рекомендую:

1. Заменить remote на чистый URL:
   ```bash
   git -C /Users/glebklimenko/ZCodeProject/portfolio remote set-url origin \
     https://github.com/no-gay/portfolio-templates.git
   ```
2. Токен **отозвать**: GitHub → Settings → Developer settings →
   Personal access tokens → удалить старый, создать новый.
3. Для пуша использовать SSH-ключ или GitHub CLI (`gh auth login`).

---

## Откат на GitHub Pages (если что-то пойдёт не так)

Vercel не удаляет ваш GitHub Pages — он просто перестаёт использоваться.
Чтобы вернуть GitHub Pages:
1. Восстановить файл `CNAME` с содержимым `liaqil.space`.
2. В GitHub → Settings → Pages → проверить, что включён.
3. Вернуть DNS-записи домена на GitHub Pages A-records.
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
```
