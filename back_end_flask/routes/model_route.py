from flask import Blueprint, jsonify, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required
from flasgger import swag_from
import apis.model_api as model_api


model_blueprint = Blueprint('model_blueprint', __name__, url_prefix='/model')
api = Api(model_blueprint)


class ModelTrain(Resource):
    @jwt_required()
    @swag_from('../swaggers/ModelTrain.yml')
    def post(self):
        requestData = request.get_json()
        responseData = model_api.trainFromRequest(requestData)
        return jsonify(responseData)
api.add_resource(ModelTrain, '/train')
    

class ModelPredict(Resource):
    @jwt_required()
    @swag_from('../swaggers/ModelPredict.yml')
    def post(self):
        requestData = request.get_json()
        responseData = model_api.predictFromRequest(requestData)
        return jsonify(responseData)
api.add_resource(ModelPredict, '/predict')


class ModelFinetune(Resource):
    @jwt_required()
    @swag_from('../swaggers/ModelFinetune.yml')
    def post(self):
        requestData = request.get_json()
        responseBody = model_api.finetuneFromRequest(requestData)
        return responseBody
api.add_resource(ModelFinetune, '/finetune')


class ModelList(Resource):
    @jwt_required()
    @swag_from('../swaggers/ModelListGet.yml')
    def get(self):
        responseData = model_api.getModelList()
        return jsonify(responseData)
    @jwt_required()
    @swag_from('../swaggers/ModelListPost.yml')
    def post(self):
        requestData = request.get_json()
        responseData = model_api.getModelListByFilter(requestData)
        return jsonify(responseData)
api.add_resource(ModelList, '/getModelList')


class ModelSave(Resource):
    @jwt_required()
    @swag_from('../swaggers/ModelSave.yml')
    def post(self):
        requestData = request.get_json()
        responseData = model_api.saveModel(requestData)
        return jsonify(responseData)
api.add_resource(ModelSave, '/saveModel')


class ModelUpdate(Resource):
    @jwt_required()
    @swag_from('../swaggers/ModelUpdate.yml')
    def post(self):
        requestData = request.get_json()
        responseData = model_api.updateModel(requestData)
        return jsonify(responseData)
api.add_resource(ModelUpdate, '/updateModel')


class ModelDelete(Resource):
    @jwt_required()
    @swag_from('../swaggers/ModelDelete.yml')
    def post(self):
        requestData = request.get_json()
        responseData = model_api.deleteModel(requestData)
        return jsonify(responseData)
api.add_resource(ModelDelete, '/deleteModel')


class MechanismModelSave(Resource):
    @jwt_required()
    def post(self):
        requestData = request.get_json()
        responseData = model_api.saveMechanismModel(requestData)
        return jsonify(responseData)
api.add_resource(MechanismModelSave, '/saveMechanismModel')

class MechanismModelParam(Resource):
    @jwt_required()
    def post(self):
        requestData = request.get_json()
        responseData = model_api.getMechanismModelParam(requestData)
        return jsonify(responseData)
api.add_resource(MechanismModelParam, '/getMechanismModelParam')

class MechanismModelDelete(Resource):
    @jwt_required()
    def post(self):
        requestData = request.get_json()
        responseData = model_api.deleteMechanismModel(requestData)
        return jsonify(responseData)
api.add_resource(MechanismModelDelete, '/deleteMechanismModel')