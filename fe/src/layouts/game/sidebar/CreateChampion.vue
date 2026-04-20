<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>THÊM MỚI GIÁI ĐẤU</h4>
      <feather-icon
        icon="XIcon"
        @click.stop="isSidebarActiveLocal = false"
        class="cursor-pointer"
      ></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar
      style="height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 10px)"
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="p-6">
        <vs-input
          label="Tên giải đấu"
          icon-pack="feather"
          class="mt-5 w-full"
          v-model="newChampion.name"
          name="champion-name"
        />

        <div class="label">Ngày bắt đầu</div>
        <datepicker
          v-model="newChampion.dateStart"
          :language="language"
        ></datepicker>

        <div class="label">Ngày kết thúc</div>
        <datepicker
          v-model="newChampion.dateEnd"
          :language="language"
        ></datepicker>

        <vs-input
          v-for="(rewardItem, ind) in newChampion.totalRewards"
          :key="ind"
          :label="`Tiền thường top ${ind + 1}`"
          icon-pack="feather"
          icon="icon-dollar-sign"
          class="mt-5 w-full"
          type="number"
          :name="`reward_${ind}`"
          v-model="newChampion.totalRewards[ind]"
          v-validate="{ required: true, regex: /\d+(\.\d+)?$/ }"
        />

        <div class="btn-add-reward">
          <vs-button type="border" @click="addReward"
            >Thêm mốc thưởng</vs-button
          >
        </div>

        <div>
          <br />
          <input
            type="file"
            class="hidden"
            name="image"
            ref="update_avatar_input"
            @change="update_avatar($event.target.files)"
            accept="image/png, image/jpg, image/jpeg"
          />

          <div v-if="newChampion.background">
            <img class="background-champion" alt="Ảnh nền giải đấu" :src="bg" />

            <br />
            <br />
          </div>
          <vs-button
            type="border"
            class="mr-4"
            @click="$refs.update_avatar_input.click()"
            >{{ newChampion.background ? "Sửa" : "Thêm" }} ảnh nền giải
            đấu</vs-button
          >
        </div>

        <vs-select
          v-model="newChampion.type"
          label="Loại giải đấu"
          class="mt-5 w-full"
          name="item-category"
          v-validate="'required'"
        >
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.text"
            v-for="item in category_choices"
          />
        </vs-select>

        <br />
        <div class="label">Nội dung giải đấu</div>
        <quill-editor
          placeholder="Điền nội dung vào đây"
          v-model="newChampion.content"
        ></quill-editor>
      </div>

      <div class="flex flex-wrap items-center p-6">
        <vs-button class="mr-6" :disabled="loading.create" @click="submitData"
          >Gửi</vs-button
        >
        <vs-button
          type="border"
          color="danger"
          @click="isSidebarActiveLocal = false"
          >Hủy</vs-button
        >
      </div>
    </VuePerfectScrollbar>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Datepicker from "vuejs-datepicker";
import AuthenticationService from "@/services/AuthenticationService";
import randomString from "@/assets/utils/randomString";
import { vi } from "vuejs-datepicker/dist/locale";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import moment from "moment";
import config from '@/config.json';

import { quillEditor } from "vue-quill-editor";

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dm: config.domain,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      },
      category_choices: [
        { text: "Khối lượng giao dịch", value: "klgd" },
        { text: "Hoa hồng", value: "hh" }
      ],
      newChampion: {
        id: null,
        name: "",
        dateStart: null,
        dateEnd: null,
        totalRewards: [],
        background: "",
        type: "",
        content: ""
      },
      language: vi,
      loading: {
        create: false
      }
    };
  },
  components: {
    VuePerfectScrollbar,
    Datepicker,
    quillEditor
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
        }
      }
    },
    bg() {
      const { background } = this.newChampion;
      if (background.startsWith("blob:")) {
        return background;
      }
      return this.dm + "api/auth/photo/champions/" + background;
    }
  },
  methods: {
    async submitData() {
      this.loading.create = true;
      // Validate data
      const {
        id,
        name,
        dateStart,
        dateEnd,
        type,
        content,
        background,
        totalRewards
      } = this.newChampion;
      if (!name || !dateStart || !dateEnd || !type || !content || !background || !totalRewards.toString()) {
        this.loading.create = false;
        return this.$vs.notify({
          text: "Bạn phải điền đầy đủ các trường thông tin!",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-circle",
          position: "right-top"
        });
      }

      const obj = {
        name,
        dateStart: moment(dateStart).toISOString(),
        dateEnd: moment(dateEnd).toISOString(),
        totalRewards: totalRewards.toString(),
        type,
        content,
        background
      };

      if (background.startsWith("blob:")) {
        // Upload background images
        const formData = new FormData();
        const backgroundImageFile = await fetch(background).then(r => r.blob());
        formData.append("image", backgroundImageFile);
        formData.append("nick", randomString(6));

        const bgUploaded = await AuthenticationService.uploadBackgroundImage(
          formData
        );
        if (bgUploaded.data.success) {
          obj.background = bgUploaded.data.data;
        }
      }

      if (id) {
        // Update
        AuthenticationService.updateChampion(id, obj).then(resp => {
          if (resp.data.success) {
            this.$emit("updateChampion", Object.assign(obj, { id }));
            this.loading.create = false;
            this.isSidebarActiveLocal = false;
            this.newChampion = {
              name: "",
              dateStart: null,
              dateEnd: null,
              totalRewards: [],
              type: "",
              content: ""
            };

            return this.$vs.notify({
              text: "Cập nhật giải đấu thành công!",
              color: "success",
              iconPack: "feather",
              icon: "icon-check"
            });
          } else {
            return this.$vs.notify({
              text: resp.data.message,
              color: "danger",
              iconPack: "feather",
              icon: "icon-alert-circle"
            });
          }
        });
      } else {
        // New
        AuthenticationService.createChampion(obj).then(resp => {
          if (resp.data.success) {
            this.$emit(
              "createdChampion",
              Object.assign(obj, { id: resp.data.data })
            );
            this.loading.create = false;
            this.isSidebarActiveLocal = false;
            this.newChampion = {
              name: "",
              dateStart: null,
              dateEnd: null,
              totalRewards: [],
              type: "",
              content: ""
            };

            return this.$vs.notify({
              text: "Bạn đã tạo giải đấu thành công!",
              color: "success",
              iconPack: "feather",
              icon: "icon-check"
            });
          } else {
            return this.$vs.notify({
              text: resp.data.message,
              color: "danger",
              iconPack: "feather",
              icon: "icon-alert-circle"
            });
          }
        });
      }
    },
    update_avatar(file) {
      this.newChampion.background = URL.createObjectURL(file[0]);
    },
    addReward() {
      this.newChampion.totalRewards.push(null);
    }
  },
  watch: {
    isSidebarActive(val) {
      if (val) {
        if (JSON.stringify(this.data) !== "{}") {
          this.newChampion = this.data;
        }
      } else {
        // reset
        this.newChampion = {
          id: null,
          name: "",
          dateStart: null,
          dateEnd: null,
          totalRewards: [],
          background: "",
          type: "",
          content: ""
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }

  .background-champion {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
  }
}

.scroll-area--data-list-add-new {
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
}

.label {
  padding-left: 5px;
  color: #c2c6dc;
  font-size: 0.85rem;
}

.btn-add-reward {
  margin-top: 10px;
}
</style>
