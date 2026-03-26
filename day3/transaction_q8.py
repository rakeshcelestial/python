from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.exc import IntegrityError
from datetime import datetime

#  Database setup (SQLite for easy testing)
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


#  Transaction Function
def create_user_with_tasks(session, username, email, password, task_titles):
    try:
        # Create user
        user = User(username=username, email=email, password=password)
        session.add(user)
        session.flush()  # get user.id before commit

        # Create tasks
        tasks = []
        for title in task_titles:
            task = Task(title=title, owner_id=user.id)
            tasks.append(task)

        session.add_all(tasks)

        # Commit transaction
        session.commit()

        return f"Transaction successful: User '{username}' created with {len(tasks)} tasks"

    except IntegrityError:
        session.rollback()
        return (
            "Transaction rolled back: duplicate key value violates unique constraint\n"
            f"{email} was NOT saved"
        )

    except Exception as e:
        session.rollback()
        return f"Transaction failed: {e}"


# Run Example
if __name__ == "__main__":
    session = SessionLocal()

    # Case 1: Success
    print("--- Case 1: New user ---")
    result = create_user_with_tasks(
        session,
        "dave",
        "dave@mail.com",
        "pass1234",
        ["Setup environment", "Read documentation", "Complete onboarding"]
    )
    print(result)

    # Case 2: Failure (duplicate username)
    print("\n--- Case 2: Duplicate user ---")
    result = create_user_with_tasks(
        session,
        "dave",
        "dave2@mail.com",
        "pass5678",
        ["Task A", "Task B", "Task C"]
    )
    print(result)

    # Verify rollback
    user = session.query(User).filter_by(username="dave").first()
    print(f"\ndave's total tasks: {len(user.tasks)}")

    session.close()
