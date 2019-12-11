<template>
  <div class="panel">
    <div class="title">Unapproved Themes</div>
    <div class="list">
      <theme-template v-for="theme in themes" :key="theme.id" :theme="theme" />
    </div>
  </div>
</template>


<script>
import ThemeTemplate from './ThemeTemplate';
import adminService from '@/services/adminService';

export default {
  components: {ThemeTemplate},
  data() {
    return {
      themes: null,
    }
  },
  async mounted() {
    const {ok, error, result} = await adminService.fetchWaitingThemes();
    if (ok) {
      this.themes = result.data;
    }
  }
}
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  height: 100%;
  width: 300px;
  margin-left: 5px;
  margin-right: 5px;
}
.title {
  background: rgba(0, 0, 0, 0.4);
  padding: 5px;
  text-align: center;
}
.list {
  overflow: auto;
}
</style>