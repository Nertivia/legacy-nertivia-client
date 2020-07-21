<template>
  <div class="search-header">
    <div class="filter-area">
      <div class="filter">
        <div class="title">{{this.$t('filter')}}</div>
        <div class="filter-item">
          <div
            class="item"
            v-for="(filter, index) in filters"
            :class="{ selected: filterSelected === index }"
            :key="filter.name"
            @click="filterSelected = index"
          >
            {{ filter.name }}
          </div>
        </div>
      </div>
      <div class="filter">
        <div class="title">{{this.$t('sort-by')}}</div>
        <div class="filter-item">
          <div
            class="item"
            v-for="(sortBy, index) in sortBys"
            :class="{ selected: sortSelected === index }"
            :key="sortBy.name"
            @click="sortSelected = index"
          >
            {{ sortBy.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="search-area" v-if="false">
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
        { name: this.$t('all'), param: "", value: true },
        { name: this.$t('verified'), param: "verified", default: true, value: true }
      ],
      sortBys: [
        { name: this.$t('most-users'), param: "", value: true },
        { name: this.$t('alphabetical'), param: "alphabetical", value: true },
        { name: this.$t('least-users'), param: "most_users", value: false },
        { name: this.$t('date-added'), param: "date_added", value: true }
      ],
      filterSelected: 1,
      sortSelected: 0
    };
  },
  methods: {
    param() {
      const filter = this.filters[this.filterSelected];
      const sort = this.sortBys[this.sortSelected];
      const query = {};

      !!filter.param && (query[filter.param] = filter.value);
      !!sort.param && (query[sort.param] = sort.value);

      return "?" + qs.stringify(query);
    }
  },
  watch: {
    filterSelected() {
      this.$emit("params", this.param());
    },
    sortSelected() {
      this.$emit("params", this.param());
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/global";
.search-header {
  display: flex;
  background: $box-secondary-color;
  box-shadow: 0px 0px 3px 0px rgb(0, 0, 0);
  margin: 5px;
  border-radius: 5px;
  min-height: 100px;
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
  flex-wrap: wrap;
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
    margin-top: 5px;
  }
  .title {
    font-size: 19px;
    color: white;
    margin-top: 10px;
    padding-left: 2px;
    padding-right: 5px;
    padding-bottom: 2px;
  }
  font-size: 15px;
  .item {
    color: white;
    opacity: 0.5;
    cursor: pointer;
    font-size: 15px;
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

@media (max-width: 429px) {
  .filter-area {
    flex-direction: column;
    margin-top: 10px;
    .title {
      margin-top: 0;
      flex-shrink: 0;
    }
    .filter-item {
      flex-direction: row;
      width: 100%;
      margin-top: 0;
      height: initial;
      .item {
        margin-left: 10px;
      }
    }
    .filter{
      display: flex;
      width: 100%;
      height: initial;
      flex-direction: row;
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
  .filter-area {
    order: 2;
  }
}
</style>
