# app/services/plate_service.py

from app.models.PlateCheck import PlateCheck
from app.extensions import db

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
