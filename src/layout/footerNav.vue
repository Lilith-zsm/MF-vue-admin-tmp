<template>
  <div class="footer">
    <p class="intro rflex">
      <span>{{ $t('commons.xiaoai') }}Admin</span>
      <a target="_blank">
        测试
      </a>
      <span>wdlhao2013({{ $t('commons.wechatNumber') }})</span>
    </p>
    <p class="beian">鄂ICP备18001612号</p>
  </div>
</template>

<script>

export default {
  name: 'FooterNav',
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
	.footer{
        width: 100%;
        padding: 10px 0;
        font-size:12px;
        text-align: center;
        background: #fff;
        p{
            line-height: 30px;
        }
        .intro{
            width: 240px;
            margin: 0 auto;
            justify-content: space-between;
            align-items: center;
        }
    }
</style>

