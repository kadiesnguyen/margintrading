<template>
  <div class="content">
    <div class="main-block">
      <div class="block">
        <div class="display-flex-block">
          <div class="flex flex-col lg:flex-row gap-2.5">
            <div class="w-full lg:w-1/2 relative">
              <img src="https://i.imgur.com/nxnbfJ5.jpg" alt="logo" width="100%" style="display: inline" />
              <div class="play-game" style="padding-top: 12px; text-align: center">
                <a href="/trading" class="Signout-button btn1" style="margin: 0 auto" title="GIAO DỊCH NGAY">GIAO DỊCH
                  NGAY</a>
              </div>
            </div>
            <div class="w-full lg:w-1/2 flex justify-center items-center">
              <div class="max-w-[80%] mx-auto">
                <div class="product-item-intro">
                  <div class="title-block bg-primary py-1.5 px-5 rounded-md mb-4">
                    <p class="text-xl text-white">HẠN MỤC TÀI CHÍNH</p>
                  </div>
                  <div class="product-item-intro-title">
                    HỢP ĐỒNG CFD CHÊNH LỆCH
                  </div>
                  <div class="product-item-intro-text" style="max-height: initial">
                    <p>
                      CFD là viết tắt của Contract For Difference (hợp đồng
                      chênh lệch).
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Hợp đồng CFD chênh lệch được sử dụng để phản ánh mức độ
                      thay đổi của tỷ giá hối đoái mỗi phút , đo lường mức độ
                      thay đổi trong kỳ vọng của thị trường và thường được sử
                      dụng để đánh giá rủi ro trong tương lai. Do đó , nó còn
                      được gọi là chỉ số khủng hoảng. Mặc dù nó phản ánh mức độ
                      thay đổi, nhưng nó được biểu thị dưới dạng tỷ lệ phần trăm
                      hàng năm và xuất hiện với xác suất có phân phối chuẩn.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Sản phẩm được cung cấp bởi Autoholds - Sàn Giao Dịch Tiền
                      Điện Tử Hàng Đầu Thế Giới!
                    </p>
                  </div>
                </div>
                <div class="pt-5 text-center hidden lg:block">
                  <a href="/trading" class="Signout-button btn1" style="margin: 0 auto" title="GIAO DỊCH NGAY">GIAO DỊCH
                    NGAY</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/client/scss/responsive";
@import "@/assets/client/scss/color";

.content {
  padding-left: 15px;
  padding-right: 15px;
  height: 100%;

  @include min-lg {
    .content {
      padding-left: 10px;
      padding-right: 15px;
      padding-top: 0;
      padding-bottom: 10px;
    }
  }
}

.product-item-intro-title {
  font-size: 26px;
  color: #0d3259;
  margin-bottom: 5px;
  font-weight: bold;
  text-align: left;
}

.product-item-intro-text {
  color: #333;
  max-height: 200px;
  overflow-y: auto;
  text-align: left;
  font-size: 14px;
}

.btn1 {
  padding: 15px 35px !important;
  background-color: #cc3d39 !important;
  border: none;
  color: #fff;
  font-weight: bold;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  border-radius: 5px;
}

.play-game {
  display: none;

  @include max-lg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 111;
    display: block;

    a {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 600;
      position: relative;
      z-index: 1;
      color: $primary;
      background-color: #fff;
      box-shadow: 0 5px 5px 5px rgba(0, 0, 0, 0.17);

      &:hover {
        background: $primary;
      }

      &:after {
        position: absolute;
        content: "";
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        background: white;
        z-index: -1;
        border-radius: 50%;
      }

      @include max-sm {
        width: 180px;
        height: 180px;
      }
    }
  }
}
</style>
