import { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

function App() {
  // 'login'이면 로그인 파일을, 'signup'이면 회원가입 파일을 보여줍니다.
  const [view, setView] = useState<'login' | 'signup'>('login');

  return (
    <div>
      {view === 'login' ? (
        // Login 컴포넌트가 요구하는 함수 이름을 정확하게 맞춰서 전달합니다.
        <Login onSwitchToSignUp={() => setView('signup')} />
      ) : (
        // SignUp 컴포넌트가 요구하는 함수 이름을 정확하게 맞춰서 전달합니다.
        <SignUp onSwitchToLogin={() => setView('login')} />
      )}
    </div>
  );
}

export default App;