from flask import Blueprint, request, current_app
from app.services.yolo_service import handle_register_car_movement
from app.utils.response_manager import ResponseManager as DoResponse
import queue

yolo_bp = Blueprint('yolo', __name__, url_prefix='/yolo')

def get_message_queue():
    if not hasattr(current_app, 'message_queue'):
        current_app.message_queue = queue.Queue()
    return current_app.message_queue

@yolo_bp.route('/register_car', methods=['POST'])
def register_car():
    try:
        data = request.get_json()
        license_plate = data.get('license_plate')

        if not license_plate:
            return DoResponse.bad_request("license_plate is required")

        car = handle_register_car_movement(license_plate=license_plate)

        message = f"Carro registrado: {car.license_plate}"
        q = get_message_queue()
        q.put(message)

        return DoResponse.created({
            "message": "Car registered successfully",
            "car": car.to_dict()
        })

    except Exception as e:
        return DoResponse.internal_server_error(str(e))