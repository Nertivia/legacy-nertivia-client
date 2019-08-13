<template>
  <div class="download-popout" @click="backgroundClickEvent">
    <div class="box">
      <div class="header">
        <div class="title">Download Nertivia</div>
        </div>
        <div class="inner-content">
          <div class="download-item" @click="openDownloadPage">
            <div class="image" :style="{backgroundImage: `url(${winImage})`}"></div>
            <div class="title">Windows</div>
          </div>
          <div class="download-item">
            <div class="image linux" :style="{backgroundImage: `url(${linuxImage})`}"></div>
            <div class="title">Coming soon!</div>
          </div>
          <div class="download-item">
            <div class="image" :style="{backgroundImage: `url(${androidImage})`}"></div>
            <div class="title">Coming soon!</div>
          </div>
        </div>
    </div>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      winImage: require('@/assets/PlatformIcons/winLogo.png'),
      linuxImage: require('@/assets/PlatformIcons/linuxLogo.png'),
      androidImage: require('@/assets/PlatformIcons/androidLogo.png'),
    }
  },
  methods: {
    backgroundClickEvent(event) {
      if (event.target.classList.contains("download-popout")) {
        this.$emit('close')
      }
    },
    openDownloadPage() {
      window.open('https://github.com/supertiger1234/nertivia-desktop-app/releases','_blank');
    }
  }
}
</script>

<style lang="scss" scoped>
  .download-popout {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.80);
    display: flex;
    user-select: none;
    cursor: default;
  }

  .box {
    display: flex;
    height: 350px;
    width: 500px;
    margin: auto;
    background: rgb(39, 39, 39);
    flex-direction: column;
    border-radius: 10px;
    overflow: hidden;

  }
  .header {
    height: 50px;
    background: #3fa9f5;  
    widows: 100%;
    color: white;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    .title {
      margin: auto;
    }
  }
  .inner-content {
    display: flex;
    height: 100%;
    width: 100%;
    align-content: center;
    align-items: center;
    justify-content: center;
  }
  .download-item {
    background: rgb(42, 42, 42);
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    border-radius: 5px;
    padding: 10px;
    color: white;
    user-select: none;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      background: rgb(27, 27, 27);
    }
    .image {
      height: 100px;
      width: 100px;
      background-size:contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    .title {
      margin-top: 10px;
    }
  }

  @media (max-width: 480px) {
    .inner-content  {
      flex-direction: column;
      justify-content: inherit;
      overflow: auto;
      align-items: inherit;
      .download-item {
        height: 400px;
      }
    }
  }
</style>