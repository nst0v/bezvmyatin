import { siteConfig } from "./config/site.js";
const app = document.querySelector("#app");
if (!app)
    throw new Error("Root element #app was not found");
const escapeHtml = (value) => value.replace(/[&<>'"]/g, (char) => {
    const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
    };
    return entities[char] ?? char;
});
const serviceRows = siteConfig.services
    .map((service, index) => `
      <article class="row">
        <span class="row__number">${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(service.title)}</h3>
        <p>${escapeHtml(service.text)}</p>
        <span class="row__meta">${escapeHtml(service.examples)}</span>
      </article>`)
    .join("");
const processSteps = siteConfig.process
    .map((step) => `
      <article>
        <span>${escapeHtml(step.number)}</span>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.text)}</p>
      </article>`)
    .join("");
const priceFactors = siteConfig.priceFactors
    .map((factor) => `
      <div class="price-item">
        <strong>${escapeHtml(factor.title)}</strong>
        <p>${escapeHtml(factor.text)}</p>
      </div>`)
    .join("");
const faqItems = siteConfig.faq
    .map((item, index) => `
      <details ${index === 0 ? "open" : ""}>
        <summary>${escapeHtml(item.question)}</summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>`)
    .join("");
app.innerHTML = `
  <a class="skip-link" href="#main">Перейти к содержанию</a>
  <div class="demo-bar" role="note">${escapeHtml(siteConfig.project.demoLabel)}</div>

  <header class="site-header">
    <div class="container site-header__inner">
      <a class="wordmark" href="#top" aria-label="${escapeHtml(siteConfig.business.name)}: к началу страницы">Бе<b>Z</b>вмятин</a>
      <nav class="main-nav" aria-label="Основная навигация" data-menu>
        <a href="#services">Услуги</a>
        <a href="#process">Как работаем</a>
        <a href="#estimate">Оценка по фото</a>
        <a href="#contacts">Контакты</a>
      </nav>
      <a class="header-phone" href="tel:${escapeHtml(siteConfig.contacts.phone)}">${escapeHtml(siteConfig.contacts.phoneDisplay)}</a>
      <button class="menu-button" type="button" aria-label="Открыть меню" aria-expanded="false" data-menu-button><span aria-hidden="true"></span></button>
    </div>
  </header>

  <main id="main">
    <section class="hero" id="top">
      <div class="container hero__grid">
        <div>
          <span class="hero__kicker">${escapeHtml(siteConfig.project.city)} · PDR-мастерская</span>
          <h1>${escapeHtml(siteConfig.business.heroTitle)}</h1>
          <p class="hero__lead">${escapeHtml(siteConfig.business.heroText)}</p>
          <div class="hero__actions">
            <a class="button" href="#estimate">Оценить по фото</a>
            <a class="button button--secondary" href="tel:${escapeHtml(siteConfig.contacts.phone)}">Позвонить</a>
          </div>
        </div>

        <aside class="hero-card" aria-labelledby="photo-title">
          <div class="hero-card__head">
            <small>Перед обращением</small>
            <strong id="photo-title">Снимите повреждение с трёх ракурсов</strong>
          </div>
          <ol class="hero-card__steps">
            ${siteConfig.heroSteps
    .map((step) => `
                  <li>
                    <span>${escapeHtml(step.number)}</span>
                    <div><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.text)}</p></div>
                  </li>`)
    .join("")}
          </ol>
          <p class="hero-card__note">Если на краске есть скол или трещина, обязательно покажите это на крупном плане.</p>
        </aside>
      </div>
    </section>

    <section class="section" id="services">
      <div class="container">
        <div class="section-heading">
          <span class="section-kicker">С чем обращаются</span>
          <h2>Типы повреждений</h2>
          <p>Предварительный вывод зависит не от названия вмятины, а от её формы, расположения и состояния краски.</p>
        </div>
        <div class="rows">${serviceRows}</div>
      </div>
    </section>

    <section class="section section--dark" id="process">
      <div class="container">
        <div class="section-heading">
          <span class="section-kicker">Порядок работы</span>
          <h2>От фотографий до решения</h2>
          <p>Сайт помогает подготовить исходные данные. Окончательный способ ремонта определяется после осмотра автомобиля.</p>
        </div>
        <div class="process">${processSteps}</div>
      </div>
    </section>

    <section class="section" id="price">
      <div class="container price-layout">
        <div class="price-intro">
          <span class="section-kicker">Стоимость</span>
          <h2>Почему нет одной цены по размеру</h2>
          <p>В демо нет вымышленного прайса. Стоимость становится понятной после оценки нескольких факторов.</p>
          <a class="button" href="#estimate">Подготовить фото</a>
        </div>
        <div class="price-list">${priceFactors}</div>
      </div>
    </section>

    <section class="section section--dark" id="estimate">
      <div class="container form-layout">
        <div class="form-copy">
          <span class="section-kicker">Оценка по фото</span>
          <h2>Подготовьте обращение</h2>
          <p>Укажите автомобиль, повреждённую деталь и добавьте до четырёх фотографий. В демонстрационной версии данные никуда не отправляются.</p>
          <p class="demo-note">Для официального запуска нужно подключить обработчик формы и согласовать политику обработки персональных данных.</p>
        </div>

        <form class="estimate-form" data-form novalidate>
          <div class="form-grid">
            <div class="field">
              <label for="name">Имя</label>
              <input id="name" name="name" autocomplete="name" aria-describedby="name-error">
              <p class="field-error" id="name-error" data-error="name"></p>
            </div>
            <div class="field">
              <label for="phone">Телефон</label>
              <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 900 000-00-00" aria-describedby="phone-error">
              <p class="field-error" id="phone-error" data-error="phone"></p>
            </div>
            <div class="field">
              <label for="car">Автомобиль</label>
              <input id="car" name="car" placeholder="Марка и модель">
              <p class="field-error" aria-hidden="true"></p>
            </div>
            <div class="field">
              <label for="service">Повреждение</label>
              <select id="service" name="service" aria-describedby="service-error">
                <option value="">Выберите вариант</option>
                ${siteConfig.services.map((service) => `<option value="${escapeHtml(service.title)}">${escapeHtml(service.title)}</option>`).join("")}
                <option value="Другое повреждение">Другое повреждение</option>
              </select>
              <p class="field-error" id="service-error" data-error="service"></p>
            </div>
            <div class="field field--wide">
              <label for="comment">Комментарий</label>
              <textarea id="comment" name="comment" placeholder="Укажите деталь и сообщите, есть ли скол или трещина краски"></textarea>
              <p class="field-error" aria-hidden="true"></p>
            </div>
            <div class="upload">
              <span>Фотографии</span>
              <label class="upload-control" for="photos">
                <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/heic" multiple data-files>
                <span><strong>Выберите до четырёх файлов</strong><small>Файлы остаются только в вашем браузере.</small></span>
                <span class="upload-control__action">Выбрать</span>
              </label>
              <p class="field-error" data-error="photos"></p>
              <div class="file-list" data-file-list></div>
            </div>
            <label class="consent">
              <input name="consent" type="checkbox" aria-describedby="consent-error">
              <span>Я понимаю, что это демонстрационная форма и введённые данные не отправляются.</span>
            </label>
            <p class="field-error" id="consent-error" data-error="consent"></p>
            <div class="form-actions">
              <button class="button" type="submit">Сформировать черновик</button>
              <a class="button button--secondary" href="tel:${escapeHtml(siteConfig.contacts.phone)}">Позвонить</a>
              <p class="form-status" role="status" aria-live="polite" data-status></p>
            </div>
            <div class="form-result" role="status" data-result hidden></div>
          </div>
        </form>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="container price-layout">
        <div>
          <span class="section-kicker">Перед визитом</span>
          <h2>Частые вопросы</h2>
        </div>
        <div class="faq-list">${faqItems}</div>
      </div>
    </section>
  </main>

  <section class="contacts" id="contacts" aria-labelledby="contacts-title">
    <div class="container">
      <span class="section-kicker">Контакты</span>
      <h2 id="contacts-title">Связаться с мастерской</h2>
      <div class="contacts__grid">
        <div class="contact-cell"><small>Телефон</small><a href="tel:${escapeHtml(siteConfig.contacts.phone)}">${escapeHtml(siteConfig.contacts.phoneDisplay)}</a><p>Нажмите, чтобы позвонить.</p></div>
        <div class="contact-cell"><small>Адрес</small><strong>${escapeHtml(siteConfig.contacts.address)}</strong><p>${escapeHtml(siteConfig.contacts.addressNote)}</p></div>
        <div class="contact-cell"><small>Режим и маршрут</small><strong>${escapeHtml(siteConfig.contacts.workHours)}</strong><p><a href="${escapeHtml(siteConfig.contacts.mapUrl)}" target="_blank" rel="noreferrer">Открыть Яндекс Карты</a></p></div>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <span>© <span data-year></span> ${escapeHtml(siteConfig.business.name)} · демонстрационный концепт</span>
      <span>Не является официальным сайтом компании. Индексация отключена.</span>
    </div>
  </footer>

  <div class="mobile-actions" aria-label="Быстрые действия">
    <a href="#estimate">Оценка по фото</a>
    <a href="tel:${escapeHtml(siteConfig.contacts.phone)}">Позвонить</a>
  </div>
`;
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const closeMenu = () => {
    menu?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Открыть меню");
    document.body.classList.remove("menu-open");
};
menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menu?.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.classList.toggle("menu-open", open);
});
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
    if (window.innerWidth > 960)
        closeMenu();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape")
        closeMenu();
});
document.querySelector("[data-year]")?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));
const fileInput = document.querySelector("[data-files]");
const fileList = document.querySelector("[data-file-list]");
const photoError = document.querySelector('[data-error="photos"]');
let selectedFiles = [];
const renderFiles = () => {
    if (!fileList)
        return;
    fileList.replaceChildren();
    selectedFiles.forEach((file, index) => {
        const item = document.createElement("div");
        item.className = "file-item";
        const name = document.createElement("span");
        name.textContent = file.name;
        name.title = file.name;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", `Удалить файл ${file.name}`);
        remove.addEventListener("click", () => {
            selectedFiles.splice(index, 1);
            renderFiles();
        });
        item.append(name, remove);
        fileList.append(item);
    });
};
fileInput?.addEventListener("change", () => {
    if (photoError)
        photoError.textContent = "";
    const incoming = [...(fileInput.files ?? [])].filter((file) => file.type.startsWith("image/"));
    if (selectedFiles.length + incoming.length > 4 && photoError) {
        photoError.textContent = "Можно выбрать не более четырёх фотографий.";
    }
    selectedFiles = [...selectedFiles, ...incoming].slice(0, 4);
    fileInput.value = "";
    renderFiles();
});
const form = document.querySelector("[data-form]");
const status = document.querySelector("[data-status]");
const result = document.querySelector("[data-result]");
const setError = (name, message) => {
    const field = form?.elements.namedItem(name);
    if (field instanceof HTMLElement)
        field.setAttribute("aria-invalid", message ? "true" : "false");
    const error = document.querySelector(`[data-error="${name}"]`);
    if (error)
        error.textContent = message;
};
form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (status)
        status.textContent = "";
    if (result)
        result.hidden = true;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const consent = data.get("consent") === "on";
    setError("name", name.length < 2 ? "Укажите имя." : "");
    setError("phone", phone.replace(/\D/g, "").length < 10 ? "Укажите корректный телефон." : "");
    setError("service", service ? "" : "Выберите тип повреждения.");
    setError("consent", consent ? "" : "Подтвердите демонстрационный режим формы.");
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) {
        firstInvalid.focus();
        if (status)
            status.textContent = "Проверьте заполнение формы.";
        return;
    }
    const car = String(data.get("car") ?? "").trim() || "не указан";
    const comment = String(data.get("comment") ?? "").trim() || "без комментария";
    if (result) {
        result.innerHTML = `<strong>Черновик подготовлен.</strong><br>Имя: ${escapeHtml(name)}<br>Телефон: ${escapeHtml(phone)}<br>Автомобиль: ${escapeHtml(car)}<br>Повреждение: ${escapeHtml(service)}<br>Комментарий: ${escapeHtml(comment)}<br>Фотографий выбрано: ${selectedFiles.length}.<br><br>Данные не отправлены.`;
        result.hidden = false;
    }
    if (status)
        status.textContent = "Ничего не отправлено: это демонстрационная форма.";
});
