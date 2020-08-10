<template>
  <div class="information">
    <div v-if="change.new">
      <strong>What's new?</strong>
      <br />
      <ul>
        <li v-for="(wnew, index) in change.new" :key="index" v-html="wnew" />
      </ul>
    </div>
    <div v-if="change.fix">
      <strong>Issues fixed</strong>
      <br />
      <ul>
        <li v-for="(wfix, index) in change.fix" :key="index" v-html="wfix" />
      </ul>
    </div>
    <div v-if="change.next">
      <strong>Up next</strong>
      <br />
      <ul>
        <li v-for="(wnext, index) in change.next" :key="index" v-html="wnext" />
      </ul>
    </div>
    <div v-if="change.msg" v-html="change.msg" />
  </div>
</template>

<script>
export default {
  props: ["change"]
};
</script>
