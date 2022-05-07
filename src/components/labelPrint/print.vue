<template>
  <div>
    <base-dialog title="打印预览" :visible.sync="innerVisible" width="500px" top="20px">
      <div class="page-scroll">
        <div ref="printAreas">
          <div v-for="item in printData" ref="sheetPage" :key="item.id + item.printNo" class="sheetPage" style="page-break-after:always">
            <div class="logo">
              <div class="logoImg" style="display: inline-block; vertical-align:middle;">
                <img :src="imgUrl" width="120px" style="margin-top: 5px">
              </div>
              <div class="barcode" style="display: inline-block; vertical-align:middle;">
                <barcode :value="item[item.type]" width="1px" height="55px" font-size="14px" margin-top="5px" margin-bottom="5px" />
              </div>
            </div>
            <div class="routeInfor">
              <div class="code"><strong>{{ item.routeCode }}</strong></div>
              <div class="website"><strong>{{ item.destSiteCode }}</strong></div>
              <div class="destination"><strong>{{ item.destinationCode }}</strong></div>
              <div class="productType"><strong>{{ item.productTypeCode }}</strong></div>
              <div class="weight">
                <span> {{ item.chargeableWeight }}kg</span>
                <strong style="font-size: 18px">{{ item.printNo }}/{{ item.pieces }}</strong>
              </div>
            </div>
            <div class="sheetBlock" style="height: 125px">
              <p><strong>Receiver: </strong>{{ item.receiver }}</p>
              <p><strong>Tel: </strong>{{ item.receiverTel }}</p>
              <p><strong>City: </strong>{{ item.receiverCity }}</p>
              <p><strong>Address: </strong>{{ item.receiverAddress }}</p>
            </div>
            <div class="sheetBlock" style="height: 120px">
              <p><strong>Shipper: </strong>{{ item.sender }}</p>
              <p><strong>Tel: </strong>{{ item.senderTel }}</p>
              <p><strong>Country: </strong>{{ item.senderCountry }}</p>
              <p><strong>City: </strong>{{ item.senderCity }}</p>
              <p><strong>Order Date: </strong>{{ item.createTime }}</p>
            </div>
            <div class="baseInfo">
              <div class="left">
                <div><strong>PRODUCT：</strong>{{ item.categoryName }}</div>
                <div><strong>ORDER NO OF PRODOCT: </strong>{{ item.pieces }}</div>
                <div><strong>ORDER NUMBER：</strong>{{ printType === 'scan' ? item.waybillNo : item.cusOrderNo }}</div>
                <div v-if="printType === 'scan' && item.waybillNo" style="margin-top: 0px; height: 40px;">
                  <barcode :value="item.waybillNo" width="1px" height="30px" font-size="0px" margin-top="5px" margin-bottom="0px" />
                </div>
                <div style="margin-top: 5px;"><strong>Service hotline: </strong>8001240177</div>
              </div>
              <div class="right">
                <div class="title">COD(SAR): </div>
                <div class="price">{{ item.cod }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="print-btn">
        <el-button type="primary" size="medium" :disabled="printData.length < 1" @click="onPrint">{{ $t('打印') }}</el-button>
      </div>
    </base-dialog>
  </div>
</template>
<script>
import printJS from 'print-js'
import VueBarcode from 'vue-barcode'
import moment from 'moment'
export default {
  components: {
    'barcode': VueBarcode
  },
  props: {
    data: {
      type: [String, Array],
      required: true
    },
    visible: Boolean,
    printType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imgUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABICAMAAACENkp0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RDgwOTg1NTJBMzIxMUVCQUVGNUI3NkJGMTIyNEU1QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0RDgwOTg1NjJBMzIxMUVCQUVGNUI3NkJGMTIyNEU1QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjREODA5ODUzMkEzMjExRUJBRUY1Qjc2QkYxMjI0RTVCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjREODA5ODU0MkEzMjExRUJBRUY1Qjc2QkYxMjI0RTVCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+aEkPWgAAAwBQTFRFpaWmvb29MzMzioqKGxobhYWGqampIyMkubq6oaGhjY2NCwsLS0tLxcXF8vLy9PT06Ojo+vr6ra2tgYGB3Nzc+Pj4wsLDEhISdXV1tra2nZ2d/Pz8kZCR39/f6urq9vb27u7ufX1+5ubm4uLi1NTU0NDQ1tbW7OzsWVhZwMDAVVVVeHl52djYzs7P0tLS8PDwKCgosrKzzMzMBQUFlZWWyMjIUVFRRkREcXFyZGVmQUFBbW1usLCxPTw92traOTk5mZmZysrLFRUWYGFiXF1eLS0uAAAAb3BxgH5+tLS1goKDh4WFe3x9X2BhiouMWFdXXFpaf4CAm5ucmJaXdnh4rKuraGlqTU5Pp6amXl5fAgICj5CQWltcamtsV1hZr7CwaGdmOzo7sK6vp6iopKSkpKKiUE5OW1xdnJqaoJ+fnp+gZ2hplJSVi4yMYmNkKywtIB4eeHZ2oqOjcnN0Li4vREJDlpaXQD09ZmdoNjY2kY+PGBYXQkNEVldXJyYmU1RVTlBRdHR1JigpcW9vJSYmY2RlRkdHYF5eNzg4P0BBICAhExQVQ0VFMi8vPj9ALCoqFBMTFhcXKiorEBAQEhITDw4O4eHh5eXlBwcHBAMDsbGy5OTkCAgJ4ODgt7i4t7e4BAQEr6+vMDAxq6urn6Cg0dLSAQICAwMDu7u7wcHB2NfXHR4fCAcHu7y8ent71dXVtba2w8PDGRgYx8jIbGxt0tHR09TUz8/PvLu7jo+PwcLCv8DADQ4PsrGxzs3Nv7+/wL+/dHNz09PT3Nvb5eTk4ODhtbW1trW1ycrKyMfHz9DQAQEBAgIB4+Pj4uHhXltcFRQU5OXlPjs8ubi40M/P19jYi4qJSElKSkhIfn9/MjAwUE9Qg4SE4+Tk5ebmsrOzp6en4eLi9fX13d3dhoeH6enpkpKTlJKSbm9w7e3tBAMEzM3NiIiJ0dHRcnBwwMC/dnd31NPT19fX29vbUlJTVFBR7+/v5OTlY2Fh4eDgycnJ2dnZs7S0x8fHOjw9////AsBAZQAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAwOSURBVHja5Jt7XFRlGscHGBjgwDjDVa4iF7kpIiciRCJAXggRQkPwgBVJWV5JUSMVtZAM0sQBBmSAA5gDktJMllEkZWWX0c3dbbPUFpaLrSu0LprbyuK75xwQOO8MwzDjhJ/29xfMe57nzPe9Pc97njMcOJ5uneywTn05/2BMjuHeO/sLLljc9Evd5eeTkbF4/Z5lYbGxx+ONjZydu3uNEs1b0nsbh63EDzg7t7S0mCca9fZ2G7esNe/tvjzz8emxsSdOLFsTuj568aqMhcuj16/fs2bNijDKyyZ/65mxCV7D1v8+xsnaaHZ49eolW9aubamH8Oi37777L0/P5lnNR2fP7nJxKSv7g1gsEAhcr3q7zeUzmkaJDyFHFYPboNn1m3VFuAJMJAVBSKVSUsG1HDY1wKQkJSktgpjYASXMr3oabdrTsSofw4dFkgRmBmvk57dtk8vlXK6cm83Nzi7k8Xh5tALfeCPmjYsX9+0zNDTMzc1bqgrE22R5nkSjbzAq3PGudZtkcpbgSLgvY/hjPE/KbgmDPbma+djqqgzysD8PB5OVYtmIvSU2OVNJLJ82c1qdj/ZdrgD+rJkPeSREQX58vBhooQjBiIfIyYFgWxgr18VKvYfVwA7NfOHPQQRE+AhPGwwgahz1ETApEIkZYzTwmlILcRzaaPZtFE9BBMTGj9SKA187pjNuiCZjmT5kU6fc9DoffqOZk8weBMRBu+EAIMNpDMjfoiZhGT00r7YrtxQNQsdyzaaDHWSDHMa05KhzGbvKzpVobsnrYkzClFvIRBiQrdmgOkM2yCMSLTlaa1jbRaXmI6JIZCzaVfRgqlD4oGZOXnVig2zUdjyk8VBbkCZmKG3nK7dwA6C5Zut1nwdkgRjYa8kBUm3ZIGK5xqZ7GIMzylOh3BFaHtBs9/4zZIGU5WjLwfsLElAFXE1NycOMwXrllsWQ/yeNXFQsgmyQ9ZMK40cIgrgbB+rRBKenUCkiEEdUJjytJ5ktK0+p4eUuuKhUNLFKsaQZ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',
      printData: []
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
    if (this.printType === 'child') {
      this.printData = this.subNoData()
    } else if (this.printType === 'main') {
      this.printData = this.data.map(item => {
        return {
          ...item,
          type: 'waybillNo',
          printTime: moment().format('YYYY-MM-DD'),
          printNo: 1
        }
      })
    } else if (this.printType === 'scan') {
      this.printData = this.data.map(item => {
        return {
          ...item,
          type: 'labaihWaybillNo',
          printNo: 1
        }
      })
    } else {
      this.printData = this.setToplayData()
    }
  },
  methods: {
    onPrint() {
      const style = '.sheetPage {width: 360px;height: 555px;border: 1px solid #333;background-color: #fff;margin: 8px auto 10px;}.sheetPage .logo {font-size: 24px;border-bottom: 1px solid #333;padding-left: 10px;position: relative;}.sheetPage .logo .barcode {height: 85px;text-align: center;width: 230px;}.sheetPage .routeInfor {border-bottom: 1px solid #333;height: 70px;}.sheetPage .routeInfor div {text-align: center;float: left;border-right: 1px solid #333;height: 52px;line-height: 15px;padding-top: 18px;word-break:break-all;}.sheetPage .routeInfor .code {width: 70px;}.sheetPage .routeInfor .website {width: 70px;}.sheetPage .routeInfor .destination {width: 65px; padding-left:5px; padding-right: 5px;}.sheetPage .routeInfor .productType {width: 70px;}.sheetPage .routeInfor .weight {width: 70px;border-right: none;padding-top: 13px;}.sheetPage .routeInfor .weight span {display: block;border-bottom: 1px solid #333;margin-bottom: 10px;padding-bottom: 10px;}.sheetPage .sheetBlock {padding: 5px 5px 0;border-bottom: 1px solid #333;height: 135px; line-height: 15px}.sheetPage .sheetBlock .left {line-height: 110px;border-right: 1px solid #333;width: 90px;font-weight: 700;float: left;}.sheetPage .sheetBlock .right {float: right;width: 230px;font-size: 13px;position: relative;}.sheetPage .sheetBlock .right p {margin: 5px 0;}.sheetPage .sheetBlock .right .no {position: absolute;top: 5px;right: 0;font-weight: 700;}.sheetPage .sheetBlock p {margin: 0 0 5px;}.sheetPage .pageNo {height: 35px;line-height: 35px;border-bottom: 1px solid #333;font-size: 13px;}.sheetPage .pageNo .left {float: left;padding: 0 10px;border-right: 1px solid #333;}.sheetPage .pageNo .right {float: right;padding: 0 10px;border-left: 1px solid #333;}.sheetPage .baseInfo {font-size: 13px;}.sheetPage .baseInfo .left {width: 240px;float: left;padding: 0 5px;line-height: 15px;}.sheetPage .baseInfo .left span {display: inline-block;width: 100px;line-height: 40px;}.sheetPage .baseInfo .left div {margin-top: 2px;}.sheetPage .baseInfo .right {width: 106px;height: 80px;border-left: 1px solid #333;border-bottom: 1px solid #333;float: right;}.sheetPage .baseInfo .right .title {line-height: 30px;text-align: center;border-bottom: 1px solid #333;font-size: 18px;}.sheetPage .baseInfo .right .price {font-weight: 700;text-align: center;line-height: 50px;font-size: 18px;} @media print {@page {size: 103mm 152mm; margin: 0;}}'
      this.$nextTick(() => {
        const obj = this.$refs.printAreas
        let outputHTML = ''
        outputHTML += obj.innerHTML
        printJS({
          printable: outputHTML,
          type: 'raw-html',
          style: style
        })
      })
      this.$emit('handlePrint')
    },
    // 子单数据处理
    subNoData() {
      let printData = []
      this.data.forEach(item => {
        if (item.subWaybillNo) {
          item.subWaybillNo.split(',').forEach((subNo, index) => {
            const dataItem = {
              ...item,
              subNo,
              printNo: index + 2,
              type: 'subNo',
              printTime: moment().format('YYYY-MM-DD')
            }
            printData = [...printData, dataItem]
          })
        }
      })
      return printData
    },
    // 套打数据处理
    setToplayData() {
      let printData = []
      this.data.forEach(item => {
        printData = [...printData, { ...item,
          type: 'waybillNo',
          printTime: moment().format('YYYY-MM-DD'),
          printNo: 1 }]
        if (item.subWaybillNo) {
          item.subWaybillNo.split(',').forEach((subNo, index) => {
            const dataItem = {
              ...item,
              subNo,
              printNo: index + 2,
              type: 'subNo',
              printTime: moment().format('YYYY-MM-DD')
            }
            printData = [...printData, dataItem]
          })
        }
      })
      return printData
    }
  }
}
</script>
<style lang="scss" scoped>
.sheetPage {
    width: 360px;
    height: 555px;
    border: 1px solid #333;
    background-color: #fff;
    margin: 0 auto 10px;
    .logo {
        font-size: 24px;
        border-bottom: 1px solid #333;
        padding-left: 10px;
        position: relative;
        .barcode {
          height: 85px;
          text-align: center;
          width: 230px;
        }
    }
    .routeInfor {
      border-bottom: 1px solid #333;
      height: 70px;
      div {
        text-align: center;
        float: left;
        border-right: 1px solid #333;
        height: 52px;
        padding-top: 18px;
        word-break: break-all;
        line-height: 15px;
      }
      .code {
        width: 70px;
      }
      .website {
        width: 70px;
      }
      .destination {
        width: 65px;
        padding-left: 5px;
        padding-right: 5px;
      }
      .productType {
        width: 70px;
      }
      .weight {
        width: 70px;
        border-right: none;
        padding-top: 13px;
        span {
          display: block;
          border-bottom: 1px solid #333;
          margin-bottom: 10px;
          padding-bottom: 10px;
        }
      }
    }
    .sheetBlock {
        padding: 0 5px 0;
        border-bottom: 1px solid #333;
        height: 135px;
        .left {
            line-height: 110px;
            border-right: 1px solid #333;
            width: 90px;
            font-weight: 700;
            float: left;
        }
        .right {
            float: right;
            width: 230px;
            font-size: 13px;
            position: relative;
            p{
                margin: 5px 0;
            }
            .no {
                position: absolute;
                top: 5px;
                right: 0;
                font-weight: 700;
            }
        }
        p {
          margin: 5px 0;
        }
    }
    .pageNo {
        height: 35px;
        line-height: 35px;
        border-bottom: 1px solid #333;
        font-size: 13px;
        .left {
            float: left;
            padding: 0 10px;
            border-right: 1px solid #333;
        }
        .right {
            float: right;
            padding: 0 10px;
            border-left: 1px solid #333;
        }
    }
    .baseInfo {
        font-size: 13px;
        .left {
            width: 240px;
            float: left;
            padding: 0 5px;
            line-height: 15px;
            span{
                display: inline-block;
                width: 100px;
                line-height: 40px;
            }
            div {
                margin-top: 2px;
            }
        }
        .right {
            width: 106px;
            height: 80px;
            border-left: 1px solid #333;
            border-bottom: 1px solid #333;
            float: right;
            .title {
                line-height: 30px;
                text-align: center;
                border-bottom: 1px solid #333;
                font-size: 18px;
            }
            .price {
                font-weight: 700;
                text-align: center;
                line-height: 50px;
                font-size: 18px;
            }
        }
    }
}
.print-btn {
    text-align: center;
    margin-top: 20px;
}
.el-scrollbar {
    height: calc(100vh - 244px);
  }
.page-scroll {
    /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
        scrollbar-color: transparent transparent;
        scrollbar-track-color: transparent;
        -ms-scrollbar-track-color: transparent;
        -ms-overflow-style: none;
    }
}
</style>
