from flask import Blueprint, request, jsonify
from app.services.plate_service import check_plate_exists, get_last_plates, PlateServiceError
from app.utils.response_manager import ResponseManager as DoResponse

check_plate_bp = Blueprint('check_plate', __name__, url_prefix='/check_plate')

@check_plate_bp.route('/check_plate', methods=['POST'])
def check_plate():
    try:
        data = request.get_json()
        plate_id = data.get('plate_id')

        if not plate_id:
            return DoResponse.bad_request("Missing 'plate_id'")

        exists = check_plate_exists(plate_id)
        return DoResponse.success(data={'exists': exists}) if exists else DoResponse.not_found("Plate not found")

    except PlateServiceError as e:
        return DoResponse.with_code(e.code, e.message)
    except Exception as e:
        return DoResponse.internal_server_error(str(e))


@check_plate_bp.route('/get_last_plates', methods=['GET'])
def get_last_plates_route():
    try:
        plates = get_last_plates()
        
        return DoResponse.success(data={"plates": plates})

    except PlateServiceError as e:
        return DoResponse.with_code(e.code, e.message)
    except Exception as e:
        return DoResponse.internal_server_error(str(e))
