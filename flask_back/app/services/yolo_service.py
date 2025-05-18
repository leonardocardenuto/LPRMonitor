from app.models.Cars import Car
from app.models.HistoricMovements import HistoricMovement
from app.extensions import db
from datetime import datetime

class CarServiceError(Exception):
    def __init__(self, message, code=400):
        self.message = message
        self.code = code
        super().__init__(message)

def handle_register_car(license_plate, owner_id=None, from_camera_id=None, to_camera_id=None):
    if not license_plate:
        raise CarServiceError("license_plate is required", code=400)

    exists = db.session.query(Car.query.filter_by(license_plate=license_plate).exists()).scalar()
    if exists:
        raise CarServiceError("Car with this license plate already exists", code=409)

    try:
        new_car = Car(license_plate=license_plate, owner_id=owner_id)
        db.session.add(new_car)
        db.session.flush()

        movement = HistoricMovement(
            car_id=new_car.id,
            from_camera_id=from_camera_id,
            to_camera_id=1,
            created_at=datetime.utcnow()
        )
        db.session.add(movement)

        db.session.commit()
        return new_car
    except Exception as e:
        db.session.rollback()
        raise CarServiceError(f"Error registering car and historic movement: {str(e)}", code=500)
