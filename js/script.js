document.addEventListener('DOMContentLoaded', () => {

    // 1. スライドショー制御 (index.htmlのみ)
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        const dots = document.querySelectorAll('.dot');
        let current = 0;
        
        function nextSlide() {
            slides[current].classList.remove('is-active');
            dots[current].classList.remove('is-active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('is-active');
            dots[current].classList.add('is-active');
        }
        setInterval(nextSlide, 6000);
    }

    // 2. スクロールアニメーション
    const scrollElements = document.querySelectorAll('.js-scroll');
    if (scrollElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        scrollElements.forEach(el => observer.observe(el));
    }

    // 3. ハンバーガーメニューの開閉制御
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('#nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('is-active');
            
            // メニューが開いている時は背面のスクロールを禁止
            if (navMenu.classList.contains('is-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // メニューのリンクをクリックしたら閉じる
        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navMenu.classList.remove('is-active');
                document.body.style.overflow = '';
            });
        });
    }

    // 4. PC用：追従するスライディング・インジケーター
    if (window.innerWidth > 768) {
        const nav = document.querySelector('nav ul');
        if (nav) {
            const indicator = document.createElement('div');
            indicator.classList.add('nav-indicator');
            nav.appendChild(indicator);

            const links = nav.querySelectorAll('li:not(.reserve-btn) a');
            let activeLink = nav.querySelector('a.active');

            function moveIndicator(el) {
                const rect = el.getBoundingClientRect();
                const navRect = nav.getBoundingClientRect();
                const left = rect.left - navRect.left;
                const width = rect.width;

                indicator.style.width = `${width}px`;
                indicator.style.transform = `translateX(${left}px)`;
                indicator.style.opacity = '1';
            }

            if (activeLink) {
                setTimeout(() => moveIndicator(activeLink), 100);
            }

            links.forEach(link => {
                link.addEventListener('mouseenter', (e) => {
                    moveIndicator(e.target);
                });
            });

            nav.addEventListener('mouseleave', () => {
                if (activeLink) {
                    moveIndicator(activeLink);
                } else {
                    indicator.style.opacity = '0';
                }
            });
        }
    }

    // ==================================================
    // 5. 統合版 Lightbox (ギャラリー ＆ お知らせ共通)
    // ==================================================
    // 拡大画面の枠組み（HTML）を自動で作る
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="" alt="" class="lightbox-img">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');

    // 「ギャラリーの画像」と「お知らせの拡大リンク」を両方探す
    const lightboxElements = document.querySelectorAll('.gallery-item, .js-lightbox');

    lightboxElements.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // 通常のリンク移動をストップ
            
            let imgSrc = '';
            let captionText = '';

            // ギャラリーからクリックされた場合
            if (item.classList.contains('gallery-item')) {
                const img = item.querySelector('.gallery-img');
                const title = item.querySelector('.gallery-title');
                imgSrc = img ? img.getAttribute('src') : '';
                captionText = title ? title.textContent : '';
            } 
            // お知らせ（js-lightbox）からクリックされた場合
            else {
                imgSrc = item.getAttribute('href');
                captionText = item.getAttribute('data-caption') || '';
            }

            // 画像があれば拡大表示する
            if (imgSrc) {
                lightboxImg.src = imgSrc;
                lightboxCaption.textContent = captionText;
                lightbox.classList.add('is-active');
            }
        });
    });

    // 拡大画面の背景や×ボタンをクリックしたら閉じる
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.classList.remove('is-active');
            // フワッと消えた後に画像を空にする
            setTimeout(() => {
                if (!lightbox.classList.contains('is-active')) {
                    lightboxImg.src = '';
                }
            }, 400);
        }
    });

});