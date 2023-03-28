# 冷端系统数字孪生模型库部署文档


## 系统环境
```
Windows 10
```
***
<br />

## 运行环境
### 前端部分
```
npm = 7.21.0
vue = 2.6.11
vue-router = 3.5.2
vuex = 3.6.2
vue/cli ~4.5.0
axios
element-ui
highcharts
wangeditor
xlsx
```
#### 详细配置见 /front_end/package.json 文件
<br />

### 后端部分（flask）
```
python = 3.8
flask
flask-cors
flask-jwt-extended
flask-restful
flask-sqlalchemy
flasgger
numpy
scikit-learn
xgboost
hpelm
```
<br />

### 后端部分（express）
```
npm = 7.21.0
express
body-parser
cors
```
#### 详细配置见 /back_end_express/package.json 文件
<br />

### 数据库部分
```
mysql = 8.0.32
```
***
<br />

## 项目目录
* front_end: 前端部分
* back_end_flask: 后端数据驱动及Web应用部分
* back_end_express: 后端机理建模部分
* dump.sql：数据库sql文件
***
<br />


## 部署过程
### 前端部分
#### 进入项目目录
```
cd front_end/
```
#### 安装依赖包
```
npm install
```
#### 调试运行
```
npm run serve
```
#### 打包项目
```
npm run build
```
#### 注意：
* 前端 baseURL 位于 /src/utils/global.js 中
* 前端调试运行默认地址为 http://localhost:8080
<br />

### 后端部分（flask）
#### 进入项目目录
```
cd back_end_flask/
```
#### 启动服务
```
python app.py
```
#### 注意：
* 建议使用 Anaconda 管理Python环境
* 后端（flask）运行默认地址为 http://127.0.0.1:10001
* 后端（flask）接口文档地址为 http://127.0.0.1:10001/apidocs
<br />

### 后端部分（express）
#### 进入项目目录
```
cd back_end_express/src
```
#### 启动服务
```
node app.js
```
#### 注意：
* 后端（express）运行默认地址为 http://localhost:3000
<br />

### 数据库部分
#### 还原数据库
```
mysql -h[ip] -P[port] -u[username] -p[password] [schema] < ./dump.sql
```