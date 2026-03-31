from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, create_engine, asc, desc
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime

#  Database setup (use your PostgreSQL URL if needed)
DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


#  Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    tasks = relationship("Task", back_populates="owner")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="pending")
    priority = Column(String, default="medium")

    owner_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="tasks")

    def __repr__(self):
        return f"<Task(id={self.id}, title='{self.title}', status='{self.status}', priority='{self.priority}')>"


#  Create tables
Base.metadata.create_all(bind=engine)


#  Query Functions

def get_tasks_by_status(session, status):
    return session.query(Task).filter_by(status=status).all()


def get_tasks_sorted(session, sort_by="created_at", order="asc"):
    column = getattr(Task, sort_by, None)

    if not column:
        raise ValueError(f"Invalid sort field: {sort_by}")

    if order == "desc":
        return session.query(Task).order_by(desc(column)).all()
    else:
        return session.query(Task).order_by(asc(column)).all()


def get_tasks_paginated(session, page=1, limit=10):
    return (
        session.query(Task)
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )


def get_user_with_tasks(session, username):
    user = session.query(User).filter_by(username=username).first()

    if not user:
        raise ValueError(f"User '{username}' not found")

    return user


#  Example Data + Usage
if __name__ == "__main__":
    session = SessionLocal()

    # Create sample users
    alice = User(username="alice", email="alice@mail.com", password="pass")
    bob = User(username="bob", email="bob@mail.com", password="pass")

    session.add_all([alice, bob])
    session.commit()

    # Create sample tasks
    tasks = [
        Task(title="Write report", status="pending", owner=alice),
        Task(title="Review PR", status="pending", owner=bob),
        Task(title="Fix bug", status="pending", owner=alice),
        Task(title="Deploy app", status="completed", owner=alice),
        Task(title="Update docs", status="completed", owner=bob),
    ]

    session.add_all(tasks)
    session.commit()

    #  Filter
    pending = get_tasks_by_status(session, "pending")
    print(f"Pending tasks: {len(pending)}")
    for t in pending:
        print(f" - {t.title} ({t.owner.username})")

    #  Sorted
    sorted_tasks = get_tasks_sorted(session, "created_at", "desc")
    print(f"\nSorted (newest first): {[t.title for t in sorted_tasks]}")

    #  Pagination
    page = get_tasks_paginated(session, page=1, limit=2)
    print(f"\nPage 1 (limit 2): {[t.title for t in page]}")

    # Relationship
    user = get_user_with_tasks(session, "alice")
    print(f"\n{user.username}'s tasks:")
    for t in user.tasks:
        print(f" - {t.title} ({t.status})")

    session.close()
