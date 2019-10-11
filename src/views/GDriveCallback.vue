<template>
  <div>Redirecting...</div>
</template>

<script>
import settingsService from "../services/settingsService.js";

export default {
  async mounted() {
    const url = new URL(location.href);
    const token = url.searchParams.get("token");
    const code = url.searchParams.get("code");
    await settingsService.GDriveAuth(code, token);

    window.opener.postMessage({ status: 'done' }, "*");
  }
};
</script>

