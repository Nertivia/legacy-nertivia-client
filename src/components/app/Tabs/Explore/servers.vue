<template>
  <div class="servers-tab">
    <search-header name="servers" />
    <div class="items-main-container">
      <div class="items-container">
        <div class="items">
          <server-template v-for="server in publicServers" :key="server.id" :server="server"/>
  
  
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchHeader from "./searchHeader";
import serverTemplate from './serverTemplate';
import exploreService from '@/services/exploreService';

export default {
  components: { searchHeader, serverTemplate },
  data() {
    return {
      publicServers: null,
    }
  },
  methods: {
    async getServersList() {
      const {ok, result, error} = await exploreService.getServersList();
      if (ok) {
        this.publicServers =  result.data;
      }

    }
  },
  mounted() {
    this.getServersList();
  }
};
</script>

<style lang="scss" scoped>
.servers-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.items-main-container {
  display: flex;
  flex-direction: column;
  overflow: auto;


}
.items-container {
  display: block;
  align-content: center;
  align-items: center;
  max-width: 1066px;
  margin: auto;
  width: 100%;
  .items {
    margin-top: 40px;
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, 250px);
    grid-auto-rows: min-content;
    align-items: stretch;
    justify-content: space-evenly;
    user-select: none;
  }
}
</style>