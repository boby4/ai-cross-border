<template>
  <div id="app">
    <el-container>
      <el-header class="app-header">
        <div class="header-left">
          <h1 class="app-title">AI 跨境运营助手</h1>
        </div>
        <div class="header-right">
          <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            router
            class="header-menu"
          >
            <el-menu-item index="/">AI 生成</el-menu-item>
            <el-menu-item index="/batch">批量生成</el-menu-item>
            <el-menu-item index="/history">历史记录</el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
  background-color: #f5f7fa;
}

#app {
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 24px;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.app-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.header-menu {
  border-bottom: none !important;
}

.header-menu .el-menu-item {
  height: 60px;
  line-height: 60px;
}

.app-main {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>
