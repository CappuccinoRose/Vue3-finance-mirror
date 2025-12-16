<template>
    <div class="metric-cards-grid">
        <!-- 首页总览卡片 -->
        <div v-for="metric in metrics" :key="metric.key" class="metric-card" :class="`trend-${metric.trend}`">
            <div class="metric-content">
                <div class="metric-title">{{ metric.title }}</div>
                <div class="metric-value">{{ formatCurrency(metric.value) }}</div>
                <div class="metric-change">
                    <span class="trend-icon">{{ metric.trendIcon }}</span>
                    <span class="change-text">{{ metric.change }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Metric {
    key: string
    title: string
    value: number
    change: string
    trend: 'positive' | 'negative' | 'neutral'
    trendIcon: string
}

const props = defineProps<{
    metrics: Metric[]
    loading?: boolean
}>()

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount)
}
</script>

<style scoped>
.metric-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 10px;
}

.metric-card {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(74, 158, 255, 0.2);
    border-radius: 16px;
    padding: 20px;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    overflow: hidden;
}

.metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4a9eff, #00d4ff, #a1ffef, #4a9eff);
    background-size: 300% 100%;
    animation: breathe-glow 4s ease-in-out infinite;
}

.metric-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow:
        0 14px 28px rgba(0, 0, 0, 0.25),
        0 10px 10px rgba(0, 0, 0, 0.22),
        0 0 0 1px rgba(74, 158, 255, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.metric-content {
    position: relative;
    z-index: 1;
}

.metric-title {
    color: #94a3b8;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
}

.metric-value {
    color: #f8fafc;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}

.metric-change {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
}

.trend-positive {
    color: #10b981;
}

.trend-negative {
    color: #ef4444;
}

.trend-neutral {
    color: #6b7280;
}

.trend-icon {
    font-weight: bold;
}

.change-text {
    font-weight: 500;
}

@keyframes breathe-glow {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

@media (max-width: 1200px) {
    .metric-cards-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
}

@media (max-width: 768px) {
    .metric-cards-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
}
</style>
