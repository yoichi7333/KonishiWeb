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

        // メニュー項目をクリックしたらメニューを閉じる（ページ内リンク用）
        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navMenu.classList.remove('is-active');
            });
        });
    }

    // ==================================================
    // 4. Lightbox (ギャラリー画像の拡大表示)
    // ==================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeBtn = document.querySelector('.lightbox-close');

        // 各画像をクリックした時の処理
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // クリックされた画像のURLとタイトルを取得
                const img = item.querySelector('.gallery-img');
                const title = item.querySelector('.gallery-title').textContent;
                
                // ライトボックスの中にセットして表示
                lightboxImg.src = img.src;
                lightboxCaption.textContent = title;
                lightbox.classList.add('is-active');
            });
        });

        // 閉じる処理（バツボタン、または背景の黒い部分をクリックした時）
        const closeLightbox = () => {
            lightbox.classList.remove('is-active');
            // フワッと消えるアニメーションが終わってから画像を空にする
            setTimeout(() => {
                if(!lightbox.classList.contains('is-active')) {
                    lightboxImg.src = '';
                }
            }, 400);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            // 画像自体ではなく、背景部分をクリックした時だけ閉じる
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    } // ★修正箇所：ここを正しい閉じカッコ `}` に直しました

    // ==================================================
    // 5. 【追加】PC用：追従するスライディング・インジケーター（マジックライン）
    // ==================================================
    // 画面幅がPCサイズ（769px以上）の時のみ実行
    if (window.innerWidth > 768) {
        const nav = document.querySelector('nav ul');
        if (nav) {
            // インジケーター（動く背景）を生成してメニューの中に追加
            const indicator = document.createElement('div');
            indicator.classList.add('nav-indicator');
            nav.appendChild(indicator);

            // WEB予約ボタン以外のメニューリンクを取得
            const links = nav.querySelectorAll('li:not(.reserve-btn) a');
            let activeLink = nav.querySelector('a.active'); // 現在表示しているページのリンク

            // インジケーターを目的のメニューに移動させる関数
            function moveIndicator(el) {
                const rect = el.getBoundingClientRect();
                const navRect = nav.getBoundingClientRect();
                
                // 親要素（ul）の左端からの距離と、文字の幅を計算
                const left = rect.left - navRect.left;
                const width = rect.width;

                indicator.style.width = `${width}px`;
                indicator.style.transform = `translateX(${left}px)`;
                indicator.style.opacity = '1';
            }

            // 1. ページ読み込み時：現在いるページ（Active）にインジケーターを合わせる
            if (activeLink) {
                setTimeout(() => moveIndicator(activeLink), 100);
            }

            // 2. マウスが乗った時：そのメニューにスライドさせる
            links.forEach(link => {
                link.addEventListener('mouseenter', (e) => {
                    moveIndicator(e.target);
                });
            });

            // 3. マウスがメニュー全体から外れた時：現在いるページ（Active）に戻る
            nav.addEventListener('mouseleave', () => {
                if (activeLink) {
                    moveIndicator(activeLink);
                } else {
                    indicator.style.opacity = '0'; // Activeなページがなければ透明にして隠す
                }
            });
        }
    }

});