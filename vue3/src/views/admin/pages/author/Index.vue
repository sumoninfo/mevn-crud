<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">Authors list</h5>
            <div class="d-flex align-items-center">
              <div class="input-group me-2">
                <input v-model="table.search" type="text" class="form-control" placeholder="Search...">
                <button @click="getList" class="btn btn-outline-secondary" type="button">Search</button>
                <button id="openModal" type="button" class="btn btn-primary ms-4" data-bs-toggle="modal"
                        data-bs-target="#authorModal">
                  Add new
                </button>
              </div>
            </div>
          </div>

          <div class="card-body table-responsive p-0">
            <table class="table table-hover">
              <tbody>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Image</th>
                <th>Status</th>
                <th>Posts count</th>
                <th>Action</th>
              </tr>
              <template v-if="lists.length">
                <tr v-for="(list, index) in lists" :key="list.id">
                  <td>{{ table.pagination.from + index }}</td>
                  <td>{{ list.title }}</td>
                  <td><img width="100" :src="$filters.getImage(list.image)"></td>
                  <td>{{ $filters.upperCase(list.status) }}</td>
                  <td>{{ list.postCount }}</td>
                  <td>
                    <a href="#" data-id="customers.id" @click="editModalWindow(list)">
                      <i class="fa fa-edit blue"></i> Edit
                    </a>
                    |
                    <a href="#" @click="destroy(list._id)">
                      <i class="fa fa-trash red"></i> Delete
                    </a>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td class="text-center" colspan="6">No Data found!</td>
                </tr>
              </template>
              </tbody>
            </table>
            <pagination v-if="lists.length>0" :pagination="table.pagination" @paginate="getList" :offset="5"/>
          </div>
        </div>

      </div>
    </div>
  </div>
  <div class="modal fade" id="authorModal" tabindex="-1" aria-labelledby="authorModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="authorModalLabel">{{ isEdit ? "Edit" : "Add" }}</h5>
          <button type="button" id="close-modal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="saveUpdateAuthor">
          <div class="modal-body">
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input :class="{ 'is-invalid': errors['title'] }" v-model="formData.title" type="text"
                     class="form-control" id="title">
              <div v-if="errors['title']" class="invalid-feedback">
                {{ errors['title'].message }}
              </div>
            </div>
            <div class="mb-3">
              <label for="status" class="form-label">Status</label>
              <select :class="{ 'is-invalid': errors['status'] }" id="status" v-model="formData.status"
                      class="form-control">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div v-if="errors['status']" class="invalid-feedback">
                {{ errors['status'].message }}
              </div>
            </div>

            <div class="mb-3">
              <label for="status" class="form-label">File</label>
              <input type="file" @change="handleFileChange" accept="image/*">
            </div>
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
import handleAuthor from "@/composables/author";
import Pagination from "@/components/Pagination.vue";

const {fetchAuthors, storeAuthor, updateAuthor, deleteAuthor} = handleAuthor();
const lists = ref([])
const isEdit = ref(false)
const errors = ref([])

const formData = ref({
  title: "",
  content: "",
  status: "",
  file: ''
})

const table = ref({
  search: '',
  pagination: {
    current_page: 1,
    per_page: 10,
  }
})
const handleFileChange = (event) => {
  formData.value.file = event.target.files[0];
}

const getList = () => {
  let params = {
    search: table.value.search,
    per_page: table.value.pagination.per_page,
    page: table.value.pagination.current_page,
  };
  fetchAuthors(params).then(({data}) => {
    lists.value = data.data.data
    table.value.pagination = data.data.meta
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

const saveUpdateAuthor = () => {
  const appendData = new FormData();
  appendData.append('title', formData.value.title);
  appendData.append('status', formData.value.status);
  appendData.append('image', formData.value.file);

  const res = isEdit.value ? updateAuthor(formData.value._id, appendData) : storeAuthor(appendData)
  res.then(({data}) => {
    errors.value = []
    getList()
    formReset()
    isEdit.value = false;
    document.getElementById('close-modal').click()
    NotificationService.success(data.message);
  }).catch(error => {
    const resError = error.response.data.message.errors ? error.response.data.message : error.response.data;
    errors.value = resError.errors
    NotificationService.error(resError.message);
  })
}

const editModalWindow = (list) => {
  isEdit.value = true
  formData.value = list
  document.getElementById('openModal').click()
}
const destroy = (id) => {
  deleteAuthor(id).then(({data}) => {
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
    file: ''
  }
}

onMounted(() => {
  isEdit.value = false;
  getList()
})
</script>
