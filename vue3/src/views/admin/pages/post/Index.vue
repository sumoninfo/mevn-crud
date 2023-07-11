<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Posts Table</h3>
            <div class="card-tools">
              <router-link :to="{name:'CreatePost'}" class="btn btn-primary">
                Add new
              </router-link>
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
                  <td>{{ $filters.dateFormat(list.date) }}</td>
                  <td>{{ list.content }}</td>
                  <td>{{ $filters.upperCase(list.status) }}</td>
                  <td>
                    <router-link :to="{name:'ShowPost', params:{postId:list._id}}">
                      <i class="fa fa-eye"></i> Show
                    </router-link>
                    |
                    <router-link :to="{name:'EditPost', params:{postId:list._id}}">
                      <i class="fa fa-edit blue"></i> Edit
                    </router-link>
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
            <pagination v-if="lists.length>0" :pagination="table.pagination" @paginate="getList" :offset="5"/>
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
import Pagination from "@/components/Pagination.vue";

const {fetchPosts, deletePost} = handlePost();
const lists = ref([])

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
    lists.value = data.data.data
    table.value.pagination = data.data.meta
  }).catch(error => {
    NotificationService.error(error.response.data.message);
  })
}
const postDelete = (id) => {
  deletePost(id).then(({data}) => {
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
