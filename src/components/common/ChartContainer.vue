<template>
    <el-card class="chart-container-card">
        <!-- echart图表 -->
        <template #header>
            <div class="chart-header">
                <span class="chart-title">{{ title }}</span>
                <div class="chart-actions">
                    <el-button size="small" @click="refreshChart" class="action-btn">
                        <el-icon>
                            <Refresh />
                        </el-icon>
                    </el-button>
                </div>
            </div>
        </template>
        <div ref="chartRef" class="chart-container"></div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { Refresh } from '@element-plus/icons-vue'

interface Props {
    title: string
    chartData: any
    chartType: 'line' | 'bar' | 'pie'
    height?: number
}

const props = withDefaults(defineProps<Props>(), {
    height: 300
})

const emit = defineEmits<{
    refresh: []
}>()

const chartRef = ref<HTMLDivElement>()
let chartInstance: any = null
let echarts: any = null

// 配色
const techColors = {
    primary: '#00d4ff',
    secondary: '#0099ff',
    accent: '#00ffcc',
    warning: '#ff6b35',
    success: '#00ff88',
    purple: '#7c3aed',
    pink: '#ff006e',
    yellow: '#ffbe0b'
}

// 饼图
const pieColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2'
]

const colorPalette = Object.values(techColors)

const initChart = async () => {
    if (!chartRef.value) return

    // 导入 echarts
    echarts = await import('echarts')
    chartInstance = echarts.init(chartRef.value, 'dark')
    updateChart()
}

const updateChart = () => {
    if (!chartInstance || !props.chartData) return

    const option = getChartOption(props.chartType, props.chartData)
    chartInstance.setOption(option, true)
}

