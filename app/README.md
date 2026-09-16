# 심사 콘솔 프로토타입

규칙이 실제로 도는 프로토타입입니다. 목 데이터로 브라우저 안에서만 동작하고 서버가 없습니다.

```bash
npm install
npm run dev      # 개발 서버
npm test         # 규칙 엔진 테스트 13개
npm run build    # 정적 빌드
```

## 구조

| 경로 | 내용 |
|---|---|
| `src/domain/policy.ts` | 접수 시각으로 적용 정책을 정한다. 이 제품의 단일 원칙 |
| `src/domain/rules.ts` | 판정 순서 5단계, 중복 후보, 선행 건 차단, 한도 절삭 |
| `src/domain/apply.ts` | 확정·보완 요청·재분류·중복 판정의 상태 전이 |
| `src/domain/rules.test.ts` | 위 규칙을 사례로 검증하는 테스트 |
| `src/data/seed.ts` | 제보 14건과 정책 v1·v2 |
| `src/ui/` | 마스터·디테일 큐, 심사 상세, 정책 4단계 |

## 링크로 상태 열기

`#/app?id=1063` 은 그 건을 연 상태로, `#/app?tab=policy` 는 정책 화면으로 시작합니다.
