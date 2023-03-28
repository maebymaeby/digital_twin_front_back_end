from flask import Blueprint, jsonify, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required
from flasgger import swag_from
import apis.user_api as user_api


user_blueprint = Blueprint('user_blueprint', __name__, url_prefix='/user')
api = Api(user_blueprint)


class UserLogin(Resource):
    @swag_from('../swaggers/UserLogin.yml')
    def post(self):
        requestData = request.get_json()
        responseBody = user_api.user_login(requestData)
        return responseBody
api.add_resource(UserLogin, '/login')


class UserInfo(Resource):
    @jwt_required()
    @swag_from('../swaggers/UserInfoGet.yml')
    def get(self):
        responseData = user_api.getUserInfo()
        return jsonify(responseData)
    @jwt_required()
    @swag_from('../swaggers/UserInfoPost.yml')
    def post(self):
        requestData = request.get_json()
        responseData = user_api.changeUserInfo(requestData)
        return jsonify(responseData)
api.add_resource(UserInfo, '/info')


class UserMessage(Resource):
    @jwt_required()
    @swag_from('../swaggers/UserMessage.yml')
    def get(self):
        responseData = user_api.getUserMessage()
        return jsonify(responseData)
api.add_resource(UserMessage, '/message')