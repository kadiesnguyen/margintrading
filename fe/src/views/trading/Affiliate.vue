<template>
  <div id="AffiliatePage">
    <div class="bodyContent affiliatePage">
      <div class="banner flex items-center justify-center">
        <div class="vx-row max-w-3xl">
          <div class="vx-col lg:w-6/12">
            <p class="text-4xl font-bold white line-height-normal mb-4">
              Bạn cần trở thành Thành viên VIP để nhận hoa hồng VIP và hoa hồng
              giao dịch
            </p>
            <vs-button
              size="large"
              style="background: #2b70fa !important; color: #fff !important"
              type="filled"
              >Mua ngay</vs-button
            >
          </div>

          <div class="vx-col w-full my-5 lg:w-6/12">
            <div class="affiliateInfo bgSecondary borderPrimary">
              <div class="linkGroup">
                <div class="vx-col flex-col justify-center">
                  <div class="w-full">
                    <p class="color-gray colorSecondary mb-2 label">
                      Link Đăng ký
                    </p>
                    <div class="groupButton flex mb-4 relative">
                      <div class="leftControl">
                        <input
                          type="text"
                          v-model="linkDk"
                          readonly="readonly"
                          disabled
                          class="form-control w-full text-base pl-2"
                        />
                      </div>
                      <div class="rightControl">
                        <button
                          class="btn button primary cursor-pointer"
                          v-clipboard:copy="linkDk"
                          @click="saoChep"
                        >
                          Sao chép
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="w-full sm:w-2/3">
                    <p class="color-light-gray mb-2 colorSecondary label">
                      Mã giới thiệu
                    </p>
                    <div class="groupButton flex mb-4 relative">
                      <div class="leftControl">
                        <input
                          type="text"
                          v-model="codeGioiThieu"
                          readonly="readonly"
                          disabled
                          class="form-control w-full text-base pl-2"
                        />
                      </div>
                      <div class="rightControl">
                        <button
                          class="btn button primary cursor-pointer"
                          v-clipboard:copy="codeGioiThieu"
                          @click="saoChep"
                        >
                          Sao chép
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="subBanner bgSecondary flex items-center justify-center p-4">
        <div
          class="
            flex
            boxContent
            h-full
            items-start
            flex-col
            sm:flex-row sm:items-center
          "
        >
          <div class="flex items-center mr-2">
            <div>
              <div class="icon iconInvite"></div>
            </div>
            <div>
              <div class="textContent">
                <p class="mb-1 title">Mời bạn</p>
                <p class="color-white-50 mb-0 des">
                  Mời bạn bè đăng ký {{ domain }} qua liên kết
                </p>
              </div>
            </div>
          </div>
          <div class="borderSubBanner hidden md:block"></div>
          <div class="flex items-center mr-2 mt-3 sm:mt-0">
            <div>
              <div class="icon iconSign"></div>
            </div>
            <div>
              <div class="textContent">
                <p class="mb-1 title">Bạn đăng ký</p>
                <p class="color-white-50 mb-0 des">
                  Bạn của bạn đồng ý lời mới, hoàn tất đăng ký và giao dịch
                </p>
              </div>
            </div>
          </div>
          <div class="borderSubBanner hidden md:block"></div>
          <div class="flex items-center mt-3 sm:mt-0">
            <div>
              <div class="icon iconCommission"></div>
            </div>
            <div>
              <div class="textContent">
                <p class="mb-1 title">Nhận hoa hồng tương ứng</p>
                <p class="color-white-50 mb-0 des">Nhận hoa hồng dễ dàng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getData from "@/pages/trade/navbar/components/data.json";
import config from "@/config.json";


export default {
  components: {

  },
  data() {
   return {
   }
  },

  computed:{
    linkDk(){
        return window.location.origin + "/register?r=" + getData.ref;
    },

    codeGioiThieu(){
        return getData.ref;
    },

    domain(){
        return config.domainRealName.charAt(0).toUpperCase() + config.domainRealName.slice(1);
    }
  },

  methods: {
    saoChep() {
      return this.$vs.notify({
        text: "Đã Sao chép vào bộ nhớ",
        color: "success",
        position: "top-right",
        iconPack: "feather",
        icon: "icon-check",
      });
    },
  },
};
</script>


<style scoped>
/*#AffiliatePage{
    margin: -2.2rem;
}*/

.affiliatePage .gobal,
.affiliatePage .commission,
.affiliatePage .qlht {
  display: none;
}

.contentWrapper .header {
  padding: 1rem;
  text-align: center;
}

.lsHH {
  display: none;
}

.contentWrapper .body {
  padding: 2rem 3rem;
  text-align: center;
}

.contentWrapper .body .imgShake {
  width: 211px;
  height: 205px;
  margin: 0 auto;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("~@/assets/images/sky/shake.svg");
}

