<template>
  <div id="app">
    <custom-header @registerButton="$router.push('/register')" />
    <div class="content">
      <div class="title">Nertivia Terms and Conditions of Use</div>
      <div class="updated-date">Last updated: Friday 05 October 2020</div>
      <p>
        If you find something missing or have any questions, email us at

        <a
          href="mailto:nertivia@gmail.com?subject=Question%20About%20Your%20Policy"
          >nertivia@gmail.com</a
        >.
      </p>

      <div class="sub-title">1. Terms</div>
      <p>
        By accessing this Website, accessible from
        https://nertivia.supertiger.tk, you are agreeing to be bound by these
        Website Terms and Conditions of Use and agree that you are responsible
        for the agreement with any applicable local laws. If you disagree with
        any of these terms, you are prohibited from accessing this site. The
        materials contained in this Website are protected by copyright and trade
        mark law.
      </p>
      <div class="sub-title">2. Use License</div>
      <p>
        Permission is granted to temporarily download one copy of the materials
        on Nertivia's Website for personal, commercial transitory viewing only.
        This is the grant of a license, not a transfer of title, and under this
        license you may not:
      </p>
      <p>
        modify or copy the materials;<br />
        use the materials for any commercial purpose or for any public display;
        <br />
        contained on Nertivia's Website; <br />
        remove any copyright or other proprietary notations from the materials;
        or <br />
        transferring the materials to another person or "mirror" the materials
        on any other server. <br />
      </p>
      <div class="sub-title">3. Disclaimer</div>
      <p>
        All the materials on Nertivia’s Website are provided "as is". Nertivia
        makes no warranties, may it be expressed or implied, therefore negates
        all other warranties. Furthermore, Nertivia does not make any
        representations concerning the accuracy or reliability of the use of the
        materials on its Website or otherwise relating to such materials or any
        sites linked to this Website.
      </p>
      <div class="sub-title">4. Limitations</div>
      <p>
        Nertivia or its suppliers will not be hold accountable for any damages
        that will arise with the use or inability to use the materials on
        Nertivia’s Website, even if Nertivia or an authorize representative of
        this Website has been notified, orally or written, of the possibility of
        such damage. Some jurisdiction does not allow limitations on implied
        warranties or limitations of liability for incidental damages, these
        limitations may not apply to you.
      </p>
      <div class="sub-title">5. Revisions and Errata</div>
      <p>
        The materials appearing on Nertivia’s Website may include technical,
        typographical, or photographic errors. Nertivia will not promise that
        any of the materials in this Website are accurate, complete, or current.
        Nertivia may change the materials contained on its Website at any time
        without notice. Nertivia does not make any commitment to update the
        materials.
      </p>
      <div class="sub-title">6. Links</div>
      <p>
        Nertivia has not reviewed all of the sites linked to its Website and is
        not responsible for the contents of any such linked site. The presence
        of any link does not imply endorsement by Nertivia of the site. The use
        of any linked website is at the user’s own risk.
      </p>
      <div class="sub-title">7. Site Terms of Use Modifications</div>
      <p>
        Nertivia may revise these Terms of Use for its Website at any time
        without prior notice. By using this Website, you are agreeing to be
        bound by the current version of these Terms and Conditions of Use.
      </p>
      <div class="sub-title">8. Your Privacy</div>
      <p>
        Please read our Privacy Policy (<a href="/privacy"
          >Nertivia Privacy Policy</a
        >).
      </p>
      <div class="sub-title">9. Governing Law</div>
      <p>
        Any claim related to Nertivia's Website shall be governed by the laws of
        gb without regards to its conflict of law provisions
      </p>
      <div class="sub-title">10. Age Requirement.</div>
      <p>
        By creating an account on the Nertivia site, you agree and are positive
        you are over the age of 14 and the age of consent in your country. If
        you are caught underaged or is in the range of minority, your account
        will be suspended. Once you are over the age of 14, do email
        <a href="mailto:nertivia@gmail.com?subject=About%20My%20Age"
          >nertivia@gmail.com</a
        >
        with proof of your age to get your account unsuspended.
      </p>
      <div class="sub-title">11. Servers.</div>
      <p>
        Creating a server on Nertivia affiliated with exploitation of any game
        or creating a NSFW based server will cause your account to be suspended
        and server to be deleted. This is to ensure our members have a great
        environment to learn and have fun in.
      </p>
      <div class="sub-title">12. Behaviour.</div>
      <p>
        Racism or harassment of any kind is prohibited on Nertivia. We would
        like everyone to have a sense of safety when using this platform. We
        would also like to keep things positive. Anyone reported or caught
        violating this term will be suspended immediately.
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
