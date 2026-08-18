import { siteConfig } from './config/site.js';
import { renderSite } from './ui/render.js';
const root = document.querySelector('#app');
if (!root)
    throw new Error('Root element #app was not found.');
root.innerHTML = renderSite();
document.title = `${siteConfig.business.name}: удаление вмятин без покраски во Владимире`;
const select = (selector, scope = document) => scope.querySelector(selector);
const selectAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
function initMenu() {
    const button = select('[data-menu-button]');
    const menu = select('[data-menu]');
    if (!button || !menu)
        return;
    const close = (restoreFocus = false) => {
        const wasOpen = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Открыть меню');
        menu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        if (restoreFocus && wasOpen)
            button.focus();
    };
    button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
        menu.classList.toggle('is-open', open);
        document.body.classList.toggle('menu-open', open);
        if (open)
            select('a', menu)?.focus();
    });
    selectAll('a', menu).forEach((link) => link.addEventListener('click', () => close()));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape')
            close(true);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 860)
            close();
    });
}
function initComparison() {
    const comparison = select('[data-comparison]');
    const range = select('[data-comparison-range]');
    if (!comparison || !range)
        return;
    const update = () => {
        comparison.style.setProperty('--split', `${range.value}%`);
        range.setAttribute('aria-valuetext', `Показано ${range.value} процентов поверхности до выравнивания`);
    };
    range.addEventListener('input', update);
    update();
}
function initEstimateForm() {
    const form = select('[data-estimate-form]');
    if (!form)
        return;
    const fileInput = select('[data-file-input]', form);
    const previewRoot = select('[data-file-previews]', form);
    const empty = select('[data-file-empty]', form);
    const success = select('[data-form-success]', form);
    let files = [];
    const setError = (name, message) => {
        const field = select(`[name="${name}"]`, form);
        const error = select(`[data-error-for="${name}"]`, form);
        field?.setAttribute('aria-invalid', message ? 'true' : 'false');
        if (error)
            error.textContent = message;
    };
    const hideSuccess = () => {
        if (success)
            success.hidden = true;
    };
    const renderFiles = () => {
        if (!previewRoot || !empty)
            return;
        previewRoot.replaceChildren();
        empty.hidden = files.length > 0;
        files.forEach((item, index) => {
            const figure = document.createElement('figure');
            figure.className = 'file-preview';
            const image = document.createElement('img');
            image.src = item.url;
            image.alt = `Локальное превью: ${item.file.name}`;
            const caption = document.createElement('figcaption');
            const name = document.createElement('span');
            name.textContent = item.file.name;
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.textContent = 'Удалить';
            remove.setAttribute('aria-label', `Удалить файл ${item.file.name}`);
            remove.addEventListener('click', () => {
                URL.revokeObjectURL(item.url);
                files.splice(index, 1);
                renderFiles();
                hideSuccess();
            });
            caption.append(name, remove);
            figure.append(image, caption);
            previewRoot.append(figure);
        });
    };
    fileInput?.addEventListener('change', () => {
        const selected = Array.from(fileInput.files ?? []);
        const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
        const accepted = selected.filter((file) => allowed.has(file.type) && file.size <= 15 * 1024 * 1024);
        const available = Math.max(0, 4 - files.length);
        accepted.slice(0, available).forEach((file) => files.push({ file, url: URL.createObjectURL(file) }));
        if (selected.some((file) => !allowed.has(file.type))) {
            setError('photos', 'Допустимы только JPG, PNG и WEBP.');
        }
        else if (selected.some((file) => file.size > 15 * 1024 * 1024)) {
            setError('photos', 'Размер одного файла не должен превышать 15 МБ.');
        }
        else if (accepted.length > available) {
            setError('photos', 'Можно выбрать не более четырёх фотографий.');
        }
        else {
            setError('photos', '');
        }
        fileInput.value = '';
        renderFiles();
        hideSuccess();
    });
    const validate = () => {
        const name = select('[name="name"]', form);
        const phone = select('[name="phone"]', form);
        const part = select('[name="part"]', form);
        const consent = select('[name="demoConsent"]', form);
        const nameValid = Boolean(name?.value.trim());
        const phoneDigits = phone?.value.replace(/\D/g, '') ?? '';
        const phoneValid = phoneDigits.length >= 10;
        const partValid = Boolean(part?.value);
        const photosValid = files.length > 0;
        const consentValid = Boolean(consent?.checked);
        setError('name', nameValid ? '' : 'Введите имя.');
        setError('phone', phoneValid ? '' : 'Введите корректный номер телефона.');
        setError('part', partValid ? '' : 'Выберите повреждённую деталь.');
        setError('photos', photosValid ? '' : 'Добавьте хотя бы одну фотографию.');
        setError('demoConsent', consentValid ? '' : 'Подтвердите демонстрационный режим формы.');
        if (!nameValid)
            name?.focus();
        else if (!phoneValid)
            phone?.focus();
        else if (!partValid)
            part?.focus();
        else if (!photosValid)
            fileInput?.focus();
        else if (!consentValid)
            consent?.focus();
        return nameValid && phoneValid && partValid && photosValid && consentValid;
    };
    form.addEventListener('input', hideSuccess);
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!validate())
            return;
        if (success) {
            success.hidden = false;
            success.focus();
        }
    });
    window.addEventListener('beforeunload', () => {
        files.forEach((item) => URL.revokeObjectURL(item.url));
    });
}
initMenu();
initComparison();
initEstimateForm();
