<template>
  <base-modal :isShowModal="isShowModal" @close="$emit('close')">
    <div slot="title">Thông báo</div>
    <template slot="content">
      <p>
        Bạn nên cân nhắc thật cẩn thận xem Vin Trade Group có phù hợp với khả năng
        chấp nhận rủi ro, mục tiêu đầu tư, kinh nghiệm đầu tư, tình hình tài
        chính, nhu cầu tài chính, hoàn cảnh cá nhân và những điều khác hay
        không.<br />1. Giao dịch sàn Vin Trade Group có rủi ro rất cao. Là một nhà
        giao dịch , bạn thừa nhận và đồng ý rằng bạn phải tự chịu rủi ro khi
        truy cập và sử dụng các dịch vụ trong giao dịch tài chính;
      </p>
      <p>
        <br />2. Bạn nên hiểu đầy đủ về các rủi ro liên quan đến giao dịch hợp
        đồng và hoàn toàn chịu trách nhiệm về bất kỳ hoạt động giao dịch và phi
        giao dịch nào trên tài khoản của mình. Không tham gia giao dịch hoặc đầu
        tư vượt quá khả năng tài chính của bạn;
      </p>
      <p>
        <br />3. Bạn hoàn toàn chịu trách nhiệm đối với việc tìm hiểu trạng thái
        thực tế của bất kỳ vị thế nào, ngay cả khi chúng tôi hiển thị sai bất kỳ
        lúc nào;
      </p>
      <p>
        <br />4. Tradestocken có thể, theo quyết định riêng của mình, thay mặt
        bạn thực hiện các biện pháp để giảm thiểu tổn thất tiềm ẩn của bạn, bao
        gồm nhưng không giới hạn ở việc chuyển tài khoản ký quỹ của bạn sang tài
        khoản giao dịch và / hoặc từ tài khoản giao dịch sang tài khoản ký quỹ
        của bạn;
      </p>
      <p>
        <br />5. Trong thời gian bảo trì hệ thống Vin Trade Group , bạn đồng ý chịu
        hoàn toàn trách nhiệm trong việc quản lý rủi ro tài khoản ký quỹ của
        mình, bao gồm nhưng không giới hạn việc đóng các vị thế của bạn.
      </p>
      <p>
        <br />6. Bạn đồng ý rằng bạn sẽ tự mình thực hiện mọi giao dịch, giao
        dịch hợp đồng và / hoặc vay nợ và hoàn toàn chịu trách nhiệm về toàn bộ
        các hoạt động của mình. Vin Trade Group sẽ không chịu trách nhiệm đối với bất
        kỳ tổn thất hoặc thiệt hại nào do bạn sử dụng bất kỳ dịch vụ nào hoặc do
        bạn không hiểu các rủi ro liên quan đến việc sử dụng tài sản hoặc dịch
        vụ của chúng tôi gây ra.
      </p>
      <p>
        <br />7. Người dùng đồng ý rằng tất cả các hoạt động đầu tư được thực
        hiện trên Vin Trade Group đều là tự nguyện và chấp nhận vô điều kiện những rủi
        ro và lợi ích tiềm ẩn do các quyết định đầu tư mang lại.
      </p>
      <p>
        <br />8. Vin Trade Group có quyền tạm dừng, chấm dứt các dịch vụ hợp đồng
        Tradestocken. Khi cần thiết, nền tảng Tradestocken có thể tạm dừng, chấm
        dứt các dịch vụ hợp đồng Vin Trade Group bất kỳ lúc nào.
      </p>
      <p>
        <br />9. Do sự chậm trễ của mạng, lỗi hệ thống máy tính và các yếu tố
        không thể cưỡng lại khác, có khả năng việc thực hiện các dịch vụ hợp
        đồng Vin Trade Group có thể bị trì hoãn, tạm ngừng, bị đình chỉ hoặc đi chệch
        hướng. Vin Trade Group sẽ cố gắng hết sức để đảm bảo nhưng không hứa hẹn về sự
        ổn định và hiệu quả của hệ thống vận hành hợp đồng Vin Trade Group. Nhưng nếu
        do các yếu tố trên, kết quả cuối cùng của các dịch vụ hợp đồng Vin Trade Group
        khác với mong đợi của khách hàng thì Vin Trade Group không chịu bất kỳ trách
        nhiệm nào.
      </p>
      <p>
        <br />10. Tài sản tiền mã hóa là sản phẩm dễ biến động với nhiều rủi ro
        mất tiền nhanh. Giá có thể dao động đáng kể vào bất kỳ ngày nào. Do
        những biến động giá này, giá trị tài sản bạn nắm giữ có thể tăng hoặc
        giảm đáng kể tại bất kỳ thời điểm nào. Điều này có thể dẫn đến việc bạn
        mất toàn bộ số vốn đã đầu tư vào một giao dịch.Do đó, bạn không nên giao
        dịch hoặc bỏ ra nhiều hơn số tiền bạn có thể mất. Điều quan trọng là bạn
        phải hiểu rõ rủi ro liên quan trước khi quyết định giao dịch với chúng
        tôi dựa trên nguồn lực tài chính, kinh nghiệm và khả năng chấp nhận rủi
        ro của bạn. Nếu cần, bạn nên tìm lời khuyên từ một cố vấn tài chính độc
        lập. Lợi nhuận và thua lỗ thực tế có thể khác, tùy vào nhiều yếu tố, bao
        gồm nhưng không giới hạn ở hành vi thị trường, biến động thị trường và
        quy mô giao dịch của bạn. Hiệu suất trong quá khứ không đảm bảo hiệu
        suất trong tương lai. Giá trị của khoản đầu tư có thể tăng hoặc giảm.
      </p>
      <p>
        Tôi đã đọc và đồng ý với thỏa thuận dịch vụ Vin Trade Group và đồng ý sử dụng
        nghiệp vụ Vin Trade Group. Tôi nhận thức được rủi ro này và xác nhận việc mua
        hàng.
      </p>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from "./BaseModal.vue";
export default {
  props:['isShowModal'],
  components: {
    BaseModal,
  },
};
</script>

<style lang="scss" scoped>

</style>
