(() => {
    const setScrollProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty('--scroll-progress', (max > 0 ? (window.scrollY / max * 100) : 0) + '%')
    };
    setScrollProgress();
    window.addEventListener('scroll', setScrollProgress, {passive: true});
    window.addEventListener('resize', setScrollProgress);
    const modal = document.getElementById('contactModal');
    document.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () => modal.classList.add('open')));
    document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => modal.classList.remove('open')));
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('open')
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') modal.classList.remove('open')
    });
    const form = document.getElementById('leadForm'), status = document.getElementById('formStatus');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const d = new FormData(form);
        const message = [
            'Заявка на бесплатную консультацию Bitcore', 'Имя: ' + d.get('name'), 'Телефон: ' + d.get('phone'), 'Компания: ' + (d.get('company') || 'Не указана'), 'Задача: ' + (d.get('task') || 'Не указана')
        ].join('\n');
        const url = 'https://t.me/share/url?text=' + encodeURIComponent(message);
        window.open(url, '_blank', 'noopener');
        status.textContent = 'Открылся Telegram с подготовленным текстом заявки. Отправьте сообщение команде Bitcore.';
    });
    document.querySelectorAll('[data-contact]').forEach(el => el.addEventListener('click', () => {
        alert('Добавьте официальную ссылку Bitcore на ' + el.dataset.contact + ' перед публикацией сайта.')
    }));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('visible');
                observer.unobserve(el)
            }
        })
    }, {threshold: .14, rootMargin: '0px 0px -5% 0px'});
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    // Progressive reveal for grouped cards, with a restrained cadence.
    document.querySelectorAll('.service-grid,.principle-grid,.case-list,.audit-steps').forEach(group => {
        [...group.children].forEach((el, i) => {
            el.style.transitionDelay = (Math.min(i, 4) * 95) + 'ms';
        });
    });
})();

(() => {
    const viewport = document.getElementById('caseViewport');
    if (!viewport) return;
    const track = viewport.querySelector('.case-track');
    const cards = [...track.children];
    const prev = document.querySelector('[data-case-prev]');
    const next = document.querySelector('[data-case-next]');
    const current = document.getElementById('caseCurrent');
    const total = document.getElementById('caseTotal');
    total.textContent = String(cards.length).padStart(2, '0');
    let active = 0;
    const step = () => {
        const card = cards[0];
        return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0) : 0
    };
    const update = () => {
        const center = viewport.scrollLeft + viewport.clientWidth / 2;
        let best = 0, dist = Infinity;
        cards.forEach((card, i) => {
            const c = card.offsetLeft + card.offsetWidth / 2;
            const d = Math.abs(c - center);
            if (d < dist) {
                dist = d;
                best = i
            }
        });
        active = best;
        current.textContent = String(active + 1).padStart(2, '0');
        prev.disabled = active === 0;
        next.disabled = active === cards.length - 1
    };
    const go = (n) => {
        const target = Math.max(0, Math.min(cards.length - 1, n));
        viewport.scrollTo({
            left: cards[target].offsetLeft - (viewport.clientWidth - cards[target].offsetWidth) / 2,
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
    };
    prev.addEventListener('click', () => go(active - 1));
    next.addEventListener('click', () => go(active + 1));
    let ticking = false;
    viewport.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                update();
                ticking = false
            });
            ticking = true
        }
    });
    window.addEventListener('resize', update);
    viewport.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            go(active + 1)
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            go(active - 1)
        }
    });
    viewport.tabIndex = 0;
    update();
})();
