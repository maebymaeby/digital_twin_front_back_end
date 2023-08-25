from flask import Blueprint, jsonify, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required
from flasgger import swag_from
import apis.admin_api as admin_api


admin_blueprint = Blueprint('admin_blueprint', __name__, url_prefix='/admin')
api = Api(admin_blueprint)


class AdminLogin(Resource):
    @swag_from('../swaggers/AdminLogin.yml')
    def post(self):
        requestData = request.get_json()
        responseBody = admin_api.admin_login(requestData)
        return responseBody
api.add_resource(AdminLogin, '/login')


class AdminModel(Resource):
    @jwt_required()
    @swag_from('../swaggers/AdminModelGet.yml')
    def get(self):
        responseData = admin_api.getModelList()
        return jsonify(responseData)
    @jwt_required()
    @swag_from('../swaggers/AdminModelPost.yml')
    def post(self):
        requestData = request.get_json()
        responseData = admin_api.getModelListByFilter(requestData)
        for resData in responseData['data']:
            if(resData.get('create_time')):
                resData['create_time'] = resData['create_time'].strftime('%Y-%m-%d %H:%M:%S')
        return responseData
api.add_resource(AdminModel, '/getModelList')


class AdminGetUserList(Resource):
    @jwt_required()
    @swag_from('../swaggers/AdminGetUserList.yml')
    def get(self):
        responseData = admin_api.getUserList()
        return jsonify(responseData)
api.add_resource(AdminGetUserList, '/getUserList')


class AdminRegisterUser(Resource):
    @jwt_required()
    @swag_from('../swaggers/AdminRegisterUser.yml')
    def post(self):
        requestData = request.get_json()
        responseData = admin_api.registerUser(requestData)
        return jsonify(responseData)
api.add_resource(AdminRegisterUser, '/registerUser')


class AdminUpdateUser(Resource):
    @jwt_required()
    @swag_from('../swaggers/AdminUpdateUser.yml')
    def post(self):
        requestData = request.get_json()
        responseData = admin_api.updateUser(requestData)
        return jsonify(responseData)
api.add_resource(AdminUpdateUser, '/updateUser')


class AdminDeleteUser(Resource):
    @jwt_required()
    @swag_from('../swaggers/AdminDeleteUser.yml')
    def post(self):
        requestData = request.get_json()
        responseData = admin_api.deleteUser(requestData)
        return jsonify(responseData)
api.add_resource(AdminDeleteUser, '/deleteUser')


class AdminSendMessage(Resource):
    @jwt_required()
    @swag_from('../swaggers/AdminSendMessage.yml')
    def post(self):
        requestData = request.get_json()
        responseData = admin_api.sendMessage(requestData)
        return jsonify(responseData)
api.add_resource(AdminSendMessage, '/sendMessage')