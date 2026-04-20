var wsReady = false;
var connectTion;
var gameGui = {};
var chart;
var arr = [
  { x: new Date(), y: 27724.43 },
  { x: new Date().getTime() + 60000, y: 27739.46 },
  { x: new Date().getTime() + 120000, y: 27735.74 },
  { x: new Date().getTime() + 180000, y: 27705.90 },
  { x: new Date().getTime() + 240000, y: 27713.06 },
  { x: new Date().getTime() + 300000, y: 27712.10 },
  { x: new Date().getTime() + 360000, y: 27735.74 },
];
var tmp = {};
var startTime = 0;
var nowTime = 0;
var stopTime = 0;
var gameTime = 0;
var padding = -110000;
var labelSize = 11;
var labelPad = 29;
var labelPad2 = -42;
var currentItemGameRecordId = 0;
var config = {
  type: "line",
  data: {
    datasets: [
      {
        label: "chart",
        backgroundColor: "",
        borderWidth: 1.5,
        borderColor: "#ffffff",
        pointRadius: 0,
        lineTension: 0,
        fill: true,
        cubicInterpolationMode: "monotone",
        data: arr,
      },
    ],
  },
  options: {
    title: {
      display: false,
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
    hover: {
      intersect: false,
      enabled: true,
      mode: "index",
      animationDuration: 0,
    },
    scales: {
      xAxes: [
        {
          type: "realtime",
          fontColor: "#ffffff",
          realtime: {
            duration: 180000,
            refresh: 1000,
            delay: padding,
            ttl: 3000000,
            onRefresh: onRefresh,
          },
          gridLines: {
            color: "rgba(47, 48, 53, 1)",
            zeroLineColor: "rgba(47, 48, 53, 1)",
            drawBorder: true,
            lineWidth: 1.5,
          },
          ticks: {
            fontColor: "rgba(255,255,255,0.8)",
          },
        },
      ],
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          gridLines: {
            color: "rgba(47, 48, 53, 1)",
            zeroLineColor: "rgba(47, 48, 53, 1)",
            drawBorder: true,
            lineWidth: 1.5,
            offsetGridLines: true,
          },
          scaleLabel: {
            display: false,
          },
          ticks: {
            fontColor: "rgba(255,255,255,0.8)",
          },
        },
      ],
    },
    pan: {
      enabled: true,
      mode: "x",
      rangeMax: {
        x: 3000000,
      },
      rangeMin: {
        x: padding,
      },
      onPan: function (e) {
        reZoom();
        if (arr.length > 0) {
          chart.options.pan.rangeMax.x =
            arr.slice(-1)[0].x - arr[0].x + padding;
        }
      },
    },
    zoom: {
      enabled: false,
      mode: "x",
      rangeMax: {
        x: 3000000,
      },
      rangeMin: {
        x: 30000,
      },
      speed: 0.5,
      onZoom: function (e) {
        reZoom();
        // filter();
      },
    },
    annotation: {
      events: ["click"],
      dblClickSpeed: 50,
      annotations: [],
    },
  },
};

function swalbox(title, content, type) {
  var closeInSeconds = 10;
  swal(
    {
      title: title,
      text: content,
      type: type,
      confirmButtonText: "Xác nhận (" + closeInSeconds + " Đóng sau vài giây)",
      closeOnConfirm: true,
      html: true,
      showLoaderOnConfirm: true,
    },
    function (inputValue) {
      clearInterval(timer);
    }
  );
  var timer = setInterval(function () {
    closeInSeconds--;
    if (closeInSeconds == 0) {
      clearInterval(timer);
      swal.close();
    }
    $(".sa-button-container .confirm").html(
      "Xác nhận (" + closeInSeconds + " Đóng sau vài giây)"
    );
  }, 1000);
}
var gradientFill = function (canvas, height) {
  var bgc = canvas.createLinearGradient(0, 0, 0, height - 50);
  bgc.addColorStop(0, "rgba(23,82,111, 0.8)");
  bgc.addColorStop(0.8, "rgba(23,82,111, 0.6)");
  bgc.addColorStop(0.95, "rgba(23,82,111, 0.2)");
  bgc.addColorStop(1, "rgba(23,82,111, 0)");
  config.data.datasets[0].backgroundColor = bgc; // 填充颜色
};

