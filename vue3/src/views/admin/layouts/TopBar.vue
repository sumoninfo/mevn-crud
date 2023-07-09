<template>
  <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <router-link :to="{name:'HomePage'}" class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
      {{ siteName }}
    </router-link>
    <div class="navbar-nav">
      <div class="nav-item text-nowrap">
        <a @click="logoutSubmit" class="nav-link px-3" href="#"><i class="fas fa-sign-out-alt"></i> Sign out</a>
      </div>
    </div>
  </header>
</template>

<script setup>
import NotificationService from "@/services/notification.service";
import JwtService  from "@/services/jwt.service";
import handleAuth  from "@/composables/auth";
import {useRouter} from "vue-router";
import {useStore}          from "vuex";

const {logout} = handleAuth();
import {ref}               from "vue";

const router = useRouter()
const store  = useStore()

const siteName     = ref(process.env.VUE_APP_TITLE)
const logoutSubmit = () => {
  const token = JwtService.getToken();

  if (typeof token != "undefined") {
    logout().then(({data}) => {
      JwtService.destroyToken();
      store.commit('auth/SETUSER', {})
      router.push({name: "LoginPage"})
      NotificationService.success(data.message);
    }).catch(error => {
      NotificationService.error(error.response.data.message);
    })
  }
}
</script>
