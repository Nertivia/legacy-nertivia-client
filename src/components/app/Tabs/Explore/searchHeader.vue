<template>
  <div class="search-header">
    <div class="filter-area">
      <div class="filter">
        <div class="title">Filter:</div>
        <div class="filter-item">
          <div
            class="item"
            v-for="(filter, index) in filters"
            :class="{selected: filterSelected === index}"
            :key="filter.name"
            @click="filterSelected = index"
          >{{filter.name}}</div>
        </div>
      </div>
      <div class="filter">
        <div class="title">Sort By:</div>
        <div class="filter-item">
          <div
            class="item"
            v-for="(sortBy, index) in sortBys"
            :class="{selected: sortSelected === index}"
            :key="sortBy.name"
            @click="sortSelected = index"
          >{{sortBy.name}}</div>
        </div>
      </div>
    </div>
    <div class="search-area">
      <input type="text" :placeholder="`Search for ${name}`" />
    </div>
  </div>
</template>

<script>
import qs from "querystring";

export default {
  props: ["name"],
  data() {
    return {
      filters: [
        { name: "All", param: "", value: true },
        { name: "Verified", param: "verified", default: true, value: true }
      ],
      sortBys: [
        { name: "Alphabetical", param: "", value: true },
        { name: "Most Users", param: "most_users", value: true },
        { name: "Least Users", param: "most_users", value: false },
        { name: "Date Added", param: "date_added", value: true }
      ],
      filterSelected: 1,
      sortSelected: 0
    };
  },
  methods: {
    param(){
      const filter = this.filters[this.filterSelected];
      const sort = this.sortBys[this.sortSelected];      
      const query = {};

      !!filter.param && (query[filter.param] = filter.value);
      !!sort.param && (query[sort.param] = sort.value);

      return '?' + qs.stringify(query);
    }
  }, 
  watch:{ 
    filterSelected() {
      this.$emit('params', this.param())
    },
    sortSelected() {
      this.$emit('params', this.param())
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


@media (max-width: 945px) {
  .search-header {
    flex-direction: column;
    height: initial;
  }
  .search-area {
    order: 1;
    margin: 0;
    width: 100%;
    input {
      width: 95%;
      overflow: hidden;
      border-radius: 0;
      margin-top: 1px;

    }

  }
  .filter-area{
    order: 2;
  }
}

</style>