function addLabel() {
  var length = config.options.annotation.annotations.length;
  var startTime_2 = new Date(startTime);
  var startObj = {
    type: "line",
    drawTime: "afterDraw",
    mode: "vertical",
    scaleID: "x-axis-0",
    value: startTime - 10000,
    borderColor: "rgba(136, 136, 136, 1)",
    borderWidth: 1,
    label: {
      backgroundColor: "#333",
      content: "Tạm ngừng giao dịch",
      fontStyle: "normal",
      fontColor: "#E9E56E",
      fontSize: labelSize,
      xAdjust: labelPad,
      cornerRadius: 0,
      position: "top",
      enabled: true,
    },
  };
  var stopObj = {
    type: "line",
    drawTime: "afterDraw",
    mode: "vertical",
    scaleID: "x-axis-0",
    value: stopTime,
    borderColor: "rgba(136, 136, 136, 1)",
    borderWidth: 1.5,
    label: {
      backgroundColor: "#333",
      content: "Bắt đầu",
      fontStyle: "normal",
      fontColor: "#E9E56E",
      fontSize: labelSize,
      xAdjust: labelPad2,
      cornerRadius: 0,
      position: "top",
      enabled: true,
    },
  };
  var boxObj = {
    type: "box",
    drawTime: "afterDraw",
    xScaleID: "x-axis-0",
    xMin: startTime - 10100,
    xMax: stopTime - 100,
    backgroundColor: "rgba(247, 243, 130, 0.2)",
    borderWidth: 0,
  };

  var gameObj = {
    type: "line",
    drawTime: "afterDraw",
    mode: "vertical",
    scaleID: "x-axis-0",
    value: gameTime,
    borderColor: "rgba(116, 116, 116, 1)",
    borderWidth: 1,
    label: {
      backgroundColor: "rgba(40, 145, 189, 0.5)",
      content: "Tỷ giá hoán đổi hiện hành",
      fontStyle: "normal",
      fonnColor: "#8ba4c2",
      fontSize: labelSize,
      cornerRadius: 0,
      position: "bottom",
      enabled: true,
    },
  };

  config.options.annotation.annotations.splice(0, 1, startObj);
  config.options.annotation.annotations.splice(1, 1, stopObj);
  config.options.annotation.annotations.splice(2, 1, boxObj);
  config.options.annotation.annotations.splice(3, 1, gameObj);

  if (length > 4) {
    setTimeout(function () {
      config.options.annotation.annotations.splice(4, length - 4);
    }, 10000);
  }
}

function filter() {
  var zone = chart.scales["x-axis-0"].max - chart.scales["x-axis-0"].min;
  var avg = 200;
  arr = [];
  step = (Math.floor(zone / 1000 / avg) || 1) * 1000;
  var min = Math.floor(chart.scales["x-axis-0"].min / step) * step;
  for (var i = 0; i <= avg; i++) {
    var key = Math.floor(min / 1000) * 1000 + i * step;
    if (tmp[key] && key <= nowTime) {
      arr.push({
        x: key,
        y: tmp[key],
      });
    }
  }
  config.data.datasets[0].data = arr;
  chart.update({
    duration: 0,
  });
}

function reZoom() {
  if (config.options.scales.xAxes[0].realtime.delay > 0) {
    $("#resetZoom").addClass("active");
  } else {
    $("#resetZoom").removeClass("active");
  }
}

