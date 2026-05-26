import React, { useState } from 'react';
import { supabase } from './supabaseClient';

interface SignUpProps {
  onSwitchToLogin: () => void;
}

export default function SignUp({ onSwitchToLogin }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Supabase 회원가입 요청
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      alert(`회원가입 실패: ${signUpError.message}`);
      return;
    }

    alert('회원가입 성공! 즉시 자동 로그인을 진행합니다.');

    // 2. 가입 성공 직후 자동 로그인
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      alert(`자동 로그인 실패: ${loginError.message}`);
    } else {
      alert('자동 로그인까지 완벽하게 성공했습니다! 🎉');
      console.log('로그인된 유저 UUID:', loginData.user?.id);
      onSwitchToLogin(); // 완료 후 로그인 화면으로 돌려보내기
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '100px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>회원가입 화면</h2>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="email" 
            placeholder="새로운 이메일 입력" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="password" 
            placeholder="새로운 비밀번호 입력" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} 
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#008CBA', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '8px' }}>
          회원가입 완료하기 (자동 로그인)
        </button>
        <button type="button" onClick={onSwitchToLogin} style={{ width: '100%', padding: '10px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', cursor: 'pointer' }}>
          ⬅️ 로그인으로 돌아가기
        </button>
      </form>
    </div>
  );
}