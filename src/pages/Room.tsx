import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LiveKitRoom, useLocalParticipant, useParticipants } from '@livekit/components-react';
import '@livekit/components-styles';
import { supabase } from '../services/supabaseClient';

function RoomContent({ onLeave, avatar, userName }: { onLeave: () => void, avatar: string, userName: string }) {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [micOn, setMicOn] = useState(true);

  const toggleMic = () => {
    localParticipant.setMicrophoneEnabled(!micOn);
    setMicOn(!micOn);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

      {/* 참여자 목록 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 24, padding: 40 }}>
        {participants.map((p) => (
          <div key={p.identity} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#5865f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, border: p.isSpeaking ? '3px solid #57f287' : '3px solid transparent' }}>
              🐱
            </div>
            <span style={{ color: 'white', fontSize: 13 }}>{p.identity}</span>
            <span style={{ fontSize: 11, color: p.isSpeaking ? '#57f287' : '#949ba4' }}>
              {p.isSpeaking ? '🎙️ 말하는 중' : '🔇 대기 중'}
            </span>
          </div>
        ))}
      </div>

      {/* 하단 컨트롤바 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#232428', borderTop: '1px solid #1a1b1e', height: 52 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#5865f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            {avatar}
          </div>
          <div>
            <div style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{userName}</div>
            <div style={{ color: '#57f287', fontSize: 10 }}>● 연결됨</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={toggleMic} title={micOn ? '마이크 끄기' : '마이크 켜기'} style={{
            width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
            background: micOn ? '#35373c' : '#ed4245', color: 'white', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {micOn ? '🎙️' : '🔇'}
          </button>
          <button onClick={onLeave} title="나가기" style={{
            width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
            background: '#ed4245', color: 'white', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            📞
          </button>
        </div>

        <div style={{ width: 80 }} />
      </div>
    </div>
  );
}

export default function Room() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [userName, setUserName] = useState('');
  const [avatar, setAvatar] = useState('🐱');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate('/'); return; }

      const { data: profile } = await supabase
        .from('profiles').select('nickname, avatar')
        .eq('id', userData.user.id).maybeSingle();

      const name = profile?.nickname || userData.user.email || '익명';
      setUserName(name);
      setAvatar(profile?.avatar || '🐱');

      const res = await fetch('http://localhost:3001/api/livekit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: id, userName: name })
      });
      const data = await res.json();
      setToken(data.token);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return (
    <div style={{ height: '100vh', background: '#1e1f22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18 }}>
      🎙️ 연결 중...
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1e1f22', fontFamily: 'sans-serif' }}>

      {/* 상단 헤더 */}
      <div style={{ padding: '0 16px', background: '#1a1b1e', color: 'white', display: 'flex', alignItems: 'center', gap: 8, height: 48, borderBottom: '1px solid #2f3136' }}>
        <span style={{ color: '#949ba4', fontSize: 20 }}>🔊</span>
        <span style={{ fontWeight: 600, fontSize: 15 }}>음성채널</span>
        <span style={{ fontSize: 11, color: '#57f287', background: '#1a3a2a', padding: '2px 8px', borderRadius: 10, marginLeft: 4 }}>● 진행 중</span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* 왼쪽 사이드바 */}
        <div style={{ width: 240, background: '#2b2d31', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 8px 4px 16px', fontSize: 11, color: '#949ba4', fontWeight: 700, letterSpacing: 1 }}>
            음성 연결됨 — {1}
          </div>
          <div style={{ padding: '2px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 4 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#5865f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {avatar}
                </div>
                <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, background: '#57f287', borderRadius: '50%', border: '2px solid #2b2d31' }} />
              </div>
              <span style={{ color: '#dbdee1', fontSize: 14 }}>{userName}</span>
              <span style={{ marginLeft: 'auto', fontSize: 14, color: '#949ba4' }}>🎙️</span>
            </div>
          </div>
        </div>

        {/* 메인 영역 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#313338' }}>
          <LiveKitRoom
            token={token}
            serverUrl={import.meta.env.VITE_LIVEKIT_URL}
            connect={true}
            audio={true}
            video={false}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <RoomContent onLeave={() => navigate(`/group/${id}`)} avatar={avatar} userName={userName} />
          </LiveKitRoom>
        </div>

      </div>
    </div>
  );
}