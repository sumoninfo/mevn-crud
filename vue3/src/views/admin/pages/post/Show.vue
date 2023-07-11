<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Post Show</h3>
            <div class="card-tools">
              <router-link class="btn btn-primary" :to="{name:'AdminPost'}">
                <i class="fa fa-eye"></i> Back
              </router-link>
            </div>
          </div>

          <div class="card-body p-3">
            <div class="row ">
              <div class="mb-3">
                <label for="title" class="form-label">Date: {{ $filters.dateFormat(formData.date) }}</label>
              </div>
              <div class="mb-3">
                <label for="title" class="form-label">Title: {{ formData.title }}</label>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">Content: {{ formData.content }}</label>
              </div>
              <div class="mb-3">
                <label for="author_id" class="form-label">Author: {{ formData.author?.title }}</label>
              </div>

              <div class="mb-3">
                <label for="categories_ids" class="form-label">Categories: {{ formData.categories_ids }}</label>
              </div>
              <div class="mb-3">
                <label for="status" class="form-label">Status: {{ $filters.upperCase(formData.status) }}</label>
              </div>
              <div class="mb-3">
                <label for="comment" class="form-label">Categories:
                  <span v-for="(category, index) in formData.categories">
                        {{ category.categoryId.title }},
                    </span>
                </label>
              </div>
              <div class="mb-3">
                <label for="comment" class="form-label">Tags:
                  <span v-for="(tag, index) in formData.tags">
                        {{ tag.tagId.title }},
                    </span>
                </label>
              </div>

              <div class="mb-3">
                <label for="comment" class="form-label">Comments:
                  <span v-for="(comment, index) in formData.comments">
                        {{ comment.comment }},
                    </span>
                </label>
              </div>

              <router-link :to="{name:'EditPost', params:{postId:formData._id}}">
                <i class="fa fa-edit blue"></i> Edit
              </router-link>
            </div>
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
import {useRoute, useRouter} from "vue-router";

const {fetchPost} = handlePost();

const router = useRouter()
const route = useRoute()
const formData = ref({
  title: "",
  content: "",
  author_id: "",
  categories: [],
  tags: [],
  status: "",
  comment: ""
})


const getPost = (id) => {
  fetchPost(id).then(({data}) => {
    formData.value = data.data
    formData.value.author_id = data.data.author._id
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
  if (route.params.postId) {
    getPost(route.params.postId)
  }
})
</script>
