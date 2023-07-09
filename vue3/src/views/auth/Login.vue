<template>
  <div id="login-section" class="align-items-center d-flex">
    <div class="container">
      <div class="row justify-content-center">
        <div class="bg-opacity-25 bg-primary border border-primary col-5 my-5 p-5 rounded">
          <form @submit.prevent="loginSubmit()" class="needs-validation" novalidate>
            <h3 class="text-center mb-4 text-primary">Login</h3>
            <div class="mb-3">
              <input v-model="form.username" type="text" class="form-control text-center"
                     id="email" required placeholder="USERNAME">
            </div>
            <div class="mb-3">
              <input v-model="form.password" type="password" class="form-control text-center" id="password" required
                     placeholder="PASSWORD">
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-primary w-100 text-light">Login</button>
            </div>
            <div class="text-center">
              Don't have an account
              <router-link :to="{name:'RegisterPage'}" class="m-2" type="submit">
                Register
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import NotificationService from "@/services/notification.service";
import handleAuth from "@/composables/auth";

const {login, afterLoginRegister} = handleAuth();
import {ref} from "vue";

const form = ref({
  username: "",
  password: ""
});

const errors = ref([])

const loginSubmit = () => {
  login(form.value).then(({data}) => {
    errors.value = []
    afterLoginRegister(data.data)
    NotificationService.success(data.message);
  }).catch(error => {
    errors.value = error.response.data.errors;
    NotificationService.error(error.response.data.message);
  })
}

</script>
