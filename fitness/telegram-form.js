/* ============================================
   TELEGRAM FORM HANDLER
   Универсальный обработчик форм с отправкой в Telegram.
   Подключается ПОСЛЕ основного script.js на любой странице.

   Принцип:
   1. Находит все <form data-tg> (или форму с id appointmentForm / contactForm).
   2. Перехватывает submit, валидирует, собирает данные.
   3. Формирует сообщение и отправляет через Telegram Bot API.
   4. Показывает success-блок и сбрасывает форму.

   НАСТРОЙКА (вверху файла):
   ============================================ */

const TG_CONFIG = {
    // 1) Токен бота от @BotFather
    BOT_TOKEN: 'PASTE_YOUR_BOT_TOKEN',
    // 2) ID чата/канала, куда слать заявки (узнать у @userinfobot)
    CHAT_ID: 'PASTE_YOUR_CHAT_ID',
    // 3) Домен сайта — добавится в шапку сообщения
    SITE_NAME: window.location.hostname || 'demo-site',
    // 4) Если true — заявка реально уходит в Telegram.
    //    false — режим демо (только показывает success, в сеть не уходит).
    ENABLED: false,
};

/* ============================================
   ENGINE (править ниже не обязательно)
   ============================================ */

(function () {
    'use strict';

    const FORM_SELECTORS = [
        'form[data-tg]',
        '#appointmentForm',
        '#contactForm',
    ];

    function collectData(form) {
        const data = {};
        const fd = new FormData(form);
        for (const [key, value] of fd.entries()) {
            if (!value) continue;
            data[key] = value;
        }
        return data;
    }

    function formatMessage(form, data) {
        const labels = {};
        form.querySelectorAll('input, select, textarea').forEach(el => {
            const name = el.getAttribute('name');
            if (!name) return;
            const labelEl = form.querySelector(`label[for="${el.id}"]`);
            if (labelEl) labels[name] = labelEl.textContent.trim();
        });

        const lines = [];
        lines.push('🔔 *Новая заявка с сайта*');
        lines.push(`🌐 ${TG_CONFIG.SITE_NAME}`);
        lines.push(`📅 ${new Date().toLocaleString('ru-RU')}`);
        lines.push(`📄 ${document.title}`);
        lines.push('');
        for (const [key, value] of Object.entries(data)) {
            const label = labels[key] || capitalize(key);
            lines.push(`*${label}:* ${value}`);
        }
        lines.push('');
        lines.push(`🔗 ${window.location.href}`);
        return lines.join('\n');
    }

    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    async function sendToTelegram(text) {
        const url = `https://api.telegram.org/bot${TG_CONFIG.BOT_TOKEN}/sendMessage`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TG_CONFIG.CHAT_ID,
                text: text,
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
            }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.description || `HTTP ${res.status}`);
        }
        return res.json();
    }

    function showSuccess(form) {
        const success = form.querySelector('.form-success') || document.getElementById('formSuccess');
        if (success) success.classList.add('show');
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
            const original = btn.textContent;
            btn.textContent = '✓ Заявка отправлена';
            btn.disabled = true;
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = original;
                if (success) success.classList.remove('show');
            }, 5000);
        }
    }

    function initForm(form) {
        if (form.dataset.tgBound === '1') return;
        form.dataset.tgBound = '1';

        // Поскольку базовый script.js уже может вешать свой submit,
        // вешаем обработчик на фазу capture, чтобы сработать раньше.
        form.addEventListener('submit', async (e) => {
            // Базовый скрипт уже preventDefault-ит; на всякий случай тоже.
            if (e.defaultPrevented === false) e.preventDefault();

            const data = collectData(form);
            const message = formatMessage(form, data);

            // Демо-режим: не уходим в сеть.
            if (!TG_CONFIG.ENABLED) {
                console.info('[telegram-form] Демо-режим. Сообщение:', '\n' + message);
                showSuccess(form);
                setTimeout(() => form.reset(), 800);
                return;
            }

            // Реальная отправка.
            try {
                await sendToTelegram(message);
                showSuccess(form);
                setTimeout(() => form.reset(), 800);
            } catch (err) {
                console.error('[telegram-form] Ошибка отправки:', err.message);
                alert('Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в Telegram.');
            }
        }, true);
    }

    function init() {
        const forms = new Set();
        FORM_SELECTORS.forEach(sel => {
            document.querySelectorAll(sel).forEach(f => forms.add(f));
        });
        forms.forEach(initForm);
        if (forms.size) {
            console.info(`[telegram-form] Привязано форм: ${forms.size}. Режим: ${TG_CONFIG.ENABLED ? 'активный' : 'демо'}.`);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
