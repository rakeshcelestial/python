import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
import ProfileCard from './Assignment/1/profile card q1/src/components/ProfileCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='component-container'>
      <ProfileCard/>
    </div>
  )
}

export default App
