function toastInfo(message, duration = 3000) {
    // 创建样式表
    const style = document.createElement('style');
    style.textContent = `
        .toast-container {
            position: fixed;
            top: 360px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            pointer-events: none;
        }
        .toast-message {
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            margin: 0 auto;
            max-width: 80%;
            text-align: center;
        }
        .toast-message.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // 创建容器元素
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // 创建消息元素
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    container.appendChild(toast);

    // 触发重排以应用初始样式
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // 设置自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode === container) {
                container.removeChild(toast);
            }
            // 如果容器为空，移除样式表和容器
            if (!container.children.length) {
                document.head.removeChild(style);
                document.body.removeChild(container);
            }
        }, 300);
    }, duration);
}

// init
document.addEventListener("DOMContentLoaded", () => {
    const orderTimi = document.getElementById('order-timi');
    if (orderTimi) {
        orderTimi.addEventListener('click', () => {
            toastInfo("Timi is coming soon. Stay tuned for updates!", 2600);
        });
    }

    const timiLearnmore = document.getElementById('timi-learnmore');
    if (timiLearnmore) {
        timiLearnmore.addEventListener('click', () => {
            window.open('https://journals.sagepub.com/doi/10.1177/20965311231218013?icid=int.sj-full-text.similar-articles.3#:~:text=Five%20big%20ideas%20of%20AI%20for%20K%2D12&text=In%202018%2C%20the%20AI4K12%20initiative,natural%20interaction%2C%20and%20societal%20impact.', '_blank');
        });
    }

    const orderHarmony = document.getElementById('order-harmony');
    if (orderHarmony) {
        orderHarmony.addEventListener('click', () => {
            toastInfo("Harmony is coming soon. Stay tuned for updates!", 2600);
        });
    }

    const harmonyLearnmore = document.getElementById('harmony-learnmore');
    if (harmonyLearnmore) {
        harmonyLearnmore.addEventListener('click', () => {
            window.open('https://www.sciencedirect.com/science/article/pii/S2949882124000380', '_blank');
        });
    }
})