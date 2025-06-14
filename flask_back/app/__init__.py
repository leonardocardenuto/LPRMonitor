from flask import Flask, request
from flask_cors import CORS 
from .config import Config
from .extensions import db, jwt
from .routes import register_routes
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from .utils.response_manager import ResponseManager as DoResponse
from datetime import timedelta

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=90)
    
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    db.init_app(app)
    jwt.init_app(app)

    @app.before_request
    def check_jwt_token():
        public_paths = ['auth/login','auth/register']

        if app.config['FLASK_ENV'] != 'development' and "auth/register" in request.path:
            return DoResponse.unauthorized()

        if any(path in request.path for path in public_paths) or request.method == "OPTIONS":
            return

        if request.path.startswith('/stream'):
            token = request.args.get('token') or request.headers.get("Authorization")
            if not token:
                return DoResponse.unauthorized(message="Missing token for stream")

            if not token.startswith("Bearer "):
                token = "Bearer " + token

            # Injeta header Authorization na request para o flask_jwt_extended ler normalmente
            request.headers.environ['HTTP_AUTHORIZATION'] = token                

            try:
                verify_jwt_in_request(locations=["headers", "query_string"])
            except Exception as e:
                return DoResponse.unauthorized(message=str(e))
            return

        if request.path.startswith('/identify_car/wipe-expired'):
            try:
                verify_jwt_in_request()
                claims = get_jwt() 
                if claims.get('name') != 'wipe-service':
                    return DoResponse.unauthorized(message="Unauthorized user")
            except Exception as e:
                return DoResponse.unauthorized(message=str(e))

        try:
            if not request.headers.get("Authorization"):
                return DoResponse.unauthorized()
            verify_jwt_in_request()
        except Exception as e:
            return DoResponse.unauthorized(message=str(e))

    register_routes(app)
    return app