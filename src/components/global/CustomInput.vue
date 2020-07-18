<template>
    <div class="input" :class="theme">
        <div class="name">{{ name }}</div>
        <input class="text-input" @input="event('input', $event)" :value="value" :autocomplete="autocomplete || 'on'"  :default-value.prop="defaultValue" :type="type || 'text'">
    </div>
</template>

<script>
export default {
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        name: String,
        defaultValue: String,
        value: String,
        type: String,
        autocomplete: String,
        theme: String,
    },
    methods: {
        event(name, event) {
            this.$emit(name, event)
        }
    }
}
</script>

<style lang="scss" scoped>
.input {
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    align-self: flex-start;
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
}
.light {
    background: rgba(255, 255, 255, 0.1);
    .text-input {
        background: rgba(255, 255, 255, 0.1);
    }
}
</style>