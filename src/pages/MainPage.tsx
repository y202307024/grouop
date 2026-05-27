import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const groups = [
  { name: '졸업작품 팀', members: ['김', '이', '안', '소'], status: '진행중', colors: ['#9FE1CB', '#B5D4F4', '#F5C4B3', '#F4C0D1'], textColors: ['#085041', '#0C447C', '#712B13', '#72243E'], icon: '📄' },
  { name: '알고리즘 스터디', members: ['김', '이', '박'], status: '대기중', colors: ['#9FE1CB', '#B5D4F4', '#EEEDFE'], textColors: ['#085041', '#0C447C', '#3C3489'], icon: '✏️' },
  { name: '캡스톤 발표 준비', members: ['김', '소'], status: '대기중', colors: ['#9FE1CB', '#F4C0D1'], textColors: ['#085041', '#72243E'], icon: '📝' },
];

function rndCode() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = 'GRP-';
  for (let i = 0; i < 5; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

export default function MainPage() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [genCode, setGenCode] = useState('');
  const [inviteInput, setInviteInput] = useState('');
  const [joinMsg, setJoinMsg] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f3', fontFamily: 'sans-serif' }}>

      {/* 왼쪽 프로필 사이드바 */}
      <div style={{ width: 220, background: '#1e1f22', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
        {/* 상단 로고 */}
        <div style={{ padding: '18px 16px', borderBottom: '1px solid #2e2f33' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, background: '#1D9E75', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>G</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Groupop</span>
          </div>
        </div>

        {/* 메뉴 */}
        <div style={{ padding: '12px 8px', flex: 1 }}>
          {[
            { icon: '🏠', label: '홈', active: true },
            { icon: '👥', label: '내 그룹', active: false },
            { icon: '📹', label: '회의', active: false },
            { icon: '📄', label: '문서', active: false },
            { icon: '✏️', label: '캔버스', active: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, cursor: 'pointer', background: item.active ? '#2e2f33' : 'transparent', marginBottom: 2 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: item.active ? '#fff' : '#9d9ea0' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* 하단 프로필 */}
        <div style={{ borderTop: '1px solid #2e2f33', padding: '12px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* 아바타 + 온라인 뱃지 */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              🐱
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#23a55a', border: '2px solid #1e1f22' }} />
          </div>
          {/* 이름 + 상태 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>김지민</div>
            <div style={{ fontSize: 11, color: '#9d9ea0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>온라인</div>
          </div>
          {/* 로그아웃 */}
          <button
            onClick={() => navigate('/')}
            title="로그아웃"
            style={{ background: 'transparent', border: 'none', color: '#9d9ea0', cursor: 'pointer', fontSize: 16, padding: 4, borderRadius: 4 }}
          >
            🚪
          </button>
        </div>
      </div>

      {/* 오른쪽 메인 콘텐츠 */}
      <div style={{ marginLeft: 220, padding: 32, flex: 1 }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>내 그룹</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>그룹을 만들거나 초대코드로 참여하세요</div>
          </div>
          <button style={{ padding: '8px 18px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            + 새 그룹 만들기
          </button>
        </div>

        {/* 액션 카드 2개 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          {/* 그룹 만들기 */}
          <div style={{ background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👥</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>새 그룹 만들기</div>
                <div style={{ fontSize: 12, color: '#888' }}>팀을 생성하고 초대코드 발급</div>
              </div>
            </div>
            <input
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #eee', borderRadius: 8, fontSize: 13, background: '#fafafa', marginBottom: 10, boxSizing: 'border-box' }}
              placeholder="그룹 이름 입력"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
            />
            <button onClick={createGroup} style={{ width: '100%', padding: 10, background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              그룹 생성하기
            </button>
            {genCode && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>초대코드가 생성되었어요</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f5f3', border: '1px solid #eee', borderRadius: 8, padding: '10px 14px', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 600, letterSpacing: '0.12em' }}>{genCode}</span>
                  <button onClick={copyCode} style={{ background: 'transparent', border: 'none', fontSize: 12, color: '#888', cursor: 'pointer' }}>
                    {copied ? '✅ 복사됨' : '📋 복사'}
                  </button>
                </div>
                <div style={{ fontSize: 11, color: '#aaa' }}>이 코드를 팀원에게 공유하세요</div>
              </div>
            )}
          </div>

          {/* 초대코드 참여 */}
          <div style={{ background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔑</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>초대코드로 참여하기</div>
                <div style={{ fontSize: 12, color: '#888' }}>코드를 입력해 그룹에 합류</div>
              </div>
            </div>
            <input
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #eee', borderRadius: 8, fontSize: 13, background: '#fafafa', marginBottom: 10, boxSizing: 'border-box', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              placeholder="초대코드 입력 (예: GRP-AB12C)"
              value={inviteInput}
              onChange={e => setInviteInput(e.target.value)}
            />
            <button onClick={joinGroup} style={{ width: '100%', padding: 10, background: '#185FA5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              그룹 참여하기
            </button>
            {joinMsg && (
              <div style={{ marginTop: 12, fontSize: 13, color: joinSuccess ? '#0F6E56' : '#A32D2D' }}>{joinMsg}</div>
            )}
          </div>
        </div>

        {/* 그룹 목록 */}
        <div style={{ fontSize: 11, fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>내 그룹 목록</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          {groups.map((g, i) => (
            <div key={i} style={{ background: '#fff', border: '1px dashed #ddd', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 150, cursor: 'pointer', padding: 18 }}>
              <span style={{ fontSize: 28 }}>{g.icon}</span>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#333', textAlign: 'center' }}>{g.name}</div>
              <div style={{ fontSize: 11, color: '#bbb' }}>팀원 {g.members.length}명</div>
              <div style={{ display: 'flex', marginTop: 2 }}>
                {g.members.map((m, j) => (
                  <div key={j} style={{ width: 22, height: 22, borderRadius: '50%', background: g.colors[j], color: g.textColors[j], fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, marginLeft: j === 0 ? 0 : -6, border: '1.5px solid #fff' }}>{m}</div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ background: '#fff', border: '1px dashed #ddd', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 150, cursor: 'pointer', color: '#bbb' }}>
            <span style={{ fontSize: 28 }}>+</span>
            <span style={{ fontSize: 12 }}>그룹 추가</span>
          </div>
        </div>
      </div>
    </div>
  );
}