from flask import Blueprint, request
from app.services.yolo_service import handle_register_car
from app.utils.response_manager import ResponseManager as DoResponse

yolo_bp = Blueprint('yolo', __name__, url_prefix='/yolo')

@yolo_bp.route('/register_car', methods=['POST'])
def register_car():
    try:
        data = request.get_json()
        license_plate = data.get('license_plate')
        owner_id = data.get('owner_id') if data.get('owner_id') else None

        if not license_plate:
            return DoResponse.bad_request("license_plate is required")

        car = handle_register_car(license_plate=license_plate, owner_id=owner_id)

        return DoResponse.created({
            "message": "Car registered successfully",
            "car": car.to_dict()
        })

    except Exception as e:
        return DoResponse.internal_server_error(str(e))