const getChartOption = (type: string, data: any) => {
    const baseOption = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 20, 40, 0.95)',
            borderColor: techColors.primary,
            borderWidth: 1,
            textStyle: {
                color: '#ffffff',
                fontSize: 13,
                fontFamily: 'Monaco, Consolas, monospace'
            },
            extraCssText: 'backdrop-filter: blur(20px); border-radius: 4px; box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);'
        }
    }

    switch (type) {
        // 曲线图设置
        case 'line':
            return {
                ...baseOption,
                grid: {
                    left: '5%',
                    right: '1%',
                    top: '15%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: data.periods || [],
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(0, 212, 255, 0.3)',
                            width: 1
                        }
                    },
                    axisLabel: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: 12,
                        fontFamily: 'Monaco, Consolas, monospace',
                        rotate: 45,
                        interval: 0,
                        margin: 10,
                    },
                    axisTick: {
                        lineStyle: {
                            color: 'rgba(0, 212, 255, 0.2)'
                        },
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(0, 212, 255, 0.3)',
                            width: 1
                        }
                    },
                    axisLabel: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: 12,
                        fontFamily: 'Monaco, Consolas, monospace',
                        formatter: (value: number) => {
                            if (value >= 10000) {
                                return (value / 10000).toFixed(1) + 'w'
                            }
                            return value.toString()
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(0, 212, 255, 0.1)',
                            type: 'dashed',
                            width: 0.5
                        }
                    },
                    nameTextStyle: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: 10
                    }
                },
                legend: {
                    data: ['流入', '流出'],
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 12,
                        fontFamily: 'Monaco, Consolas, monospace'
                    },
                    top: '5%',
                    itemWidth: 12,
                    itemHeight: 8,
                    itemGap: 20
                },
                series: [
                    {
                        name: '流入',
                        data: data.inflows || [],
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 6,
                        itemStyle: {
                            color: techColors.primary,
                            borderColor: '#000',
                            borderWidth: 2,
                            shadowColor: techColors.primary,
                            shadowBlur: 10
                        },
                        lineStyle: {
                            width: 2,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: techColors.primary },
                                { offset: 1, color: techColors.accent }
                            ]),
                            shadowColor: techColors.primary,
                            shadowBlur: 15
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                                { offset: 1, color: 'rgba(0, 212, 255, 0.02)' }
                            ])
                        }
                    },
                    {
                        name: '流出',
                        data: data.outflows || [],
                        type: 'line',
                        smooth: true,
                        symbol: 'diamond',
                        symbolSize: 6,
                        itemStyle: {
                            color: techColors.warning,
                            borderColor: '#000',
                            borderWidth: 2,
                            shadowColor: techColors.warning,
                            shadowBlur: 10
                        },
                        lineStyle: {
                            width: 2,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: techColors.warning },
                                { offset: 1, color: techColors.pink }
                            ]),
                            shadowColor: techColors.warning,
                            shadowBlur: 15
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(255, 107, 53, 0.3)' },
                                { offset: 1, color: 'rgba(255, 107, 53, 0.02)' }
                            ])
                        }
                    }
                ]
            }
        // 饼图设置
        case 'pie':
            const pieDataWithColors = (data.series || []).map((item: any, index: number) => ({
                ...item,
                itemStyle: {
                    color: pieColors[index % pieColors.length],
                    borderRadius: 2,
                    borderColor: 'rgba(0, 0, 0, 0.6)',
                    borderWidth: 1,
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 5,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 15,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        scale: 1.05,
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        borderWidth: 1
                    }
                }
            }))

            return {
                ...baseOption,
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0, 20, 40, 0.95)',
                    borderColor: techColors.primary,
                    borderWidth: 1,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 13,
                        fontFamily: 'Monaco, Consolas, monospace'
                    },
                    extraCssText: 'border-radius: 4px; box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);',
                    appendToBody: true,
                    formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
                },

                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top: 'center',
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: 11,
                        fontFamily: 'Monaco, Consolas, monospace'
                    },
                    itemWidth: 10,
                    itemHeight: 8,
                    itemGap: 8,
                    pageIconColor: techColors.primary,
                    pageTextStyle: {
                        color: 'rgba(255, 255, 255, 0.6)'
                    },
                    padding: [0, 20, 0, 0]
                },
                series: [{
                    name: '收支结构',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['64%', '50%'],
                    data: pieDataWithColors,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            scale: 1.05
                        }
                    },
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    animationType: 'expansion',
                    animationEasing: 'elasticOut',
                    animationDuration: 1000,
                    hoverOffset: 5,
                    avoidLabelOverlap: true
                }]
            }
        default:
            return baseOption
    }
}

const refreshChart = () => {
    emit('refresh')
}

watch(() => props.chartData, updateChart, { deep: true })

onMounted(() => {
    nextTick(initChart)
})
</script>

<style scoped>
.chart-container-card {
    background: linear-gradient(135deg, rgba(0, 10, 20, 0.9) 0%, rgba(0, 20, 40, 0.8) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 8px;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(0, 212, 255, 0.3),
        0 0 40px rgba(0, 212, 255, 0.1);
    height: 75%;
    position: relative;
    overflow: visible;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-container-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00d4ff, transparent);
    animation: scan 3s linear infinite;
}

.chart-container-card:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 212, 255, 0.4);
    box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(0, 212, 255, 0.4),
        0 0 60px rgba(0, 212, 255, 0.2);
}

.chart-container-card :deep(.el-card__header) {
    padding: 8px 16px;
    min-height: 28px;
    border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
}


.chart-title {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
    letter-spacing: 1px;
    font-family: 'Monaco', 'Consolas', monospace;
}

.action-btn {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    color: #00d4ff;
    border-radius: 4px;
    transition: all 0.3s ease;
    width: 28px;
    height: 28px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn:hover {
    background: rgba(0, 212, 255, 0.2);
    border-color: #00d4ff;
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
}

.chart-container {
    height: v-bind('height + "px"');
    width: 90%;
    position: relative;
    z-index: 1;
}

@keyframes scan {
    0% {
        left: -100%;
    }

    100% {
        left: 100%;
    }
}
</style>
