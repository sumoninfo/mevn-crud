<template>
  <div id="login-section" class="align-items-center d-flex">
    <div class="container">
      <div class="row justify-content-center">
        <div class="bg-opacity-25 bg-primary border border-primary col-5 my-5 p-5 rounded">
          <form @submit.prevent="registerSubmit()" class="needs-validation" novalidate>
            <h3 class="text-center mb-4 text-primary">Register</h3>
            <div class="mb-3">
              <input v-model="form.username" type="text" class="form-control "
                     id="name" required placeholder="USERNAME">
            </div>
            <div class="mb-3">
              <input v-model="form.email" type="email" class="form-control"
                     id="email" required placeholder="EMAIL">
            </div>
            <div class="mb-3">
              <input v-model="form.password" type="password" class="form-control" id="password" required
                     placeholder="PASSWORD">
            </div>
            <div class="mb-3">
              <input v-model="form.confirm_password" type="password" class="form-control" id="confirm_password"
                     required
                     placeholder="CONFIRM PASSWORD">
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-primary w-100 text-light">Register</button>
            </div>
            <div class="text-center">
              Already have an account?
              <router-link :to="{name:'LoginPage'}" class="m-2" type="submit">
                Login here
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

const {register} = handleAuth();
import {ref} from "vue";
import {useRouter} from "vue-router";

const form = ref({
  username: "",
  email: "",
  password: "",
  confirm_password: ""
});

const errors = ref([])
const router = useRouter()
const registerSubmit = () => {
  register(form.value).then((res) => {
    console.log(res, 'res')
    // errors.value = []
    // NotificationService.success(data.message);
    // router.push({name: "LoginPage"})
  }).catch(error => {
    console.log(error, 'error')
    // errors.value = error.response.data.errors;
    // NotificationService.error(error.response.data.message);
  })
}
</script>
