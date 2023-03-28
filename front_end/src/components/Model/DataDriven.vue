<template>
  <el-row class="datadriven_framework" v-if="isTraining">
    <loading-component class="loading_layout" :loadingEvent="this.loadingEvent"></loading-component>
  </el-row>
  <el-row class="datadriven_framework" v-else>
    <el-col class="model_select_layout" :span="24">
      <el-col class="model_select_body" :span="4" v-for="item in modelItems" :key="item.index">
        <el-card class="model_select_card" shadow="hover">
          <div class="model_image_box">
            <img class="model_image_content" :src="item.src" />
          </div>
          <div class="model_intro">
            <p class="model_intro_title">{{item.title}}</p>
            <p class="model_intro_content">{{item.content}}</p>
          </div>
          <!--  按钮操作  -->
          <div class="select_operation">
            <el-button class="select_button" v-if="item.isSelected" type="success" @click="selectModel(item)" icon="el-icon-check" circle></el-button>
            <el-button class="select_button" v-else type="info" @click="selectModel(item)" icon="el-icon-check" circle></el-button>
          </div>
        </el-card>
      </el-col>
    </el-col>
    <transition name="el-zoom-in-center">
      <el-col class="excel_select_layout" :span="16" v-show="this.modelIndex!=-1">
        <excel-uploader :on-success="excelUploadSuccess" />
      </el-col>
    </transition>
  </el-row>
</template>

<script>
  import STORE from '@/store'
  import ExcelUploader from '../Global/ExcelUploader.vue';
  import LoadingComponent from '../Global/LoadingComponent.vue';

  export default {
    components: {
      ExcelUploader,
      LoadingComponent,
    },
    name: "DataDriven",
    data() {
      return {
        // 模型卡片信息
        modelItems: [
        {
          content: 'XGBoost是一种优化的分布式梯度增强库',
          index: 0,
          isSelected: false,
          src: require('@/assets/XGB.png'),
          title: 'XGBoost（极限梯度提升树）',
        },
        {
          content: 'SVM是一种按监督学习方式对数据进行二元分类的广义线性分类器',
          index: 1,
          isSelected: false,
          src: require('@/assets/SVM.png'),
          title: 'SVM（支持向量机）',
        },
        {
          content: 'RandomForest是一种利用多棵决策树集成对样本进行训练的分类器',
          index: 2,
          isSelected: false,
          src: require('@/assets/RF.png'),
          title: 'RandomForest（随机森林）',
        },
        {
          content: 'ELM是一种基于前馈神经网络构建的机器学习方法',
          index: 3,
          isSelected: false,
          src: require('@/assets/ELM.png'),
          title: 'ELM（极限学习机）',
        }, ],
        // 选择的模型的编号
        modelIndex: -1,
        // 根据选择的模型编号获取模型种类
        modelIndex2Type: ['xgb', 'svm', 'forest', 'elm', ],
        // 请求数据
        requestData: {
          "id": "",
          "model_type": "",
          "input": [],
          "output": [],
        },
        // excel数据列
        dataHeaderIndex: [
          "Gw", "Gw1", "ti", "pi", "po", "to", "pc", "tw",
        ],
        // 是否正在训练
        isTraining: false,
        loadingEvent: "训练"
      };
    },
    computed: {},
    created() {},
    mounted() {},
    updated() {},
    methods: {
      // 选择模型事件
      selectModel(item) {
        if (item.isSelected == true) {
          for (let i = 0; i < this.modelItems.length; i++) {
            this.modelItems[i].isSelected = false;
          }
          this.modelIndex = -1
        }
        else {
          for (let i = 0; i < this.modelItems.length; i++) {
            this.modelItems[i].isSelected = false;
          }
          item.isSelected = true;
          this.modelIndex = item.index;
        }
      },
      // excel文件上传成功事件
      excelUploadSuccess(excelData) {
        if (this.modelIndex == -1) {
          this.$message({
            message: "请勾选需要训练的模型类型",
            type: 'error'
          });
        }
        else {
          let processedData = this.processExcelData(excelData);
          this.generateRequestData(this.modelIndex2Type[this.modelIndex], processedData);
          this.$message({
            message: "训练数据上传成功",
            type: 'success'
          });
          this.isTraining = true;
          return new Promise((resolve, reject) => {
            STORE
              .dispatch("Model/modelTrain", this.requestData)
              .then((res) => {
                this.$router.push({
                  path: '/DatadrivenModelResult',
                  query: {
                    from: "train",
                    resultData: res.data.data,
                  }
                });
                resolve(res)
              })
              .catch((error) => {
                reject(error);
              })
          });
        }
      },
      // 处理excel文件
      processExcelData(excelData) {
        let resInputData = [];
        let resOutputData = [];
        let excelResults = excelData.results;
        for (let i = 0; i < excelResults.length; i++) {
          let inputData = []
          for (let j = 0; j < 4; j++) {
            inputData.push(excelResults[i][this.dataHeaderIndex[j]]);
          }
          let outputData = []
          for (let j = 4; j < 8; j++) {
            outputData.push(excelResults[i][this.dataHeaderIndex[j]]);
          }
          resInputData.push(inputData);
          resOutputData.push(outputData);
        }
        let resData = {};
        resData.inputData = resInputData;
        resData.outputData = resOutputData;
        return resData;
      },
      // 生成请求数据
      generateRequestData(model_type, processedData) {
        let profile = JSON.parse(sessionStorage.getItem("profile"));
        let timeStr = this.GLOBAL.getDatetimeFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
        let modelStr = profile.company + "_" + profile.title + "_" + profile.name + "_" + timeStr;
        this.requestData.id = modelStr;
        this.requestData.model_type = model_type;
        this.requestData.input = processedData.inputData;
        this.requestData.output = processedData.outputData;
      },
    },
  }
</script>

<style>
  .datadriven_framework {
    height: 500px;
  }

  .loading_layout {
    margin-top: 50px;
  }

  .model_select_layout {
    margin-top: 10px;
    margin-left: 10px;
  }

  .model_select_body {
    margin-left: 20px;
    margin-right: 10px;
  }

  .model_select_card .el-card__body {
    padding: 0;
    background-color: #F8F8F8;
  }

  .model_image_box {
    width: 100%;
    height: 150px;
    overflow: hidden;
  }

  .model_image_content {
    width: 100%;
    height: 150px;
    margin: 0 auto;
    transition: all 0.5s;
  }

  .model_image_content:hover {
    transform: scale(1.25);
  }

  .model_intro {
    margin-left: 20px;
  }

  .model_intro_title {
    text-align: left;
    font-size: 14px;
  }

  .model_intro_content {
    text-align: left;
    font-size: 12px;
    line-height: 1.7;
    opacity: 0.85;
  }

  .select_operation {
    text-align: left;
  }

  .select_button {
    margin-left: 20px;
    margin-bottom: 10px;
    font-size: 12px;
  }

  .excel_select_layout {
    margin-top: 40px;
    margin-left: 30px;
  }
</style>