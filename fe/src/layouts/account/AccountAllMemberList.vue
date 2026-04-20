<!-- =========================================================================================
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Admin
  Author: Ares
  Author Telegram: @skydn93
========================================================================================== -->

<template>
  <div id="list-all-account" class="data-list-container">
    <data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      @user-updated="userUpdated"
    />
    <div id="loading-corners" class="vs-con-loading__container">
      <vs-table
        ref="table"
        :data="products"
      >
        <div
          slot="header"
          class="flex flex-wrap-reverse items-center flex-grow justify-between"
        >
          <!-- ITEMS PER PAGE -->
          <vs-dropdown
            vs-trigger-click
            class="cursor-pointer mb-4 mr-4 items-per-page-handler"
          >
            <div
              class="
                p-4
                border border-solid
                d-theme-border-grey-light
                rounded-full
                d-theme-dark-bg
                cursor-pointer
                flex
                items-center
                justify-between
                font-medium
              "
            >
              <span class="mr-2 text-black"
                >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
                {{
                  products.length - currentPage * itemsPerPage > 0
                    ? currentPage * itemsPerPage
                    : products.length
                }}
                of {{ queriedItems }}</span
              >
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
            <vs-dropdown-menu>
              <vs-dropdown-item @click="itemsPerPage = 20">
                <span>20</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 50">
                <span>50</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 100">
                <span>100</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
          <div class="con-input-search vs-table--search">
              <input
                v-model="searchText"
                class="input-search vs-table--search-input"
                type="text" />
              <vs-icon icon="search"></vs-icon>
            </div>
        </div>

        <template slot="thead">
          <vs-th sort-key="id">ID</vs-th>
          <vs-th sort-key="email">{{ $t('tendangnhap') }}</vs-th>
          <vs-th sort-key="nickname">{{ $t('name') }}</vs-th>
          <vs-th sort-key="wallet">{{ $t('wallet') }}</vs-th>
          <vs-th sort-key="isDisabled">{{ $t('active') }}</vs-th>
          <vs-th v-if="checkRole('*')">{{ $t('captren') }}</vs-th>
          <vs-th sort-key="verify">{{ $t('danhtinh') }}</vs-th>
          <vs-th sort-key="datecreate">{{ $t('ngaytao') }}</vs-th>
          <vs-th>{{ $t('tacvu') }}</vs-th>
        </template>

        <template slot-scope="{ data }">
          <tbody>
            <vs-tr :data="tr" :key="tr.id" v-for="(tr, indextr) in data">
              <vs-td>
                <p class="user-name font-medium truncate">{{ tr.id }}</p>
              </vs-td>

              <vs-td>
                <p class="user-name font-medium truncate">
                  {{ tr.username }}<br />
                  <!-- <vs-checkbox v-model="tr.marketing" @click="changeAccType(tr)">Marketing</vs-checkbox> -->
                </p>
                <p>
                  <!-- <vs-button color="dark" type="line" icon-pack="feather" icon="icon-eye" @click="showF1F7(tr.nick_name, tr.ref_code, tr.email)"> F1-F7</vs-button> -->
                </p>
              </vs-td>

              <vs-td>
                <p class="user-name font-medium truncate">{{ tr.last_name }}</p>
              </vs-td>

              <vs-td>
                <p class="user-price">
                  {{ formatPrice(tr.balance, 0) }} <br />
                </p>
              </vs-td>

              <vs-td>
                <p class="user-price">
                  {{ tr.isDisabled ? "Khóa" : $t('hoatdong') }}
                </p>
              </vs-td>

              <vs-td v-if="checkRole('*')">
                <p class="user-price">
                  <vs-button
                    color="success"
                    icon-pack="feather"
                    icon="icon-zap"
                    @click="showCapTren(tr)"
                    >Xem</vs-button
                  >
                </p>
              </vs-td>

              <vs-td>
                <vx-tooltip style="float: left" text="Detail">
                  <vs-button
                    :color="getOrderStatusColor(tr.verified)"
                    class="de-status whitespace-no-wrap rounded-lg py-2 px-4"
                    @click.stop="showVerifyPopup(tr)"
                    >{{ getVerifyStatusText(tr.verified) }}</vs-button
                  >
                </vx-tooltip>
              </vs-td>

              <vs-td>
                <p class="user-create">{{ formatDate(tr.created_at) }}</p>
              </vs-td>

              <vs-td class="whitespace-no-wrap text-center">
                <!-- <vx-tooltip v-if="tr.marketing" style="float: left" :title="tr.nick_name" color="success" text="Cộng tiền vào tài khoản">
                          <vs-button color="dark" type="line" icon-pack="feather" icon="icon-dollar-sign" @click.stop="addMoneyUser(tr)"></vs-button>
                      </vx-tooltip> -->
                <vx-tooltip
                  style="float: left"
                  :title="tr.email"
                  color="success"
                  :text="tr.isDisabled ? 'Mở khóa tài khoản' : 'Khóa tài khoản'"
                  v-if="checkRole('*')"
                >
                  <vs-button
                    color="dark"
                    type="line"
                    icon-pack="feather"
                    :icon="`icon-${tr.isDisabled ? 'unlock' : 'lock'}`"
                    @click.stop="toggleLockAccount(tr)"
                  ></vs-button>
                </vx-tooltip>
                <vx-tooltip
                  style="float: left"
                  :title="tr.email"
                  color="warning"
                  text="Chỉnh sửa tài khoản"
                  v-if="checkRole('*')"
                >
                  <vs-button
                    color="dark"
                    type="line"
                    icon-pack="feather"
                    icon="icon-edit"
                    @click.stop="editUser(tr, indextr)"
                  ></vs-button>
                </vx-tooltip>
                <!-- <vx-tooltip style="float: left" :title="tr.nick_name" color="danger" text="Xóa tài khoản">
                          <vs-button color="dark" type="line" icon-pack="feather" icon="icon-trash" @click="openPopDelete({id: tr.id, email: tr.email, index: indextr})"></vs-button>
                      </vx-tooltip> -->
                <vx-tooltip
                  style="float: left"
                  :title="tr.email"
                  color="info"
                  text="Kiểm tra tài khoản"
                >
                  <vs-button
                    color="dark"
                    type="line"
                    icon-pack="feather"
                    icon="icon-eye"
                    @click="
                      openPopView({
                        id: tr.id,
                        email: tr.email,
                        index: indextr,
                      })
                    "
                  ></vs-button>
                </vx-tooltip>

                <vx-tooltip
                  style="float: left"
                  :title="tr.email"
                  color="info"
                  text="Thêm điểm"
                  v-if="checkRole('*')"
                >
                  <vs-button
                    color="dark"
                    type="line"
                    icon-pack="feather"
                    icon="icon-dollar-sign"
                    @click="openPopupAddMoney(tr.username)"
                  ></vs-button>
                </vx-tooltip>

                <!-- <feather-icon icon="DollarSignIcon" svgClasses="w-5 h-5 hover:text-success stroke-current" @click.stop="addMoneyUser({id: tr.id, type: 'addMoney'})" />
                    <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current" @click.stop="editUser(tr)" />
                    <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2" @click.stop="deleteUser(tr.id)" /> -->
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
      <vs-pagination :total="totalPage" v-model="currentPage" class="con-pagination-table vs-table--pagination"></vs-pagination>

    </div>
    <vs-popup
      background-color="rgba(255,255,255,.6)"
      class=""
      title="Background"
      :active.sync="popupDeleteActive"
    >
      <p>Bạn đồng ý xóa tài khoản {{ UserInfo.email }} này.</p>
      <vs-button
        icon="icon-trash"
        icon-pack="feather"
        type="gradient"
        @click.stop="deleteUser(UserInfo.id, UserInfo.index)"
        >Đồng ý</vs-button
      >
    </vs-popup>
    <vs-popup title="Address Wallet" :active.sync="popupAdressWallet">
      <p>
        Address: {{ getAdress }}
        <feather-icon
          icon="CopyIcon"
          v-clipboard:copy="getAdress"
          v-clipboard:success="onCopy"
          class="cursor-pointer"
        ></feather-icon
        ><br />
        Private Key: {{ getPrivateKey }}
        <feather-icon
          icon="CopyIcon"
          v-clipboard:copy="getPrivateKey"
          v-clipboard:success="onCopy"
          class="cursor-pointer"
        ></feather-icon
        ><br />
        WFI BTC Address: {{ getWfiKey }}
        <feather-icon
          icon="CopyIcon"
          v-clipboard:copy="getWfiKey"
          v-clipboard:success="onCopy"
          class="cursor-pointer"
        ></feather-icon>
      </p>
    </vs-popup>
    <vs-popup title="Danh sách thành viên F1 - F7" :active.sync="popupF1F7">
      <div id="loading-corners2" class="vs-con-loading__container">
        <p>
          <span class="mr-2"
            >Khối lượng GH tháng này: {{ nFormatter(tslgdCD1, 2) }}</span
          ><br />
          <span class="mr-2"
            >Khối lượng GH tháng trước: {{ nFormatter(tslgdCD2, 2) }}</span
          ><br />
          <span class="mr-2"
            >Khối lượng GH 2 tháng trước: {{ nFormatter(tslgdCD3, 2) }}</span
          ><br />
          <span class="mr-2"
            >Khối lượng GH 3 tháng trước: {{ nFormatter(tslgdCD4, 2) }}</span
          ><br />
        </p>
        <v-tree ref="tree" :data="treeData" :draggable="true" />
      </div>

      <!--<v-tree ref='tree' :canDeleteRoot="true" :data='treeData' :draggable='true' :tpl='tpl' :halfcheck='true' :multiple="true"/>-->
    </vs-popup>

    <vs-popup
      title="Kiểm tra tài khoản"
      :active.sync="popupViewActive"
      fullscreen
    >
      <div v-if="loadingUserViewer">Đợi một chút nhé</div>
      <vs-tabs v-else-if="UserViewer">
        <vs-tab label="Lịch sử nạp tiền">
          <vs-table :data="UserViewer.lichSuNap" pagination :max-items="10">
            <template slot="thead">
              <vs-th sort-key="account">Tài khoản</vs-th>
              <vs-th sort-key="amount">Số tiền</vs-th>
              <vs-th sort-key="note">Ghi chú</vs-th>
              <vs-th sort-key="status">Trạng thái</vs-th>
              <vs-th sort-key="created_at">Thời gian</vs-th>
            </template>
            <template slot-scope="{ data }">
              <tbody>
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    <p class="de-name font-medium truncate">{{ tr.email }}</p>
                  </vs-td>

                  <vs-td>
                    <p class="de-amount">{{ formatPrice(tr.amount) }}<br /></p>
                  </vs-td>

                  <vs-td>
                    <p class="de-note">{{ tr.note }}</p>
                  </vs-td>

                  <vs-td>
                    <vs-chip
                      :color="getOrderStatusColor(tr.status)"
                      class="de-status"
                      >{{ getTradeStatusText(tr.status) | title }}</vs-chip
                    >
                  </vs-td>

                  <vs-td>
                    <p class="de-create">{{ formatDate(tr.created_at) }}</p>
                  </vs-td>
                </vs-tr>
              </tbody>
            </template>
          </vs-table>
          <b v-if="UserViewer.lichSuNap"
            >Tổng tiền đã nạp: {{ formatPrice(UserViewer.tongNap) }}</b
          >
          <br />
          <!-- <b>Số tiền trong TK Live: {{ nFormatter(UserViewer.tienTrongViLive, 2) }}</b> -->
        </vs-tab>
        <vs-tab label="Lịch sử rút tiền">
          <vs-table :data="UserViewer.lichSuRut" pagination :max-items="10">
            <template slot="thead">
              <vs-th sort-key="account">Tài khoản</vs-th>
              <vs-th sort-key="amount">Số tiền</vs-th>
              <vs-th sort-key="note">Ghi chú</vs-th>
              <vs-th sort-key="status">Trạng thái</vs-th>
              <vs-th sort-key="datecreate">Thời gian</vs-th>
            </template>
            <template slot-scope="{ data }">
              <tbody>
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    <p class="de-name font-medium truncate">
                      {{ tr.email }}
                    </p>
                  </vs-td>
                  <vs-td>
                    <p class="de-amount">
                      {{ formatPrice(tr.amount, 0) }}<br />
                    </p>
                  </vs-td>

                  <vs-td>
                    <div class="de-note">
                      {{ formatNote(tr.currency, tr.note, tr.bank) }}
                    </div>
                  </vs-td>

                  <vs-td>
                    <vs-chip
                      :color="getOrderStatusColor(tr.status)"
                      class="de-status"
                      >{{ getTradeStatusText(tr.status) | title }}</vs-chip
                    >
                  </vs-td>

                  <vs-td>
                    <p class="de-create">{{ formatDate(tr.created_at) }}</p>
                  </vs-td>
                </vs-tr>
              </tbody>
            </template>
          </vs-table>

          <b> Tổng tiền đã rút: {{ formatPrice(UserViewer.tongRut) }}</b>
        </vs-tab>
        <vs-tab label="Lịch sử cược">
          <vs-table
            :data="UserViewer.lichSuCuocTien"
            pagination
            :max-items="10"
          >
            <template slot="thead">
              <vs-th sort-key="email">Tài khoản</vs-th>
              <vs-th sort-key="buy_sell">Mua / Bán</vs-th>
              <vs-th sort-key="amount">Số tiền</vs-th>
              <vs-th sort-key="win_lose">Thắng / Thua</vs-th>
              <vs-th sort-key="result_bet">Kết quả</vs-th>
              <vs-th sort-key="datecreate">Thời gian</vs-th>
            </template>

            <template slot-scope="{ data }">
              <tbody>
                <vs-tr
                  :data="tr"
                  :key="indextr"
                  v-for="(tr, indextr) in data.filter((e) => e.type_account)"
                >
                  <vs-td>
                    <p class="bet-description font-medium truncate">
                      {{ tr.email }}
                    </p>
                  </vs-td>

                  <vs-td>
                    <p class="bet-buy_sell" v-if="tr.buy_sell == 'buy'">
                      <span class="text-success">MUA</span>
                    </p>
                    <p class="bet-buy_sell" v-else>
                      <span class="text-danger">BÁN</span>
                    </p>
                  </vs-td>

                  <vs-td>
                    <p class="bet-amount">
                      {{ formatPrice(tr.amount_bet) }}
                    </p>
                  </vs-td>

                  <vs-td>
                    <p class="bet-win_lose">
                      <span
                        :class="{
                          'text-success': tr.amount_win,
                          'text-danger': !tr.amount_win,
                        }"
                        >{{
                          `${
                            tr.amount_win != 0
                              ? "+ " + formatPrice(tr.amount_win)
                              : "- " + formatPrice(tr.amount_lose)
                          }`
                        }}</span
                      >
                    </p>
                  </vs-td>

                  <vs-td>
                    <p class="bet-result_bet" v-if="tr.amount_win != 0">
                      <span class="text-success">Thắng</span>
                    </p>
                    <p class="bet-result_bet" v-else>
                      <span class="text-danger">Thua</span>
                    </p>
                  </vs-td>

                  <!-- <vs-td>
                    <p class="bet-open_close">
                      {{ `${tr.open} -> ${tr.close}` }}
                    </p>
                    <p>Phiên: {{ tr.session }}</p>
                  </vs-td> -->

                  <vs-td>
                    <p class="de-create">{{ tr.created_at }}</p>
                  </vs-td>
                </vs-tr>
              </tbody>
            </template>
          </vs-table>
          <p>
            <b>
              Tổng thắng:
              <span class="text-success">{{
                formatPrice(UserViewer.tongThang)
              }}</span></b
            >
          </p>
          <p>
            <b>
              Tổng thua:
              <span class="text-danger">{{
                formatPrice(UserViewer.tongThua)
              }}</span></b
            >
          </p>
        </vs-tab>
        <vs-tab label="Thêm tiền cho tài khoản">
          <vs-table
            :data="UserViewer.lichSuThemTien"
            pagination
            :max-items="10"
          >
            <template slot="thead">
              <vs-th sort-key="account">Tài khoản</vs-th>
              <vs-th sort-key="amount">Số tiền</vs-th>
              <vs-th sort-key="datecreate">Thời gian</vs-th>
            </template>

            <template slot-scope="{ data }">
              <tbody>
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    <p class="de-name font-medium truncate">
                      {{ tr.email }}
                    </p>
                  </vs-td>

                  <vs-td>
                    <p class="de-amount">
                      {{ formatPrice(tr.price_VN) }}<br />
                    </p>
                  </vs-td>

                  <vs-td>
                    <p class="de-create">{{ formatDate(tr.created_at) }}</p>
                  </vs-td>
                </vs-tr>
              </tbody>
            </template>
          </vs-table>
          <b> Tổng tiền đã thêm: {{ formatPrice(UserViewer.tongThem) }}</b>
        </vs-tab>
      </vs-tabs>
    </vs-popup>

    <vs-popup
      class="holamundo"
      title="Xác minh người dùng"
      :active.sync="isShowVerifyPopup"
    >
      <template v-if="checkRole('*')">
        <div
          @click.stop="doneVerify(verifySelectedUser.id, 1)"
          v-if="
            verifySelectedUser.verified == 0 || verifySelectedUser.verified == 2
          "
          class="mb-2"
        >
          <vs-button svgClasses="w-5 h-5 stroke-current"> Đồng ý </vs-button>
        </div>
        <div
          @click.stop="doneVerify(verifySelectedUser.id, 0, tr)"
          class="mb-2"
          v-else
        >
          <vs-button color="danger" svgClasses="w-5 h-5 stroke-current">
            Từ chối
          </vs-button>
        </div>
      </template>
      <p class="font-bold">Mặt trước CMND:</p>
      <p class="text-center"><img class="responsive" :src="imgFront" /></p>
      <p class="font-bold mt-2">Mặt sau CMND:</p>
      <p class="text-center"><img class="responsive" :src="imgBack" /></p>
      <p class="font-bold mt-2">Ảnh chân dung:</p>

      <p class="text-center"><img class="responsive" :src="imgAvatar" /></p>
    </vs-popup>

    <vs-popup
      :title="'Thêm điểm: ' + addMoneyEmail"
      :active.sync="isShowAddMoney"
    >
      <vs-input label="Số điểm" type="number" v-model="addMoneyAmount" />
      <vs-button class="mt-4" @click="AddMoneyUser">Xác nhận</vs-button>
    </vs-popup>

    <vs-popup
      :title="`Xem cấp trên người dùng`"
      :active.sync="popupCapTren"
      class="superior-popup"
    >
      <div id="loading-corners3" class="vs-con-loading__container">
        <div v-if="!dataSuperior">
          <p>Nick này không có cấp trên!</p>
          <div class="mt-2">
            <p>Tên người dùng:</p>
            <v-select
              class="superior-select"
              :options="agencyOptions"
              label="username"
              v-model="selectedSuperior"
              :reduce="(option) => option.ref_code"
            >
            </v-select>
          </div>
          <vs-button class="mt-2" @click="updateUpline">Thêm</vs-button>
        </div>
        <div v-else>
          <template v-if="isEditSuperior">
            <v-select
              class="superior-select"
              :options="agencyOptions"
              v-model="selectedSuperior"
              label="username"
              :reduce="(option) => option.ref_code"
            >
            </v-select>
            <div class="flex space-x-2">
              <vs-button
                class="mt-2"
                icon-pack="feather"
                icon="icon-chevronDown"
                color="warning"
                @click="isEditSuperior = false"
                >Hủy</vs-button
              >
              <vs-button class="mt-2" @click="updateUpline">Cập nhật</vs-button>
            </div>
          </template>
          <template v-else>
            <div>Tên người dùng: {{ dataSuperior.username }}</div>
            <div>
              Tên đầy đủ: {{ dataSuperior.first_name }}
              {{ dataSuperior.last_name }}
            </div>
            <div>Mã giới thiệu: {{ dataSuperior.ref_code }}</div>

            <vs-button class="mt-2" @click="isEditSuperior = true"
              >Cập nhật</vs-button
            >
          </template>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import DataViewSidebar from "@/layouts/account/slidebar/DataViewSidebar.vue";
