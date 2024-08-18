/**
 * 监听系统主题
 * @type {MediaQueryList}
 */
var OSTheme = window.matchMedia('(prefers-color-scheme: dark)');
OSTheme.addListener(e => {
    if (window.localStorage.getItem('Theme_Mode') === 'auto') {
        ThemeChange('auto');
    }
})
/**
 * 自动模式 6:00-18:00-Light 18:00-6:00-Dark,开启后每三十分钟检查一次
 */
const AutoMode = (htmlElement) => {
    var date = new Date();
    var hours = date.getHours();
    if (hours < 18 && hours >= 6) {
        document.querySelector("html").id = "Light";
    } else {
        document.querySelector("html").id = "Dark";
    }
    // if (htmlElement.id === "Light") {    // 闪瞎你的眼模式（速度快一点的话）
    //     htmlElement.id = "Dark";
    // } else { htmlElement.id = "Light"; }
}

let autoTimer;

/**
 * 修改博客主题
 * @param theme 亮为light,暗为dark,自动为auto
 * @constructor
 */
const ThemeChange = (theme) => {
    // 清除计时器
    clearInterval(autoTimer);
    // 抽取元素
    const htmlElement = document.querySelector("html");
    let themeBtnIcon;
    try {
        themeBtnIcon = document.querySelector("#start > aside > footer > div > a:last-child > i")
    }
    catch {
        // 元素不存在
    }

    if (theme === 'light' || (theme === 'auto' && !OSTheme.matches)) {
        htmlElement.id = "Light";
        if (themeBtnIcon) {
            themeBtnIcon.className = 'fa-solid fa-sun fa-spin fa-spin-reverse';
        }
    } else {
        htmlElement.id = "Dark";
        if (themeBtnIcon) {
            themeBtnIcon.className = 'fa-solid fa-moon fa-fade';
        }
    }
    if (theme === 'auto') {
        if (themeBtnIcon) {
            themeBtnIcon.className = 'fa-solid fa-circle-half-stroke fa-flip';
        }
        AutoMode(htmlElement);
        autoTimer = setInterval(function () {
            AutoMode(htmlElement);
        }, 1000 * 60 * 30); // 半小时一次
    }
    window.localStorage.setItem('Theme_Mode', theme);
}

/**
 * 初始化博客主题
 */
switch (window.localStorage.getItem('Theme_Mode')) {
    case 'light':
        ThemeChange('light');
        break;
    case 'dark':
        ThemeChange('dark');
        break;
    default:
        ThemeChange('auto');
}
/**
 * 切换主题模式
 */
// 绑定按钮点击事件
try {
    document.querySelector("#start > aside > footer > div > a:last-child").onclick = () => {
        if (window.localStorage.getItem('Theme_Mode') === 'auto') {
            hud.toast('🌞白天模式');
            ThemeChange('light');
        } else if (window.localStorage.getItem('Theme_Mode') === 'light') {
            hud.toast('🌙 夜间模式');
            ThemeChange('dark');
        } else {
            hud.toast('🌞/🌙 自动模式');
            ThemeChange('auto');
        }
    }
} catch {
    // 元素不存在
}

