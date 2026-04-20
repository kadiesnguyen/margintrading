<template>

</template>
<script>
import { ref } from "vue";
import { Navigation, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

// import "swiper/css/autoplay";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },

  setup() {
    const breakpoints = {
      1024: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    };

    const autoplay = {
      delay: 2000,
      disableOnInteraction: false,
    };

    const swiperOptions = {
      slidesPerView: 2,
      spaceBetween: 10,
      pagination: { clickable: true },
      breakpoints,
      autoplay,
      modules: [Navigation, Autoplay],
      navigation: true,
    };
    const isToggleMenu = ref(false);

    return {
      swiperOptions,
      isToggleMenu,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/client/scss/responsive.scss";
.button {
  transition: 0.5s;
}
.title {
  font-size: 28px;
}
.description {
  font-size: 18px;
  color: #7e7e7e;
}
.header {
  background: #000b19;
  font-size: 13px;
  text-transform: uppercase;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  .top-bar {
    background: #cc3d39;

    @include max-sm {
      display: none;
    }

    img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
  }

  .main-bar {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .logo {
    max-height: unset;
    max-width: 150px;
    height: unset;
  }

  .menu {
    display: flex;
    align-items: center;
    overflow: hidden;

    @include max-lg {
      // display: none;
      flex-basis: 100%;
      flex-direction: column;
      transition: max-height 0.35s ease;
      max-height: 0;

      &.show {
        display: flex;
        max-height: 140px;
        padding-bottom: 20px;
      }
    }
  }

  .collapse-menu-button {
    color: white;
    display: none;
    @include max-lg {
      display: block;
    }
  }

  .button {
    display: flex;
    padding: 0 10px;
    align-items: center;
    margin: 10px;
    border-radius: 5px;
    text-transform: uppercase;
    font-size: 14px;
    color: white;
    white-space: nowrap;
    height: 40px;
    box-sizing: border-box;
    &:hover {
      color: #fff;
    }
  }
}
.tradingview-widget-container{
  background: #0b203a;
  margin-top: 102px;
  height: auto !important;

  @include max-sm{
    margin-top: 67px;
  }
}
.main {
  background: #f8f8f8;
  .button {
    background: #cc3d39;
    padding: 7px 10px;
    border-radius: 5px;

    color: white;
    font-size: 24px;
    text-transform: uppercase;

    white-space: nowrap;

    &:hover {
      color: #fff;
    }
  }

  .banner{
    display: flex;
    flex-wrap: wrap;

    @include max-sm{
      &-item{
        flex-basis: 100%;

        &:nth-child(2){
          order: -1;
        }
      }
    }
  }
}

.news {
  .wrapper {
    border-bottom: solid thin #ebebeb;
    padding-bottom: 4px;
  }

  .title {
    min-width: fit-content;
    font-size: 16px;
    position: relative;
    background: #cc3d39;
    color: #fff;
    padding: 5px 7px;
    margin-right: 20px;
  }
  .top {
    display: flex;
    animation: news-top-animation 10s linear 0s infinite;

    &:hover {
      animation-play-state: paused;
    }
    .top-item {
      font-size: 13px;
      border: solid thin #ebebeb;
      padding: 4px 7px;
      border-radius: 4px;
      margin-right: 20px;
      white-space: nowrap;
    }
  }
}

#start-up-carousel {
  ::v-deep .swiper-button-prev,
  ::v-deep .swiper-button-next {
    background: #fff;
    opacity: 0.7;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    &::after {
      font-size: 20px;
      color: black;
    }
  }

  ::v-deep .swiper-button-prev {
    left: -10px;
  }

  ::v-deep .swiper-button-next {
    right: -10px;
  }
}
.section-preview {
  background: #f8f8f8;
  .items_link {
    flex-basis: calc(100% / 3);
    text-align: center;

    svg {
      margin: 0 auto;
    }

    .name {
      display: block;
      margin-top: 10px;
    }
  }
}

.whychoose {
  .service_box {
    .service_text {
      h4 {
        font-size: 18px;
        font-weight: bold;
      }
      p {
        font-size: 13px;
        color: #3f3f3f;
      }
    }
    .service_icon {
      margin-bottom: 10px;
      img {
        display: inline-block;
        max-width: 130px;
        vertical-align: middle;
      }
    }
  }

  @include max-sm{
    &-item{
      flex-basis: 50%;
    }
  }

}

.lowest {
  background: url(http://bmwindex.com/img/impe/bg3.jpg) no-repeat;
  background-size: cover;
  background-position: left center;
  padding: 40px 15px;

}

.market-chart {
  background: url(~@/assets/client/images/home/bg-quickstart.png) no-repeat
    center center;
  background-size: cover;
}
</style>

<style>
@keyframes news-top-animation {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>

