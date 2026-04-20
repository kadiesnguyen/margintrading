<template functional>
    <footer class="the-footer flex-wrap justify-between" :class="classes">
        <span>Bản quyền &copy; {{ new Date().getFullYear() }} <a href="https://t.me/koh_21" target="_blank" rel="nofollow">Koh</a></span>
        <component :is="injections.components.BuyNow"></component>
    </footer>
</template>

<script>
import BuyNow from '../../components/BuyNow.vue'

export default {
    name: "the-footer",
    props: {
        classes: {
            type: String,
        },
    },
    inject: {
      components:{
          default: {
            BuyNow
          }
      }
    }
}
</script>
