from ..extensions import db
from datetime import datetime
from pytz import timezone

def get_sp_time():
    aware_time = datetime.now(timezone('America/Sao_Paulo'))
    return aware_time.replace(tzinfo=None)

class CarAuthorization(db.Model):
    __tablename__ = 'car_authorizations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    license_plate_id = db.Column(db.String, db.ForeignKey('cars.id'), nullable=False)
    valid_until = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=get_sp_time, nullable=False)
    justification = db.Column(db.String, nullable=True)
    status = db.Column(db.String, nullable=True)
    extra_info = db.Column(db.String, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "license_plate_id": self.license_plate_id,
            "valid_until": self.valid_until.isoformat() if self.valid_until else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "justification": self.justification,
            "status": self.status,
            "extra_info": self.extra_info
        }

    def __repr__(self):
        return f"<CarAuthorization id={self.id} license_plate_id={self.license_plate_id}>"
