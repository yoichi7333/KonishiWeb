document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // 1. スライドショー制御 (index.htmlのみで動作)
    // ==================================================
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

    // ==================================================
    // 2. スクロールアニメーション (Intersection Observer)
    // ==================================================
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
            
            // ★追加：メニューが開いている時は背面のスクロールを禁止する
            if (navMenu.classList.contains('is-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navMenu.classList.remove('is-active');
                document.body.style.overflow = ''; // ★追加：メニューを閉じたらスクロールを許可する
            });
        });
    }

    // ==================================================
    // 4. PC用：追従するスライディング・インジケーター
    // ==================================================
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
    // 5. ギャラリーページ用 Lightbox（自動生成）
    // ==================================================
    const galleryLightbox = document.createElement('div');
    galleryLightbox.classList.add('lightbox');
    galleryLightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="" alt="" class="lightbox-img">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(galleryLightbox);

    const galleryLightboxImg = galleryLightbox.querySelector('.lightbox-img');
    const galleryLightboxCaption = galleryLightbox.querySelector('.lightbox-caption');
    const lightboxElements = document.querySelectorAll('.js-lightbox, .gallery-item');

    lightboxElements.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation();

            let imgSrc = '';
            let captionText = '';

            if (item.classList.contains('gallery-item')) {
                const img = item.querySelector('.gallery-img');
                const title = item.querySelector('.gallery-title');
                imgSrc = img ? img.getAttribute('src') : '';
                captionText = title ? title.textContent : '';
            } else {
                imgSrc = item.getAttribute('src');
                captionText = item.getAttribute('data-caption') || '';
            }
            
            if (imgSrc) {
                galleryLightboxImg.src = imgSrc;
                galleryLightboxCaption.textContent = captionText;
                galleryLightbox.classList.add('is-active');
            }
        });
    });

    galleryLightbox.addEventListener('click', (e) => {
        if (e.target !== galleryLightboxImg) {
            galleryLightbox.classList.remove('is-active');
        }
    });

    // ==================================================
    // 6. お知らせページ用 Lightbox（今回追加分）
    // ==================================================
    const triggers = document.querySelectorAll('.js-lightbox-trigger');
    const customLightbox = document.getElementById('custom-lightbox');
    
    // customLightbox が存在するページ（お知らせページ）だけで動かす
    if (customLightbox) {
        const targetImg = document.getElementById('lightbox-target-img');
        const closeBtn = customLightbox.querySelector('.lightbox-close');

        // 画像をクリックした時
        triggers.forEach(function(trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault(); 
                const imagePath = this.getAttribute('href'); 
                if (targetImg) {
                    targetImg.setAttribute('src', imagePath); 
                }
                customLightbox.classList.add('is-active'); 
            });
        });

        // 閉じるボタン（×）をクリックした時
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                customLightbox.classList.remove('is-active'); 
            });
        }

        // 背景の黒い部分をクリックした時
        customLightbox.addEventListener('click', function(e) {
            if (e.target === customLightbox) {
                customLightbox.classList.remove('is-active');
            }
        });
    }

}); // ★すべてのプログラムをここで1回だけ閉じます