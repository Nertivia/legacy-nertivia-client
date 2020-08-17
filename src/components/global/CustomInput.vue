<template>
  <div class="input" :class="theme">
    <div class="error" v-if="error">{{ error }}</div>
    <div class="name" v-if="name">{{ name }}</div>
    <input
      ref="input"
      v-if="(type === undefined) | (type !== 'textarea')"
      class="text-input"
      @input="event('input', $event)"
      :value="value"
      :autocomplete="autocomplete || 'on'"
      :placeholder="placeholder"
      :default-value.prop="defaultValue"
      :type="type || 'text'"
    />
    <textarea
      v-if="type && type === 'textarea'"
      class="text-input"
      @input="event('input', $event)"
      :default-value.prop="defaultValue"
      :value="value"
    />
  </div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "model"
  },
  props: {
    name: String,
    defaultValue: String,
    value: String,
    type: String,
    autocomplete: String,
    placeholder: String,
    theme: String,
    error: String
  },
  methods: {
    updateVal(val) {
      this.$nextTick(() => {
        this.$refs.input.value = val;
      });
    },
    event(name, event) {
      if (name === "input") {
        this.$emit("model", event.target.value);
      }
      this.$emit(name, event);
    }
  }
};
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  align-self: flex-start;
}
.error {
  color: white;
  background: rgb(255, 71, 71);
  border-radius: 4px;
  font-size: 14px;
  padding: 3px;
}
.name {
  margin: 5px;
  user-select: none;
}
.text-input {
  background: rgba(0, 0, 0, 0.3);
  margin-bottom: 0;
  margin-top: 0;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  width: initial;
  &:focus {
    color: white;
  }
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
}
.light {
  background: rgba(255, 255, 255, 0.1);
  .text-input {
    background: rgba(255, 255, 255, 0.1);
  }
}

textarea {
  padding: 10px;
  resize: none;
  border: none;
  outline: none;
  color: white;
  height: 100px;
  margin-bottom: 10px;
  margin-top: 2px;
  transition: 0.3s;
  border-radius: 4px;
}
input {
  padding: 10px;
  background: rgba(0, 0, 0, 0.301);
  outline: none;
  border: none;
  color: white;
  margin-top: 5px;
  margin-bottom: 10px;
  width: 200px;
  transition: 0.3s;
}
</style>
