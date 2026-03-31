class SQLAlchemyRepository:
    def __init__(self, model, db):
        self.model = model
        self.db = db

    def save(self, obj):
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def find(self, obj_id):
        return self.db.query(self.model).filter(self.model.id == obj_id).first()

    def find_all(self):
        return self.db.query(self.model).all()

    def update(self, obj):
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(self, obj):
        self.db.delete(obj)
        self.db.commit()