document.addEventListener('DOMContentLoaded', () => {

    // 1. スライドショー制御 (index.htmlのみで動作)
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

    // 2. スクロールアニメーション (Intersection Observer)
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
        });

        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navMenu.classList.remove('is-active');
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
    // 5. Lightbox（画像拡大表示）の統合版
    // ==================================================
    // 拡大画面の枠組みを生成
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

    // 「js-lightbox」クラス（お知らせ用）、またはギャラリーの画像を探す
    const lightboxElements = document.querySelectorAll('.js-lightbox, .gallery-item');

    lightboxElements.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation(); // 重なったリンクが同時にクリックされるのを防ぐ

            let imgSrc = '';
            let captionText = '';

            if (item.classList.contains('gallery-item')) {
                // ギャラリーページの場合
                const img = item.querySelector('.gallery-img');
                const title = item.querySelector('.gallery-title');
                imgSrc = img ? img.getAttribute('src') : '';
                captionText = title ? title.textContent : '';
            } else {
                // お知らせ等の場合（imgタグ自身に情報を埋め込む形式）
                imgSrc = item.getAttribute('src');
                captionText = item.getAttribute('data-caption') || '';
            }
            
            if (imgSrc) {
                lightboxImg.src = imgSrc;
                lightboxCaption.textContent = captionText;
                lightbox.classList.add('is-active');
            }
        });
    });

    // 閉じる処理
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.classList.remove('is-active');
        }
    });

});