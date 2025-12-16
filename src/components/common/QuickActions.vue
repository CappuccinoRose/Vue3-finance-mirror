<template>
    <el-row class="quick-actions">
        <!-- 快速访问卡片 -->
        <el-col :span="24">
            <el-card class="quick-actions-card">
                <template #header>
                    <div class="card-header">
                        <span class="header-icon">⚡</span>
                        <span class="header-title">快速操作</span>
                    </div>
                </template>

                <!-- 第一行按钮 -->
                <el-row :gutter="16" class="button-row">
                    <el-col :span="8">
                        <el-button type="primary" @click="handleNavigate('/reports')" class="action-btn full-width">
                            <el-icon>
                                <Document />
                            </el-icon>
                            财务报表
                        </el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="success" @click="handleNavigate('/journal')" class="action-btn full-width">
                            <el-icon>
                                <Edit />
                            </el-icon>
                            录入凭证
                        </el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="warning" @click="handleNavigate('/customers')" class="action-btn full-width">
                            <el-icon>
                                <Money />
                            </el-icon>
                            客户管理
                        </el-button>
                    </el-col>
                </el-row>

                <!-- 第二行按钮 -->
                <el-row :gutter="16" class="button-row">
                    <el-col :span="8">
                        <el-button type="info" @click="handleNavigate('/vendors')" class="action-btn full-width">
                            <el-icon>
                                <CreditCard />
                            </el-icon>
                            供应商管理
                        </el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="danger" @click="handleNavigate('/expenses')" class="action-btn full-width">
                            <el-icon>
                                <Wallet />
                            </el-icon>
                            费用管理
                        </el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary" plain @click="handleNavigate('/accounts')"
                            class="action-btn full-width">
                            <el-icon>
                                <List />
                            </el-icon>
                            会计科目
                        </el-button>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { Document, Edit, Money, CreditCard, Wallet, List } from '@element-plus/icons-vue'

const emit = defineEmits<{
    navigate: [route: string]
}>()

const handleNavigate = (route: string) => {
    emit('navigate', route)
}
</script>

<style scoped>
.quick-actions {
    margin-top: 24px;
}

.quick-actions-card {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(74, 158, 255, 0.2);
    border-radius: 24px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.quick-actions-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 32px 64px rgba(74, 158, 255, 0.2);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #e2e8f0;
    font-weight: 600;
    font-size: 16px;
}

.header-icon {
    font-size: 20px;
}

.header-title {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.button-row {
    margin-bottom: 16px;
}

.button-row:last-child {
    margin-bottom: 0;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 12px;
    border-radius: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    height: 56px;
    width: 100%;
}

.full-width {
    width: 100%;
}

.action-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.action-btn:hover::before {
    left: 100%;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(74, 158, 255, 0.3);
}

@media (max-width: 1200px) {
    .action-btn {
        padding: 14px 10px;
        height: 52px;
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    .button-row {
        margin-bottom: 12px;
    }

    .action-btn {
        padding: 12px 8px;
        height: 48px;
        font-size: 13px;
    }
}

@media (max-width: 576px) {
    .el-col {
        margin-bottom: 12px;
    }

    .el-col[class*="span-8"] {
        flex: 0 0 50%;
        max-width: 50%;
    }

    .action-btn {
        padding: 10px 6px;
        height: 44px;
        font-size: 12px;
    }
}
</style>
