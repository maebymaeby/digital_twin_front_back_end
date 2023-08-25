<template>
  <div class="linechart_container"></div>
</template>

<script>
  import Highcharts from "highcharts/highstock";
  import exporting from 'highcharts/modules/exporting'
  exporting(Highcharts)

  Highcharts.setOptions({
    lang: {
      contextButtonTitle: "",
      downloadJPEG: "导出为JPEG",
      downloadPDF: "导出为PDF",
      downloadPNG: "导出为PNG",
      downloadSVG: "导出为SVG",
      exitFullscreen: "退出全屏",
      printChart: "打印图表",
      resetZoom: "重置缩放比例",
      resetZoomTitle: "",
      viewFullscreen: "全屏查看图表",
    }
  });

  export default {
    props: {
      seriesData: {
        type: Array,
        required: true,
      },
      titleText: {
        type: String,
        required: true,
      },
      subTitleText: {
        type: String,
        required: true,
      },
      yAxisText: {
        type: String,
        required: true,
      },
    },
    name: "LineChart",
    data() {
      return {
        chart: null,
        font: "'Helvetica Neue','Helvetica','PingFang SC','Hiragino Sans GB','Microsoft YaHei','微软雅黑','Arial,sans-serif'",
      };
    },
    created() {},
    mounted() {
      this.initChart();
    },
    updated() {},
    methods: {
      initChart() {
        this.chart = new Highcharts.Chart(this.$el, {
          // 图表配置
          chart: {
            // 设置图表样式
            style: {
              fontFamily: this.font,
            },
            // 设置选中时区域的背景填充
            selectionMarkerFill: 'rgba(220,103,171,0.1)',
            // 设置图表类型
            type: "line",
            // 设置重置缩放按钮
            resetZoomButton: {
              theme: {
                fill: 'white',
                stroke: 'silver',
                r: 0,
                states: {
                  hover: {
                    fill: 'rgb(51,92,173)',
                    style: {
                      color: 'white'
                    }
                  }
                }
              }
            },
            // 设置缩放坐标轴
            zoomType: 'x'
          },

          // 设置颜色
          colors: ['#6794dc', '#a367dc', ],

          // 版权信息
          credits: {
            // 关闭版权信息开关
            enabled: false,
          },

          // 图表导出配置
          exporting: {
            // 图表导出按钮配置
            buttons: {
              contextButton: {
                symbolSize: 24,
                x: -13,
                y: 0,
              },
            },
            // 设置是否使用图表导出选项
            enabled: true
          },

          // 图例
          legend: {
            // 设置图例水平对齐方式
            align: "right",
            // 设置打开图例
            enabled: true,
            // 设置图例项顶部外边距
            itemMarginTop: 40,
            // 设置图例项样式（图例文本样式）
            itemStyle: {
              color: "#000000",
              fontFamily: this.font,
              fontSize: "12px",
              fontWeight: "normal",
            },
            // 设置图例布局为垂直布局
            layout: "vertical",
            // 设置图例标志的长、宽相等，且长、宽尺寸默认与图例项字体大小一致
            squareSymbol: true,
            // 设置图例标志和图例文本之间的距离
            symbolPadding: 10,
            // 设置图例标志形状为正方形
            symbolRadius: 0,
            // 设置图例垂直对齐方式为居中
            verticalAlign: "middle",
            y: 125,
          },

          // 数据列
          series: [
          {
            // 设置数据列数据
            data: this.seriesData[0],
            // 设置数据列名称
            name: '预测值',
            // 设置数据列类型
            type: "line",
          },
          {
            // 设置数据列数据
            data: this.seriesData[1],
            // 设置数据列名称
            name: '真实值',
            // 设置数据列类型
            type: "line",
          }, ],

          // 副标题
          subtitle: {
            text: this.subTitleText,
            // 设置标题样式
            style: {
              color: "#000",
              fontFamily: this.font,
              fontSize: "12px",
              fontWeight: "normal",
              lineHeight: 24,
            },
            verticalAlign: 'bottom',
            align: 'left',
            x: 30,
            y: 20,
          },

          // 标题
          title: {
            // 设置标题文本
            text: this.titleText,
            // 设置标题样式
            style: {
              color: "#000000",
              fontFamily: this.font,
              fontSize: "16px",
              fontWeight: "normal",
            },
          },


          // 数据提示框
          tooltip: {
            // 设置打开数据提示框
            enabled: true,
            formatter: function () {
              return '<span style="color: ' + this.point.color + '">\u25CF</span> ' +
                '<p>' + this.series.name + ": " + '</p>' + '<b>' + this.point.y.toFixed(4) + '</b>'
            }
          },

          // X轴
          xAxis: {
            // 设置X轴标签
            labels: {
              enabled: false
            },
            // 设置X轴标题
            title: {
              enabled: false
            },
          },

          // Y轴
          yAxis: {
            // 设置Y轴标签
            labels: {
              // 设置标签样式
              style: {
                color: "#000000",
                fontFamily: this.font,
                fontSize: "14px",
                fontWeight: "normal",
              },
            },
            // 设置Y轴标题
            title: {
              text: this.yAxisText,
              style: {
                color: "#000000",
                fontFamily: this.font,
                fontSize: "12px",
                fontWeight: "normal",
              }
            },
          },
        });
      },
    },
  };
</script>

<style scoped>
</style>