<template>
  <div class="servers-tab">
    <search-header name="servers" />
    <div class="items-main-container">
      <div class="items-container">
        <div class="items">
          <server-template :server="serverData[0]"/>
  
  
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchHeader from "./searchHeader";
import serverTemplate from './serverTemplate';

export default {
  components: { searchHeader, serverTemplate },
  data() {
    return {
      serverData: [
        {server_id: "6572151490335477760", name: 'Nertivia', description: 'Nertivia is a cool server.', code: ''},
      ]
    }
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