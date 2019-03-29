<template>
  <div class="right-panel-home">
    <div class="right-panel-inner">
        <div class="logo"></div>
        <div class="title">Nertivia</div>
        <spinner :msg="spinnerMessage" v-if="previouslyLoggedIn && user == null && tokenExists" />
        
        <transition name="component-fade" appear mode="out-in" v-else>

          <logged-in v-if="tokenExists && user != null" />

          <div class="new-member" v-if="!tokenExists">
            <div class="details">
              Nertivia chat is the best chat client to be made with 99% uptime, you won't miss a thing! Join now if you’re new!
            </div>
            <div class="switch-buttons">
              <div :class="{button: true, selected: loginSelected}" @click="loginSelected = true">Already a pro</div>
              <div :class="{button: true, selected: !loginSelected}" @click="loginSelected = false">I'm new!</div>
            </div>
            <transition name="switch-selected" mode="out-in">
              <login-panel v-if="loginSelected" />
              <register-panel v-if="!loginSelected" />
            </transition>
          </div>
        </transition>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main';
import AuthenticationService from '@/services/AuthenticationService.js'
import RegisterPanel from "../../components/homePage/RegisterPanel.vue"
import LoginPanel from "../../components/homePage/LoginPanel.vue"
import LoggedIn from "../../components/homePage/LoggedIn.vue"
import Spinner from "../../components/Spinner.vue"
export default {
  components: {
    RegisterPanel,
    LoginPanel,
    LoggedIn,
    Spinner
  },
  data() {
    return {
      loginSelected: true,
      previouslyLoggedIn: false,
      spinnerMessage: "Logging in...",
      connectionRetryCount: 0
    }
  },
  methods: {
    async getUser() {
      // Get details if previously logged in.
      if (this.previouslyLoggedIn) {
        const { ok, error, result } = await AuthenticationService.user();
        if ( ok ) {
          this.$store.commit( 'user', result.data.user );
        } else {
          if ( error.response === undefined ) {
            this.connectionRetryCount++;
            this.spinnerMessage = `Connection failed. Trying again (${this.connectionRetryCount})`
            setTimeout(() => {
              this.getUser();
            }, 5000);
            return;
          }
          this.$store.commit( 'logout' );
        }
      }
    }
  },
  async mounted() {
    this.previouslyLoggedIn = this.tokenExists;
    this.getUser()
    
  },
  computed: {
    tokenExists() {
      return this.$store.getters.tokenExists;
    },
    user() {
      return this.$store.getters.user;
    }
  },
}
</script>


<style scoped>
.component-fade-enter-active, .component-fade-leave-active {
  transition: .3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.switch-selected-enter-active, .switch-selected-leave-active {
  transition: .3s ease;
}
.switch-selected-enter, .switch-selected-leave-to {
  transform: translateY(20px);
  opacity: 0;
}


.right-panel-home {
    width: 400px;
    height: 100%;
    background: rgba(0, 0, 0, 0.493);
    display: flex;
    flex-direction: column;
    overflow: auto;
    user-select: none;
}
.right-panel-inner{
    display: flex;
    flex-direction: column;
    height: 100%;
    z-index: 0;
}
.new-member{
  display: flex;
  flex-direction: column;
  transition: .3s;
}

.logo {
  height: 150px;
  width: 150px;
  background: url(./../../assets/logo.png);
  background-size: 105%;
  background-position: center;
  border-radius: 50%;
  box-shadow: 0px 0px 96px -4px rgba(69,212,255,1);
  margin: auto;
  margin-bottom: 0;
  margin-top: 40px;
  flex-shrink: 0;

}

.title{
  color: white;
  font-size: 35px;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 10px;
}

.right-panel .title {
    margin: auto;
    margin-top: 10px;
    width: 230px;
    font-size: 40px;
    text-align: center;
}
.details{
  color: rgb(204, 204, 204);
  margin: 49px;
  margin-top: 10px;
}
.switch-buttons{
    display: table;
    margin: auto;
}

.button{
    color: white;
    font-size: 18px;
    display: inline-block;
    padding: 10px;
    margin: 5px;
    user-select: none;
    transition: 0.3s;
}

.button:hover{
    border-bottom: solid 2px rgba(255, 255, 255, 0.493);
}

.button.selected{
    border-bottom: solid 2px white;
}

</style>