.icon {
  width: 52px;
  height: 55px;
  margin-right: 1rem;
  background-size: cover;
  background-repeat: no-repeat;
}

.borderSubBanner {
  margin: auto;
  width: 90px;
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.19);
}

.icon.iconCommission {
  background-image: url("~@/assets/images/sky/affi/3.svg");
}

.icon.iconSign {
  background-image: url("~@/assets/images/sky/affi/2.svg");
}

.icon.iconInvite {
  background-image: url("~@/assets/images/sky/affi/1.svg");
}

.affiliatePage .subBanner {
  color: #fff;
  height: 120px;
  background-color: #0e0e0e !important;
}

.affiliatePage .banner .content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

}

.affiliatePage .banner {
  background-image: url("~@/assets/images/sky/bitono_affiliate_bg.png");
}

.affiliatePage .banner {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 200px);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
  padding: 1rem;
}

.color-yellow {
  color: #2b70fa;
}

.table-bordered td {
  border-color: #2b70fa;
}

.table-bordered thead th {
  color: hsla(0, 0%, 100%, 0.5);
  font-weight: 400;
  border-bottom-width: 1px;
  border-color: #2b70fa;
}

.btnTime.active {
  background-color: #2b70fa;
  color: #fff;
  border-color: #2b70fa;
}

.btnTime {
  padding: 5px 11px;
  margin-bottom: 5px;
  border-radius: 5px;
  border: 1px solid #2b70fa;
  color: #2b70fa;
  background-color: transparent;
  white-space: nowrap;
}

.textTime {
  color: #2b70fa;
}

.v-select .vs__dropdown-toggle {
  background: transparent;
}

.btnSearchType {
  background-color: #414141;
  color: #fff;
  border: 1px solid #2b70fa;
  border-radius: 10px;
  min-width: 162px;
  padding: 9px 0;
}

.filterDiv .colFirst:before {
  content: "";
  background-color: #41416f;
  width: 1px;
  height: 45px;
  position: absolute;
  z-index: 898888;
  right: -25px;
  top: 22px;
  opacity: 0.6;
}

.filterDiv {
  background-color: #13263e;
  padding: 37px 42px;
  margin-bottom: 33px;
}

.tableBackground .table-dark td:first-child:after {
  width: calc(100% - 1.5rem);
  left: 1.5rem;
}

.tableBackground .table-dark td:last-child:after {
  width: calc(100% - 1.5rem);
  right: 1.5rem;
  left: auto;
}

.tableBackground .table-dark td,
.tableBackground .table-dark th {
  position: relative;
  border: none;
  padding: 0.75rem 1.5rem;
}

.tableBackground .table-dark td:after,
.tableBackground .table-dark th:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #2b70fa;
}

.tableBackground .table-dark thead th {
  font-weight: 400;
  font-size: 0.75rem;
  color: #2b70fa;
}

.tableBackground {
  border-radius: 20px;
  border: 1px solid #2b70fa;
  height: 100%;
  overflow: hidden;
}

.wrap-chart .chartHight {
  height: 400px;
}

