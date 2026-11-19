// パーツHTMLを読み込む関数
async function loadPart(id, file) {
    const element = document.getElementById(id);
    if (!element) return;
    try {
        const response = await fetch(file);
        if (response.ok) {
            element.innerHTML = await response.text();
        }
    } catch (error) {
        console.error(`${file} の読み込みに失敗しました:`, error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. ヘッダー・サイドバー・フッターを同時に読み込む
    await Promise.all([
        loadPart('header-placeholder', 'header.html'),
        loadPart('box2', 'sidebar.html'),
        loadPart('footer-placeholder', 'footer.html')
    ]);

    // 2. フッターが読み込まれた後にCookie同意バナーの処理を実行する
    initCookieBanner();
});

function initCookieBanner() {
    // Cookie同意状況の確認
    if (localStorage.getItem('user-cookie-consent')) {
        return;
    }

    const banner = document.getElementById('simple-cookie-banner');
    if (banner) {
        banner.style.display = 'block';
    }

    // 「同意する」ボタンのイベント
    const acceptBtn = document.getElementById('simple-consent-accept');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('user-cookie-consent', 'accepted');
            banner.remove();
        });
    }

    // 「同意しない」ボタンのイベント
    const rejectBtn = document.getElementById('simple-consent-reject');
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            const result = confirm('本当にいいのですか？');
            if (result) {
                window.close();
                setTimeout(() => {
                    window.location.href = 'about:blank';
                }, 100);
            }
        });
    }
}
