document.addEventListener('DOMContentLoaded', () => {

    const dateFrom = document.querySelector('#date-from');
    const dateTo = document.querySelector('#date-to');
    const cardsContainer = document.querySelector('.cards');
    const loadMoreBtn = document.querySelector('.load-more');
    const viewButtons = document.querySelectorAll('.view-btn');

    let allCards = [];
    let filteredCards = [];

    let currentIndex = 0;
    const perPage = 8;

    // =========================
    // VIEW SWITCHER + LOCALSTORAGE
    // =========================

    let currentView = localStorage.getItem('cardsView') || 'grid';

    cardsContainer.classList.add(currentView);

    viewButtons.forEach(btn => {
        if (btn.dataset.view === currentView) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {

            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentView = btn.dataset.view;

            cardsContainer.style.opacity = '0';

            setTimeout(() => {
                cardsContainer.classList.remove('grid', 'list');
                cardsContainer.classList.add(currentView);
                cardsContainer.style.opacity = '1';
            }, 150);

            // SAVE
            localStorage.setItem('cardsView', currentView);
        });
    });

    // =========================
    // FLATPICKR
    // =========================

    let fromPicker = flatpickr("#date-from", {
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr) {

            toPicker.set('minDate', dateStr);
            applyFilter();
        }
    });

    let toPicker = flatpickr("#date-to", {
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr) {

            fromPicker.set('maxDate', dateStr);
            applyFilter();
        }
    });

    // =========================
    // RENDER CARDS
    // =========================

    function renderCards(reset = false) {

        if (reset) {
            currentIndex = 0;
            cardsContainer.innerHTML = '';
        }

        const items = filteredCards.slice(
            currentIndex,
            currentIndex + perPage
        );

        items.forEach((card, i) => {
            const el = document.createElement('li');
            el.className = 'card';

            el.style.animationDelay = `${i * 50}ms`;

            el.innerHTML = `
                <img src="${card.img}" alt="${card.imgAlt}">
               <div class="info">
                <div class="title">
                <h3>${card.title}</h3>
               <ul class="ul-info">
                <li>
                <img src="./img/heart.svg" alt="like">
                 <p>${card.like}</p>
                 </li>
                 <li>
                <img src="./img/comment.svg" alt="comment">
                <p>${card.comment}</p>
                </li>
                </ul>
                </div>
                <div class="title">
                <h3>${card.date}</h3>
                <ul class="ul-info">
                <li>
                <img src="./img/heart.svg" alt="like">
                 <p>${card.likeTwo}</p>
                 </li>
                 <li>
                <img src="./img/comment.svg" alt="comment">
                <p>${card.commentTwo}</p>
                </li>
                </ul>
                </div>
                <div class="upload">
                <p>${card.upload}</p>
                 <p>${card.uploadData}</p>
                </div>
                </div>
            `;

            cardsContainer.appendChild(el);
        });

        currentIndex += perPage;

        toggleLoadMore();
    }

    // =========================
    // SHOW / HIDE BUTTON
    // =========================

    function toggleLoadMore() {
        loadMoreBtn.style.display =
            currentIndex >= filteredCards.length ? 'none' : 'block';
    }

    // =========================
    // FILTER
    // =========================

    function applyFilter() {

        const from = dateFrom.value;
        const to = dateTo.value;

        filteredCards = allCards.filter(card => {
            if (from && card.date < from) return false;
            if (to && card.date > to) return false;
            return true;
        });

        renderCards(true);
    }

    // =========================
    // LOAD DATA
    // =========================

    fetch('./cards.json')
        .then(res => res.json())
        .then(data => {

            allCards = data;
            filteredCards = data;

            cardsContainer.classList.add(currentView);

            renderCards(true);
        });

    // =========================
    // LOAD MORE
    // =========================

    loadMoreBtn.addEventListener('click', () => {

        loadMoreBtn.style.opacity = '0.6';
        loadMoreBtn.disabled = true;

        setTimeout(() => {
            renderCards();
            loadMoreBtn.style.opacity = '1';
            loadMoreBtn.disabled = false;
        }, 180);
    });

    // =========================
    // CLEAR BUTTONS
    // =========================

    document.querySelectorAll('.clear-btn').forEach(btn => {
        btn.addEventListener('click', () => {

            const input = document.getElementById(btn.dataset.target);
            const picker = input._flatpickr;

            if (picker) picker.clear();

            input.value = '';

            applyFilter();
        });
    });

});