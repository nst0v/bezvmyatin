import { siteConfig } from '../config/site.js';
const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => {
    const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
    };
    return entities[character] ?? character;
});
const phoneHref = `tel:${siteConfig.contacts.phone}`;
const serviceRows = siteConfig.services
    .map((service, index) => `
      <article class="service-row">
        <span class="service-row__number">${String(index + 1).padStart(2, '0')}</span>
        <h3>${escapeHtml(service.title)}</h3>
        <p>${escapeHtml(service.description)}</p>
        <small>${escapeHtml(service.examples)}</small>
      </article>`)
    .join('');
const photoSteps = siteConfig.photoSteps
    .map((step) => `
      <li class="photo-step">
        <span>${escapeHtml(step.number)}</span>
        <div>
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.description)}</p>
        </div>
      </li>`)
    .join('');
const processSteps = siteConfig.process
    .map((step) => `
      <article class="process-step">
        <span>${escapeHtml(step.number)}</span>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.description)}</p>
      </article>`)
    .join('');
const pricingFactors = siteConfig.pricing.factors
    .map((factor, index) => `
      <div class="factor-row">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHtml(factor.title)}</strong>
        <p>${escapeHtml(factor.description)}</p>
      </div>`)
    .join('');
const faqItems = siteConfig.faq
    .map((item, index) => `
      <details class="faq-item" ${index === 0 ? 'open' : ''}>
        <summary><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(item.question)}<b aria-hidden="true">+</b></summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>`)
    .join('');
