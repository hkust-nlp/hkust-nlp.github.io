document.addEventListener('DOMContentLoaded', function () {
    loadTasks(); // 加载任务数据
    initializeDividerArrows(); // 初始化分割线箭头
});

var taskData; // 用于存储任务数据的全局变量

function loadTasks() {
    fetch('/data/To_Release/task_description.json')
        .then(response => response.json())
        .then(data => {
            taskData = data; // 存储任务数据
            initializeTabs(); // 在数据加载后初始化标签页
        })
        .catch(error => console.error('Error loading the tasks:', error));
}

function initializeTabs() {
    // 获取所有的 tab 按钮
    var tabs = document.querySelectorAll('.tabs input[type="radio"]');

    // 为每个 tab 按钮添加点击事件监听
    tabs.forEach(tab => {
        tab.addEventListener('change', () => {
            // 根据选中的tab加载对应的内容
            loadContentForTab(tab);
        });
    });

    // 初始加载第一个tab的内容
    if (tabs.length > 0) {
        loadContentForTab(tabs[0]);
    }
}

function loadContentForTab(tab) {
    var contentLeft = document.querySelector('.content-left');
    var contentRight = document.querySelector('.content-right');

    contentLeft.innerHTML = '';
    contentRight.innerHTML = '';

    var targetClass = tab.getAttribute('data-target').slice(1); // 获取任务对应的类名
    var taskKey = targetClass.split('-')[1]; // 从类名中提取任务关键字

    var task = taskData.find(t => t.Task.toLowerCase() === taskKey);

    if (task) {
        let task_href = ``;
        if (task.Github_url !== '') {
            task_href += `<a class=\"nav-button\" href=\"${task.Github_url}\">\n <img src=\"img/icon/github.png\" alt=\"github\">Gitlab</a>`
        }
        if (task.Paper_url !== '') {
            task_href += `<a class=\"nav-button\" href=\"${task.Paper_url}\">\n <img src=\"img/icon/task_paper.png\" alt=\"task_paper\">Paper</a>`
        }
        if (task.Project_url !== '') {
            task_href += `<a class=\"nav-button\" href=\"${task.Project_url}\">\n <img src=\"img/icon/goto_project.png\" alt=\"goto_project\">Project</a>`
        }
        const taskContent_description = `
            <div class="content-left-content">
                <div class="${targetClass} tab-content">
                    <p style="font-size: 18px; font-weight: bold; margin: 0 0 5px 5px"> > Task Description </p>
                    <img src="${task.Task_image}" alt="${task.Task.toLowerCase()}">
                    <br>
                    &nbsp;&nbsp;${task.Description}
                </div>
            </div>
            <div class="content-left-links">
                ${task_href}
            </div>
        `;
        const taskContent_example = `
            <div class="${targetClass} tab-content">
                <p style="font-size: 18px; font-weight: bold; margin: 0 0 5px 5px"> > Example (By GPT-3.5) </p>
                <div class="container">
                    <div class="top-side">
                        <div id="instruction-top">
                            <img src="img/icon/question_icon.png" alt="question"><strong> Goal</strong>
                            <br>&nbsp;&nbsp;&nbsp;${task.Example.Intent}
                        </div>
                    </div>
                    <div class="bottom-side">
                        <div id="trajectory-long">
                            <img src="img/icon/trajectory_icon.png" alt="example_trajectory"><strong> Example Trajectory</strong>
                            <br>${task.Example.Trajectory}
                        </div>
                        <div id="table-bottom"><a class="nav-button" href=${task.Wandb_url}>
                    <img src="img/icon/more_example.png" alt="more_example">Explore more examples on W&B</a></div>
                    </div>
                </div>
            </div>`;

        contentLeft.innerHTML = taskContent_description;
        contentRight.innerHTML = taskContent_example;
    }
}

function initializeDividerArrows() {
    // 获取左侧和右侧内容元素
    const contentLeft = document.querySelector('.content-left');
    const contentRight = document.querySelector('.content-right');

    // 当鼠标悬停在左侧内容时，加粗左箭头
    contentLeft.addEventListener('mouseenter', () => {
        document.querySelector('.divider').classList.add('left-hover');
    });
    contentLeft.addEventListener('mouseleave', () => {
        document.querySelector('.divider').classList.remove('left-hover');
    });

    // 当鼠标悬停在右侧内容时，加粗右箭头
    contentRight.addEventListener('mouseenter', () => {
        document.querySelector('.divider').classList.add('right-hover');
    });
    contentRight.addEventListener('mouseleave', () => {
        document.querySelector('.divider').classList.remove('right-hover');
    });
}
