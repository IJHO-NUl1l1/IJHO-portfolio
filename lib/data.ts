export type MediaItem =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

export interface OtherProject {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  type: string;
  description: string;
  myRole: string[];
  highlights: string[];
  stack: string[];
  media?: MediaItem[];
  links?: {
    web?: string;
    githubs?: Array<{ label: string; href: string }>;
  };
}

export const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const SKILLS = {
  "Frontend": ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  "Realtime & Backend": ["Fastify", "Node.js", "Supabase", "Chrome Extension (MV3)"],
  "Web3": ["Solidity", "Move", "Wagmi"],
};

export const PROJECTS = {
  featured: {
    id: "chzzk",
    title: "치지직 라이엇 티어 트래커",
    subtitle: "Chrome Extension + Fastify 서버 + Next.js 웹",
    period: "2025.09 ~ 진행 중",
    type: "개인 프로젝트",
    description:
      "치지직 라이브 채팅창에서 시청자 닉네임 옆에 LoL / TFT 랭크 배지를 실시간으로 표시하는 Chrome Extension. Extension, Fastify 서버, OBS 오버레이, 온보딩 웹까지 전 구성을 단독 설계 및 구현.",
    links: {
      web: "https://chzzk-riot-tier-tracker-web.vercel.app",
      github: "https://github.com/IJHO-NUl1l1/chzzk-lol-tier",
      server: "https://github.com/IJHO-NUl1l1/chzzk-riot-tier-tracker-fastify",
      webRepo: "https://github.com/IJHO-NUl1l1/chzzk-riot-tier-tracker-web",
    },
    roles: [
      {
        title: "MutationObserver + SPA 라우팅 대응",
        desc: [
          "chatWrapper remount 시 기존 observer가 detached DOM을 감시하는 문제 파악",
          "document.body 직접 감시 + 셀렉터 필터링으로 chatItem만 처리",
          "라우팅 후에도 배지 삽입이 안정적으로 동작",
        ],
        tags: ["MutationObserver", "document.body", "Chrome Extension"],
      },
      {
        title: "3단계 캐싱 레이어 설계",
        desc: [
          "클라이언트 인메모리 캐시 (5분 TTL) — 동일 닉네임 중복 요청 차단",
          "Debounce 300ms 배치 — 채팅 폭발 시 요청 묶음 전송",
          "서버 LRU 500개 / 5분 TTL — 공통 닉네임 DB 쿼리 공유",
        ],
        tags: ["LRU Cache", "Debounce", "TTL"],
      },
      {
        title: "Supabase Realtime Broadcast 즉시 동기화",
        desc: [
          "티어 등록/삭제/공개설정 변경 시 서버에서 broadcast push",
          "payload로 클라이언트 캐시 직접 갱신 — 서버 재요청 0",
          "해당 닉네임 배지만 선택적 재렌더 + LRU 동시 무효화",
        ],
        tags: ["Supabase Realtime", "Broadcast", "WebSocket"],
      },
      {
        title: "JWT 인증 시스템 직접 설계",
        desc: [
          "HS256 서명 기반 JWT 직접 구현",
          "requireSelf() 미들웨어로 JWT.sub ↔ 요청 채널ID 검증",
          "withAuth() 래퍼로 401 수신 시 refresh 자동 재시도",
        ],
        tags: ["JWT", "HS256", "Fastify Middleware"],
      },
      {
        title: "Manifest V3 OAuth 플로우",
        desc: [
          "chrome.identity 쿠키 격리 문제로 tabs.create() 기반 인증으로 전환",
          "tabs.onUpdated로 /auth/success 리다이렉트 감지 후 JWT 추출",
          "authTabId를 chrome.storage.session에 보관 — SW 재시작 후 복구",
        ],
        tags: ["Chrome MV3", "OAuth", "Service Worker"],
      },
      {
        title: "OBS Browser Source Overlay",
        desc: [
          "tier_updates:{liveId} 채널에서 Presence + Broadcast 이중 구독",
          "Presence sync로 현재 방송 시청자 목록 초기화",
          "Broadcast payload로 티어 변경 즉시 반영 — 추가 API 호출 없이 state 직접 갱신",
        ],
        tags: ["Supabase Presence", "Broadcast", "OBS"],
      },
    ],
    design: [
      {
        step: "01",
        label: "문제 정의 — 어디서 부하가 생기는가",
        situation: "티어 배지 표시의 실제 흐름: content.js가 채팅 닉네임을 감지 → 서버 /api/tier 호출 → DB(tier_cache) 조회 → 결과 반환. Riot API는 팝업에서 닉네임 검색 시에만 한 번 호출되고, 배지 표시 메인 로직에는 없음.",
        numbers: [
          "시청자 1명 입장 → 채팅에서 처음 본 닉네임마다 /api/tier 요청 1회",
          "시청자 1,000명 동시 입장 → 동일 닉네임에 대해 최대 1,000 req 집중",
          "캐싱 없이는 DB 쿼리도 동일 비율로 선형 증가",
        ],
        problem: "시청자가 많을수록 동일 닉네임에 대한 중복 서버 요청이 급증. 캐싱 전략 없이는 DB 쿼리가 선형으로 증가.",
      },
      {
        step: "02",
        label: "캐싱 레이어 설계 — 클라이언트 + 서버 3단계",
        situation: "중복 요청을 줄이기 위해 클라이언트와 서버 양쪽에 캐시 도입. 클라이언트는 인메모리 Map(5분 TTL)으로 자신이 본 닉네임을 기억. 서버는 LRU(500개, 5분 TTL)로 공통 닉네임 쿼리 결과를 공유.",
        numbers: [
          "클라이언트 캐시 hit → 서버 요청 0",
          "클라이언트 miss → 서버 LRU hit → DB 쿼리 0",
          "서버 LRU miss → DB 조회 1회 후 LRU 저장 → 이후 동일 닉네임 요청은 LRU hit",
          "Debounce 300ms: 채팅 폭발 시 같은 닉네임 요청을 묶어 1회만 전송",
        ],
        problem: "정적 캐시만으로는 티어 변경 시 즉시 반영 불가. TTL 만료 전까지 오래된 데이터가 표시됨.",
      },
      {
        step: "03",
        label: "실시간 동기화 도입 — 단일 전체 구독 채널",
        situation: "티어 변경을 즉시 반영하기 위해 Supabase Realtime Broadcast 도입. 처음엔 익스텐션 사용자 전원이 하나의 채널을 구독하는 구조로 설계.",
        numbers: "전체 사용자 N명이 단일 채널 구독 → 누군가 티어 변경 시 N명 전원에게 이벤트 전달",
        problem: "다른 방송을 보는 사람에게도 이벤트가 전달됨. 사용자 수가 늘수록 Supabase Realtime 채널 부하 급증. 관련 없는 닉네임 이벤트 처리 낭비.",
      },
      {
        step: "04",
        label: "방송별 채널 분리 — tier_updates:{liveId}",
        situation: "실시간 동기화가 의미 있는 범위는 '같은 방송을 보는 시청자'로 한정. 방송 ID(liveId)별로 채널을 분리하여 무관한 사용자에게는 이벤트가 전달되지 않도록 변경.",
        numbers: "채널명: tier_updates:{liveId} → 같은 방송 시청자만 구독 → 이벤트 수신 대상 최소화",
        problem: "채널 분리로 불필요한 이벤트 전달은 해결. 그러나 broadcast 수신 후 클라이언트가 각자 /api/tier를 재호출하는 구조가 남아 있음. LRU는 방금 무효화된 상태라 첫 요청은 DB까지 도달.",
      },
      {
        step: "05",
        label: "최종 설계 — broadcast payload로 캐시 직접 갱신",
        situation: "서버는 broadcast 시 이미 변경된 데이터(tier, rank, LP, Riot 닉네임)를 알고 있음. payload에 전체 데이터를 포함하면 클라이언트가 서버 재요청 없이 로컬 캐시를 직접 갱신 가능.",
        numbers: [
          "broadcast 1회 → 같은 방송 시청자 N명 수신",
          "→ 각자 payload로 클라이언트 Map 캐시 직접 write",
          "→ 서버 요청 0, DB 쿼리 0",
          "→ 해당 닉네임을 아직 본 적 없는 시청자만 /api/tier 1회 호출",
        ],
        result: "broadcast 1회 push → 같은 방송 N명 동시 수신, 추가 서버 요청 0 / DB 쿼리 0. 서버는 broadcastToChannel() payload에 변경 데이터 포함(1줄 추가), 클라이언트는 tier_updated / tier_deleted / privacy_changed 이벤트별로 캐시를 직접 수정 후 해당 닉네임 배지만 재렌더.",
      },
    ],
    problems: [
      {
        title: "SPA 라우팅 후 배지 미작동",
        cause: "React가 chatWrapper를 unmount/remount할 때 기존 MutationObserver가 detached DOM을 계속 감시. 라우팅 후 신규 채팅에 배지가 삽입되지 않음.",
        solution: "특정 컨테이너 대신 document.body를 직접 감시하고 셀렉터로 chatItem만 필터링하는 방식으로 전환. React remount에 완전히 독립적인 구조.",
      },
      {
        title: "JWT 만료로 인한 401 반복",
        cause: "JWT 만료를 치지직 access_token 수명(~1시간)에 맞춰 설정했더니, 1시간 후 모든 보호 API가 일괄 401을 반환.",
        solution: "JWT 만료를 30일 고정으로 분리(OAuth 토큰 수명과 무관하게 관리). withAuth() 래퍼로 401 수신 시 refresh 1회 자동 재시도.",
      },
      {
        title: "chrome.identity OAuth 쿠키 격리",
        cause: "chrome.identity.launchWebAuthFlow()는 일반 브라우저 세션과 쿠키를 공유하지 않아 치지직 로그인 상태를 인식하지 못함.",
        solution: "chrome.tabs.create()로 일반 탭을 직접 열어 인증. tabs.onUpdated로 /auth/success 리다이렉트 감지 후 JWT 추출.",
      },
      {
        title: "Service Worker 재시작 시 인증 탭 추적 유실",
        cause: "Manifest V3의 background service worker는 이벤트 없을 때 종료됨. 재시작 후 authTabId를 메모리에서 잃어 OAuth 완료 감지 불가.",
        solution: "authTabId를 chrome.storage.session에 보관. service worker 재시작 후에도 스토리지에서 복구하여 탭 추적 재개.",
      },
      {
        title: "tooltip이 transform 컨텍스트에 갇힘 (Web 데모)",
        cause: "position: fixed는 transform된 조상 요소가 있으면 viewport 기준이 아닌 해당 요소 기준으로 동작. 애니메이션 중인 카드 안에서 tooltip이 잘리거나 위치 이탈.",
        solution: "React createPortal로 tooltip을 document.body에 직접 마운트. transform 스택 컨텍스트를 완전히 탈출.",
      },
    ],
    stack: ["JavaScript", "Chrome Extension MV3", "Fastify", "TypeScript", "Supabase Realtime", "Next.js 15", "JWT", "Riot API"],
    architecture: {
      components: [
        {
          name: "Chrome Extension",
          color: "#6366f1",
          files: [
            {
              name: "content.js",
              desc: "치지직 페이지에 주입되는 핵심 스크립트",
              details: [
                "document.body MutationObserver로 채팅 DOM 변화 감지 (SPA remount 대응)",
                "닉네임별 클라이언트 인메모리 캐시 (5분 TTL) — 동일 닉네임 중복 요청 차단",
                "Debounce 300ms 배치 처리 — 채팅 폭발 시 요청 묶음 전송",
                "Supabase Realtime 구독 (tier_updates:{liveId}) — broadcast 수신 시 payload로 캐시 직접 갱신, API 호출 0",
                "Realtime 실패 시 자동 재연결 3회 → 60초 polling fallback",
                "Presence track — 로그인 상태면 chzzkChannelName 등록 (OBS 연동)",
              ],
            },
            {
              name: "popup.js",
              desc: "익스텐션 팝업 UI 및 API 연동",
              details: [
                "치지직 OAuth 로그인 시작 — chrome.tabs.create()로 인증 탭 열기",
                "Riot 닉네임 + 태그 입력 → 서버 조회 → LoL/TFT 티어 카드 표시",
                "티어 등록/삭제/공개설정 변경 → 서버 API 호출 (JWT 인증 헤더 포함)",
                "withAuth() 래퍼 — 401 수신 시 refresh 자동 재시도, 실패 시 재로그인 안내",
                "getLiveId() — 현재 탭 URL에서 liveId 추출해 API 요청에 포함 (Realtime broadcast 대상 특정)",
              ],
            },
            {
              name: "background.js",
              desc: "Service Worker — 인증 흐름 및 스토리지 관리",
              details: [
                "OAuth 인증 탭 생성 및 tabs.onUpdated로 /auth/success 리다이렉트 감지",
                "redirect URL에서 jwt_token 파라미터 추출 → chrome.storage.local 저장",
                "authTabId를 chrome.storage.session에 보관 — SW 재시작 후에도 탭 추적 복구",
              ],
            },
          ],
        },
        {
          name: "Fastify 서버 (Railway)",
          color: "#a855f7",
          files: [
            {
              name: "routes/chzzk/",
              desc: "치지직 연동 핵심 라우트",
              details: [
                "GET /api/chzzk/auth — 치지직 OAuth 시작, state 쿠키로 CSRF 방어",
                "GET /api/chzzk/auth/callback — 코드 교환 → DB 저장 → JWT 생성 → redirect에 포함",
                "POST /api/chzzk/tier-cache — 티어 등록 (JWT 인증) → DB upsert → LRU 무효화 → broadcast",
                "DELETE /api/chzzk/tier-cache — 삭제 (JWT 인증) → DB 삭제 → LRU 무효화 → broadcast",
                "POST /api/chzzk/auth/refresh — 치지직 토큰 갱신 + 새 JWT 발급",
              ],
            },
            {
              name: "routes/privacy/",
              desc: "공개 설정 관리",
              details: [
                "POST /api/privacy/update — is_public 변경 (JWT 인증) → LRU 무효화 → broadcast",
              ],
            },
            {
              name: "routes/tier.ts",
              desc: "공개 조회 엔드포인트 (content.js 전용)",
              details: [
                "GET /api/tier?chzzk_name= — 닉네임으로 tier_cache 조회",
                "서버 LRU 캐시 (500개, 5분 TTL) — 캐시 hit 시 DB 조회 없이 즉시 반환",
                "is_public=true 항목만 반환 — RLS와 이중 보호",
              ],
            },
            {
              name: "lib/",
              desc: "서버 공통 모듈",
              details: [
                "auth.ts — requireSelf(): JWT.sub ↔ 요청 대상 chzzkChannelId 검증, 30일 고정 만료",
                "tier-store.ts — LRU 캐시 관리, invalidateTierCache() export",
                "realtime.ts — broadcastToChannel() 서버 헬퍼, Supabase service_role로 broadcast",
              ],
            },
            {
              name: "routes/riot/",
              desc: "Riot API 프록시",
              details: [
                "API Key 서버 보관 — 클라이언트에 노출 없음",
                "LoL: 계정/소환사/리그/숙련도/매치/현재게임 조회",
                "TFT: 계정/소환사/리그/매치/현재게임 조회",
              ],
            },
          ],
        },
        {
          name: "Supabase",
          color: "#3b82f6",
          files: [
            {
              name: "PostgreSQL DB",
              desc: "4개 테이블 + RLS",
              details: [
                "users — 치지직 채널 ID/닉네임, chzzk_channel_name INDEX (채팅 조회 최적화)",
                "chzzk_tokens — 치지직 OAuth 토큰 (1:1 관계, CASCADE 삭제)",
                "riot_tokens — Riot RSO OAuth 토큰 (Riot API OAuth 승인 대기 중)",
                "tier_cache — LoL/TFT 티어 데이터, (chzzk_channel_id, game_type) UNIQUE",
                "RLS: tier_cache는 is_public=true만 anon SELECT 허용, 나머지 테이블 전체 차단",
                "서버는 service_role 키로 RLS 우회 — 쓰기는 서버 API 경유만 허용",
              ],
            },
            {
              name: "Realtime Broadcast",
              desc: "방송별 채널 기반 실시간 동기화",
              details: [
                "채널명: tier_updates:{liveId} — 같은 방송 시청자만 구독",
                "이벤트: tier_updated / tier_deleted / privacy_changed",
                "payload에 변경된 데이터 전체 포함 — 수신자가 추가 API 호출 없이 캐시 직접 갱신",
                "서버 1회 broadcast → N명 동시 수신, DB/서버 추가 부하 0",
              ],
            },
            {
              name: "Realtime Presence",
              desc: "OBS 오버레이용 시청자 추적",
              details: [
                "content.js가 SUBSCRIBED 시 chzzkChannelName을 track",
                "탭 닫기 → WebSocket 해제 → Supabase 자동 제거 (untrack 불필요)",
                "OBS 오버레이 페이지가 Presence 목록 구독 → is_public 유저만 표시",
              ],
            },
          ],
        },
        {
          name: "Web (Next.js / Vercel)",
          color: "#22c55e",
          files: [
            {
              name: "app/page.tsx (랜딩)",
              desc: "온보딩 및 기능 소개",
              details: [
                "MockChat — 실제 배지 스타일 그대로 재현, hover 툴팁 포함",
                "MockExtensionPopup — 실제 팝업 UI 인터랙션 데모",
              ],
            },
            {
              name: "app/demo/page.tsx",
              desc: "5단계 스크롤 잠금 인터랙티브 데모",
              details: [
                "치지직 연결 → Riot 연동 → 티어 등록 → 채팅 배지 → OBS 오버레이 전체 플로우 체험",
                "createPortal로 툴팁 document.body 마운트 — transform 컨텍스트 탈출",
              ],
            },
            {
              name: "app/overlay/[liveId]/page.tsx",
              desc: "OBS Browser Source 전용",
              details: [
                "mode=list: 시청자 티어 배지 + 닉네임 목록",
                "mode=stats: 티어 분포 통계 바차트",
                "배경 투명, Realtime Presence 구독으로 시청자 목록 실시간 갱신",
              ],
            },
          ],
        },
      ],
      flows: [
        {
          title: "채팅 배지 표시",
          subtitle: "MutationObserver → 3단계 캐시 → DOM 삽입",
          color: "#6366f1",
          insight: "캐시 hit 시 즉시 early return — 시청자 수가 늘어도 서버 부하 선형 증가 없음",
          rows: [
            {
              nodes: [
                { text: "채팅 DOM\n감지", type: "trigger" },
                { text: "클라이언트 캐시\n5min TTL", type: "cache" },
                { text: "Debounce\n300ms 배치", type: "cache" },
                { text: "GET /api/tier", type: "api" },
                { text: "서버 LRU\n500개 5min", type: "cache" },
                { text: "DB\ntier_cache", type: "db" },
                { text: "배지 + 툴팁\n삽입", type: "result" },
              ],
            },
          ],
        },
        {
          title: "유저 등록 + JWT 인증",
          subtitle: "Chzzk OAuth로 JWT 발급, Riot RSO로 게임 계정 연동",
          color: "#3b82f6",
          insight: "authTabId를 storage.session에 보관 — service worker 재시작 후에도 탭 추적 복구",
          rows: [
            {
              label: "Chzzk",
              nodes: [
                { text: "Connect\n버튼", type: "trigger" },
                { text: "새 탭 열기\n(tabs.create)", type: "extension" },
                { text: "Chzzk\nOAuth", type: "api" },
                { text: "서버 콜백\n코드 교환", type: "api" },
                { text: "DB\nusers 저장", type: "db" },
                { text: "JWT 생성\n(30d)", type: "api" },
                { text: "storage.local\n저장", type: "cache" },
              ],
            },
            {
              label: "Riot RSO",
              nodes: [
                { text: "Riot 연동\n버튼", type: "trigger" },
                { text: "Riot OAuth\n(RSO)", type: "api" },
                { text: "서버 콜백", type: "api" },
                { text: "riot_tokens\nDB 저장", type: "db" },
              ],
            },
          ],
        },
        {
          title: "데이터 변경 + 실시간 반영",
          subtitle: "broadcast payload 하나로 N명 동시 갱신 — 추가 API 호출 없이 payload만으로 캐시 직접 write",
          color: "#a855f7",
          insight: "핵심: 서버가 DB write 완료 시점에 변경 데이터 전체를 payload에 포함해 broadcast 1회 전송 → 구독자 N명이 payload만으로 로컬 캐시를 직접 write.",
          rows: [
            {
              label: "채널",
              nodes: [
                { text: "방송 입장", type: "trigger" },
                { text: "liveId\n추출", type: "extension" },
                { text: "tier_updates\n:{liveId} 구독", type: "realtime" },
              ],
            },
            {
              label: "변경",
              nodes: [
                { text: "변경 요청\n(JWT 포함)", type: "trigger" },
                { text: "requireSelf()\nJWT 검증", type: "api" },
                { text: "DB upsert\nLRU 무효화", type: "db" },
                { text: "broadcast\n(payload 포함)", type: "realtime" },
                { text: "구독자 N명\n수신", type: "realtime" },
                { text: "payload로\n캐시 갱신", type: "cache" },
                { text: "배지 재렌더\nAPI 호출 0", type: "result" },
              ],
            },
          ],
        },
        {
          title: "OBS Overlay",
          subtitle: "Presence + Broadcast 이중 구독 — 추가 API 호출 없이 실시간 갱신",
          color: "#22c55e",
          insight: "Presence로 초기 시청자 목록 확정, 이후 변경은 broadcast payload만으로 state 직접 갱신",
          rows: [
            {
              label: "입장 시",
              nodes: [
                { text: "Presence sync", type: "realtime" },
                { text: "GET /api/tier\n(초기화)", type: "api" },
                { text: "BadgeList /\nTierStats 렌더", type: "result" },
              ],
            },
            {
              label: "변경 시",
              nodes: [
                { text: "broadcast 수신\n(tier_updated 등)", type: "realtime" },
                { text: "viewers state\n직접 갱신", type: "cache" },
                { text: "즉시 재렌더\nAPI 호출 0", type: "result" },
              ],
            },
          ],
        },
      ],
    },
  },
  others: [
    {
      id: "bluenode",
      title: "BlueNode DAO",
      subtitle: "DAO 기여도 측정 및 보상 시스템",
      period: "2024.12 ~ 2025.05",
      type: "팀 프로젝트",
      media: [
        { type: "image" as const, src: "/DAO1.png", alt: "Epoch 기여 제출 → Admin 승인 → 보상 분배 플로우" },
      ],
      description:
        "인하대학교 블록체인 학회의 GitHub 기여 활동을 정량화하고 온체인 보상으로 연결하는 DAO 플랫폼. 학기(Epoch) 단위로 기여도를 측정하고 스마트컨트랙트로 보상을 분배.",
      myRole: [
        "Frontend 기여도 대시보드 설계 및 구현",
        "grimoirelab 데이터 파이프라인 연동",
        "Supabase 인증 / DB 스키마 설계 및 API 설계",
        "보상 스마트컨트랙트 구현 (Solidity)",
      ],
      links: {
        web: "https://wepublic-six.vercel.app/",
        githubs: [
          { label: "GitHub", href: "https://github.com/Bluenode2024/POCFE" },
        ],
      },
      highlights: [
        "grimoirelab(Perceval → ElasticSearch → Kibiter)를 활용한 GitHub 활동 데이터 파이프라인 구성",
        "기여도 정량화 + 참여도 가중치 계산 로직 설계",
        "Epoch 단위 기여 제출 → IPFS 증거 업로드 → Admin 승인 → 보상 분배 플로우 구현",
        "Next.js + Shadcn-ui 대시보드 구현",
        "Supabase 인증 / DB 스키마 설계 및 API 설계",
      ],
      stack: ["Next.js", "TypeScript", "Shadcn-ui", "Supabase", "Solidity", "ElasticSearch", "IPFS"],
    },
    {
      id: "wiw",
      title: "WiW — Who is Winner",
      subtitle: "AI 논쟁 기반 예측 마켓",
      period: "2025.03 (Mammothon Celestia Hackathon)",
      type: "해커톤 팀 프로젝트",
      media: [
        { type: "image" as const, src: "/WIW.jpg", alt: "게임 생성 → 베팅 → 결과 정산 플로우" },
        { type: "video" as const, src: "/Who%20is%20Winner.mp4" },
      ],
      description:
        "두 AI 에이전트가 토론하고 유저가 승자를 예측해 MOVE 토큰으로 베팅하는 예측 마켓. Messenger-style UI로 AI 토론을 실시간 표시.",
      myRole: [
        "Frontend UI 설계 및 구현",
        "Move 스마트컨트랙트 작성 (Movement Labs testnet 배포)",
      ],
      links: {
        githubs: [
          { label: "Frontend", href: "https://github.com/Mammothon-Celestia-hackathon/wiw-front" },
          { label: "Contract", href: "https://github.com/Mammothon-Celestia-hackathon/wiw-contract" },
        ],
      },
      highlights: [
        "논쟁 → 베팅 → 결과 정산 전체 흐름 UI 및 상태 관리 구현",
        "Messenger-style UI로 AI 토론 실시간 표시 + 베팅 인터랙션 설계",
        "(Contract) 디베이트 생성 시 AI 에이전트 정보(이름·캐릭터·주소)·토론 주제 온체인 등록, 고유 ID 관리",
        "(Contract) 베팅 발생 시 각 AI 진영 베팅 풀 실시간 업데이트 + 이벤트 emit → 프론트엔드 즉시 반영",
        "(Contract) 토론 종료 시 AI가 승자 결정 → 베팅 비율에 따라 MOVE 토큰 자동 분배",
      ],
      stack: ["React", "TypeScript", "Move", "Movement Labs", "Wagmi"],
    },
  ],
};
