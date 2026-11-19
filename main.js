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

// 最新記事のプレビュー一覧を生成する関数
async function loadPostPreviews() {
    const container = document.getElementById('post-list-container');
    if (!container) return; // 記事個別ページでは何もしない

    try {
        const response = await fetch('posts.json');
        if (!response.ok) throw new Error('記事データの取得に失敗');
        const posts = await response.json();

        container.innerHTML = posts.map(post => `
            <article class="post-preview-card">
                <div class="post-preview-meta">
                    <time datetime="${post.date}" class="post-preview-date">${post.date}</time>
                    <span class="post-preview-category">${post.category}</span>
                </div>
                <h3 class="post-preview-title">
                    <a href="${post.url}">${post.title}</a>
                </h3>
                <p class="post-preview-summary">${post.summary}</p>
                <div class="post-preview-more">
                    <a href="${post.url}" class="read-more-btn">続きを読む →</a>
                </div>
            </article>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p>記事の読み込みに失敗しました。</p>';
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. 共通パーツと記事一覧を同時に読み込む
    await Promise.all([
        loadPart('header-placeholder', 'header.html'),
        loadPart('box2', 'sidebar.html'),
        loadPart('footer-placeholder', 'footer.html'),
        loadPostPreviews()
    ]);

    // 2. Cookie同意バナーの制御を実行
    initCookieBanner();
});

function initCookieBanner() {
    if (localStorage.getItem('user-cookie-consent')) {
        return;
    }

    const banner = document.getElementById('simple-cookie-banner');
    if (banner) {
        banner.style.display = 'block';
    }

    const acceptBtn = document.getElementById('simple-consent-accept');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('user-cookie-consent', 'accepted');
            banner.remove();
        });
    }

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
