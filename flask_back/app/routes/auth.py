from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from app.services.auth_service import register_user, authenticate, AuthError
from app.utils.response_manager import ResponseManager as DoResponse
from datetime import datetime

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

def handle_auth_error(error):
    code_map = {
        400: DoResponse.bad_request,
        401: DoResponse.unauthorized,
        409: DoResponse.conflict,
    }
    handler = code_map.get(error.code, DoResponse.bad_request)
    return handler(error.message)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        user = register_user(data['name'], data['password'])
        return DoResponse.created(data={"id": user.id, "name": user.name})
    except AuthError as e:
        return handle_auth_error(e)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        user = authenticate(data['name'], data['password'])
        token = create_access_token(
            identity=str(user.id),
            additional_claims={"login_time": datetime.utcnow().isoformat()}
        )
        return DoResponse.success(data={"token": token})
    except AuthError as e:
        return handle_auth_error(e)