from flask import Blueprint, request, jsonify
from app.services.identify_car_service import create_identify_car, IdentifyCarServiceError
from app.utils.response_manager import ResponseManager as DoResponse
from app.services.identify_car_service import wipe_expired_identify_cars_service

identify_car_bp = Blueprint('identify_car', __name__, url_prefix='/identify_car')


def handle_indentify_error(error):
    code_map = {
        400: DoResponse.bad_request,
        401: DoResponse.unauthorized,
        409: DoResponse.conflict,
    }
    handler = code_map.get(error.code, DoResponse.bad_request)
    return handler(error.message)

@identify_car_bp.route('/create', methods=['POST'])
def create_identify_car_route():
    try:
        data = request.get_json()

        required_fields = [
            "license_plate", "status",
            "expire_date", "justification"
        ]

        if data.get("status", "").lower() == "aluno" or data.get("status", "").lower() == "parente":
            required_fields.append("extra_info")

        missing = [field for field in required_fields if field not in data]
        if missing:
            return DoResponse.bad_request(f"Missing required fields: {', '.join(missing)}")

        new_car = create_identify_car(data)

        return DoResponse.success(data=new_car.to_dict(), message="IdentifyCar created successfully")

    except IdentifyCarServiceError as e:
        return DoResponse.with_code(e.code, e.message)
    except Exception as e:
        return handle_indentify_error(str(e))

@identify_car_bp.route('/wipe-expired', methods=['DELETE'])
def wipe_expired_identify_cars():
    try:
        print("Wiping expired IdentifyCars...")
        wiped_count = wipe_expired_identify_cars_service()
        print(f"Wiped {wiped_count} expired IdentifyCars.")
        return DoResponse.success(data={"wiped_count": wiped_count}, message="Expired IdentifyCars wiped successfully")
    except IdentifyCarServiceError as e:
        print(f"Error wiping expired IdentifyCars: {e.message}")
        return DoResponse.with_code(e.code, e.message)
    except Exception as e:
        print(f"Unexpected error wiping expired IdentifyCars: {str(e)}")
        return DoResponse.internal_server_error(str(e))