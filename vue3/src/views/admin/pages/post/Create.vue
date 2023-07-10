<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Posts Create</h3>
            <div class="card-tools">
              <button type="button" class="btn btn-primary">
                Back
              </button>
            </div>
          </div>

          <div class="card-body p-3">
            <form @submit.prevent="saveUpdatePost">
              <div class="row ">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input v-model="formData.title" type="text" class="form-control" id="title">
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label">Content</label>
                  <input v-model="formData.content" type="text" class="form-control" id="content">
                </div>
                <div class="mb-3">
                  <label for="author_id" class="form-label">Author</label>
                  <select id="author_id" v-model="formData.author_id" class="form-control">
                    <option v-for="author in authors" :value="author._id">{{ author.title }}</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="categories_ids" class="form-label">Categories</label>
                  <select multiple id="categories_ids" v-model="formData.categories_ids" class="form-control">
                    <option v-for="category in categories" :value="category._id">{{ category.title }}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="status" class="form-label">Status</label>
                  <select id="status" v-model="formData.status" class="form-control">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="comment" class="form-label">Comment</label>
                  <textarea v-model="formData.comment" type="text" class="form-control" id="comment"></textarea>
                </div>
              </div>
              <div class="">
                <button type="button" class="btn btn-secondary m-2" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">{{ isEdit ? "Update" : "Save" }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import NotificationService from "@/services/notification.service";
import handlePost from "@/composables/post";
import handleAuthor from "@/composables/author";
import {useRoute, useRouter} from "vue-router";
import handleCategory from "@/composables/category";

const {fetchPost, storePost, updatePost} = handlePost();
const {fetchAuthors} = handleAuthor();
const {fetchCategories} = handleCategory();
const authors = ref([])
const categories = ref([])
const isEdit = ref(false)
const router = useRouter()
const route = useRoute()
const formData = ref({
  title: "",
  content: "",
  author_id: "",
  categories_ids: [],
  status: "",
  comment: ""
})

const getAuthors = () => {
  fetchAuthors().then(({data}) => {
    authors.value = data.data
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

const getCategories = () => {
  fetchCategories().then(({data}) => {
    categories.value = data.data
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}
const getPost = (id) => {
  fetchPost(id).then(({data}) => {
    formData.value = data.data
    formData.value.author_id = data.data.author._id
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

const saveUpdatePost = () => {
  const res = isEdit.value ? updatePost(formData.value._id, formData.value) : storePost(formData.value)
  res.then(({data}) => {
    router.push({'name': 'AdminPost'})
    formReset()
    isEdit.value = false;
    NotificationService.success(data.message);
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

const formReset = () => {
  formData.value = {
    title: "",
    content: "",
    status: "",
    date: "",
  }
}

onMounted(() => {
  getAuthors()
  getCategories()

  if (route.params.postId) {
    isEdit.value = true;
    getPost(route.params.postId)
  }
})
</script>
