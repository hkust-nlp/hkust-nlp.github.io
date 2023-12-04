// Global variables
let rawData;
// let chart = null;
let scoreChart = null;
let accChart = null;

const HardColors = {
    score: '#f398ae',
    accuracy: '#78b5f1',
};

const EasyColors = {
    score: 'rgba(148,121,35,0.26)',
    accuracy: 'rgba(77,154,34,0.2)',
}

const sortby_options = {
    BY_REWARD_SCORE_EASY: "sort-by-reward-score-easy",
    BY_REWARD_SCORE_HARD: "sort-by-reward-score-hard",
    BY_REWARD_SCORE_GAP: "sort-by-reward-score-gap",
    BY_ACCURACY_SCORE_EASY: "sort-by-accuracy-score-easy",
    BY_ACCURACY_SCORE_HARD: "sort-by-accuracy-score-hard",
    BY_ACCURACY_SCORE_GAP: "sort-by-accuracy-score-gap",
};
let currentTask = 'Avg';
let cur_sortby_option = sortby_options.BY_REWARD_SCORE_EASY;

// Load JSON data and initialize the chart
function loadData() {
    fetch('/data/To_Release/difficulty.json')
        .then(response => response.json())
        .then(data => {
            rawData = data;
            createScoreChart();
            createAccChart();
        });
}


function prepareChartData(metricType) {
    const labels = rawData.map(d => d.model);

    const metricDataEasy = rawData.map(d => ({
        x: d.tasks[currentTask].easy ? parseFloat(d.tasks[currentTask].easy[metricType]) : 0,
        y: d.model
    }));

    const metricDataHard = rawData.map(d => ({
        x: d.tasks[currentTask].hard ? parseFloat(d.tasks[currentTask].hard[metricType]) : 0,
        y: d.model
    }));

    const hardColor = HardColors[metricType] || 'gray'; // Fallback to gray if no color is found
    const easyColor = EasyColors[metricType] || 'gray';

    return {
        labels,
        datasets: [
            {
                // label: 'Easy ' + metricType[0].toUpperCase() + metricType.slice(1),
                label: 'Easy Level',
                data: metricDataEasy,
                backgroundColor: easyColor,
                datalabels: {
                    align: (context) => {
                        const value = context.dataset.data[context.dataIndex];
                        return value.x > 80 ? 'end' : 'end'; // 当值大于90%时，标签向左对齐
                    },
                    anchor: 'end', // 标签总是锚定在数据点的末端
                    offset: (context) => {
                        const value = context.dataset.data[context.dataIndex];
                        if (value.x > 95) {
                            return -value.x;
                        } else if (value.x > 83) {
                            return -value.x / 1.5;
                        } else if (value.x > 78) {
                            return -value.x / 3;
                        } else {
                            return 0;
                        }
                    },
                    font: {
                        weight: 'bold', // 加粗字体
                        family: "'Noto Sans', sans-serif" // 字体类型，您可以根据需要更改
                    },
                    formatter: (value, context) => {
                        const modelData = rawData.find(d => d.model === context.chart.data.labels[context.dataIndex]);
                        const gapScore = modelData && modelData.tasks[currentTask].gap ? modelData.tasks[currentTask].gap[metricType] : 0;
                        return `${value.x}% (${formatWithSign(gapScore)}%)`;
                    }
                }
            },
            {
                // label: 'Hard ' + metricType[0].toUpperCase() + metricType.slice(1),
                label: 'Hard Level',
                data: metricDataHard,
                backgroundColor: hardColor,
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    formatter: () => '', // Hard Score的标签不显示
                }
            }
        ]
    };
}

function createScoreChart() {
    const chartData = prepareChartData('score');

    if (scoreChart) {
        scoreChart.destroy();
    }

    scoreChart = new Chart(document.getElementById('difficulty_score_Chart'), {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                y: {
                    ticks: {
                        font: {
                            weight: 'bold', // 加粗 Y 轴刻度文字
                            size: 12,
                            family: "'Noto Sans', sans-serif"
                        },
                    },
                    title: {
                        display: true,
                        text: 'Model',
                        font: {
                            size: 14,
                            family: "'Noto Sans', sans-serif", // 字体类型，您可以根据需要更改
                            weight: 'bold',
                        },
                    },
                    stacked: true,
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        font: {
                            weight: 'bold', // 加粗 Y 轴刻度文字
                            size: 12,
                            family: "'Noto Sans', sans-serif"
                        },
                    },
                    title: {
                        display: true,
                        text: 'Progress Rate (%)',
                        font: {
                            size: 14,
                            family: "'Noto Sans', sans-serif", // 字体类型，您可以根据需要更改
                            weight: 'bold',
                        },

                    },
                    stacked: false,
                    min: 0,
                    max: 100 // 设置x轴范围为0-100
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 12,
                            family: "'Noto Sans', sans-serif",
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    callbacks: {
                        footer: createTooltipFooter('score')
                    }
                },
            }
        },
        plugins: [ChartDataLabels]
    });
}

