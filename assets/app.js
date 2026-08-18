'use strict';

document.documentElement.classList.add('js');

const query = (selector, root = document) => root.querySelector(selector);
const queryAll = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuButton = query('[data-menu-button]');
const menu = query('[data-menu]');

function closeMenu() {
  if (!menu || !menuButton) return;
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('open', willOpen);
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Закрыть меню' : 'Открыть меню');
  document.body.classList.toggle('menu-open', willOpen);
});

queryAll('a[href^="#"]', menu).forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
});

queryAll('details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    queryAll('details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const form = query('[data-form]');
const fileInput = query('[data-file-input]');
const fileList = query('[data-file-list]');
const result = query('[data-result]');
const resultText = query('[data-result-text]');
const copyButton = query('[data-copy]');
const copyStatus = query('[data-copy-status]');

let selectedFiles = [];
let objectUrls = [];

function getErrorElement(name) {
  return query(`[data-error-for="${name}"]`);
}

function setFieldError(field, message) {
  const error = getErrorElement(field.name);
  if (error) error.textContent = message;
  field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
  const error = getErrorElement(field.name);
  if (error) error.textContent = '';
  field.removeAttribute('aria-invalid');
}

function clearErrors() {
  queryAll('[aria-invalid="true"]', form).forEach(clearFieldError);
  queryAll('[data-error-for]', form).forEach((item) => { item.textContent = ''; });
}

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

function validateForm() {
  clearErrors();
  const name = form.elements.namedItem('name');
  const phone = form.elements.namedItem('phone');
  const damage = form.elements.namedItem('damage');
  const consent = form.elements.namedItem('consent');
  const invalid = [];

  if (!name.value.trim() || name.value.trim().length < 2) {
    setFieldError(name, 'Укажите имя минимум из двух символов.');
    invalid.push(name);
  }

  if (normalizePhone(phone.value).length < 10) {
    setFieldError(phone, 'Укажите номер телефона минимум из десяти цифр.');
    invalid.push(phone);
  }

  if (!damage.value) {
    setFieldError(damage, 'Выберите тип повреждения.');
    invalid.push(damage);
  }

  if (!consent.checked) {
    setFieldError(consent, 'Подтвердите, что понимаете демонстрационный режим формы.');
    invalid.push(consent);
  }

  invalid[0]?.focus();
  return invalid.length === 0;
}

function revokeObjectUrls() {
  objectUrls.forEach((url) => URL.revokeObjectURL(url));
  objectUrls = [];
}

function renderFiles() {
  if (!fileList) return;
  revokeObjectUrls();
  fileList.replaceChildren();

  selectedFiles.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'file-item';

    const image = document.createElement('img');
    const url = URL.createObjectURL(file);
    objectUrls.push(url);
    image.src = url;
    image.alt = '';
    image.className = 'file-thumb';

    const name = document.createElement('span');
    name.className = 'file-name';
    name.textContent = file.name;
    name.title = file.name;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'file-remove';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `Удалить файл ${file.name}`);
    remove.addEventListener('click', () => {
      selectedFiles.splice(index, 1);
      renderFiles();
    });

    item.append(image, name, remove);
    fileList.append(item);
  });
}

fileInput?.addEventListener('change', () => {
  const incoming = [...fileInput.files].filter((file) => file.type.startsWith('image/') || /\.(heic|heif)$/i.test(file.name));
  const combined = [...selectedFiles, ...incoming];
  selectedFiles = combined.slice(0, 4);

  const fileError = getErrorElement('photos');
  if (combined.length > 4 && fileError) {
    fileError.textContent = 'Можно выбрать не более четырёх фотографий.';
  } else if (fileError) {
    fileError.textContent = '';
  }

  fileInput.value = '';
  renderFiles();
});

function buildDraft(data) {
  const lines = [
    'Здравствуйте. Хочу уточнить возможность удаления вмятины без покраски.',
    '',
    `Имя: ${String(data.get('name')).trim()}`,
    `Телефон: ${String(data.get('phone')).trim()}`,
    `Автомобиль: ${String(data.get('car')).trim() || 'не указан'}`,
    `Повреждение: ${String(data.get('damage')).trim()}`,
    `Комментарий: ${String(data.get('comment')).trim() || 'без комментария'}`,
    `Фотографии: ${selectedFiles.length ? `${selectedFiles.length} файл(а), приложу отдельно` : 'приложу отдельно'}`,
    '',
    'Черновик сформирован в демонстрационном концепте сайта.'
  ];
  return lines.join('\n');
}

form?.addEventListener('input', (event) => {
  const field = event.target;
  if (field?.name && field.getAttribute('aria-invalid') === 'true') clearFieldError(field);
});

form?.addEventListener('change', (event) => {
  const field = event.target;
  if (field?.name && field.getAttribute('aria-invalid') === 'true') clearFieldError(field);
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const draft = buildDraft(new FormData(form));
  resultText.textContent = draft;
  result.hidden = false;
  result.focus();
  result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
});

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

copyButton?.addEventListener('click', async () => {
  try {
    await copyText(resultText.textContent || '');
    copyStatus.textContent = 'Текст скопирован.';
  } catch {
    copyStatus.textContent = 'Не удалось скопировать автоматически. Выделите текст вручную.';
  }
});

window.addEventListener('beforeunload', revokeObjectUrls);
