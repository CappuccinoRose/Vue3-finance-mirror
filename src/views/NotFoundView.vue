<template>
  <div class="not-found-container">
    <div class="glow-bg"></div>
    <div class="grid-bg"></div>
    
    <div class="card">
      <div class="error-visual">
        <div class="error-number">404</div>
        <div class="error-glow"></div>
      </div>
      
      <div class="error-content">
        <h2 class="error-title">页面未找到</h2>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被移除
        </p>
      </div>
      
      <div class="action-buttons">
        <el-button type="primary" class="primary-btn" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button class="secondary-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回上一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { House, ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.not-found-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  overflow: hidden;
}


.glow-bg {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(74, 158, 255, 0.15) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 70% 80%,
    rgba(161, 255, 239, 0.1) 0%,
    transparent 50%
  );
  animation: float 20s ease-in-out infinite;
}

.grid-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(74, 158, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74, 158, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
  animation: grid-move 10s linear infinite;
}

.card {
  position: relative;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(74, 158, 255, 0.2);
  border-radius: 24px;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 100px rgba(74, 158, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 60px 50px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  z-index: 1;
}

.error-visual {
  position: relative;
  margin-bottom: 40px;
}

.error-number {
  font-size: 120px;
  font-weight: 900;
  background: linear-gradient(135deg, #4a9eff 0%, #a1ffef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(74, 158, 255, 0.5);
  position: relative;
  z-index: 2;
  letter-spacing: -2px;
}

.error-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(74, 158, 255, 0.3) 0%,
    transparent 70%
  );
  filter: blur(40px);
  z-index: 1;
  animation: pulse 3s ease-in-out infinite;
}

.error-content {
  margin-bottom: 40px;
}

.error-title {
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.error-description {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn {
  background: linear-gradient(135deg, #4a9eff 0%, #a1ffef 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  color: #0f172a !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  height: 48px !important;
  padding: 0 24px !important;
  transition: all 0.3s ease !important;
  box-shadow:
    0 8px 24px rgba(74, 158, 255, 0.3),
    0 0 20px rgba(74, 158, 255, 0.2) !important;
  position: relative;
  overflow: hidden;
}

.primary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.primary-btn:hover::before {
  left: 100%;
}

.primary-btn:hover {
  background: linear-gradient(135deg, #5aa5ff 0%, #b3fff3 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 12px 32px rgba(74, 158, 255, 0.4),
    0 0 30px rgba(74, 158, 255, 0.3) !important;
}

.primary-btn:active {
  transform: translateY(0) !important;
  box-shadow:
    0 6px 20px rgba(74, 158, 255, 0.3),
    0 0 15px rgba(74, 158, 255, 0.2) !important;
}

.secondary-btn {
  background: rgba(30, 41, 59, 0.8) !important;
  border: 1px solid rgba(74, 158, 255, 0.3) !important;
  border-radius: 12px !important;
  color: #a1ffef !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  height: 48px !important;
  padding: 0 24px !important;
  transition: all 0.3s ease !important;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.secondary-btn:hover {
  background: rgba(30, 41, 59, 0.9) !important;
  border-color: rgba(74, 158, 255, 0.5) !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(74, 158, 255, 0.2) !important;
}

.secondary-btn:active {
  transform: translateY(0) !important;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(1deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(-1deg);
  }
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@media (max-width: 600px) {
  .card {
    padding: 40px 30px;
  }
  
  .error-number {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .primary-btn,
  .secondary-btn {
    width: 100%;
    max-width: 200px;
  }
}

.el-icon {
  margin-right: 8px;
  font-size: 18px;
}
</style>
