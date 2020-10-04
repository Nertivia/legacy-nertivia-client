<template>
  <div class="message">
    {{ msg || "By creating an account, you are agreeing to the" }}
    <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer"
      >Terms And Conditions</a
    >
    and the
    <a href="/privacy" target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >
  </div>
</template>
<script>
export default {
  props: ["msg"]
};
</script>

<style lang="scss" scoped>
.message {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}
a {
  color: #68aaff;
}
</style>
