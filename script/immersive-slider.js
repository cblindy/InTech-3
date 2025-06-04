document.addEventListener("DOMContentLoaded", () => {
    // Настройки по умолчанию
    const defaults = {
        slideSelector: ".slide",
        loop: true,
        autoStart: false
    };

    function immersiveSlider(element, options) {
        const settings = { ...defaults, ...options };

        // Проверка на наличие слайдера
        if (!element) {
            console.error("Слайдер не найден!");
            return;
        }

        // Находим слайды
        const slides = element.querySelectorAll(settings.slideSelector);
        if (!slides.length) {
            console.error("Слайды не найдены!");
            return;
        }
        console.log(`Найдено ${slides.length} слайдов`);

        // Инициализация слайдов
        slides.forEach((slide, index) => {
            slide.classList.add("is-slide");
            slide.id = `slide_${index + 1}`;
        });

        // Создаём контейнер для фонов
        const bgOverflow = document.createElement("div");
        bgOverflow.className = "is-bg-overflow";
        slides.forEach((slide, index) => {
            const imgSrc = slide.dataset.blurred;
            if (!imgSrc) {
                console.warn(`У слайда ${slide.id} отсутствует атрибут data-blurred!`);
                return;
            }
            const bgDiv = document.createElement("div");
            bgDiv.id = `slide_${index + 1}_bg`;
            bgDiv.className = "is-background";
            bgDiv.innerHTML = `<img src="${imgSrc}" alt="Background">`;
            bgOverflow.appendChild(bgDiv);
        });
        element.insertBefore(bgOverflow, element.firstChild);

        // Создаём контейнер для слайдов
        const overflow = document.createElement("div");
        overflow.className = "is-overflow";
        slides.forEach(slide => {
            overflow.appendChild(slide);
        });
        element.insertBefore(overflow, element.querySelector(".is-nav"));

        // Находим кнопки навигации
        const prev = element.querySelector(".is-prev");
        const next = element.querySelector(".is-next");
        if (!prev || !next) {
            console.error("Кнопки навигации не найдены!");
            return;
        }

        let currentIndex = 0;
        let isAnimating = false;

        function moveSlider(index, direction, isInitial = false) {
            if (isAnimating) return;
            if (index >= slides.length) index = settings.loop ? 0 : slides.length - 1;
            if (index < 0) index = settings.loop ? slides.length - 1 : 0;

            isAnimating = true;

            // Находим текущий и новый слайд
            const currentSlide = slides[currentIndex];
            const currentBg = bgOverflow.querySelector(`#slide_${currentIndex + 1}_bg`);
            const newSlide = slides[index];
            const newBg = bgOverflow.querySelector(`#slide_${index + 1}_bg`);

            // Убираем класс active у текущих элементов и добавляем анимацию ухода
            if (currentSlide && !isInitial) {
                currentSlide.classList.remove("active");
                // Меняем направление: при "next" уходим влево, при "prev" — вправо
                currentSlide.classList.add(direction === "next" ? "exiting-to-left" : "exiting-to-right");
                console.log(`Слайд ${currentSlide.id} уходит ${direction === "next" ? "влево" : "вправо"}`);
            }

            if (currentBg && !isInitial) {
                currentBg.classList.remove("active");
                currentBg.classList.add(direction === "next" ? "exiting-to-left" : "exiting-to-right");
            }

            // Добавляем анимацию появления для нового слайда
            if (!isInitial) {
                newSlide.classList.remove("active", "from-left", "from-right", "exiting-to-left", "exiting-to-right");
                // Меняем направление: при "next" приходим справа, при "prev" — слева
                newSlide.classList.add(direction === "next" ? "from-right" : "from-left");
                newBg.classList.remove("active", "from-left", "from-right", "exiting-to-left", "exiting-to-right");
                newBg.classList.add(direction === "next" ? "from-right" : "from-left");
            }

            // Даём время на завершение анимации ухода, затем активируем новый слайд
            setTimeout(() => {
                newSlide.classList.add("active");
                newBg.classList.add("active");
                console.log(`Слайд ${newSlide.id} активирован${isInitial ? " (начальная загрузка)" : " с " + direction}`);
                console.log(`Классы нового слайда (${newSlide.id}): ${newSlide.className}`);
                console.log(`Классы нового фона (${newBg.id}): ${newBg.className}`);

                // Обновляем текущий индекс
                currentIndex = index;
                isAnimating = false;
            }, isInitial ? 0 : 500);
        }

        // Обработчики событий для кнопок
        prev.addEventListener("click", (e) => {
            e.preventDefault();
            if (!isAnimating) {
                console.log("Prev clicked");
                moveSlider(currentIndex - 1, "prev");
            }
        });

        next.addEventListener("click", (e) => {
            e.preventDefault();
            if (!isAnimating) {
                console.log("Next clicked");
                moveSlider(currentIndex + 1, "next");
            }
        });

        // Показываем первый слайд при загрузке
        moveSlider(0, "next", true);
    }

    // Инициализация слайдера
    const slider = document.querySelector("#immersive_slider");
    if (slider) {
        immersiveSlider(slider, {
            loop: true,
            autoStart: false
        });
    } else {
        console.error("Слайдер #immersive_slider не найден!");
    }
});
