<template>
  <div>
    <top-bar></top-bar>
    <div class="container-fluid">
      <div class="row">
        <sidebar/>
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <router-view ref="admin-layout"/>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar  from "@/views/admin/layouts/TopBar";
import Sidebar from "@/views/admin/layouts/Sidebar";

export default {
  name      : "Layout",
  components: {Sidebar, TopBar}
}
</script>
