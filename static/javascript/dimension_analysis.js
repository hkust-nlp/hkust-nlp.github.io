async function fetchData() {
    const response = await fetch('/data/To_Release/dimension_score_all.json');
    const models = await response.json();
    return models;
}

function createRadarChart(models) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const colors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
        'rgba(40, 159, 64, 1)',
        'rgba(143, 162, 235, 1)',
        'rgba(255, 99, 75, 1)'
    ];
    const borderStyles = [
        [], [5, 5], [10, 5], [15, 10], [20, 5, 10, 5], [20, 15, 10, 5],
        [25, 10], [30, 5], [35, 5, 20, 5], [40, 10], [45, 15, 10, 5]
    ];
    // const defaultModelsToShow = ['GPT4-8k', 'Claude2-100k', 'ChatGPT3.5-4k', 'llama2-70b-4k', 'codellama-34b-16k', 'lemur-70b-chat', 'codellama-13b-16k'];
    const datasets = models.map((model, index) => {
        const backColor = colors[index].replace(/[\d\.]+\)$/g, '0.15)');
        return {
            label: model.model,
            data: Object.values(model.dimensions).map(value => parseFloat(value) * 100),
            backgroundColor: backColor,
            borderColor: colors[index],
            borderWidth: 2,
            borderDash: borderStyles[index],
            // hidden: !defaultModelsToShow.includes(model.model) // 判断是否隐藏
        };
    });

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(models[0].dimensions),
            datasets: datasets
        },
        options: {
            scales: {
                r: {
                    pointLabels: {
                        font: {
                            size: 12,
                            family: "'Noto Sans', sans-serif",
                            weight: 'bold' // 修改为 weight
                        }
                    },
                    ticks: {
                        font: {
                            size: 12,
                            family: "'Noto Sans', sans-serif",
                            weight: 'bold' // 修改为 weight
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 12,
                            family: "'Noto Sans', sans-serif",
                            weight: 'bold' // 修改为 weight
                        }
                    }
                },
                tooltip: {
                    bodyFont: {
                        size: 12,
                        family: "'Noto Sans', sans-serif",
                        weight: 'bold' // 修改为 weight
                    }
                }
            },
            elements: {
                line: {
                    tension: 0 // 禁用贝塞尔曲线
                }
            },
        }
    });
}

fetchData().then(models => createRadarChart(models));


// save chart
// function saveChartAsPDF(chartId, pdfFilename, printWidth, printHeight) {
//     const chartElement = document.getElementById(chartId);
//
//     html2canvas(chartElement).then(canvas => {
//         const imgData = canvas.toDataURL('image/png');
//         const pdf = new jspdf.jsPDF({
//             orientation: 'landscape',
//             unit: 'px',
//             format: [printWidth, printHeight]
//         });
//
//         const scale = Math.min(printWidth / canvas.width, printHeight / canvas.height);
//         const imgWidth = canvas.width * scale;
//         const imgHeight = canvas.height * scale;
//         const x = (printWidth - imgWidth) / 2;
//         const y = (printHeight - imgHeight) / 2;
//
//         pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
//         pdf.save(pdfFilename);
//     });
// }
//
// document.getElementById('save-pdf-button').addEventListener('click', function () {
//     const printWidth = 297; // A4 纸张宽度，单位毫米
//     const printHeight = 210; // A4 纸张高度，单位毫米
//     saveChartAsPDF('radarChart', 'chart.pdf', printWidth, printHeight);
// });