function createAccChart() {
    const chartData_acc = prepareChartData('accuracy');

    if (accChart) {
        accChart.destroy();
    }

    accChart = new Chart(document.getElementById('difficulty_acc_Chart'), {
        type: 'bar',
        data: chartData_acc,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                y: {
                    ticks: {
                        font: {
                            weight: 'bold', // 加粗 Y 轴刻度文字
                            size: 12,
                            family: "'Noto Sans', sans-serif"
                        },
                    },
                    title: {
                        display: true,
                        text: 'Model',
                        font: {
                            size: 14,
                            family: "'Noto Sans', sans-serif", // 字体类型，您可以根据需要更改
                            weight: 'bold',
                        },
                    },
                    stacked: true,
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        font: {
                            weight: 'bold', // 加粗 Y 轴刻度文字
                            size: 12,
                            family: "'Noto Sans', sans-serif"
                        },
                    },
                    title: {
                        display: true,
                        text: 'Success Rate (%)',
                        font: {
                            size: 14,
                            family: "'Noto Sans', sans-serif", // 字体类型，您可以根据需要更改
                            weight: 'bold',
                        },
                    },
                    stacked: false,
                    min: 0,
                    max: 100 // 设置x轴范围为0-100
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 12,
                            family: "'Noto Sans', sans-serif",
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    callbacks: {
                        footer: createTooltipFooter('accuracy')
                    }
                },
            }
        },
        plugins: [ChartDataLabels]
    });
}

function highlightModelInChart(chart, modelName) {
    let indexToHighlight = -1;

    // 查找需要高亮的模型的索引
    chart.data.labels.forEach((label, index) => {
        if (label.includes(modelName)) {
            indexToHighlight = index;
        }
    });

    // 找到对应模型的数据
    let modelData = rawData.find(d => d.model.includes(modelName));

    // 设置工具提示
    if (modelData) {
        chart.options.plugins.tooltip.callbacks = {
            title: () => modelName,
            label: (context) => {
                let label = context.dataset.label || '';
                let value = context.raw.x;
                return `${label}: ${value}%`;
            },
            footer: () => {
                let gapValue;
                if (chart === scoreChart) {
                    gapValue = modelData.tasks[currentTask].gap ? modelData.tasks[currentTask].gap.score : 'N/A';
                } else if (chart === accChart) {
                    gapValue = modelData.tasks[currentTask].gap ? modelData.tasks[currentTask].gap.accuracy : 'N/A';
                }
                return `Gap: ${gapValue}%`;
            }
        };
    }

    if (indexToHighlight >= 0) {
        chart.tooltip.setActiveElements([{datasetIndex: 0, index: indexToHighlight}, {
            datasetIndex: 1,
            index: indexToHighlight
        }], {
            x: 0, y: 0
        });
    }

    chart.update();
}


document.getElementById('difficulty_score_Chart').addEventListener('mousemove', (event) => {
    const activePoints = scoreChart.getElementsAtEventForMode(event, 'nearest', {intersect: true}, true);
    if (activePoints.length > 0) {
        const firstPoint = activePoints[0];
        const modelName = scoreChart.data.labels[firstPoint.index].split(' ')[0];
        highlightModelInChart(accChart, modelName);
    }
    scoreChart.update();
});

document.getElementById('difficulty_acc_Chart').addEventListener('mousemove', (event) => {
    const activePoints = accChart.getElementsAtEventForMode(event, 'nearest', {intersect: true}, true);
    if (activePoints.length > 0) {
        const firstPoint = activePoints[0];
        const modelName = accChart.data.labels[firstPoint.index].split(' ')[0];
        highlightModelInChart(scoreChart, modelName);
    }
    accChart.update();
});

document.getElementById('difficulty_score_Chart').addEventListener('mouseleave', () => {
    if (accChart) {
        accChart.destroy();
    }
    createAccChart()

});

document.getElementById('difficulty_acc_Chart').addEventListener('mouseleave', () => {
    if (scoreChart) {
        scoreChart.destroy();
    }
    createScoreChart()
});


