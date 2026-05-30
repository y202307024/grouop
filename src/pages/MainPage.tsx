import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import './MainPage.css';

const groups = [
  { name: '졸업작품 팀', members: ['김','이','안','소'], colors: ['#9FE1CB','#B5D4F4','#F5C4B3','#F4C0D1'], textColors: ['#085041','#0C447C','#712B13','#72243E'], icon: '📄' },
  { name: '알고리즘 스터디', members: ['김','이','박'], colors: ['#9FE1CB','#B5D4F4','#EEEDFE'], textColors: ['#085041','#0C447C','#3C3489'], icon: '✏️' },
  { name: '캡스톤 발표 준비', members: ['김','소'], colors: ['#9FE1CB','#F4C0D1'], textColors: ['#085041','#72243E'], icon: '📝' },
];

function rndCode() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = 'GRP-';
  for (let i = 0; i < 5; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

const menuItems = [
  { icon: '🏠', label: '홈', active: true },
  { icon: '👥', label: '내 그룹', active: false },
  { icon: '📹', label: '회의', active: false },
  { icon: '📄', label: '문서', active: false },
  { icon: '✏️', label: '캔버스', active: false },
];

export default function MainPage() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [genCode, setGenCode] = useState('');
  const [inviteInput, setInviteInput] = useState('');
  const [joinMsg, setJoinMsg] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('🐱');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate('/'); return; }

      const { data } = await supabase
        .from('profiles')
        .select('nickname, avatar')
        .eq('id', userData.user.id)
        .single();

      if (data) {
        setNickname(data.nickname ?? '');
        setAvatar(data.avatar ?? '🐱');
      }
    };
    fetchProfile();
  }, []);

  const createGroup = () => {
    if (!groupName.trim()) return;
    setGenCode(rndCode());
  };

  const copyCode = () => {
    navigator.clipboard.writeText(genCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinGroup = () => {
    const v = inviteInput.trim().toUpperCase();
    if (!v) { setJoinMsg('코드를 입력해주세요'); setJoinSuccess(false); return; }
    if (!v.startsWith('GRP-') || v.length < 8) { setJoinMsg('올바른 초대코드 형식이 아닙니다'); setJoinSuccess(false); return; }
    setJoinMsg('그룹을 찾고 있어요...');
    setTimeout(() => { setJoinMsg('참여 요청을 보냈습니다!'); setJoinSuccess(true); }, 900);
  };

  return (
    <div className="main-wrap">

      {/* 사이드바 */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">G</div>
          <span className="sidebar-logo-text">Groupop</span>
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item, i) => (
            <button key={i} className={`menu-item ${item.active ? 'active' : ''}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="profile-avatar">
            <div className="avatar-circle">{avatar}</div>
            <div className="online-dot" />
          </div>
          <div className="profile-info">
            <div className="profile-name">{nickname || '...'}</div>
            <div className="profile-status">온라인</div>
          </div>
          <button className="logout-btn" onClick={(e) => { e.stopPropagation(); navigate('/'); }} title="로그아웃">🚪</button>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="content">
        <div className="content-header">
          <div>
            <div className="page-title">내 그룹</div>
            <div className="page-sub">그룹을 만들거나 초대코드로 참여하세요</div>
          </div>
          <button className="btn-primary">+ 새 그룹 만들기</button>
        </div>

        <div className="action-grid">
          {/* 그룹 만들기 */}
          <div className="action-card">
            <div className="action-card-head">
              <div className="action-icon green">👥</div>
              <div>
                <div className="action-title">새 그룹 만들기</div>
                <div className="action-desc">팀을 생성하고 초대코드 발급</div>
              </div>
            </div>
            <input className="action-input" placeholder="그룹 이름 입력" value={groupName} onChange={e => setGroupName(e.target.value)} />
            <button className="btn-green" onClick={createGroup}>그룹 생성하기</button>
            {genCode && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>초대코드가 생성되었어요</div>
                <div className="code-box">
                  <span className="code-text">{genCode}</span>
                  <button className="copy-btn" onClick={copyCode}>{copied ? '✅ 복사됨' : '📋 복사'}</button>
                </div>
                <div style={{ fontSize: 11, color: '#aaa' }}>이 코드를 팀원에게 공유하세요</div>
              </div>
            )}
          </div>

          {/* 초대코드 참여 */}
          <div className="action-card">
            <div className="action-card-head">
              <div className="action-icon blue">🔑</div>
              <div>
                <div className="action-title">초대코드로 참여하기</div>
                <div className="action-desc">코드를 입력해 그룹에 합류</div>
              </div>
            </div>
            <input className="action-input uppercase" placeholder="초대코드 입력 (예: GRP-AB12C)" value={inviteInput} onChange={e => setInviteInput(e.target.value)} />
            <button className="btn-blue" onClick={joinGroup}>그룹 참여하기</button>
            {joinMsg && <div className={`join-msg ${joinSuccess ? 'success' : 'error'}`}>{joinMsg}</div>}
          </div>
        </div>

        {/* 그룹 목록 */}
        <div className="section-label">내 그룹 목록</div>
        <div className="rooms-grid">
          {groups.map((g, i) => (
            <div key={i} className="room-card" onClick={() => navigate(`/room/${i}`)} style={{ cursor: 'pointer' }}>
              <span className="room-icon">{g.icon}</span>
              <div className="room-name">{g.name}</div>
              <div className="room-meta">팀원 {g.members.length}명</div>
              <div className="members-stack">
                {g.members.map((m, j) => (
                  <div key={j} className="member-dot" style={{ background: g.colors[j], color: g.textColors[j], marginLeft: j === 0 ? 0 : -6 }}>{m}</div>
                ))}
              </div>
            </div>
          ))}
          <div className="room-card room-add">
            <span className="room-icon">+</span>
            <span style={{ fontSize: 12 }}>그룹 추가</span>
          </div>
        </div>
      </div>
    </div>
  );
}