function onRefresh(chart) {
  //   filter();
  //   if (nowTime + 60000 - startTime == 1000) {
  //     connectTion.send("get_history");
  //     connectTion.send("get_config_gui");

  //   }
  //   if (nowTime + 60000 - startTime == 0) {
  //     $('input[name="game_type"]').prop("checked", false);
  //   }
  $("#draw_uid").val(currentItemGameRecordId);
  var delayTime = nowTime + 1000;
  var last = parseFloat(tmp[delayTime]).toFixed(2);
  //   <span class="now-data" style="top: 54.467px;"><b>27756.</b><i>59</i></span>
  //   if (!isNaN(last)) {
  //     $(".now-data b").text("27756.");
  //     $(".now-data i").text(last.slice(-2));
  //   }
  $(".now-data b").text("16.");
  $(".now-data i").text("59");
  var endLabel = chart.config.options.annotation.annotations[0].value;
  var t = (startTime - delayTime) / 1000;
  t = t === 60 ? 0 : t;
  var t2 = 70;
  var date = new Date(startTime);
  if (delayTime >= endLabel) {
    addLabel();
  }
  var roteA = [];
  var roteB = 0;
  var gameLabel = chart.config.options.annotation.annotations[3].value;
  var gameLabelShow = gameLabel - 60000;
  if (delayTime >= gameLabel && tmp[gameLabelShow]) {
    var eTime = tmp[gameLabelShow];
    config.options.annotation.annotations[3].label.content =
      "Tỷ giá hoán đổi hiện hành : " + eTime;
  } else if (delayTime < gameLabel) {
    config.options.annotation.annotations[3].label.content =
      "Tỷ giá hoán đổi hiện hành : " + (t2 - 60) + "đếm ngược";
  }
  var a = "";
  if (t < 10) {
    a = "0";
  }
  $("#time").text("00:00:" + a + t);
  config.options.annotation.annotations[1].label.content =
    "Bắt đầu " + t2 + " đếm ngược";
}
var GUI = {
  init() {
    GUI.initGame();
    // GUI.initMoneySelecter();
    // GUI.initSelectGameType();
    // GUI.initFormBet();
    setInterval(function () {
      GUI.getTime();
      //   GUI.showGameValue();
    }, 1000);
    // setInterval(function () {
    //   if (wsReady) {
    //     connectTion.send("get_config");
    //     connectTion.send("user_info");
    //   }
    // }, 1000);
  },
  initGame() {
    $(".bet-history-result").html(`<table class="table">

    <tbody>
                        <tr>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>1</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>2023101611009</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_2"><a>16:49:00</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_3"><a style="color: #176400">Cao</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_4"><a>27739.46</a></span></th>
        </tr>
                                                                                                                                        <tr>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>2</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>2023101611008</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_2"><a>16:48:00</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_3"><a style="color: #64001e">Thấp</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_4"><a>27735.74</a></span></th>
        </tr>
                                <tr>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>3</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>2023101611007</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_2"><a>16:47:00</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_3"><a style="color: #176400">Cao</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_4"><a>27727.19</a></span></th>
        </tr>
                                <tr>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>4</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>2023101611006</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_2"><a>16:46:00</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_3"><a style="color: #64001e">Thấp</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_4"><a>27724.43</a></span></th>
        </tr>
                                <tr>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>5</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>2023101611005</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_2"><a>16:45:00</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_3"><a style="color: #64001e">Thấp</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_4"><a>27722.61</a></span></th>
        </tr>
                                <tr>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>6</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_1"><a>2023101611004</a></span></th>
            <th scope="col" class="tablesfonts"><span class="rote_0_2"><a>16:44:00</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_3"><a style="color: #64001e">Thấp</a></span></th>
                        <th scope="col" class="tablesfonts"><span class="rote_0_4"><a>27715.21</a></span></th>
        </tr>
                    </tbody>
</table>`);
    // connectTion = new WebSocket(
    //   "wss://" +
    //     window.location.hostname +
    //     "/wsstrade/?auth_token=" +
    //     "$("#auth_token").val()"
    // );
    GUI.initChart();
    // connectTion.onopen = function (e) {
    //   wsReady = true;
    //   GUI.initChart();
    //   connectTion.send("get_history");
    //   connectTion.send("get_config_gui");
    // };
    // connectTion.onmessage = function (e) {
    //   var info = JSON.parse(e.data);
    //   if (info.type == "get_config") {
    //     currentItemGameRecordId = info.data.currentItemGameRecordId;
    //     startTime = info.data.startTime;
    //     nowTime = info.data.nowTime;
    //     stopTime = info.data.stopTime;
    //     gameTime = info.data.gameTime;
    //     tmp = info.data.tmp;
    //   }
    //   if (info.type == "get_history") {
    //     $(".bet-history-result").html(info.data.html_history);
    //   }
    //   if (info.type == "user_info") {
    //     $(".user-amount [name=wallet]").html(info.data.user_w);
    //   }
    //   if (info.type == "get_config_gui") {
    //     gameGui.game_value = info.data.game_value;
    //   }
    // };
    // connectTion.onclose = function (e) {
    //   wsReady = false;
    //   setTimeout(function () {
    //     GUI.initGame();
    //   }, 3000);
    // };
    // connectTion.onerror = function (e) {
    //   wsReady = false;
    // };
  },
  getTime() {
    var getNow = new Date(nowTime);
    var h = ("0" + getNow.getHours()).slice(-2);
    var m = ("0" + getNow.getMinutes()).slice(-2);
    var s = ("0" + getNow.getSeconds()).slice(-2);
    $(".game-time span").text(
      getNow.toLocaleString(document.documentElement.lang)
    );
  },
  initMoneySelecter() {
    $(".money-speed [data-num]").on("click", function () {
      var add = parseInt($(this).attr("data-num"));
      $('.rank-box [name="totalView"]').val($(this).text());
      $('.rank-box [name="total"]').val(add + 0);
      var speed = $(".control-box .money-speed");
      var _this = $(".arrow-speed");
      var isActive = _this.hasClass("active");
      _this.toggleClass("active");
      speed.removeClass("active");
    });
    $(".money-speed-mobile [data-num]").on("click", function () {
      var add = parseInt($(this).attr("data-num"));
      $('.rank-box [name="totalView"]').val($(this).text());
      $('.rank-box [name="total"]').val(add + 0);
    });
    $(".arrow-speed").on("click", function () {
      var $speed = $(".control-box .money-speed");
      var $this = $(this);
      var isActive = $this.hasClass("active");

      $this.toggleClass("active");
      if (isActive) {
        $speed.removeClass("active");
      } else {
        $speed.addClass("active");
      }
    });
  },
  initSelectGameType() {
    $(document).on("change", 'input[name="game_type"]', function (event) {
      if ($(this).is(":checked")) {
        $('input[name="game_type"]').not($(this)).prop("checked", false);
      }
    });
  },
  initChart() {
    var ctx = $("#chart-view").get(0).getContext("2d");
    chart = new Chart(ctx, config);
    addLabel();
    $(window)
      .on("resize", function () {
        var h = $("#chart-view").height();
        gradientFill(ctx, h);
      })
      .resize();

    $("#resetZoom").on("click", function () {
      chart.resetZoom();
      $(this).removeClass("active");
    });
    setInterval(function () {
      chart.update({
        lazy: false,
      });
      if (arr.length > 0) {
        var meta = chart.getDatasetMeta(0);
        var metaY = meta.data[meta.data.length - 1]._model;
        console.log(metaY.y);
        // $(".now-data").css("top", metaY.y + 10);
        $(".now-data").css("top", "54%");
        return;
      }
      $(".now-data").css("top", "54%");
    }, 100);
  },
  showGameValue() {
    console.log("game value");
    const gameValue = {};
    // if (gameGui.game_value) {
    var timeNow = nowTime + 2000;
    var timeLast = nowTime + 1000;
    for (const [key, value] of Object.entries(gameValue)) {
      if (value[timeNow] && value[timeLast]) {
        var ele = $('.currency-item-show[data-name="' + key + '"]');
        var valueShow = parseFloat(value[timeNow]);
        if (key == 1 || key == 6) {
          ele.find(".view-item-data").text(valueShow.toFixed(2));
        } else {
          ele.find(".view-item-data").text(valueShow.toFixed(7));
        }
        if (value[timeNow] > value[timeLast]) {
          ele.find(".view-item-amplitude-new").attr("data-amplitude-new", "up");
        }
        if (value[timeNow] < value[timeLast]) {
          ele
            .find(".view-item-amplitude-new")
            .attr("data-amplitude-new", "down");
        }
        var sumAll =
          ((value[timeNow] - value[timeLast]) * 10000) / value[timeNow];
        ele.find("[data-sum]").text(sumAll.toFixed(2) + "‱");
      }
    }
    // }
  },
  initFormBet() {
    $(document).on("submit", "#form_bet", function (event) {
      event.preventDefault();
      if (!wsReady) {
        return swalbox("Không thể kết nối server", "network : 1100", "error");
      }
      if (stopTime - nowTime <= 12000) {
        return swalbox(
          "Tạm ngừng giao dịch",
          "Giao dịch đã tạm ngừng",
          "error"
        );
      }
      if ($("input[name=game_type]:checked").length == 0) {
        return swalbox("Lỗi", "Chọn ít nhất một mặt hàng", "error");
      }
      var _btnSubmit = $(this).find(".bet-submit");
      _btnSubmit.addClass("in-loading-box");
      $.ajax({
        url: $(this).attr("action"),
        type: "POST",
        dataType: "json",
        data: $(this).serialize(),
      }).done(function (json) {
        _btnSubmit.removeClass("in-loading-box");
        $('input[name="game_type"]').prop("checked", false);
        if (json.code == 200) {
          swalbox(json.message, json.content, "success");
        } else {
          swalbox(json.message, "", "error");
        }
      });
    });
  },
};
$(document).ready(function ($) {
  GUI.init();
  $(".rank-box.choose").click(function () {
    var _parent = $(this).parent().children(".money-speed");
    _parent.toggleClass("active");
  });
});
