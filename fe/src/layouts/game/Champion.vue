<template>
  <div id="list-all-champions">
    <div class="flex flex-wrap-reverse items-center data-list-btn-container">
      <!-- ACTION - DROPDOWN -->
      <vs-dropdown vs-trigger-click class="dd-actions cursor-pointer mr-4 mb-4">
        <div
          class="p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32 w-full"
        >
          <span class="mr-2">Tác vụ</span>
          <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
        </div>

        <vs-dropdown-menu>
          <vs-dropdown-item>
            <span class="flex items-center">
              <feather-icon
                icon="TrashIcon"
                svgClasses="h-4 w-4"
                class="mr-2"
              />
              <span @click="deleteMultiple">Xóa</span>
            </span>
          </vs-dropdown-item>

          <vs-dropdown-item>
            <span class="flex items-center">
              <feather-icon icon="FileIcon" svgClasses="h-4 w-4" class="mr-2" />
              <span @click="activePrompt = true">In</span>
            </span>
          </vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>

      <!-- ADD NEW -->
      <div
        class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
        @click="addNewChampion"
      >
        <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
        <span class="ml-2 text-base text-primary">Tạo giải đấu</span>
      </div>
    </div>

    <create-new-champion
      :isSidebarActive="isOpenCreateChampion"
      :data="data"
      @closeSidebar="toggleDataSidebar"
      @createdChampion="createdChampion"
      @updateChampion="updateChampion"
    ></create-new-champion>

    <!-- Champions list -->
    <vs-table
      ref="table"
      v-model="selectedUser"
      pagination
      :max-items="itemsPerPage"
      search
      :data="products"
    >
      <template slot="thead">
        <vs-th sort-key="name">Tên giải đấu</vs-th>
        <vs-th sort-key="dateStart">Ngày bắt đầu</vs-th>
        <vs-th sort-key="dateEnd">Ngày kết thúc</vs-th>
        <vs-th sort-key="totalReward">Tổng phần thưởng</vs-th>
        <vs-th sort-key="type">Loại giải đấu</vs-th>
        <vs-th sort-key="content">Nội dung giải đấu</vs-th>
        <vs-th>Tác vụ</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="tr.id" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="user-name font-medium truncate">{{ tr.name }}</p>
            </vs-td>

            <vs-td>
              <p class="user-name font-medium truncate">
                {{ formatDate(tr.dateStart) }}
              </p>
            </vs-td>

            <vs-td>
              <p class="user-price">{{ formatDate(tr.dateEnd) }}</p>
            </vs-td>
            <vs-td>
              <p class="user-commission">
                {{ tr.totalRewards.reduce((prev, curr) => +prev + +curr, 0) }}
              </p>
            </vs-td>

            <vs-td>
              <p class="user-commission">
                {{ tr.type }}
              </p>
            </vs-td>

            <vs-td>
              <div class="champion-content" v-html="tr.content"></div>
            </vs-td>

            <vs-td class="whitespace-no-wrap text-center">
              <vx-tooltip
                style="float: left"
                color="warning"
                text="Chỉnh sửa giải đấu"
              >
                <vs-button
                  color="dark"
                  type="line"
                  icon-pack="feather"
                  icon="icon-edit"
                  @click.stop="editChampion(tr)"
                ></vs-button>
              </vx-tooltip>
              <vx-tooltip
                style="float: left"
                color="danger"
                text="Xóa giải đấu"
              >
                <vs-button
                  color="dark"
                  type="line"
                  icon-pack="feather"
                  icon="icon-trash"
                  @click="
                    openPopDelete({
                      id: tr.id,
                      name: tr.name,
                      index: indextr
                    })
                  "
                ></vs-button>
              </vx-tooltip>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>

    <vs-popup
      background-color="rgba(255,255,255,.6)"
      class=""
      title="Cảnh báo"
      :active.sync="popupDeleteActive"
    >
      <p>Bạn đồng ý xóa {{ championData.name }} này?</p>
      <br />
      <vs-button
        icon="icon-trash"
        icon-pack="feather"
        type="gradient"
        @click.stop="deleteChampion()"
        >Đồng ý</vs-button
      >
    </vs-popup>
  </div>
