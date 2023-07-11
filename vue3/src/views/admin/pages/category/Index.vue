<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Category Table</h3>
            <div class="card-tools">
              <button id="openModal" type="button" class="btn btn-primary" data-bs-toggle="modal"
                      data-bs-target="#categoryModal">
                Add new
              </button>
            </div>
          </div>

          <div class="card-body table-responsive p-0">
            <table class="table table-hover">
              <tbody>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              <template v-if="lists.length">
                <tr v-for="(list, index) in lists" :key="list.id">
                  <td>{{ ++index }}</td>
                  <td>{{ list.title }}</td>
                  <td>{{ $filters.upperCase(list.status) }}</td>
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
  <div class="modal fade" id="categoryModal" tabindex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="categoryModalLabel">{{ isEdit ? "Edit" : "Add" }}</h5>
          <button type="button" id="close-modal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="saveUpdateCategory">
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
import handleCategory from "@/composables/category";
import Pagination from "@/components/Pagination.vue";

const {fetchCategories, storeCategory, updateCategory, deleteCategory} = handleCategory();
const lists = ref([])
const isEdit = ref(false)
const errors = ref([])
const formData = ref({
  title: "",
  content: "",
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
  fetchCategories(params).then(({data}) => {
    lists.value = data.data.data
    table.value.pagination = data.data.meta
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}

const saveUpdateCategory = () => {
  const res = isEdit.value ? updateCategory(formData.value._id, formData.value) : storeCategory(formData.value)
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
  deleteCategory(id).then(({data}) => {
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
})
</script>
