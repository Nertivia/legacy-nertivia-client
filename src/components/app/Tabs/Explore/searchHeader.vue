<template>
  <div class="search-header">
    <div class="filter-area">
      <div class="filter">
        <div class="title">Filter:</div>
        <div class="filter-item">
          <div class="item">All</div>
          <div class="item selected">Verified</div>
        </div>
      </div>
      <div class="filter">
        <div class="title">Sort By:</div>
        <div class="filter-item">
          <div class="item selected">Most Users</div>
          <div class="item">Least Users</div>
          <div class="item">Date Added</div>
        </div>
      </div>
    </div>
    <div class="search-area">
      <input type="text" :placeholder="`Search for ${name}`" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["name"],
  data() {
    return {

    }

  }
};
</script>

<style lang="scss" scoped>
.search-header {
  display: flex;
  background: rgba(0, 0, 0, 0.231);
  width: 100%;
  height: 70px;
  flex-shrink: 0;
}
.search-area {
  height: 100%;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  margin-right: 0;
}
input {
  border-radius: 5px;
}

.filter-area {
  display: flex;
}
.filter {
  margin-top: 2px;
  user-select: none;
  margin-left: 10px;
  width: 200px;
  .filter-item {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 57px;
  }
  .title {
    font-size: 17px;
    color: white;
    border-bottom: solid 1px rgba(255, 255, 255, 0.575);
    padding-left: 2px;
    padding-right: 5px;
    padding-bottom: 2px;
  }
  font-size: 15px;
  .item {
    color: white;
    opacity: 0.5;
    cursor: pointer;
    margin: 2px;
    transition: 0.3s;
    &.selected {
      opacity: 0.9;
    }
    &:hover {
      opacity: 0.8; 
    }
  }
}
</style>