// Sort rawData based on the selected option
function sortData(sortOption) {
    if (sortOption === sortby_options.BY_REWARD_SCORE_EASY) {
        rawData.sort((a, b) => {
            const scoreA = a.tasks[currentTask].easy ? parseFloat(a.tasks[currentTask].easy.score) : 0;
            const scoreB = b.tasks[currentTask].easy ? parseFloat(b.tasks[currentTask].easy.score) : 0;
            return scoreB - scoreA;
        });
    } else if (sortOption === sortby_options.BY_REWARD_SCORE_HARD) {
        rawData.sort((a, b) => {
            const scoreA = a.tasks[currentTask].hard ? parseFloat(a.tasks[currentTask].hard.score) : 0;
            const scoreB = b.tasks[currentTask].hard ? parseFloat(b.tasks[currentTask].hard.score) : 0;
            return scoreB - scoreA;
        });
    } else if (sortOption === sortby_options.BY_REWARD_SCORE_GAP) {
        rawData.sort((a, b) => {
            const scoreA = a.tasks[currentTask].gap ? parseFloat(a.tasks[currentTask].gap.score) : 0;
            const scoreB = b.tasks[currentTask].gap ? parseFloat(b.tasks[currentTask].gap.score) : 0;
            return scoreB - scoreA;
        });
    } else if (sortOption === sortby_options.BY_ACCURACY_SCORE_EASY) {
        rawData.sort((a, b) => {
            const accuracyA = a.tasks[currentTask].easy ? parseFloat(a.tasks[currentTask].easy.accuracy) : 0;
            const accuracyB = b.tasks[currentTask].easy ? parseFloat(b.tasks[currentTask].easy.accuracy) : 0;
            return accuracyB - accuracyA;
        });
    } else if (sortOption === sortby_options.BY_ACCURACY_SCORE_HARD) {
        rawData.sort((a, b) => {
            const accuracyA = a.tasks[currentTask].hard ? parseFloat(a.tasks[currentTask].hard.accuracy) : 0;
            const accuracyB = b.tasks[currentTask].hard ? parseFloat(b.tasks[currentTask].hard.accuracy) : 0;
            return accuracyB - accuracyA;
        });
    } else if (sortOption === sortby_options.BY_ACCURACY_SCORE_GAP) {
        rawData.sort((a, b) => {
            const accuracyA = a.tasks[currentTask].gap ? parseFloat(a.tasks[currentTask].gap.accuracy) : 0;
            const accuracyB = b.tasks[currentTask].gap ? parseFloat(b.tasks[currentTask].gap.accuracy) : 0;
            return accuracyB - accuracyA;
        });
    }
}

// Event listeners for task filter buttons
document.querySelectorAll('.btn-group.task-filter-selector-for-difficulty .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentTask = btn.id.replace('difficulty-tasks-filter-', '');

        document.querySelectorAll('.btn-group.task-filter-selector-for-difficulty .btn.active').forEach(active => {
            active.classList.remove('active');
        });
        btn.classList.add('active');

        sortData(cur_sortby_option);  // Sort the data based on the current sort option
        createScoreChart();  // Re-create the chart with sorted data
        createAccChart()
    });
});

// 更新Accuracy图表的排序按钮组
document.querySelectorAll('.right-chart-panel .sort-by-button .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除Accuracy按钮组内所有按钮的active状态
        document.querySelectorAll('.right-chart-panel .sort-by-button .btn').forEach(button => {
            button.classList.remove('active');
        });

        // 激活当前点击的按钮
        btn.classList.add('active');

        // 更新排序选项并重新创建Accuracy图表
        cur_sortby_option = btn.id;
        sortData(cur_sortby_option);
        createAccChart();
    });
});

// 更新Score图表的排序按钮组
document.querySelectorAll('.left-chart-panel .sort-by-button .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除Score按钮组内所有按钮的active状态
        document.querySelectorAll('.left-chart-panel .sort-by-button .btn').forEach(button => {
            button.classList.remove('active');
        });

        // 激活当前点击的按钮
        btn.classList.add('active');

        // 更新排序选项并重新创建Score图表
        cur_sortby_option = btn.id;
        sortData(cur_sortby_option);
        createScoreChart();
    });
});


// Page load event
window.onload = function () {
    loadData();
    // 设置默认选项并添加active类
    document.getElementById('sort-by-accuracy-score-easy').classList.add('active');
    document.getElementById('sort-by-reward-score-easy').classList.add('active');
    // 默认排序并创建图表
    cur_sortby_option = sortby_options.BY_ACCURACY_SCORE_EASY;
    sortData(cur_sortby_option);
    createAccChart();
    cur_sortby_option = sortby_options.BY_REWARD_SCORE_EASY;
    sortData(cur_sortby_option);
    createScoreChart();
};

function formatWithSign(num) {
    // 确保num是一个数字
    const number = parseFloat(num);
    if (isNaN(number)) {
        return num;  // 如果num不是数字，原样返回
    }
    return (number > 0 ? "+" : "") + number.toFixed(2); // 格式化数字，保留两位小数并在正数前加上 '+'
}

function createTooltipFooter(gapType) {
    return function (tooltipItems) {
        let tooltipItem = tooltipItems[0];
        let model = tooltipItem.label;
        let modelData = rawData.find(d => d.model === model);
        let gapValue = modelData && modelData.tasks[currentTask].gap ? modelData.tasks[currentTask].gap[gapType] : 'N/A';
        return 'Gap: ' + gapValue + '%';
    }
}