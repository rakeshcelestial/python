from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine
from datetime import datetime

#  Database setup (simple local example — replace with your DATABASE_URL)
DATABASE_URL = "sqlite:///./test.db"  # change to your PostgreSQL URL

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


#  User Model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"


#  Create tables
Base.metadata.create_all(bind=engine)


#  CRUD Operations

# Create User
def create_user(session, username, email, password):
    user = User(username=username, email=email, password=password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return f"User '{username}' created with id {user.id}"


# Read Users
def get_all_users(session):
    return session.query(User).all()


# Update User Email
def update_user_email(session, username, new_email):
    user = session.query(User).filter_by(username=username).first()

    if not user:
        raise ValueError(f"User '{username}' not found")

    user.email = new_email
    session.commit()
    return f"Updated {username}'s email to {new_email}"


# Delete User
def delete_user(session, username):
    user = session.query(User).filter_by(username=username).first()

    if not user:
        raise ValueError(f"User '{username}' not found")

    session.delete(user)
    session.commit()
    return f"User '{username}' deleted successfully"


#  Example Usage
if __name__ == "__main__":
    session = SessionLocal()

    print(create_user(session, "charlie", "charlie@mail.com", "pass1234"))

    users = get_all_users(session)
    for u in users:
        print(u)

    print(update_user_email(session, "charlie", "charlie.new@mail.com"))

    print(delete_user(session, "charlie"))

    session.close()
