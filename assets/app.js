'use strict';

document.documentElement.classList.add('js');

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const header = $('[data-header]');
const menuButton = $('[data-menu-button]');
const menu = $('[data-menu]');
const toast = $('[data-toast]');

const setHeaderState = () => header?.classList.toggle('scrolled', window.scrollY > 18);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

function closeMenu() {
  if (!menu || !menuButton) return;
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menu.classList.toggle('open', !isOpen);
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  document.body.classList.toggle('menu-open', !isOpen);
});

$$('a[href^="#"]', menu).forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 780) closeMenu();
});

$('[data-year]')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));

const reveals = $$('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach((element) => revealObserver.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

const compare = $('[data-compare]');
const compareRange = $('[data-compare-range]');
compareRange?.addEventListener('input', () => {
  compare?.style.setProperty('--split', `${compareRange.value}%`);
});

let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 4300);
}

const form = $('[data-estimate-form]');
const fileInput = $('[data-file-input]');
const fileStatus = $('[data-file-status]');
const previews = $('[data-previews]');
let selectedFiles = [];

function renderFiles() {
  if (!previews || !fileStatus) return;
  previews.replaceChildren();
  selectedFiles.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'preview';

    const name = document.createElement('span');
    name.textContent = file.name;
    name.title = file.name;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.setAttribute('aria-label', `Удалить файл ${file.name}`);
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      selectedFiles.splice(index, 1);
      renderFiles();
    });

    item.append(name, remove);
    previews.append(item);
  });

  fileStatus.textContent = selectedFiles.length
    ? `Выбрано: ${selectedFiles.length} из 4 · прикрепите их в WhatsApp после перехода`
    : 'JPG, PNG или HEIC · файлы не загружаются на этот демо-сайт';
}

fileInput?.addEventListener('change', () => {
  const incoming = [...fileInput.files].filter((file) => file.type.startsWith('image/'));
  const total = selectedFiles.length + incoming.length;
  selectedFiles = [...selectedFiles, ...incoming].slice(0, 4);
  if (total > 4) showToast('Можно выбрать не более четырёх фотографий.');
  fileInput.value = '';
  renderFiles();
});

function clean(value) {
  return String(value || '').trim();
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const name = clean(data.get('name'));
  const phone = clean(data.get('phone'));
  const car = clean(data.get('car')) || 'не указан';
  const part = clean(data.get('part')) || 'не указана';
  const message = clean(data.get('message')) || 'без комментария';

  const text = [
    'Здравствуйте! Хочу получить предварительную оценку вмятины.',
    '',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Автомобиль: ${car}`,
    `Деталь: ${part}`,
    `Комментарий: ${message}`,
    '',
    selectedFiles.length
      ? `Я выбрал(а) ${selectedFiles.length} фото и прикреплю их следующим сообщением.`
      : 'Фотографии прикреплю следующим сообщением.',
    '',
    'Сообщение сформировано в демонстрационном концепте сайта.'
  ].join('\n');

  const url = `https://wa.me/79036472592?text=${encodeURIComponent(text)}`;
  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (!popup) window.location.href = url;
  showToast('Обращение сформировано. Прикрепите фотографии в открывшемся WhatsApp.');
});

$$('details').forEach((details) => {
  details.addEventListener('toggle', () => {
    if (!details.open) return;
    $$('details').forEach((other) => {
      if (other !== details) other.open = false;
    });
  });
});
