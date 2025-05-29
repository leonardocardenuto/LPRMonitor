from ..extensions import db
from datetime import datetime

class IdentifyCar(db.Model):
    __tablename__ = 'identify_car'

    id = db.Column(db.Integer, primary_key=True)
    license_plate = db.Column(db.String(10), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    extra_info = db.Column(db.Text, nullable=True)
    expire_date = db.Column(db.Date, nullable=False)
    justification = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "license_plate": self.license_plate,
            "status": self.status,
            "extra_info": self.extra_info,
            "expire_date": self.expire_date.isoformat() if self.expire_date else None,
            "justification": self.justification,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<IdentifyCar id={self.id} license_plate='{self.license_plate}'>"