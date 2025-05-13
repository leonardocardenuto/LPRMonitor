from app.models.PlateCheck import PlateCheck
from app.extensions import db
from flask import jsonify

class PlateServiceError(Exception):
    def __init__(self, message, code=400):
        self.message = message
        self.code = code
        super().__init__(message)

def check_plate_exists(plate_id):
    if not plate_id:
        raise PlateServiceError("plate_id is required", code=400)

    exists = db.session.query(PlateCheck.query.filter_by(license_plate=plate_id).exists()).scalar()
    return exists

def get_last_plates():
    try:
        plates = PlateCheck.query.order_by(PlateCheck.created_at.desc()).limit(10).all()
        return [plate.to_dict() for plate in plates] 
    except Exception as e:
        raise PlateServiceError(f"Error retrieving plates: {str(e)}", code=500)
