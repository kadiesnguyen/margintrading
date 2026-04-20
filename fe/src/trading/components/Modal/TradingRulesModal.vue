<template>
  <base-modal :isShowModal="isShowModal" @close="$emit('close')">
    <div slot="title">Quy tắc giao dịch</div>
    <template slot="content">
      <table style="width: 100%">
        <tbody>
          <tr>
            <td style="text-align: center; background: #212529">
              <p>
                <span style="font-size: 16px; color: #ffffff"
                  ><strong>GIỚI THIỆU</strong></span
                >
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <p><strong>1. Sản phẩm giao dịch</strong></p>
      <p>
        Giao dịch này là một sản phẩm phát sinh tài chính. Bạn có thể đoán một
        trong hai kết quả có thể xảy ra. Nếu dự đoán của bạn là chính xác, bạn
        sẽ nhận được tiền lãi được xác định trước. Nếu không, bạn sẽ mất tài sản
        đầu tư của bạn.
      </p>
      <p><strong>2.&nbsp;Thời gian giao dịch</strong></p>
      <p>
        Sàn Tradestocken giao dịch tiền ảo BTC, giao dịch 24/7 không giới hạn
        khung thời gian.
      </p>
      <p><strong>3.&nbsp;Tiền tệ giao dịch</strong></p>
      <p>Cặp BTC/USD - Tỉ giá Bitcoin với USD</p>
      <p><strong>4.&nbsp;Thời gian giao dịch</strong></p>
      <p>60 giây , đặt cược trước thời gian kết thúc 10 giây .</p>
      <table style="width: 100%">
        <tbody>
          <tr>
            <td style="text-align: center; background: #212529">
              <p>
                <span style="font-size: 16px; color: #ffffff"
                  ><strong>QUY TẮC GIAO DỊCH</strong></span
                >
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        <!--  -->
        Giao dịch được dựa trên tỉ giá giao dịch tại thời điểm bắt đầu phiên
        giao dịch để tính toán và chữ số được đánh giá là tổng tỉ giá kết quả
        lớn hơn hoặc bé hơn tỉ giá lúc khởi điểm.
        <br />Ví dụ: Tỉ giá giao dịch hiện tại là 1.11523339. <br />Kết thúc
        giao dịch tỉ giá 1.2358455 (lớn hơn tỉ giá khởi điểm) khách cược cao sẽ
        thắng và cược thấp sẽ thua và ngược lại...
        <!--  -->
      </p>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from "./BaseModal.vue";
export default {
  props: ["isShowModal"],
  components: {
    BaseModal,
  },
};
</script>

<style lang="scss" scoped>
</style>
