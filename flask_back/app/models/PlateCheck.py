from ..extensions import db
from datetime import datetime

class PlateCheck(db.Model):
    __tablename__ = 'car_temp'

    id = db.Column(db.Integer, primary_key=True)
    license_plate = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<CarTemp id={self.id} license_plate='{self.license_plate}'>"
