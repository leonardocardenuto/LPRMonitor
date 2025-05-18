from .auth import auth_bp
from .plate_checks import check_plate_bp
from .yolo import yolo_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(check_plate_bp)
    app.register_blueprint(yolo_bp)

