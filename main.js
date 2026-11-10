document.addEventListener('DOMContentLoaded', () => {
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
});
