<template>
  <el-row class="userguide_framework">
    <el-col class="intro_layout" :span="24">
      <p class="intro_title">欢迎使用冷端系统数字孪生模型库</p>
      <p class="intro_content">冷端系统数字孪生模型库是一个面向电力业务公司工作人员的机器学习集成开发环境，为用户提供了基于经典机器学习算法的，从模型训练、结果可视化、模型管理到模型增量的全生命周期管理服务，帮助用户更快、更便捷的构建、训练和管理模型。</p>
    </el-col>
    <el-col class="step_layout">
      <el-col class="guide_layout" :span="5" @click.native="guideClick('/ModelTrain')">
        <img class="guide_icon" src="@/assets/icon_train.svg" width="60" height="60" />
        <div class="guide_text">
          <p class="guide_title">模型训练</p>
          <p class="guide_content">提供丰富且便捷的模型训练方式，业务人员可轻松使用</p>
        </div>
      </el-col>
      <el-col class="arrow_layout" :span="1">
        <i class="arrow_icon el-icon-arrow-right"></i>
      </el-col>
      <el-col class="guide_layout" :span="5" @click.native="guideClick('/ModelPredict')">
        <img class="guide_icon" src="@/assets/icon_chart.svg" width="60" height="60" />
        <div class="guide_text">
          <p class="guide_title">结果可视化</p>
          <p class="guide_content">提供明确的可视化图表，对模型输出进行详细评估</p>
        </div>
      </el-col>
      <el-col class="arrow_layout" :span="1">
        <i class="arrow_icon el-icon-arrow-right"></i>
      </el-col>
      <el-col class="guide_layout" :span="5" @click.native="guideClick('/ModelFinetune',)">
        <img class="guide_icon" src="@/assets/icon_finetune.svg" width="60" height="60" />
        <div class="guide_text">
          <p class="guide_title">模型增量</p>
          <p class="guide_content">提供增量学习方法，从模型库中更新参数获得最新模型</p>
        </div>
      </el-col>
      <el-col class="arrow_layout" :span="1">
        <i class="arrow_icon el-icon-arrow-right"></i>
      </el-col>
      <el-col class="guide_layout" :span="5" @click.native="guideClick('/UserModel',)">
        <img class="guide_icon" src="@/assets/icon_model.svg" width="60" height="60" />
        <div class="guide_text">
          <p class="guide_title">模型管理</p>
          <p class="guide_content">提供完整的多用户模型库，为所有模型提供统一的管理视图</p>
        </div>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "UserGuide",
    data() {
      return {};
    },
    computed: {},
    created() {},
    mounted() {},
    updated() {},
    methods: {
      guideClick(gotoRoute, gotoTab = null) {
        if (gotoTab == null) {
          this.$router.push({ path: gotoRoute });
        }
        else {
          this.$router.push({ path: gotoRoute, query: { openTab: gotoTab } });
        }
      }
    },
  }
</script>

<style>
  .userguide_framework {
    height: 600px;
    margin: 16px;
    padding: 24px;
    background-color: #fff;
    border-radius: 6px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    opacity: 0.95;
  }

  .intro_layout {
    margin-left: 50px;
    margin-right: 50px;
    margin-bottom: 75px;
    width: 95%;
    text-align: left;
    line-height: 1.7;
  }

  .intro_title {
    font-size: 24px;
  }

  .step_layout {
    margin-left: 50px;
    margin-right: 50px;
    width: 95%;
    height: 200px;
    line-height: 1.5;
  }

  .guide_layout {
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .guide_layout:hover {
    background-color: #F8F8F8;
  }

  .guide_text {
    margin: 0 10px;
  }

  .guide_title {
    font-size: 18px;
  }

  .arrow_layout {
    margin: 0 5px;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 30px;
  }
</style>