<template>
  <div class="tab">
    <i :class="{'material-icons': true, closed: !$props.expanded}">
      expand_more
    </i>
    <div class="tab-name">
      {{ $props.tabname }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['tabname', 'expanded']
}
</script>


<style scoped>
  .tab{
    display: flex;
    color: white;
  }
  .tab-name {
    padding-top: 3px;
  }
  .material-icons{
    transition: 0.3s;
  }
  .closed{
    transform: rotate(180deg);
  }
</style>

