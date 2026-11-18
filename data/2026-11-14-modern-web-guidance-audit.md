# Локальный аудит Modern Web Guidance

Дата: 2026-11-14. Изменения только в рабочей папке; на GitHub не отправлены. Опубликованная версия остаётся на коммите `37f933a`.

## Источники

- [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance)
- [Dialog](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-components/dialog.md)
- [Optimize image priority](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/performance/optimize-image-priority.md)
- [Defer rendering heavy content](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/performance/defer-rendering-heavy-content.md)
- [Validate input after interaction](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/validate-input-after-interaction.md)

## Что изменено

- Hero переведён с CSS-фона на `<img>`: `fetchpriority="high"`, `srcset`, `sizes`, реальные размеры и локализованный `alt`.
- Для 24 исходных фотографий созданы 24 производные по 640 px и 3 hero-версии по 960 px. Общий дополнительный объём — около 1,9 МБ. Полные изображения сохранены для лайтбокса.
- Карточки, видео и галерея используют адаптивные изображения и отложенную загрузку ниже первого экрана.
- Самодельные модалки заменены на `<dialog>` с `showModal()`: нативные top layer, фокус, Esc, возврат фокуса. Добавлены `closedby="any"`, fallback для Safari и остановка видео при закрытии.
- Секции видео, галереи и отзывов получили `content-visibility:auto` и `contain-intrinsic-size`.
- У обязательных полей формы есть HTML-ограничения, `aria-invalid`, связь ошибки через `aria-describedby`, перевод фокуса на первое ошибочное поле и статус успешной заявки.

## Проверено локально

- Chrome: Тоскана, Апулия и Венето отображаются; скрипты проходят `node --check`.
- 25 интерактивных проверок: открытие/закрытие галереи и видео, фокус, остановка видео, ошибки формы, успешная заявка, выбранные даты в URL WhatsApp.
- WhatsApp в тестах перехвачен заглушкой: внешних отправок не было.
- Все локальные изображения и скрипты существуют.

## Осталось проверить вручную перед публикацией

- Safari: закрытие диалога по фону через fallback и прокрутку.
- Последовательную навигацию клавишей Tab через секции с `content-visibility`.
- Визуальный результат на реальном телефоне и выбор `srcset` на устройствах с высоким DPR.
