<template>
  <div id="app">
    <custom-header @registerButton="$router.push('/register')" />
    <div class="content">
      <div class="title">Nertivia Privacy Policy</div>
      <div class="updated-date">Last updated: Friday 27 December 2020</div>
      <p>
        If you find something missing or have any questions, email us at

        <a
          href="mailto:nertivia@gmail.com?subject=Question%20About%20Your%20Policy"
          >nertivia@gmail.com</a
        >.
      </p>
      <div class="sub-title">Personal Information We Collect</div>
      <p>
        While using Nertivia, we may collect information from you as shown
        below: When registering an account on Nertivia and using its services,
        we may collect some information. The information we collect may include
        but not be limited to email address username, full name, age, messages,
        images or any other content by sending a message.
      </p>
      <div class="sub-title">Information We May Inspect</div>
      <p>
        To ensure users are complying with the TOS, we may view the contents of
        your private/public channels (Message logs). We may give you a warning
        followed by an account/server termination if you continue to not comply.
      </p>

      <div class="sub-title">Data We Collect Automatically</div>
      <p>
        While using Nertivia and its services, we will store certain information
        such as your IP Address, your account creation date and your activities
        such as your online status. We may store this information in the
        database owned by service providers. We may also track and store some
        details while you use Nertivia. This includes tracking the number of
        visitors on the website and the number of messages that a user has sent.
        We use IP Addresses to rate limit or ban users that may attack Nertivia.
      </p>
      <div class="sub-title">Third-Party Services</div>
      <p>
        You may permit us to connect your account with third party services such
        as your Google account. When you do this, it allows users to gain
        functionality (For example, uploading images or files to Google Drive).
        After you connect your account with third-party services, we may collect
        refresh tokens or some user details from the services and save them in
        the database. We use third party storage solution to store media you
        upload to Nertivia (Nertivia CDN option). You may read their
        <a href="https://nodeclusters.com/privacy_policy.pdf"
          >Privacy Policy Here</a
        >.
      </p>
      <div class="sub-title">Cookies</div>
      <p>
        We use cookies and similar storage technologies to store local data such
        as recent emojis, logged in users id and other information. We may store
        and expand the usage of cookies to save more data as this service gets
        updated. We may use third-party technologies such as hCaptcha that use
        cookies store some data and also collect some data (<a
          href="https://www.hcaptcha.com/privacy"
          >See hCaptcha policies</a
        >)
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CustomHeader from "@/components/homePage/Header";

export default Vue.extend({
  components: {
    CustomHeader
  },
  methods: {}
});
</script>

<style scoped lang="scss">
@import "@/styles/global";
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
#app {
  color: white;
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
  align-content: center;
}

.content {
  max-width: 700px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 30px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
.sub-title {
  font-weight: bold;
}
.updated-date {
  font-size: 12px;
  opacity: 0.8;
}
a {
  color: #68aaff;
}
p {
  color: rgba(255, 255, 255, 0.8);
}
</style>
