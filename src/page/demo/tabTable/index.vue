<template>
  <div class="common-wrap">
    <div class="common-box">
      <vxe-radio-group v-model="selectTab" style="margin-bottom: 5px;" class="con-tab">
        <vxe-radio-button label="tab1" content="分组按钮1" />
        <vxe-radio-button label="tab2" content="分组按钮2" />
        <vxe-radio-button label="tab3" content="分组按钮3" />
      </vxe-radio-group>
      <div v-show="selectTab === 'tab1'">
        <table1 />
      </div>
      <div v-show="selectTab === 'tab2'">
        <table2 />
      </div>
      <div v-show="selectTab === 'tab3'">
        <table3 />
      </div>
    </div>
  </div>
</template>
<script>
import table1 from './table1'
import table2 from './table2'
import table3 from './table3'
export default {
  components: {
    table1,
    table2,
    table3
  },
  data() {
    return {
      selectTab: 'tab1'
    }
  }
}
</script>
