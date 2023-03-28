<template>
  <el-row class="modeltrain_framework">
    <el-col :span="24">
      <el-tabs class="train_tab" v-model="activeTabPanName">
        <el-tab-pane name="datadriven">
          <div slot="label" class="tab_title">
            <span>数据驱动模型</span>
          </div>
          <data-driven v-if="isDataDriven"></data-driven>
        </el-tab-pane>
        <el-tab-pane name="mechanismmodeling">
          <div slot="label" class="tab_title">
            <span>机理建模模型</span>
          </div>
          <mechanism-modeling v-if="isMechanismModeling"></mechanism-modeling>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
  import DataDriven from './DataDriven.vue'
  import MechanismModeling from './MechanismModeling.vue';

  export default {
    components: {
      DataDriven,
      MechanismModeling,
    },
    name: "ModelTrain",
    data() {
      return {
        activeTabPanName: "datadriven",
        isDataDriven: true,
        isMechanismModeling: false,
      };
    },
    watch: {
      activeTabPanName: {
        handler: function (val) {
          this.isDataDriven = false;
          this.isMechanismModeling = false;
          switch (val) {
          case "datadriven":
            this.isDataDriven = true;
            break;
          case "mechanismmodeling":
            this.isMechanismModeling = true;
            break;
          default:
            break;
          }
        }
      }
    },
    computed: {},
    created() {},
    mounted() {},
    updated() {},
    methods: {}
  }
</script>

<style>
  .modeltrain_framework {
    margin: 16px;
    padding: 20px 24px;
    background-color: #fff;
    border-radius: 6px;
  }

  .el-tabs__active-bar {
    margin-left: 10px;
  }

  .el-tabs__item {
    margin-left: 10px;
  }

  .tab_title {
    margin: 0 20px;
    font-size: 16px;
    line-height: 1.7;
  }

  .el-tabs__nav-scroll {
    padding-top: 0;
    padding-left: 20px;
    height: 40px;
  }
</style>