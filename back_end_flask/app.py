from flask import Flask, jsonify, make_response
from flask_cors import CORS
from flask_restful import Api
from flasgger import Swagger, swag_from

from routes.model_route import model_blueprint
from routes.user_route import user_blueprint
from routes.admin_route import admin_blueprint
from dbs.db_schema import db
from dbs.db_table import UserInfos
import utils
import config

app = Flask(__name__)  
app.config.from_object(config)
app.config['JSON_AS_ASCII'] = False
app.config['MAX_CONTENT_LENGTH'] = 4*1024*1024

CORS(app, supports_credentials=True)

api = Api(app)

swagger_config = Swagger.DEFAULT_CONFIG
swagger_config['title'] = config.SWAGGER_TITLE
swagger_config['description'] = config.SWAGGER_DESC
swagger = Swagger(app, config=swagger_config)

app.register_blueprint(model_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(admin_blueprint)

db.init_app(app)


from flask_jwt_extended import JWTManager

jwt = JWTManager()
app.config["JWT_SECRET_KEY"] = 'jwt'
jwt.init_app(app)

@jwt.unauthorized_loader
def my_unauthorized_token_callback(jwt_header):
    responseData = make_response(jsonify(error="Authorization Header 缺失"), 804)
    return responseData

@jwt.expired_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    responseData = make_response(jsonify(error="Token 已过期"), 805)
    return responseData


from datetime import datetime, date
from flask.json import JSONEncoder
class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return JSONEncoder.default(self, obj)
app.json_encoder = CustomJSONEncoder


@app.route('/')
@swag_from('./swaggers/hello_world.yml')
def hello_world(): 
    return "hello world"


if(__name__ == '__main__'):
    app.run(host='127.0.0.1', port=10001, debug=True)