import vSelect from "vue-select";
import AuthenticationService from "@/services/AuthenticationService";
import moment from "moment";
import Vue from "vue";
import { VTree, VSelectTree } from "vue-tree-halower";
import { formatPrice } from "@/helpers/helpers.js";
import config from "@/config.json";
import { checkRole } from "@/helpers/helpers.js";
import { debounce } from "debounce";

export default {
  components: {
    DataViewSidebar,
    vSelect,
    VTree,
    //VSelectTree
  },
  props: ["refCode"],
  data() {
    return {
      userSeleced: "",
      dataSuperior: null,
      agencyList: [],
      popupCapTren: false,
      selectedSuperior: "",
      isEditSuperior: false,
      checkRole,
      formatPrice,
      tslgdCD1: 0,
      tslgdCD2: 0,
      tslgdCD3: 0,
      tslgdCD4: 0,

      treeData: [
        {
          title: "node1",
          expanded: true,
          children: [
            {
              title: "<span style='color: red'>node 1-1</span>",
              expanded: true,
              children: [
                {
                  title: "node 1-1-1",
                },
                {
                  title: "node 1-1-2",
                },
                {
                  title: "node 1-1-3",
                },
              ],
            },
            {
              title: "<span style='color: red'>node 1-2</span>",
              children: [
                {
                  title: "node 1-2-1",
                },
                {
                  title: "node 1-2-2",
                },
              ],
            },
          ],
        },
      ],
      popupF1F7: false,
      getAdress: "",
      getPrivateKey: "",
      getWfiKey: "",
      popupAdressWallet: false,

      UserInfo: {},
      UserViewer: null,
      loadingUserViewer: false,
      popupDeleteActive: false,
      popupViewActive: false,
      activePrompt: false,
      selectedUser: [],
      fileName: "",
      cellAutoWidth: true,
      selectedFormat: "xlsx",
      productsFake: [
        {
          id: 1,
          email: "abc@gmail.com",
          nick_name: "SkyPlaza",
          first_name: "Ares",
          last_name: "BO",
          profile_image: "https://vi.vuejs.org/images/logo.svg",
          money_vn: 100.0,
          money_btc: 0.0,
          money_eth: 0.01,
          money_usdt: 1.0,
          money_paypal: 0.0,
          manage_supers: 1,
          pending_commission: 0.0,
          active_2fa: 0,
          created_at: "00:00:00 02-04-2021",
        },
        {
          id: 2,
          email: "abc@gmail.com",
          nick_name: "SkyPlaza 3",
          first_name: "KK",
          last_name: "Ares",
          profile_image: "https://vi.vuejs.org/images/logo.svg",
          money_vn: 100.0,
          money_btc: 0.0,
          money_eth: 0.01,
          money_usdt: 1.0,
          money_paypal: 0.0,
          manage_supers: 0,
          pending_commission: 0.0,
          active_2fa: 1,
          created_at: "01:00:00 02-04-2021",
        },
      ],
      itemsPerPage: 20,
      isMounted: false,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},

      dm: config.domain,
      imgLinkDef: require("@/assets/images/profile/sfp.png"),
      isShowVerifyPopup: false,
      imgFront: "",
      imgBack: "",
      imgAvatar: "",
      verifySelectedUser: "",
      isShowAddMoney: false,
      addMoneyEmail: -1,
      addMoneyAmount: 0,
      totalItems: 0,
      currentPage: 1,
      searchText: '',
    };
  },
  computed: {
    totalPage(){
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },

    products() {
      return this.productsFake;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.productsFake.length;
    },
    agencyOptions() {
      return this.agencyList.filter((e) => e.ref_code);
    },
  },
  methods: {
    updateUpline() {
      const data = {
        username: this.userSeleced.username,
        ref_code: this.selectedSuperior,
      };
      AuthenticationService.updateUpline(data).then((res) => {
        if (res.data.success == 1) {
          const index = this.agencyList.findIndex((item) => {
            return item.ref_code == data.ref_code;
          });

          if (index !== -1) {
            this.userSeleced.upline_id = this.selectedSuperior;
            this.isEditSuperior = false;
            this.dataSuperior = this.agencyList[index];
          }
          this.isEditSuperior = false;
          return this.$vs.notify({
            text: "Cập nhật cấp trên thành công",
            color: "success",
            iconPack: "feather",
            position: "top-right",
            icon: "icon-check",
          });
        }
      });
    },
    showCapTren(tr) {
      this.popupCapTren = true;
      this.dataSuperior = null;
      this.userSeleced = tr;
      this.selectedSuperior = tr.upline_id;
      this.dataSuperior = this.agencyList.find((e) => {
        return e.ref_code == tr.upline_id;
      });
    },

    AddMoneyUser() {
      if (!this.addMoneyAmount || isNaN(this.addMoneyAmount)) {
        return this.$vs.notify({
          text: "Số tiền không hợp lệ.",
          color: "danger",
          iconPack: "feather",
          icon: "icon-check",
        });
      }
      const data = {
        email: this.addMoneyEmail,
        amount: this.addMoneyAmount,
      };
      AuthenticationService.updateMoneyMember(data).then((res) => {
        let updateIndex = this.productsFake.findIndex((e) => {
          return e.username == this.addMoneyEmail;
        });
        if (res.data.success == 1) {
          this.productsFake[updateIndex].balance =
            Number(this.productsFake[updateIndex].balance) +
            Number(this.addMoneyAmount);
          this.isShowAddMoney = false;
          return this.$vs.notify({
            text: `Thêm tiền cho người dùng ${this.addMoneyEmail} thành công!`,
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
          });
        }
      });
    },
    openPopupAddMoney(email) {
      this.addMoneyEmail = email;
      this.addMoneyAmount = 0;
      this.isShowAddMoney = true;
    },
    doneVerify(id, val) {
      const obj = {
        id: id,
        verified: val,
      };

      AuthenticationService.verifiedUser(obj).then((resq) => {
        if (resq.data.success == 1) {
          this.verifySelectedUser.verified = val;
          let text = "";
          switch (val) {
            case 1:
              text = "Xác minh thành công";
              break;

            case 0:
              text = "Hủy xác minh thành công";
              break;

            case -1:
              text = "Từ chối xác minh thành công";
              break;

            default:
              break;
          }
          return this.$vs.notify({
            text: text,
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
          });
        } else {
          return this.$vs.notify({
            text: "Xác minh tài khoản thất bại",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        }
      });
    },

    showVerifyPopup(user) {
      this.verifySelectedUser = user;
      const t = `?t=${Date.now()}`;
      this.imgFront = user.id_front
        ? this.dm + "api/auth/me/photo/passport/" + user.id_front + t
        : this.imgLinkDef;
      this.imgBack = user.id_front
        ? this.dm + "api/auth/me/photo/passport/" + user.id_back + t
        : this.imgLinkDef;
      this.imgAvatar = user.profile_image
        ? this.dm + "api/auth/me/photo/" + user.profile_image + t
        : this.imgLinkDef;
      this.isShowVerifyPopup = true;
    },
    userUpdated(data) {
      const index = this.productsFake.findIndex((item) => {
        return item.id === data.id;
      });
      if (index !== -1) {
        this.$set(this.productsFake, index, {
          ...this.productsFake[index],
          ...data,
        });
      }
    },
    showF1F7(nick, ref, email) {
      this.popupF1F7 = true;

      this.openLoadingInDiv2();

      this.treeData = [
        {
          title: nick,
          expanded: true,
          children: [],
        },
      ];

      let obj = {
        nick: nick,
        ref: ref,
        email: email,
      };

      //console.log(Object.keys(test).length);

      AuthenticationService.getListF1F7(obj).then((resp) => {
        this.$vs.loading.close("#loading-corners2 > .con-vs-loading");

        if (resp.data.success) {
          let data = resp.data.data;
          let obj = resp.data.obj;
          this.tslgdCD1 = obj.tslgdCD1;
          this.tslgdCD2 = obj.tslgdCD2;
          this.tslgdCD3 = obj.tslgdCD3;
          this.tslgdCD4 = obj.tslgdCD4;

          let c = 0;
          for (let obj in data) {
            c++;
            for (let i = 0; i < data[obj].length; i++) {
              this.treeData[0].children.push({
                title: `<span style='color: white'>Cấp ${c} - ${data[obj][i].nick_name} - Khối lượng Giao Dịch: { this.nFormatter(data[obj][i].tklgd, 2)}</span> - Tổng tiền nạp: {this.nFormatter(data[obj][i].amt, 2)}`,
              });
            }
          }
        }
      });
    },

    openLoadingInDiv2() {
      this.$vs.loading({
        container: "#loading-corners2",
        type: "corners",
        scale: 0.6,
      });
    },

    openLoadingInDiv() {
      this.$vs.loading({
        container: "#loading-corners",
        type: "corners",
        scale: 0.6,
      });
    },

    changeAccType(tr) {
      const { id } = tr;
      let obj = {
        id: id,
        type: tr.marketing ? 0 : 1,
      };

      AuthenticationService.changeAccMarketing(obj).then((resp) => {
        if (resp.data.success === -1) {
          tr.marketing = false;
          return this.$vs.notify({
            text: resp.data.message,
            color: "warning",
            iconPack: "feather",
            icon: "icon-check",
          });
        } else {
          if (resp.data.success) {
            return this.$vs.notify({
              text: "Đã thay đổi thành công tài khoản!",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
          } else {
            localStorage.removeItem("token");
            this.$router.push("/pages/login").catch(() => {});
          }
        }
      });
    },

    clickGetAddress(a, p, w) {
      this.popupAdressWallet = true;
      if (w != "") {
        this.getWfiKey = w;
      } else {
        this.getWfiKey = "N/A";
      }
      this.getAdress = a;
      this.getPrivateKey = p;
    },

    onCopy() {
      this.$vs.notify({
        text: "Đã sao chép vào bộ nhớ",
        color: "success",
        iconPack: "feather",
        position: "top-center",
        icon: "icon-check-circle",
      });
    },
    deleteMultiple() {
      for (var i = this.selectedUser.length - 1; i >= 0; i--) {
        let id = this.selectedUser[i]["id"];
        AuthenticationService.deleteMember(id);
        Vue.delete(this.productsFake, i);
      }
      this.selectedUser = [];
      return this.$vs.notify({
        text: "Đã xóa thành công",
        color: "success",
        iconPack: "feather",
        icon: "icon-check",
      });
    },
    openPopDelete(data) {
      this.UserInfo = data;
      this.popupDeleteActive = true;
    },

    async openPopView(data) {
      let token = localStorage.getItem("token");
      this.$store.dispatch("setToken", token);
      this.loadingUserViewer = true;

      AuthenticationService.analyticsUser(data.id).then((resp) => {
        if (resp.data.success) {
          this.UserViewer = resp.data.data;
          this.loadingUserViewer = false;
        } else {
          this.loadingUserViewer = false;
          localStorage.removeItem("token");
          this.$router.push("/pages/login").catch(() => {});
        }
      });

      this.popupViewActive = true;
    },
    typeMoney(currency) {
      switch (currency.toUpperCase()) {
        case "BTC":
        case "ETH":
        case "USDT":
          return {
            t: "Hệ thống",
            i: require("@/assets/images/sky/icon_bank/paypal-mini.png"),
          };
        case "VND":
          return {
            t: "Ngân hàng VNĐ",
            i: require("@/assets/images/sky/icon_bank/vnd-mini.svg"),
          };

        default:
          return {
            t: currency.toUpperCase(),
            i: require("@/assets/images/sky/icon_bank/paypal-mini.png"),
          };
      }
    },
    getAmountDecimal(type, money) {
      let cur = "$";
      let coin = type.toUpperCase();
      let minimum = 2;
      if (coin == "BTC") minimum = 6;

      if (coin == "ETH") minimum = 4;

      if (coin == "USDT") minimum = 2;

      if (coin == "VN") minimum = 0;

      var formatter = new Intl.NumberFormat("en-US", {
        //style: 'currency',
        //currency: '',
        minimumFractionDigits: minimum,
      });

      return cur + formatter.format(money);
    },
    formatNote(currency, note, bank) {
      if (currency === "vnd") {
        const noteArr = bank.split("|");
        return `
Ngân hàng: ${noteArr[0]}\n
Chi nhánh: ${noteArr[1]}\n
Số tài khoản: ${noteArr[2]}\n
Chủ tài khoản: ${noteArr[3]}
`;
      } else {
        return note;
      }
    },
    deleteUser(id, index) {
      let token = localStorage.getItem("token");
      this.$store.dispatch("setToken", token);

      AuthenticationService.deleteMember(id).then((resp) => {
        if (resp.data.success) {
          Vue.delete(this.productsFake, index);
          this.popupDeleteActive = false;
          return this.$vs.notify({
            text: "Đã xóa thành công",
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
          });
        } else {
          localStorage.removeItem("token");
          this.$router.push("/pages/login").catch(() => {});
        }
      });
    },
    nFormatter(num, digits) {
      const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
          return num >= item.value;
        });
      return item
        ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
        : "0";
    },
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("MM/DD/YYYY hh:mm:ss");
      }
    },
    addMoneyUser(data) {
      data["type"] = "addMoney";
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },

    toggleLockAccount(data) {
      if (data.isDisabled) {
        // Mở khóa TK
        AuthenticationService.enabledAccount(data.id).then((resp) => {
          if (resp.data.success) {
            data.isDisabled = false;
            return this.$vs.notify({
              text: "Mở khóa TK thành công",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
          } else {
            localStorage.removeItem("token");
            this.$router.push("/pages/login").catch(() => {});
          }
        });
      } else {
        AuthenticationService.disabledAccount(data.id).then((resp) => {
          if (resp.data.success) {
            data.isDisabled = true;
            return this.$vs.notify({
              text: "Khóa TK thành công",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
          } else {
            localStorage.removeItem("token");
            this.$router.push("/pages/login").catch(() => {});
          }
        });
      }
    },
    addNewAccount() {
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },
    editUser(data, index) {
      delete data["type"];
      data["trIndex"] = index;
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    getOrderStatusColor(status) {
      if (status == 0) return "warning";
      if (status == 1) return "success";
      if (status == -1) return "danger";
      return "warning";
    },

    getOrderStatusColorText(status) {
      if (status == 0) return "Chưa bật";
      if (status == 1) return "Đã bật";
      //if(status == 2) return "danger"
      return "Chưa bật";
    },

    getTradeStatusText(status) {
      if (status == 0) return "Đang xử lý";
      if (status == 1) return "Hoàn thành";
      if (status == -1) return "Từ chối";
      //if(status == 2) return "danger"
      return "Đang xử lý";
    },

    getVerifyStatusText(status) {
      if (status == 0) return "Chưa xác minh";
      if (status == 1) return "Đã xác minh";
      //if(status == 2) return "danger"
      return "Chưa xác minh";
    },

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          // Add col name which needs to be translated
          // if (j === 'timestamp') {
          //   return parseTime(v[j])
          // } else {
          //   return v[j]
          // }

          return v[j];
        })
      );
    },
    getData(){
      if(this.isMounted){
          this.openLoadingInDiv();
      }

      const offset = (this.currentPage - 1 ) * this.itemsPerPage;
      const limit = this.itemsPerPage
      const params = {offset, limit}

      if(this.searchText){
        params.s = this.searchText;
      }

      if (this.refCode) params.ref_code = this.refCode;
      // this.openLoadingInDiv();
      AuthenticationService.getAllMember(params)
      .then((resp) => {

        this.$vs.loading.close('#loading-corners > .con-vs-loading');

        if(resp.data.success == 4){
            localStorage.removeItem('token');
            this.$router.push('/pages/login').catch(() => {})
        }else{
            this.totalItems = resp.data.data.count;
            this.productsFake = resp.data.data.items;
        }
      })
    },

    search: debounce(function () {
          this.getData()
      }, 500)
  },
  created() {
    // if(!moduleDataList.isRegistered) {
    //   this.$store.registerModule('dataList', moduleDataList)
    //   moduleDataList.isRegistered = true
    // }

    //this.$store.registerModule('dataList', this.productsFake);

    //this.$store.dispatch("dataList/fetchDataListItems")

    //console.log(this.$store.state.dataList);
    let token = localStorage.getItem("token");
    this.$store.dispatch("setToken", token);
    this.getData();

    if (checkRole("*")) {
      AuthenticationService.getListAgency().then((resp) => {
        if (resp.data.success == 4) {
          localStorage.removeItem("token");
          this.$router.push("/pages/login").catch(() => {});
        } else {
          this.agencyList = resp.data.data;
        }
      });
    }
  },
  mounted() {
    this.isMounted = true;
    this.openLoadingInDiv();
  },

  watch:{
    currentPage(){
      this.getData()
    },

    searchText(){
      this.currentPage = 1;
      this.search()
    }

  }
};
</script>

<style lang="scss" scoped>
.superior-popup {
  ::v-deep .vs-popup--content {
    overflow: visible !important;
  }

  #loading-corners3 {
    &.vs-con-loading__container {
      overflow: visible;
    }
  }
}
</style>
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
#list-all-account {
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
}
</style>
