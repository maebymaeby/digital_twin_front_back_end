USERNAME = 'root'
PASSWORD = '1234567'
HOST = '127.0.0.1'
PORT = '3306'
SCHEMA = 'digital_twin'

DB_URI = "mysql+pymysql://{username}:{password}@{host}:{port}/{db}".format(username=USERNAME, password=PASSWORD, host=HOST, port=PORT, db=SCHEMA)

SQLALCHEMY_DATABASE_URI = DB_URI
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True

SWAGGER_TITLE = '冷端系统数字孪生模型库接口文档'
SWAGGER_DESC = '冷端系统数字孪生模型库接口文档，主要分为模型功能接口、用户功能接口、管理员功能接口三部分，主要用于前后端开发人员对接'