</template>

<script>
import CreateNewChampion from "./sidebar/CreateChampion.vue";
import AuthenticationService from "@/services/AuthenticationService";
import moment from "moment";

export default {
  data() {
    return {
      isOpenCreateChampion: false,
      popupDeleteActive: false,
      championData: {}, // Dữ liệu giải đấu cần xoá
      data: {}, // Dữ liệu giái đấu
      productsFake: [
        {
          id: 1,
          name: "Giải đấu1",
          dateStart: "00:00:00 02-04-2021",
          dateEnd: "00:00:00 02-04-2021",
          totalRewards: [],
          type: "hh",
          content: "Xin chao"
        }
      ],
      selectedUser: [],
      itemsPerPage: 20
    };
  },
  methods: {
    editChampion(champion) {
      this.data = JSON.parse(JSON.stringify(champion));
      this.isOpenCreateChampion = true;
    },
    deleteChampion() {
      AuthenticationService.deleteChampion(this.championData.id).then(resp => {
        if (resp.data.success) {
          this.productsFake.splice(this.championData.index, 1);
          this.popupDeleteActive = false;
          return this.$vs.notify({
            text: `Xoá ${this.championData.name} thành công`,
            color: "success",
            position: "top-right"
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
    },
    openPopDelete(data) {
      this.championData = data;
      this.popupDeleteActive = true;
    },
    toggleDataSidebar() {
      this.isOpenCreateChampion = !this.isOpenCreateChampion;
    },
    addNewChampion() {
      this.data = {};
      this.isOpenCreateChampion = true;
    },
    deleteMultiple() {},
    formatPrice(value, minimum) {
      var formatter = new Intl.NumberFormat("en-US", {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum
      });
      return formatter.format(value);
    },
    getOrderStatusColor(status) {
      if (status == 0) return "warning";
      if (status == 1) return "success";
      return "warning";
    },
    getOrderStatusColorText(status) {
      if (status == 0) return "Chưa bật";
      if (status == 1) return "Đã bật";
      return "Chưa bật";
    },
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY");
      }
    },
    updateChampion(championUpdated) {
      const indChampionUpdated = this.productsFake.findIndex((e) => e.id === championUpdated.id);
      if (indChampionUpdated > -1) {
        this.productsFake.splice(indChampionUpdated, 1, { ...championUpdated, totalRewards: championUpdated.totalRewards.split(',') });
      }
    },
    createdChampion(newChampion) {
      this.productsFake = [{ ...newChampion, totalRewards: newChampion.totalRewards.split(',') }].concat(this.productsFake);
    }
  },
  components: {
    CreateNewChampion
  },
  computed: {
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    products() {
      return this.productsFake;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.productsFake.length;
    }
  },
  created() {
    let token = localStorage.getItem("token");
    this.$store.dispatch("setToken", token);

    AuthenticationService.getChampions().then(resp => {
      this.$vs.loading.close("#loading-corners > .con-vs-loading");

      if (resp.data.success == 4) {
        localStorage.removeItem("token");
        this.$router.push("/pages/login").catch(() => {});
      } else {
        this.productsFake = resp.data.data.map((e) => ({
          ...e,
          totalRewards: e.totalRewards.split(',')
        }));
      }
    });
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/extraComponents/tree.scss";

button.btn-async {
  background: rgba(var(--vs-warning), 0.15);
}

button.btn-delete {
  background: rgba(var(--vs-danger), 0.15);
}
</style>

<style lang="scss">
#list-all-champions {
  .vs-con-table {
    /*
      Below media-queries is fix for responsiveness of action buttons
      Note: If you change action buttons or layout of this page, Please remove below style
    */
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          padding: 20px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }

  .champion-content {
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    display: -webkit-box;
  }
}
</style>
