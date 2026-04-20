<template>
  <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
    <span class="cursor-pointer flex items-center i18n-locale">
      <img class="h-4 w-5" :src="i18n_locale_img" :alt="$i18n.locale" />
      <span class="hidden sm:block ml-2">{{
        getCurrentLocaleData.lang || "Việt Nam"
      }}</span>
    </span>
    <vs-dropdown-menu class="w-48 i18n-dropdown vx-navbar-dropdown">
      <vs-dropdown-item @click="updateLocale('vi')"
        ><img
          class="h-4 w-5 mr-1"
          src="@/assets/images/flags/vi.png"
          alt="vi"
        />
        &nbsp;Tiếng Việt</vs-dropdown-item
      >
      <vs-dropdown-item @click="updateLocale('zh')"
        ><img
          class="h-4 w-5 mr-1"
          src="@/assets/images/flags/zh.png"
          alt="zh"
        />
        &nbsp;China</vs-dropdown-item
      >
      <vs-dropdown-item @click="updateLocale('en')"
        ><img
          class="h-4 w-5 mr-1"
          src="@/assets/images/flags/en.png"
          alt="en"
        />
        &nbsp;English</vs-dropdown-item
      >
      <!-- <vs-dropdown-item @click="updateLocale('fr')"><img class="h-4 w-5 mr-1" src="@/assets/images/flags/fr.png" alt="fr" /> &nbsp;French</vs-dropdown-item> -->
      <!-- <vs-dropdown-item @click="updateLocale('de')"><img class="h-4 w-5 mr-1" src="@/assets/images/flags/de.png" alt="de" /> &nbsp;German</vs-dropdown-item> -->
      <!-- <vs-dropdown-item @click="updateLocale('pt')"><img class="h-4 w-5 mr-1" src="@/assets/images/flags/pt.png" alt="pt" /> &nbsp;Portuguese</vs-dropdown-item>  -->
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
export default {
  data() {
    return {
      language: this.$i18n.locale,
    };
  },
  computed: {
    i18n_locale_img() {
      return require(`@/assets/images/flags/${this.$i18n.locale}.png`);
    },
    getCurrentLocaleData() {
      const locale = this.$i18n.locale;
      console.log(this.$i18n.locale);
      if (locale == "vi") {
        return { flag: "vi", lang: "Tiếng Việt" };
      } else if (locale == "en") {
        return { flag: "en", lang: "English" };
      } else if (locale == "zh") {
        return { flag: "zh", lang: "China" };
      }
    },
  },
  methods: {
    updateLocale(locale) {
      this.$i18n.locale = locale;
      this.changeLanguage(locale);
    },
    changeLanguage(language) {
      localStorage.setItem("language", language || "vi");
      this.$i18n.locale = language;
      window.location.reload();
    },
  },
  beforCreate() {
    this.$i18n.locale = localStorage.getItem("language") || "vi";
  },
  created() {
    this.$i18n.locale = localStorage.getItem("language") || "vi";
  }
};
</script>
