// components/ProfileCard.js

function ProfileCard({ name, title, bio, avatarUrl }) {
  return (
    <div className="profile-card">
      <img src={avatarUrl} alt={name} className="avatar" />

      <h2>{name}</h2>
      <h4>{title}</h4>
      <p>{bio}</p>
    </div>
  );
}

export default ProfileCard;