import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import { store } from "./store/index";
import VueSocketio from "vue-socket.io-extended";
import io from "socket.io-client";
import config from "./config.js";
import VueMq from "vue-mq";

const MainApp = () =>
  import(/* webpackChunkName: "MainApp" */ "../src/views/App.vue");
const HomePage = () =>
  import(/* webpackChunkName: "HomePage" */ "../src/views/HomePage.vue");
const GDriveCallback = () =>
  import(
    /* webpackChunkName: "GDriveCallback" */ "../src/views/GDriveCallback.vue"
  );
const LoginPage = () =>
  import(/* webpackChunkName: "LoginPage" */ "../src/views/LoginPage.vue");
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
