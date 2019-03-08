<template>
    <div>
        Redirecting...
    </div>
</template>

<script>
export default {
    mounted() {
        window.opener.postMessage({code: location.href}, "*");
    }
}
</script>

