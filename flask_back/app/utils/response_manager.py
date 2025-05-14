from flask import jsonify

class ResponseManager:
    @staticmethod
    def success(data=None, message="Success"):
        response = {"msg": message}
        if data:
            response.update(data)
        return jsonify(response), 200

    @staticmethod
    def created(data=None, message="Created"):
        response = {"msg": message}
        if data:
            response.update(data)
        return jsonify(response), 201

    @staticmethod
    def bad_request(message="Bad Request"):
        return jsonify({"msg": message}), 400

    @staticmethod
    def unauthorized(message="Unauthorized"):
        return jsonify({"msg": message}), 401

    @staticmethod
    def conflict(message="Conflict"):
        return jsonify({"msg": message}), 409

    @staticmethod
    def not_found(message="Not Found"):
        return jsonify({"msg": message}), 404

    @staticmethod
    def internal_server_error(message="Internal Server Error"):
        return jsonify({"msg": message}), 500

    @staticmethod
    def with_code(code: int, message=""):
        return jsonify({"msg": message}), code