export function renderSite() {
    return `
    <a class="skip-link" href="#main">Перейти к содержанию</a>
    <div class="demo-bar" role="note">${escapeHtml(siteConfig.demo.label)}</div>

    <header class="site-header">
      <div class="container site-header__inner">
        <a class="wordmark" href="#top" aria-label="${escapeHtml(siteConfig.business.name)}: к началу страницы">Бе<span>Z</span>вмятин</a>

        <nav class="main-nav" aria-label="Основная навигация" data-menu>
          <a href="#services">Услуги</a>
          <a href="#photos">Оценка по фото</a>
          <a href="#method">Метод</a>
          <a href="#estimate">Обращение</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <a class="header-phone" href="${phoneHref}">${escapeHtml(siteConfig.contacts.phoneDisplay)}</a>
        <button class="menu-button" type="button" aria-label="Открыть меню" aria-expanded="false" data-menu-button>
          <span aria-hidden="true"></span>
        </button>
      </div>
    </header>

    <main id="main">
      <section class="hero" id="top">
        <div class="container hero__grid">
          <div class="hero__copy">
            <p class="overline">${escapeHtml(siteConfig.hero.eyebrow)}</p>
            <h1>${escapeHtml(siteConfig.hero.title)}</h1>
            <p class="hero__lead">${escapeHtml(siteConfig.hero.lead)}</p>
            <div class="hero__actions">
              <a class="button" href="#estimate">${escapeHtml(siteConfig.hero.primaryCta)}</a>
              <a class="button button--secondary" href="${phoneHref}">${escapeHtml(siteConfig.hero.secondaryCta)}</a>
            </div>
          </div>

          <figure class="hero-media">
            <img src="${escapeHtml(siteConfig.assets.hero)}" width="1600" height="1180" alt="Диагностические полосы на кузовной поверхности показывают локальную деформацию">
            <figcaption>${escapeHtml(siteConfig.hero.visualCaption)}</figcaption>
          </figure>
        </div>
      </section>

      <section class="facts" aria-label="Подтверждённые сведения">
        <div class="container">
          <dl>
            ${siteConfig.verifiedFacts
        .map((fact) => `<div><dt>${escapeHtml(fact.term)}</dt><dd>${escapeHtml(fact.description)}</dd></div>`)
        .join('')}
          </dl>
        </div>
      </section>

      <section class="section" id="services">
        <div class="container">
          <header class="section-heading section-heading--wide">
            <p class="section-label">С чем обращаются</p>
            <h2>Повреждения, которые стоит показать мастеру</h2>
            <p>Окончательное решение зависит не только от размера. Важны форма, расположение, состояние краски и доступ к панели.</p>
          </header>
          <div class="service-list">${serviceRows}</div>
        </div>
      </section>

      <section class="photo-route" id="photos">
        <div class="container photo-route__grid">
          <div class="photo-route__intro">
            <p class="section-label section-label--light">Предварительная оценка</p>
            <h2>Три фотографии дают больше информации, чем десять одинаковых</h2>
            <p>Снимайте при ровном свете, без фильтров и цифрового зума. Если краска повреждена, покажите это отдельно.</p>
            <a class="button button--light" href="#estimate">Подготовить обращение</a>
          </div>
          <ol class="photo-steps">${photoSteps}</ol>
        </div>
      </section>

      <section class="section method" id="method">
        <div class="container method__grid">
          <div class="method__copy">
            <p class="section-label">Как работает диагностика</p>
            <h2>${escapeHtml(siteConfig.method.title)}</h2>
            <p>${escapeHtml(siteConfig.method.description)}</p>
            <ul>
              ${siteConfig.method.facts.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </div>

          <figure class="method-media">
            <img src="${escapeHtml(siteConfig.assets.method)}" width="1200" height="960" alt="Изгиб диагностических полос на кузовной поверхности">
            <figcaption>Демонстрационный макровизуал принципа PDR. Не фотография выполненной работы.</figcaption>
          </figure>
        </div>

        <div class="container comparison-wrap">
          <div class="comparison-heading">
            <p class="section-label">Интерактивное объяснение</p>
            <h3>Как меняется отражённая линия</h3>
            <p>Передвигайте ползунок. Слева линии искажены деформацией, справа поверхность показана ровной.</p>
          </div>
          <div class="comparison" data-comparison style="--split: 52%">
            <img class="comparison__after" src="${escapeHtml(siteConfig.assets.after)}" width="1280" height="820" alt="Ровные диагностические линии на поверхности">
            <div class="comparison__before" aria-hidden="true">
              <img src="${escapeHtml(siteConfig.assets.before)}" width="1280" height="820" alt="">
            </div>
            <span class="comparison__label comparison__label--before">Деформация</span>
            <span class="comparison__label comparison__label--after">Ровная поверхность</span>
            <span class="comparison__divider" aria-hidden="true"></span>
            <label class="visually-hidden" for="comparison-range">Положение сравнения поверхности</label>
            <input id="comparison-range" type="range" min="0" max="100" value="52" data-comparison-range aria-valuetext="Показано 52 процента поверхности до выравнивания">
          </div>
          <p class="comparison-note">Сравнение объясняет метод и не является кейсом компании.</p>
        </div>
      </section>

      <section class="process-section">
        <div class="container process-layout">
          <header class="section-heading section-heading--light">
            <p class="section-label section-label--light">Порядок работы</p>
            <h2>От фотографии до решения</h2>
            <p>Сайт не обещает результат до диагностики. Он помогает передать мастеру исходные данные без лишней переписки.</p>
          </header>
          <div class="process-list">${processSteps}</div>
        </div>
      </section>

      <section class="section" id="price">
        <div class="container price-layout">
          <header class="section-heading">
            <p class="section-label">Стоимость</p>
            <h2>${escapeHtml(siteConfig.pricing.title)}</h2>
            <p>${escapeHtml(siteConfig.pricing.description)}</p>
            <a class="text-link" href="#estimate">Перейти к форме</a>
          </header>
          <div class="factor-list">${pricingFactors}</div>
        </div>
      </section>

      <section class="estimate" id="estimate">
        <div class="container estimate__grid">
          <div class="estimate__copy">
            <p class="section-label section-label--light">Оценка по фото</p>
            <h2>Подготовьте обращение</h2>
            <p>Заполните короткую форму и добавьте фотографии. В демо появится локальный черновик, но данные никуда не отправятся.</p>
            <div class="estimate__phone">
              <span>Запись по телефону</span>
              <a href="${phoneHref}">${escapeHtml(siteConfig.contacts.phoneDisplay)}</a>
            </div>
          </div>

          <form class="estimate-form" novalidate data-estimate-form>
            <div class="form-grid">
              <label class="field">
                <span>Имя</span>
                <input type="text" name="name" autocomplete="name" aria-describedby="name-error">
                <small class="field-error" id="name-error" data-error-for="name"></small>
              </label>
              <label class="field">
                <span>Телефон</span>
                <input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="+7 900 000-00-00" aria-describedby="phone-error">
                <small class="field-error" id="phone-error" data-error-for="phone"></small>
              </label>
              <label class="field">
                <span>Автомобиль</span>
                <input type="text" name="car" placeholder="Марка и модель">
              </label>
              <label class="field">
                <span>Повреждённая деталь</span>
                <select name="part" aria-describedby="part-error">
                  <option value="">Выберите деталь</option>
                  <option value="door">Дверь</option>
                  <option value="fender">Крыло</option>
                  <option value="hood">Капот</option>
                  <option value="roof">Крыша</option>
                  <option value="trunk">Крышка багажника</option>
                  <option value="other">Другая деталь</option>
                </select>
                <small class="field-error" id="part-error" data-error-for="part"></small>
              </label>
              <label class="field field--wide">
                <span>Комментарий</span>
                <textarea name="comment" rows="4" placeholder="Например: вмятина на передней двери, краска визуально целая"></textarea>
              </label>
            </div>

            <div class="upload-block">
              <div>
                <strong>Фотографии</strong>
                <p>До четырёх JPG, PNG или WEBP. Файлы остаются в браузере.</p>
              </div>
              <label class="upload-button">
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple data-file-input>
                <span>Выбрать файлы</span>
              </label>
            </div>
            <small class="field-error" data-error-for="photos"></small>
            <p class="file-empty" data-file-empty>Фотографии пока не выбраны.</p>
            <div class="file-previews" data-file-previews></div>

            <label class="consent">
              <input type="checkbox" name="demoConsent">
              <span>Я понимаю, что это демонстрационная форма и данные не отправляются.</span>
            </label>
            <small class="field-error" data-error-for="demoConsent"></small>

            <button class="button" type="submit">Проверить обращение</button>
            <div class="form-success" hidden tabindex="-1" data-form-success>
              <strong>Черновик готов.</strong>
              <p>Ничего не отправлено. Для реального обращения позвоните в мастерскую.</p>
              <a href="${phoneHref}">${escapeHtml(siteConfig.contacts.phoneDisplay)}</a>
            </div>
          </form>
        </div>
      </section>

      <section class="section proof-faq" id="faq">
        <div class="container proof-faq__grid">
          <aside class="proof-block">
            <p class="section-label">Проверяемые материалы</p>
            <h2>${escapeHtml(siteConfig.proof.title)}</h2>
            <p>${escapeHtml(siteConfig.proof.description)}</p>
            <div class="proof-links">
              <a class="button" href="${escapeHtml(siteConfig.business.mapUrl)}" target="_blank" rel="noopener noreferrer">Открыть Яндекс Карты</a>
              <a class="text-link" href="${escapeHtml(siteConfig.business.currentSiteUrl)}" target="_blank" rel="noopener noreferrer">Текущий сайт компании</a>
            </div>
          </aside>
          <div class="faq-block">
            <p class="section-label">Перед обращением</p>
            <h2>Частые вопросы</h2>
            <div class="faq-list">${faqItems}</div>
          </div>
        </div>
      </section>

      <section class="contacts" id="contacts">
        <div class="container contacts__grid">
          <div>
            <p class="section-label section-label--light">Контакты</p>
            <h2>${escapeHtml(siteConfig.business.name)}</h2>
            <p>${escapeHtml(siteConfig.contacts.address)}</p>
            <p>${escapeHtml(siteConfig.contacts.workHours)}</p>
            <small>${escapeHtml(siteConfig.contacts.addressNote)}</small>
          </div>
          <div class="contacts__actions">
            <a class="contacts__phone" href="${phoneHref}">${escapeHtml(siteConfig.contacts.phoneDisplay)}</a>
            <a class="button button--light" href="${escapeHtml(siteConfig.business.mapUrl)}" target="_blank" rel="noopener noreferrer">Открыть маршрут</a>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container site-footer__inner">
        <span>${escapeHtml(siteConfig.demo.label)}</span>
        <span>Индексация отключена. Форма не отправляет данные.</span>
      </div>
    </footer>

    <div class="mobile-actions" aria-label="Быстрые действия">
      <a href="#estimate">Подготовить фото</a>
      <a href="${phoneHref}">Позвонить</a>
    </div>
  `;
}
