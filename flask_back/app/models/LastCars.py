from ..extensions import db
from datetime import datetime
from pytz import timezone

def get_sp_time():
    aware_time = datetime.now(timezone('America/Sao_Paulo'))
    return aware_time.replace(tzinfo=None)

class LastCars(db.Model):
    __tablename__ = 'last_cars'

    id = db.Column(db.Integer, primary_key=True)
    license_plate = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=get_sp_time)
    last_seen_in = db.Column(db.Integer, nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "license_plate": self.license_plate,
            "description": self.description,
            "created_at": self.created_at.isoformat(),
            "last_seen_in": self.last_seen_in
        }

    def __repr__(self):
        return f"<CarTemp id={self.id} license_plate='{self.license_plate}'>"
