<template>
  <div class="centerHome">
    <el-row :gutter="20">
      <el-col :span="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('当日票量')" total="126,560" />
      </el-col>
      <el-col :span="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('当日运单货款金额')" total="88,560" />
      </el-col>
      <el-col :span="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('当日问题件')" total="126,560" />
      </el-col>
      <el-col :span="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('当日签收率')" total="78%" />
      </el-col>
      <el-col :span="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('当日应收货款')" total="878,333" />
      </el-col>
      <el-col :span="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('当日留仓数量')" total="126,560" />
      </el-col>
    </el-row>
    <el-card :loading="loading" :bordered="false" :body-style="{padding: '0 10px 20px'}">
      <div class="salesCard">
        <div class="extra-wrapper">
          <div class="extra-item">
            <a>{{ $t('今日') }}</a>
            <a>{{ $t('本周') }}</a>
            <a>{{ $t('本月') }}</a>
            <a>{{ $t('本年') }}</a>
          </div>
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            range-separator="~"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            :style="{width: '256px'}"
          />
        </div>
        <el-tabs v-model="tabActive" class="chartTab">
          <el-tab-pane :label="$t('票量')" name="1" />
          <el-tab-pane :label="$t('代收货款')" name="2" />
          <el-tab-pane :label="$t('问题件')" name="3" />
          <el-tab-pane :label="$t('留仓件')" name="4" />
        </el-tabs>
        <el-row>
          <el-col :span="16">
            <chart-bar :title="$t('票量趋势')" />
          </el-col>
          <el-col :span="8">
            <rank-list :title="$t('网点运单排名')" :list="rankList" />
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import chartCard from './chartCard'
import chartBar from './chartBar'
import rankList from './rankList'

export default {
  name: 'Index',
  components: {
    chartCard,
    chartBar,
    rankList
  },
  data() {
    const rankList = []
    for (let i = 0; i < 7; i++) {
      rankList.push({
        name: '工专 ' + (i + 1) + ' 号网点',
        total: 1234.56 - i * 100
      })
    }
    return {
      loading: false,
      tabActive: '1',
      dateTime: [],
      tabPosition: '1',
      rankList
    }
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
    .centerHome {
      padding: 10px;
      box-sizing: border-box;
      /deep/ .el-tabs__item {
        height: 55px;
        line-height: 55px;
        font-size: 16px;
        &.el-tabs__item.is-active,&.el-tabs__item:hover {
          color: #52c41a;
        }
      }
      /deep/ .el-tabs__active-bar {
        background-color: #52c41a;
      }
      /deep/ .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .salesCard{
        position: relative;
        .extra-wrapper {
          position: absolute;
          right: 10px;
          line-height: 55px;
          z-index: 9;
          display: flex;
          align-items: center;
          a{
            color: #52c41a;
            margin-right: 10px;
            font-size: 14px;
          }
        }
      }
      .categrory {
        position: relative;
        .categrory-tab {
          position: absolute;
          top: 50px;
          z-index: 100;
        }
      }
    }
</style>
