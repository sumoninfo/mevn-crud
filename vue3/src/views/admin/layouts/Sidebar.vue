<template>
  <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="position-sticky pt-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link :to="{name:'AdminDashboard'}" class="nav-link active">
            <i class="fas fa-home"></i>
            Dashboard
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name:'AdminAuthor'}" class="nav-link">
            <i class="fas fa-home"></i>
            Author
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name:'AdminCategory'}" class="nav-link">
            <i class="fas fa-home"></i>
            Category
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name:'AdminPost'}" class="nav-link">
            <i class="fas fa-home"></i>
            Post
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup>
</script>
