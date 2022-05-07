<!--
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-28 13:41:16
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-30 17:22:57
-->
<template>
  <vxe-pulldown ref="xDown" transfer>
    <template #default>
      <vxe-input
        v-model="value"
        clearable
        suffix-icon="el-icon-search"
        :placeholder="$t('请选择')"
        @keyup="keyupEvent"
        @focus="focusEvent"
        @blur="blurEvent"
        @suffix-click="suffixClick"
      />
    </template>
    <template #dropdown>
      <div class="my-dropdown">
        <m-table
          ref="commonTable"
          table-type="dialogTable"
          :data-source="dataSource"
          :custom-storage="false"
          :loading="loading"
          :page-vo="pageVo"
          :columns="columns"
          @handleCurrentChange="handleCurrentChange"
          @handlePageChange="handlePageChange"
        />
      </div>
    </template>
  </vxe-pulldown>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      pageVo: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
      loading: false,
      columns: [
        {
          title: '序号',
          type: 'seq',
          width: 60,
          fixed: 'left'
        },
        {
          field: 'subCode',
          title: '子类别编号'
        },
        {
          field: 'subName',
          title: '子类别名称（中）',
          width: 160
        },
        {
          field: 'subNameEn',
          title: '子类别名称（英）',
          width: 180
        },
        {
          field: 'subNameTh',
          title: '子类别名称（印尼）',
          width: 180
        }
      ],
      dataSource: [],
      searchForm: {}
    }
  },
  mounted() {
    this.getSubList()
  },
  methods: {
    keyupEvent() {
      this.searchForm.subName = this.value
      this.getSubList()
    },
    focusEvent() {
      this.$refs.xDown.showPanel()
    },
    suffixClick() {
      this.$refs.xDown.togglePanel()
    },
    blurEvent() {
      this.value = ''
      this.searchForm.subName = ''
      this.getSubList()
    },
    handleCurrentChange(row) {
      this.value = row.subName
      this.$refs.xDown.hidePanel()
    },
    handlePageChange(val) {
      const { currentPage, pageSize } = val
      this.pageVo.currentPage = currentPage
      this.pageVo.pageSize = pageSize
      this.getSubList()
    },
    // 根据主类获取子类
    async getSubList() {
      const postForm = {
        ...this.searchForm,
        pageNum: this.pageVo.currentPage,
        pageSize: this.pageVo.pageSize
      }
      this.loading = true
      try {
        const res = await this.$api.common.dictionary.getSubByMain({ mainCode: '002', ...postForm })
        this.dataSource = res.rows
        this.pageVo.total = res.total
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
