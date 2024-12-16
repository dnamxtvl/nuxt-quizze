<template>
    <Bar :id="'my-chart-id'" :options="chartOptions" :data="chartData" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Đăng ký các plugin với ChartJS
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

export default {
    props: {
        getDataChart: {
            type: Array,
            required: true
        }
    },
    name: 'BarChart',
    components: {
        Bar
    },
    data() {
        return {
            chartData: {
                labels: this.getDataChart.map((item, index) => 'Câu ' + (index + 1)),
                datasets: [
                    {
                        data: this.getDataChart,
                        backgroundColor: [
                            'rgb(226, 27, 60)',
                            'rgb(216, 158, 0)',
                            'rgb(19, 104, 206)',
                            'rgb(38, 137, 12)'
                        ],
                        borderColor: [
                            'rgb(226, 27, 60)',
                            'rgb(216, 158, 0)',
                            'rgb(19, 104, 206)',
                            'rgb(38, 137, 12)'
                        ],
                        borderWidth: 1,
                        minBarLength: 35
                    }
                ]
            },
            chartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        anchor: 'start',
                        align: 'top',
                        color: '#fff',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 4,
                        padding: {
                            top: 4,
                            right: 10,
                            bottom: 4,
                            left: 10
                        },
                        font: {
                            weight: 'bold',
                            size: 15
                        },
                        formatter: function (value) {
                            return value;
                        }
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                }
            }
        }
    }

}
</script>

<style scoped lang="scss">
#my-chart-id {
    width: 80%;
}
</style>
