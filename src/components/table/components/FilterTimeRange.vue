<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-23 10:40:07
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-23 16:09:11
-->
<template>
  <div class="my-filter-time-range">
    <vxe-input
      v-model="option.data.startTime"
      :placeholder="$t('开始时间')"
      type="datetime"
      :disabled-method="startTimeDisabledMethod"
      transfer
      class="time-range-input"
    />
    {{ $t('至') }}
    <vxe-input
      v-model="option.data.endTime"
      :placeholder="$t('结束时间')"
      type="datetime"
      :disabled-method="endTimeDisabledMethod"
      transfer
      class="time-range-input"
    />
    <div class="my-fc-footer">
      <vxe-button status="primary" @click="confirmEvent">{{ $t('确认') }}</vxe-button>
      <vxe-button @click="resetEvent">{{ $t('重置') }}</vxe-button>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'FilterTimeRange',
  props: {
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      size: 'mini', // 被所有子组件继承 size
      column: null,
      option: null
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      const { column } = this.params
      const option = column.filters[0]
      this.column = column
      this.option = option
      const currentTime = moment().format('YYYY-MM-DD')
      const { startTime, endTime } = option.data
      this.option.data = {
        startTime: startTime || currentTime + ' 00:00:00',
        endTime: endTime || currentTime + ' 23:59:59'
      }
    },
    confirmEvent () {
      const { column } = this.params
      column.params.handleSearch(this.option.data)
    },
    resetEvent () {
      const { column } = this.params
      this.option.data = {
        startTime: '',
        endTime: ''
      }
      column.params.handleSearch(this.option.data)
    },
    startTimeDisabledMethod({ date, viewType }) {
      const { endTime } = this.option.data
      return moment(date).valueOf() > moment(endTime).valueOf()
    },
    endTimeDisabledMethod({ date, viewType }) {
      const { startTime } = this.option.data
      return moment(startTime).valueOf() > moment(date).valueOf()
    }
  }
}
</script>

<style scoped>
.my-filter-time-range {
  width: 260px;
  padding: 5px 15px 10px 15px;
}
.my-filter-time-range .time-range-input{
  width: 100%;
  margin-bottom: 5px;
  margin-top: 5px;
}
.my-filter-time-range .my-fc-footer {
  text-align: center;
  margin-top: 5px;
}
</style>
