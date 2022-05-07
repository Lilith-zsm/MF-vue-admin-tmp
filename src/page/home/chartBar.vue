<template>
  <div ref="echarts" style="width: 100%;height:400px;" />
</template>
<script>
import echarts from 'echarts'
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const myEcharts = echarts.init(this.$refs.echarts)
      const option = {
        color: ['rgb(58, 161, 255)'],
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['10月', '11月', '12月', '01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '订单量',
            type: 'bar',
            barWidth: '40%',
            data: [10, 52, 200, 334, 390, 330, 220, 400, 567, 277, 279, 555]
          }
        ]
      }
      myEcharts.setOption(option)
      window.addEventListener('resize', myEcharts.resize)
    }
  }
}
</script>
