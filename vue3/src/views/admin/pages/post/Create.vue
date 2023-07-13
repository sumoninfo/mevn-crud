<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Posts Create</h3>
            <div class="card-tools">
              <router-link :to="{name:'AdminPost'}" class="btn btn-primary">
                Back
              </router-link>
            </div>
          </div>

          <div class="card-body p-3">
            <form @submit.prevent="saveUpdatePost">
              <div class="row ">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input :class="{ 'is-invalid': errors['title'] }" v-model="formData.title" type="text"
                         class="form-control" id="title">
                  <div v-if="errors['title']" class="invalid-feedback">
                    {{ errors['title'].message }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label">Content</label>
                  <input :class="{ 'is-invalid': errors['content'] }" v-model="formData.content" type="text"
                         class="form-control" id="content">
                  <div v-if="errors['content']" class="invalid-feedback">
                    {{ errors['content'].message }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="author_id" class="form-label">Author</label>
                  <select id="author_id" :class="{ 'is-invalid': errors['author_id'] }" v-model="formData.author_id"
                          class="form-control">
                    <option v-for="author in authors" :value="author._id">{{ author.title }}</option>
                  </select>
                  <div v-if="errors['author_id']" class="invalid-feedback">
                    {{ errors['author_id'].message }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="categories_ids" class="form-label">Categories</label>
                  <select multiple id="categories_ids" :class="{ 'is-invalid': errors['categories_ids'] }"
                          v-model="formData.categories_ids" class="form-control">
                    <option v-for="category in categories" :value="category._id">{{ category.title }}</option>
                  </select>
                  <div v-if="errors['categories_ids']" class="invalid-feedback">
                    {{ errors['categories_ids'].message }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="tags_ids" class="form-label">Tags</label>
                  <select multiple id="tags_ids" :class="{ 'is-invalid': errors['tags_ids'] }"
                          v-model="formData.tags_ids" class="form-control">
                    <option v-for="tag in tags" :value="tag._id">{{ tag.title }}</option>
                  </select>
                  <div v-if="errors['tags_ids']" class="invalid-feedback">
                    {{ errors['tags_ids'].message }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="status" class="form-label">Status</label>
                  <select id="status" :class="{ 'is-invalid': errors['status'] }" v-model="formData.status"
                          class="form-control">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <div v-if="errors['status']" class="invalid-feedback">
                    {{ errors['status'].message }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="comment" class="form-label">Comment</label>
                  <textarea :class="{ 'is-invalid': errors['comment'] }" v-model="formData.comment" type="text"
                            class="form-control" id="comment"></textarea>
                  <div v-if="errors['comment']" class="invalid-feedback">
                    {{ errors['comment'].message }}
                  </div>
                </div>
              </div>
              <div class="">
                <router-link :to="{name:'AdminPost'}" class="btn btn-secondary m-2">
                  Close
                </router-link>
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
import handleTag from "@/composables/tag";

const {fetchPost, storePost, updatePost} = handlePost();
const {fetchAuthors} = handleAuthor();
const {fetchCategories} = handleCategory();
const {fetchTags} = handleTag();
const errors = ref([])
const authors = ref([])
const categories = ref([])
const tags = ref([])
const isEdit = ref(false)
const loader = ref(false)
const router = useRouter()
const route = useRoute()
const formData = ref({
  title: "",
  content: "",
  author_id: "",
  categories_ids: [],
  tags_ids: [],
  status: "",
  comment: ""
})
const getPost = (id) => {
  fetchPost(id).then(({data}) => {
    formData.value = data.data
    formData.value.author_id = data.data.author._id
    formData.value.comment = data.data.comments[0].comment
    formData.value.categories_ids = data.data.categories.map((category, index) => {
      return category.categoryId._id
    })
    formData.value.tags_ids = data.data.tags.map((tag, index) => {
      return tag.tagId._id
    })

  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

const saveUpdatePost = () => {
  const res = isEdit.value ? updatePost(formData.value._id, formData.value) : storePost(formData.value)
  res.then(({data}) => {
    errors.value = []
    router.push({'name': 'AdminPost'})
    formReset()
    isEdit.value = false;
    NotificationService.success(data.message);
  }).catch(error => {
    console.log(error, 'error')
    const resError = error.response.data.message.errors ? error.response.data.message : error.response.data;
    console.log(resError, 'resError')
    errors.value = resError.errors ?? []
    NotificationService.error(resError.message.message ?? resError.message);
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

onMounted(async () => {
  loader.value = true
  const authorRes = fetchAuthors()
  const categoryRes = fetchCategories()
  const tagRes = fetchTags()
  Promise.all([
    authorRes.then(({data}) => {
      if (data.data) authors.value = data.data.data
    }),
    categoryRes.then(({data}) => {
      if (data.data) categories.value = data.data.data
    }),
    tagRes.then(({data}) => {
      if (data.data) tags.value = data.data.data
    }),
  ]).then(() => {
    loader.value = false
  }).catch((err) => {
    loader.value = false
  })

  if (route.params.postId) {
    isEdit.value = true;
    getPost(route.params.postId)
  }
})
</script>