.wrap-chart .chart-instance {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.wrap-chart-below {
  border: none;
}

.c-question,
.c-mail {
  stroke: #2b70fa;
}

.elipText {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.getIntouch .cardBody {
  padding: 1.25rem 1.25rem 1rem;
}

.getIntouch .cardHeader {
  padding: 1rem 1.25rem;
}

.getIntouch {
  border-radius: 20px;
  height: 100%;
}

.networkVolumeStats .cardFooter p {
  line-height: 45px;
  font-size: 18px;
}

.networkVolumeStats .cardFooter {
  background-color: #2b70fa;
  color: #000;
}

.networkVolumeStats .cardFooter {
  padding: 0 1.25rem;
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}

.networkVolumeStats .cardBody p {
  line-height: 40px;
}

.networkVolumeStats .cardBody .dataContent {
  margin-right: -10px;
  margin-left: -10px;
  color: #fff;
}

.networkVolumeStats .texthead {
  color: #2b70fa;
}

.networkVolumeStats .cardBody .head p {
  line-height: 26px;
}

.networkVolumeStats .cardBody .border-bottom,
.networkVolumeStats .cardBody .border-top {
  border-color: #2b70fa !important;
}

.networkVolumeStats .cardBody {
  padding: 0 1.25rem 1rem;
  height: 205px;
  overflow: hidden;
}

.networkVolumeStats .cardHeader {
  padding: 1rem 1.25rem;
}

.networkVolumeStats {
  background-color: #000;
  border-radius: 20px;
  height: 100%;
  position: relative;
  padding-bottom: 45px;
}

.wrap-chart {
  border-radius: 20px;
}

.wrap-chart {
  z-index: 2;
  border-radius: 10px;
  overflow: hidden;
  -webkit-box-shadow: none;
  box-shadow: none;
  position: relative;
  border: 1px solid #2b70fa;
}

.wrap-chart .header {
  padding: 15px;
  border-bottom: 1px solid #2b70fa;
}

.groupButton .leftControl {
  width: 90%;
}

.groupButton .rightControl {
  width: auto;
}

.groupButton .form-control {
  color: #333;
  font-size: 0.875rem;
  background-color: #fafafa;
  border: 1px solid;
  border-radius: 8px 0 0 8px;
  border-color: #2b70fa;
  height: 40px;
  line-height: 40px;
}

.button.primary,
.button.primary:hover {
  background-color: #2b70fa !important;
  color: #fff !important;
}

.groupButton .btn {
  line-height: 37px;
  height: 100%;
  border-radius: 0 3px 3px 0;
  border: none;
  width: 90px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  white-space: nowrap;
}

.colorSuccess {
  color: #31baa0;
}

.colorDanger {
  color: #f46273;
}

.colorPrimary {
  color: #2b70fa;
}

.affiliatePage .affiliateInfo {
  padding: 1.25rem;
  border-radius: 18px;
  height: 100%;
  overflow: hidden;
}

.borderBottom {
  border-color: #2b70fa;
}

.white-50 {
  color: hsla(0, 0%, 100%, 0.5) !important;
}

.colorSecondary {
  color: #fff !important;
}

.boxBasic .heading .textRank .q {
  vertical-align: middle;
  display: inline-block;
}

.bgPrimary-hover:hover,
.bgPrimary {
  background-color: #000 !important;
}

.boxBasic .heading .textRank {
  font-size: 17px;
  color: #2b70fa;
  border: 1px solid #2b70fa;
  border-radius: 14px;
  padding: 1rem 1rem 1rem 80px;
  margin-bottom: 0;
  min-width: 220px;
  width: 100%;
  max-width: 250px;
}

.boxBasic .heading .textRank .text {
  vertical-align: middle;
}

.rank-text {
  margin-left: -62px;
  width: auto !important;
}

.bgSecondary {
  background-color: #0e0e0e !important;
}

.borderSecondary {
  border: 1px solid;
  border-color: #2b70fa;
}

.boxRank {
  margin: 0 auto;
}

.borderBtSecondary {
  border-bottom: 1px solid;
  border-color: #2b70fa;
}

.boxBasic .heading {
  position: relative;
  height: 100px;
  text-align: center;
}

.boxBasic {
  width: 100%;
  padding: 1.25rem;
  border-radius: 20px;
}

.iconRank {
  position: relative;
  height: 100px;
  width: 100px;
  z-index: 1;
}

.iconRank.rank8 {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@/assets/images/sky/rank/rank8.png");
}

.iconRank.rank7 {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@/assets/images/sky/rank/rank7.png");
}

.iconRank.rank6 {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@/assets/images/sky/rank/rank6.png");
}

.iconRank.rank5 {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@/assets/images/sky/rank/rank5.png");
}

.iconRank.rank4 {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@/assets/images/sky/rank/rank4.png");
}

.iconRank.rank3 {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@/assets/images/sky/rank/rank3.png");
}

.iconRank.rank2 {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@/assets/images/sky/rank/rank2.png");
}

.iconRank.rank1 {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@/assets/images/sky/rank/rank1.png");
}

.dateRange {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  max-width: 300px;
}

.dateRange > span {
  text-align: center;
}

.dateRange > span {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 40px;
  flex: 0 0 40px;
  line-height: 40px;
  color: #fff;
}

@media only screen and (max-width: 646px) {
  .btnSearchType {
    width: 100%;
    margin-bottom: 5px;
  }
  .filterDiv .colFirst:before {
    right: 0;
    opacity: 0;
  }
}
</style>

<style>
.TnD input {
  color: #000;
  background: #fff;
}

.table td,
.table th {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table-bordered,
.table-bordered td,
.table-bordered th {
  border: 1px solid #dee2e6;
  text-align: center;
}

.vs--single .vs__selected {
  position: absolute;
  z-index: 111;
}

.vs__dropdown-toggle input {
  background: transparent;
}

.vdp-datepicker input {
  padding: 11px !important;
}

.v-select .vs__dropdown-toggle {
  border: 0;
  border-bottom: 1px solid #fff;
  border-radius: 5px;
}

.vs__dropdown-option--highlight {
  background: #363b56;
}

.con-vs-popup .vs-popup {
  width: 800px;
}

.vs-popup--content {
  padding: 0;
  margin: 0;
  width: calc(100%);
}

.colorBlue {
  color: #00b6ff;
}

.content .inputGroup input {
  background: #fff;
  color: #545454;
}

.dateRange input {
  background: transparent;
  border-bottom: 1px solid #fff !important;
}
</style>
