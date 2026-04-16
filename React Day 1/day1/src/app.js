// App.js

import ProfileCard from "./Assignment/1/profile card q1/src/components/ProfileCard";

function App() {
  return (
    <div className="app">
      <ProfileCard
        name="Rakesh"
        title="Frontend Developer"
        bio="Passionate about building beautiful web interfaces."
        avatarUrl="https://i.pravatar.cc/150?img=1"
      />

      <ProfileCard
        name="Ananya"
        title="UI/UX Designer"
        bio="Designing user-friendly digital experiences."
        avatarUrl="https://i.pravatar.cc/150?img=2"
      />

      <ProfileCard
        name="Rahul"
        title="Backend Engineer"
        bio="Loves APIs, databases, and scalable systems."
        avatarUrl="https://i.pravatar.cc/150?img=3"
      />
    </div>
  );
}

export default App;