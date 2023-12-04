// 当鼠标悬停在 sidebar-toggle 上时展开侧边栏
document.getElementById('sidebar-toggle').addEventListener('mouseenter', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.style.left = '0px';
    this.style.left = '136px'; // 根据侧边栏宽度调整
});

// 当鼠标在页面其他地方移动时检查是否需要收回侧边栏
document.addEventListener('mousemove', function(event) {
    var sidebar = document.getElementById('sidebar');
    var toggle = document.getElementById('sidebar-toggle');

    // 检查鼠标是否不在 sidebar 和 sidebar-toggle 上
    if (!sidebar.contains(event.target) && !toggle.contains(event.target)) {
        sidebar.style.left = '-135px';
        toggle.style.left = '0px';
    }
});

// 监听所有锚点链接的点击事件
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // 阻止默认锚点跳转行为

        // 获取目标元素
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // 计算顶部固定元素的高度
            var offsetTop = document.getElementById('nav').offsetHeight;

            // 计算目标元素的位置，并减去顶部元素的高度
            var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offsetTop * 1.5;

            // 平滑滚动到计算后的位置
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

