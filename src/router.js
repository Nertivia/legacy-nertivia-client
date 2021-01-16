import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import { store } from "./store/index";
import VueSocketio from "vue-socket.io-extended";
import io from "socket.io-client";
import config from "./config.js";
import VueMq from "vue-mq";
import { i18n } from "./i18n";

const MainApp = () =>
  import(/* webpackChunkName: "MainApp" */ "../src/views/App.vue");
const HomePage = () =>
  import(/* webpackChunkName: "HomePage2" */ "../src/views/HomePage2.vue");

const Privacy = () =>
  import(/* webpackChunkName: "Privacy" */ "../src/views/Privacy.vue");
const TermsAndConditions = () =>
  import(
    /* webpackChunkName: "TermsAndConditions" */ "../src/views/TermsAndConditions.vue"
  );

const GDriveCallback = () =>
  import(
    /* webpackChunkName: "GDriveCallback" */ "../src/views/GDriveCallback.vue"
  );
const LoginPage = () =>
  import(/* webpackChunkName: "LoginPage" */ "../src/views/LoginPage.vue");
const ResetPasswordRequestPage = () =>
  import(
    /* webpackChunkName: "ResetPasswordRequestPage" */ "../src/views/ResetPasswordRequestPage.vue"
  );
const ResetPasswordPage = () =>
  import(
    /* webpackChunkName: "ResetPasswordPage" */ "../src/views/ResetPasswordPage.vue"
  );
const InvitesPage = () =>
  import(/* webpackChunkName: "Invites" */ "../src/views/Invites.vue");
const ThemesPage = () =>
  import(/* webpackChunkName: "Themes" */ "../src/views/Themes.vue");
const BotsPage = () =>
  import(/* webpackChunkName: "BotsPage" */ "../src/views/BotsPage.vue");

const RegisterPage = () =>
  import(
    /* webpackChunkName: "RegisterPage" */ "../src/views/RegisterPage.vue"
  );
const PageNotFound = () =>
  import(/* webpackChunkName: "404" */ "../src/views/404.vue");

export const router = new VueRouter({
  mode: "history",
  routes: [
    { name: "404", path: "*", component: PageNotFound },
    {
      path: "/",
      name: "HomePage",
      component: HomePage
    },
    {
      path: "/privacy",
      name: "Privacy",
      component: Privacy
    },
    {
      path: "/terms-and-conditions",
      name: "TermsAndConditions",
      component: TermsAndConditions
    },
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
      beforeEnter(to, from, next) {
        if (localStorage.getItem("hauthid")) {
          return router.push({ path: "/app" });
        }
        next();
      }
    },
    {
      path: "/reset",
      name: "Reset Password",
      component: ResetPasswordPage,
      beforeEnter(to, from, next) {
        if (localStorage.getItem("hauthid")) {
          return router.push({ path: "/app" });
        }
        next();
      }
    },
    {
      path: "/reset-password",
      name: "Reset Password Request",
      component: ResetPasswordRequestPage,
      beforeEnter(to, from, next) {
        if (localStorage.getItem("hauthid")) {
          return router.push({ path: "/app" });
        }
        next();
      }
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterPage,
      beforeEnter(to, from, next) {
        if (localStorage.getItem("hauthid")) {
          return router.push({ path: "/app" });
        }
        next();
      }
    },
    {
      path: "/app",
      name: "app",
      component: MainApp,
      beforeEnter(to, from, next) {
        if (!localStorage.getItem("hauthid")) {
          return router.push({ path: "/login" });
        }

        // language
        let lang = localStorage.getItem("lang");
        if (!lang) {
          lang = "en";
          localStorage.setItem("lang", "en");
        }
        if (lang !== "en") {
          import(`@/lang/${lang}.json`)
            .then(msgs => {
              i18n.setLocaleMessage(lang, msgs.default);
              i18n.locale = lang;
            })
            .catch(() => {
              console.log("Invalid Language");
            });
        }

        Vue.use(VueSocketio, io(config.socketIP), { store });
        Vue.use(VueMq, {
          breakpoints: {
            mobile: 600,
            members_panel: 950,
            desktop: Infinity
          }
        });
        next();
      }
    },
    {
      path: "/GDrive_callback",
      name: "GDrive callback",
      component: GDriveCallback
    },
    {
      path: "/invites/:invite_id",
      name: "invites",
      alias: "/i/:invite_id",
      component: InvitesPage
    },
    {
      path: "/themes/:theme_id",
      name: "themes",
      component: ThemesPage
    },
    {
      path: "/bots/:bot_id",
      name: "bots",
      component: BotsPage
    }
  ]
});
