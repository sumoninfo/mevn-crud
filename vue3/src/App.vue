<template>
  <section style="background-color: #eee;">
    <div class="container py-5">
      <form @submit.prevent="savePost">
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Title</label>
          <input v-model="formData.title" type="text" class="form-control" id="exampleInputEmail1"
                 aria-describedby="emailHelp">
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Content</label>
          <input v-model="formData.content" type="text" class="form-control" id="exampleInputEmail1"
                 aria-describedby="emailHelp">
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Status</label>
          <select v-model="formData.status" class="form-control">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      <div class="row">
        <div v-for="(post, index) in lists" class="col-md-12 col-lg-3 mb-3" :key="index">
          <div class="card">
            <!--            <img :src="post.image" style="height: 250px" class="card-img-top" :alt="post.name"/>-->
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <p class="small"><a href="#!" class="text-muted">{{ post.date }}</a></p>
              </div>

              <div class="d-flex justify-content-between mb-3">
                <h5 class="mb-0">{{ post.title }}</h5>
                <h6 class="mb-0">{{ post.content }}</h6>
              </div>

              <div class="d-flex justify-content-between mb-2">
                <h6 class="text-dark mb-0">{{ $filters.upperCase(post.status) }}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      <pagination v-if="lists.length>0" :pagination="table.pagination" @paginate="getList" :offset="5"/>-->
    </div>
  </section>
</template>

<script setup>
import {onMounted, ref} from "vue";
import NotificationService from "@/services/notification.service";
import handlePost from "@/composables/post";
// import Pagination          from "@/components/Pagination.vue";

const {fetchPosts, storePost} = handlePost();
const lists = ref([])

const formData = ref({
  title: '',
  content: "",
  status: "",
  date: "",
})
const table = ref({
  search: '',
  pagination: {
    current_page: 1,
    per_page: 10,
  }
})

const getList = () => {
  let params = {
    search: table.value.search,
    per_page: table.value.pagination.per_page,
    page: table.value.pagination.current_page,
  };
  fetchPosts(params).then(({data}) => {
    console.log(data.data, 'data')
    lists.value = data.data
    // const {links, path, ...meta} = data.meta;
    // table.value.pagination       = meta
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

const savePost = () => {
  storePost(formData.value).then(({data}) => {
    console.log(data)
    getList()
    NotificationService.success(data.message);
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

onMounted(() => {
  getList()
})
</script>
