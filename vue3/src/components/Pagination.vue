<template>
  <nav
      class="pagination-section align-items-center d-flex flex-column flex-sm-row gap-2 gap-sm-0 justify-content-between my-4 my-sm-5">
    <div class="show">
      <select v-model="pagination.per_page" @change="emit('paginate')" class="form-control">
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="500">500</option>
        <option value="all">All</option>
      </select>
    </div>
    <div class="show">
      Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries
    </div>
    <div>
      <ul class="pagination justify-content-center m-0">
        <li class="page-item" :class="{ disabled: pagination.current_page <= 1 }">
          <a class="page-link" @click.prevent="changePage(1)">
            <i class="fa fa-angle-double-left"></i>
          </a>
        </li>
        <li class="page-item" :class="{ disabled: pagination.current_page <= 1 }">
          <a class="page-link" @click.prevent="changePage(pagination.current_page - 1)">
            <i class="fa fa-arrow-left"></i>
          </a>
        </li>

        <li class="page-item" v-for="page in pages" :key="page" :class="isCurrentPage(page) ? 'active' : ''">
          <a class="page-link" @click.prevent="changePage(page)">{{ page }}
            <span v-if="isCurrentPage(page)" class="sr-only">(current)</span>
          </a>
        </li>

        <li class="page-item" :class="{ disabled: pagination.current_page >= pagination.last_page }">
          <a class="page-link" @click.prevent="changePage(pagination.current_page + 1)">
            <i class="fa fa-arrow-right"></i>
          </a>
        </li>
        <li class="page-item" :class="{ disabled: pagination.current_page >= pagination.last_page }">
          <a class="page-link" @click.prevent="changePage(pagination.last_page)">
            <i class="fa fa-angle-double-right"></i>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup>
import {computed} from "vue";

const emit = defineEmits(['paginate'])

const props = defineProps({
  pagination: Object,
  offset: Number
})

const pages = computed(() => {
  let pages = []

  let from = props.pagination.current_page - Math.floor(props.offset / 2)

  if (from < 1) {
    from = 1
  }

  let to = from + props.offset - 1

  if (to > props.pagination.last_page) {
    to = props.pagination.last_page
  }

  while (from <= to) {
    pages.push(from)
    from++
  }

  return pages

});

const isCurrentPage = (page) => {
  return props.pagination.current_page === page
}
const changePage = (page) => {
  if (page > props.pagination.last_page) {
    page = props.pagination.last_page;
  }
  props.pagination.current_page = page;
  emit('paginate');
}
</script>
<style>
li > a.page-link {
  cursor: pointer;
}

li.disabled {
  cursor: not-allowed;
  pointer-events: all !important;
}

li.active > a {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
