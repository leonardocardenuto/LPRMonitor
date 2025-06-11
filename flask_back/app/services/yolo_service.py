from app.models.RegisteredCars import RegisteredCars
from app.models.LastCars import LastCars
from app.models.Camera import Camera

from app.extensions import db
from datetime import datetime

class CarServiceError(Exception):
    def __init__(self, message, code=400):
        self.message = message
        self.code = code
        super().__init__(message)

def handle_register_car_movement(license_plate, owner_id=None, camera_id=None):
    if not license_plate:
        raise CarServiceError("license_plate is required", code=400)

    try:
        car = LastCars.query.filter_by(license_plate=license_plate).first()
        if car:
            car.last_seen_in = camera_id
            db.session.commit()
            return car

        else:
            car = LastCars(
                license_plate=license_plate,
                last_seen_in=camera_id,
            )
            db.session.add(car)
            db.session.commit()
            return car
    except Exception as e:
        db.session.rollback()
        raise CarServiceError(f"Error processing car and movement: {str(e)}", code=500)

def get_all_cameras(justActive=True):
    try:
        query = Camera.query
        if justActive:
            query = query.filter_by(active=True)
        return query.order_by(Camera.id).all()
    except Exception as e:
        raise CarServiceError(f"Error fetching cameras: {str(e)}", code=500)
    
def handle_delete_car(license_plate: str):
    if not license_plate:
        raise CarServiceError("license_plate is required", code=400)

    try:
        deleted_count = LastCars.query.filter_by(license_plate=license_plate).delete()
        if deleted_count == 0:
            db.session.rollback()
            raise CarServiceError(f"Placa '{license_plate}' não encontrada", code=404)
        db.session.commit()
        return {"deleted": license_plate}

    except CarServiceError:
        raise
    except Exception as e:
        db.session.rollback()
        raise CarServiceError(f"Error deleting car occurrence: {str(e)}", code=500)