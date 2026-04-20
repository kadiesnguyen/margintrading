var wsReady = false;

function loadinghide() {
    $(".loading").hide();
}
var BASE_GUI = {
    init() {
        const myTimeout = setTimeout(loadinghide, 2000);
        BASE_GUI.initLogoutBtn();
        BASE_GUI.initBetHistoryUser();
        BASE_GUI.initGame();
        setInterval(function() {
            if (wsReady) {
                connectTion.send('user_info');
            }
        }, 1000);
    },
    initGame() {
        connectTion = new WebSocket('wss://' + window.location.hostname + '/wsstrade/?auth_token=' + $('#auth_token').val());
        connectTion.onopen = function(e) {
            wsReady = true;
        };
        connectTion.onmessage = function(e) {
            var info = JSON.parse(e.data);
            if (info.type == 'user_info') {
                $('.user-amount [name=wallet]').html(info.data.user_w);
                $('[name=wallet_2]').html(info.data.user_w);
            }
        };
        connectTion.onclose = function(e) {
            wsReady = false;
            setTimeout(function() {
                BASE_GUI.initGame();
            }, 3000);
        };
        connectTion.onerror = function(e) {
            wsReady = false;
        }
    },
    initLogoutBtn() {
        $(".logout").on("click", function() {
            swal({
                title: "Xác nhận đăng xuất?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                confirmButtonColor: "#DD6B55",
                closeOnConfirm: false,
                closeOnCancel: true,
                html: true,
                showLoaderOnConfirm: true,
            }, function() {
                location.href = "/logout";
            });
        });
    },
    initBetHistoryUser() {
        $("#modal-transaction-history").on("show.bs.modal", function(e) {
            var boxLoading = $(this).find(".modal-body");
            boxLoading.addClass('in-loading-box');
            $(this).find(".modal-body").load('init-bet-history-user', function() {
                $('.log [name=start]').datepicker({
                    'dateFormat': 'yy-mm-dd',
                });
                $('.log [name=end]').datepicker({
                    'dateFormat': 'yy-mm-dd',
                });
                boxLoading.removeClass('in-loading-box');
            });
        });
        $('#modal-transaction-history').on('hidden.bs.modal', function() {
            $(this).find(".modal-body").html('');
        })
        $(document).on('submit', '.form-init-bet-history-user', function(event) {
            event.preventDefault();
            var _btnSubmit = $(this).find('.bet-submit');
            _btnSubmit.addClass('in-loading-box');
            $.ajax({
                    url: 'init-bet-history-user',
                    type: 'GET',
                    data: $(this).serialize()
                })
                .done(function(html) {
                    _btnSubmit.removeClass('in-loading-box');
                    $('.user-history-bet-result').html(html);
                    $('.log [name=start]').datepicker({
                        'dateFormat': 'yy-mm-dd',
                    });
                    $('.log [name=end]').datepicker({
                        'dateFormat': 'yy-mm-dd',
                    });
                })
        });
    }
}
$(document).ready(function() {
    BASE_GUI.init();
});