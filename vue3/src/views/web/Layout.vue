<template>
  <main>
    <div class="container py-4">
      <Navbar/>
      <router-view/>
      <Footer/>
    </div>
  </main>
</template>

<script>
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";

export default {
  name      : "WebLayout",
  components: {Navbar, Footer}
};
</script>
