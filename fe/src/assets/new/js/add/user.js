var USER_JS = {
    init() {
        USER_JS.initLoginForm();
        USER_JS.initRegisterForm();
        USER_JS.initChangePassword();
        USER_JS.initSwingNumber();
        USER_JS.initRechargeForm();
        /*USER_JS.initWithdrawForm();*/
    },
    initLoginForm() {
        $('.login_form').find('.submit').onClick(function(data) {
            if (data.code != 200) {
                swal({
                    title: data.message,
                    content: true,
                    className: 'swalPopup',
                    button: 'Đóng'
                });
            } else {
                window.location.href = data.redirect_url;
            }
            var _this = $(this);
            setTimeout(function() {
                _this.html('Đăng nhập');
                _this.prop('disabled', false);
            }, 300);
        }, function() {
            $(this).html("<i class='fa fa-circle-o-notch fa-spin'></i> Đang xử lý...");
            $(this).prop('disabled', true);
        });
    },
    initRegisterForm() {
        $('.register_form').find('.submit').onClick(function(data) {
            if (data.code != 200) {
                swal({
                    title: data.message,
                    content: true,
                    className: 'swalPopup',
                    button: 'Đóng'
                });
            } else {
                swal({
                    title: data.message,
                    content: true,
                    className: 'swalPopup',
                    button: 'Ok'
                }).then((willDelete) => {
                    window.location.href = data.redirect_url;
                });
            }
            var _this = $(this);
            setTimeout(function() {
                _this.html('Đăng ký');
                _this.prop('disabled', false);
            }, 300);
        }, function() {
            $(this).html("<i class='fa fa-circle-o-notch fa-spin'></i> Đang xử lý...");
            $(this).prop('disabled', true);
        });
    },
    initChangePassword() {
        $('.member_form').find('.submit').onClick(function(data) {
            if (data.code != 200) {
                swal({
                    title: data.message,
                    content: true,
                    className: 'swalPopup',
                    button: 'Đóng'
                });
            } else {
                swal({
                    title: data.message,
                    content: true,
                    className: 'swalPopup',
                    button: 'Ok'
                }).then((willDelete) => {
                    window.location.href = data.redirect_url;
                });
            }
            var _this = $(this);
            setTimeout(function() {
                _this.html('Lưu');
                _this.prop('disabled', false);
            }, 300);
        }, function() {
            $(this).html("<i class='fa fa-circle-o-notch fa-spin'></i> Đang xử lý...");
            $(this).prop('disabled', true);
        });
    },
    initSwingNumber() {
        $(function() {
            var dd = new Date();
            var max = 976658;
            var floatSeed = dd.getMonth() % 3 * 100 + dd.getDate() % 7 * 89;
            max -= floatSeed;
            var now = (dd.getHours() * 60 * 60 + dd.getMinutes() * 60 + dd.getSeconds()) / 86400;
            $(".timer.num").text(Math.floor(max * now).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            $($(".timer.percent")[0]).text(Math.floor(Math.random() * 21 + 60) + "%");
            $($(".timer.percent")[1]).text(Math.floor(Math.random() * 21 + 20) + "%");
            $('.timer').each(function() {
                var $this = $(this);
                $({
                    Counter: 0
                }).animate({
                    Counter: $this.text().replace(",", "").replace("%", "")
                }, {
                    duration: 6000,
                    easing: 'swing',
                    step: function() {
                        $this.text(Math.ceil(this.Counter));
                        if ($this.hasClass('num')) {
                            $this.text($this.text().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                        }
                        if ($this.hasClass('percent')) {
                            $this.text($this.text() + "%");
                        }
                    }
                });
            });
        });
    },
    initRechargeForm() {
        $('.store_form').find('.submit').onClick(function(data) {
            if (data.code != 200) {
                swal({
                    title: data.message,
                    content: true,
                    className: 'swalPopup',
                    button: 'Đóng'
                });
            } else {
                swal({
                    title: data.message,
                    content: true,
                    className: 'swalPopup',
                    button: 'Ok'
                }).then((willDelete) => {
                    window.location.href = data.redirect_url;
                });
            }
            var _this = $(this);
            setTimeout(function() {
                _this.html('Gửi');
                _this.prop('disabled', false);
            }, 300);
        }, function() {
            $(this).html("<i class='fa fa-circle-o-notch fa-spin'></i> Đang xử lý...");
            $(this).prop('disabled', true);
        });
    },
    initUpdateBankInfo() {
        if ($('.bank_form').length == 0) return;
        let idCard1 = document.getElementsByName('idCard1').value;
        let idCard2 = document.getElementsByName('idCard2').value;
        let bank = document.getElementById('bank').value;
        let bank_branch = document.getElementById('bank_branch').value;
        let bank_number = document.getElementById('bank_number').value;
        let _token = $('.bank_form input[name=_token]').val();
        const data = {
            bank: bank,
            bank_branch: bank_branch,
            bank_number: bank_number,
            idCard1: idCard1,
            idCard2: idCard2,
            _token: _token
        };
        $('.bank_form .submit').html("<i class='fa fa-circle-o-notch fa-spin'></i> Đang xử lý...");
        $('.bank_form .submit').prop('disabled', true);
        $.ajax({
                url: $('.bank_form').attr('action'),
                type: 'POST',
                contentType: "application/json;charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(data)
            })
            .done(function(data) {
                setTimeout(function() {
                    $('.bank_form .submit').html('Gửi');
                    $('.bank_form .submit').prop('disabled', false);
                }, 300);
                if (data.code != 200) {
                    swal({
                        title: data.message,
                        content: true,
                        className: 'swalPopup',
                        button: 'Đóng'
                    });
                } else {
                    swal({
                        title: data.message,
                        content: true,
                        className: 'swalPopup',
                        button: 'Ok'
                    }).then((willDelete) => {
                        window.location.reload();
                    });
                }
            })
    },
    initWithdrawForm() {
        if ($('.withdraw_form').length == 0) return;
        let idCard1 = document.getElementsByName('idCard1').value;
        let idCard2 = document.getElementsByName('idCard2').value;
        let bank = document.querySelector('#bank .bank').value;
        let bank_branch = document.querySelector('#bank_branch .bank_branch').value;
        let bank_number = document.querySelector('#bankAccount .bank_number').value;
        let amount = document.querySelector('#amount .amount').value;
        let _token = $('.withdraw_form input[name=_token]').val();
        const data = {
            bank: bank,
            bank_branch: bank_branch,
            bank_number: bank_number,
            amount: amount,
            idCard1: idCard1,
            idCard2: idCard2,
            _token: _token
        };
        $('.withdraw_form .submit').html("<i class='fa fa-circle-o-notch fa-spin'></i> Đang xử lý...");
        $('.withdraw_form .submit').prop('disabled', true);
        $.ajax({
                url: $('.withdraw_form').attr('action'),
                type: 'POST',
                contentType: "application/json;charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(data)
            })
            .done(function(data) {
                setTimeout(function() {
                    $('.withdraw_form .submit').html('Gửi');
                    $('.withdraw_form .submit').prop('disabled', false);
                }, 300);
                if (data.code != 200) {
                    swal({
                        title: data.message,
                        content: true,
                        className: 'swalPopup',
                        button: 'Đóng'
                    });
                } else {
                    swal({
                        title: data.message,
                        content: true,
                        className: 'swalPopup',
                        button: 'Ok'
                    }).then((willDelete) => {
                        window.location.href = data.redirect_url;
                    });
                }
            })
    },
    initWithdrawForm1() {
        $('.withdraw_form').find('.submit').onClick(function(data) {
            if (data.code != 200) {
                swal({
                    title: data.message,
                    content: true,
                    className: 'swalPopup',
                    button: 'Đóng'
                });
            } else {
                swal({
                    title: data.message,
                    content: true,
                    className: 'swalPopup',
                    button: 'Ok'
                }).then((willDelete) => {
                    window.location.href = data.redirect_url;
                });
            }
            var _this = $(this);
            setTimeout(function() {
                _this.html('Gửi');
                _this.prop('disabled', false);
            }, 300);
        }, function() {
            $(this).html("<i class='fa fa-circle-o-notch fa-spin'></i> Đang xử lý...");
            $(this).prop('disabled', true);
        });
    },
}
$(document).ready(function() {
    USER_JS.init();
});