<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Posts Table</h3>
            <div class="card-tools">
              <button id="openModal" type="button" class="btn btn-primary" data-bs-toggle="modal"
                      data-bs-target="#postModal">
                Add new
              </button>
            </div>
          </div>

          <div class="card-body table-responsive p-0">
            <table class="table table-hover">
              <tbody>
              <tr>
                <th>#</th>
                <th>Author</th>
                <th>Title</th>
                <th>Date</th>
                <th>Content</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              <template v-if="lists.length">
                <tr v-for="(list, index) in lists" :key="list.id">
                  <td>{{ ++index }}</td>
                  <td>{{ list.author ? list.author.title : "" }}</td>
                  <td>{{ list.title }}</td>
                  <td>{{ list.date }}</td>
                  <td>{{ list.content }}</td>
                  <td>{{ $filters.upperCase(list.status) }}</td>
                  <td>
                    <a href="#" data-id="customers.id" @click="editModalWindow(list)">
                      <i class="fa fa-edit blue"></i> Edit
                    </a>
                    |
                    <a href="#" @click="postDelete(list._id)">
                      <i class="fa fa-trash red"></i> Delete
                    </a>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td class="text-center" colspan="7">No Data found!</td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
  <div class="modal fade" id="postModal" tabindex="-1" aria-labelledby="postModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="postModalLabel">{{ isEdit ? "Edit" : "Add" }}</h5>
          <button type="button" id="close-modal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="saveUpdatePost">
          <div class="modal-body">
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
              <label for="status" class="form-label">Status</label>
              <select id="status" v-model="formData.status" class="form-control">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div
            >
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">{{ isEdit ? "Update" : "Save" }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import NotificationService from "@/services/notification.service";
import handlePost from "@/composables/post";
import handleAuthor from "@/composables/author";
// import Pagination          from "@/components/Pagination.vue";

const {fetchPosts, storePost, updatePost, deletePost} = handlePost();
const {fetchAuthors} = handleAuthor();
const lists = ref([])
const authors = ref([])
const isEdit = ref(false)

const formData = ref({
  title: "",
  content: "",
  author_id: "",
  status: ""
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
    lists.value = data.data
    // const {links, path, ...meta} = data.meta;
    // table.value.pagination       = meta
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

const getAuthor = () => {
  fetchAuthors().then(({data}) => {
    authors.value = data.data
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

const saveUpdatePost = () => {
  const res = isEdit.value ? updatePost(formData.value._id, formData.value) : storePost(formData.value)
  res.then(({data}) => {
    getList()
    formReset()
    isEdit.value = false;
    document.getElementById('close-modal').click()
    NotificationService.success(data.message);
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

const editModalWindow = (list) => {
  isEdit.value = true
  formData.value = list
  formData.value.author_id = list.author._id
  document.getElementById('openModal').click()
}
const postDelete = (id) => {
  deletePost(id).then(({data}) => {
    getList()
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
  isEdit.value = false;
  getList()
  getAuthor()
})
</script>
