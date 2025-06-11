from ..extensions import db
from datetime import datetime

class Camera(db.Model):
    __tablename__ = 'cameras'

    id = db.Column(db.Integer, primary_key=True)
    camera_ip = db.Column(db.String(10), nullable=False)
    place = db.Column(db.String(20), nullable=False)
    active = db.Column(db.Boolean, nullable=False, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "camera_ip": self.camera_ip,
            "place": self.place, 
            "active": self.active
        }

    def __repr__(self):
        return f"<Camera id={self.id} camera_ip='{self.camera_ip}' place='{self.place}' active={self.active}>"