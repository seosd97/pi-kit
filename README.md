# pi-kit

개인 pi 설정 패키지. 하나의 repo로 모든 머신에 동일한 pi 환경을 배포·유지한다.

## 구성

| 경로 | 내용 |
| --- | --- |
| `config/AGENTS.md` | 전역 행동 강령 (행동 원칙 + 도구 선호). setup.sh가 `~/.pi/agent/AGENTS.md`로 심볼릭 링크 |
| `prompts/plan.md` | `/plan` — 분석 후 `PLAN.md` 작성 (구현 안 함) |
| `prompts/impl.md` | `/impl` — `PLAN.md` 단계별 실행, 검증마다 체크박스 갱신 |
| `prompts/commit.md` | `/commit` — 스테이징 변경사항 컨벤션 커밋 |
| `prompts/review.md` | `/review` — 변경사항 리뷰 (버그·보안·에러처리) |
| `extensions/` | 자체 확장 + 매니페스트(`package.json` `pi.extensions`)가 `node_modules/<패키지>` 경로로 번들 확장 참조 |
| `extensions/tmux-status.ts` | tmux 상태바에 pi 실행 상태 색상 표시 (아래 참고) |
| `skills/project-memory/` | `.pi/memory/` 프로젝트 메모리 컨벤션 (아래 참고) |
| `themes/` | kit 소유 리소스 (현재 비어 있음) |
| `package.json` | pi 매니페스트 — 확장 7종 번들 |
| `package-lock.json` | 소비자 머신 설치 재현성 고정 (npm) |
| `pnpm-lock.yaml` | 개발용 lockfile (pnpm) |
| `pnpm-workspace.yaml` | pnpm 빌드 스크립트 승인 목록 (@ast-grep/cli 등) |
| `setup.sh` | 설치 스크립트 |

### 번들 확장

| 패키지 | 제공 |
| --- | --- |
| [pi-web-access](https://www.npmjs.com/package/pi-web-access) | 웹 검색·출처 확인·콘텐츠 fetch |
| [pi-lens](https://www.npmjs.com/package/pi-lens) | LSP·ast-grep 진단, 심볼·모듈 탐색 |
| [@juicesharp/rpiv-ask-user-question](https://www.npmjs.com/package/@juicesharp/rpiv-ask-user-question) | 구조화된 사용자 질문 |
| [@ff-labs/pi-fff](https://www.npmjs.com/package/@ff-labs/pi-fff) | 퍼지 파일 탐색·그렙 |
| [pi-simplify](https://www.npmjs.com/package/pi-simplify) | 코드 단순화 리뷰 |
| [pi-background-tasks](https://www.npmjs.com/package/pi-background-tasks) | 백그라운드 태스크·에이전트 위임 |
| [@firstpick/pi-themes-bundle](https://www.npmjs.com/package/@firstpick/pi-themes-bundle) | 테마 모음 |

## 설치

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
curl -fsSL https://raw.githubusercontent.com/seosd97/pi-kit/main/setup.sh | bash
```

setup.sh는 `pi install` 후 AGENTS.md를 심볼릭 링크한다. 기존 파일은 백업.

## 업데이트

- 각 머신: `pi update --extensions` — lockfile 기준 설치.
- 버전 당기기: repo에서 버전 올린 뒤 두 lockfile 동기화 후 커밋·push.

개발은 pnpm을 사용한다. 소비자 머신(`pi update --extensions`)은 npm으로 설치하므로 lockfile이 둘이다. 범위 내 버전업은 `update:packages` 스크립트가 두 lockfile을 함께 갱신한다:

```bash
pnpm run update:packages          # == pnpm update && pnpm sync:lock — pnpm-lock 갱신 + package-lock.json 동기화
git add package.json package-lock.json pnpm-lock.yaml
git commit -m "chore: 번들 확장 버전업 — <패키지> x.y.z"
git push
```

버전 범위를 넘는 major/minor 업데이트는 `pnpm update` 대신 `pnpm add <패키지>@^new.major`를 쓰고, 그 뒤에 `npm run sync:lock`으로 package-lock.json을 맞춘다. 소비자 설치에서 `node_modules/`는 pi가 clone에서 npm install로 만들므로, 매니페스트(`pi.extensions`, `pi.skills`, `pi.themes`)의 `node_modules/<패키지>` 경로는 양쪽 lockfile 모두에서 동일하게 해석된다.

## 플랜 워크플로우

1. `/plan <주제>` — 코드베이스 분석 후 `PLAN.md` 작성. 구현은 안 함.
2. `PLAN.md` 검토·수정 — 파일이라 직접 고치거나 에이전트에게 시키면 됨.
3. 새 세션에서 `/impl` — 단계를 하나씩 실행하고 검증 통과 시 체크.

엄격한 읽기 전용 분석은 alias로:

```bash
alias pi-plan='pi --tools read,grep,find,ls'
```

(이 모드에선 PLAN.md 저장도 불가 — 분석 출력을 직접 옮긴다)

코드 탐색은 내장 grep/find 대신 fff override 모드 권장: 셸에 `export PI_FFF_MODE=override`.

## 프로젝트 메모리

`/skill:project-memory` — 프로젝트별 `.pi/memory/`(인덱스 `MEMORY.md` + 주제 파일)에 사실을 기록·조회. 읽기는 작업 시작 시, 쓰기는 요청받을 때만. `.git/info/exclude`로 로컬 유지.

## tmux 상태

tmux 안에서 pi를 실행하면 상태바 색상이 실행 상태를 표시: 보라=작업중, 노랑=대기(셸·UI), 초록=완료, 파랑=컴팩션, 빨강=에러. 팬 옵션 `@pi-state`로도 읽을 수 있음. 끄려면 `PI_TMUX_STATUS=0`.

## 워크플로우

- 수정은 이 repo에서. 반영은 pi에서 `/reload`.
- `~/.pi/agent/git/` 은 pi가 받아 둔 복사본 — 직접 수정 금지.
- 확장 진입점은 `package.json` `pi.extensions`가 `node_modules/<패키지>` 경로로 직접 참조 — 각 패키지의 자체 매니페스트를 따라감. upstream이 내부 구조를 바꿔도 repo 수정 불허. 패키지 추가/제거 시에만 목록 갱신.

### 개발 (pnpm)

- 설치: `pnpm install` — `pnpm-lock.yaml` 기준.
- 빌드 스크립트가 필요한 패키지(`@ast-grep/cli`, `@google/genai`, `protobufjs`)는 `pnpm-workspace.yaml`의 `allowBuilds`에 등록돼 있다. 새로 추가되는 패키지가 빌드 스크립트를 요구하면 pnpm이 경고를 출력하므로 그때 `allowBuilds`에 추가.
- `pnpm-lock.yaml`과 `package-lock.json`을 모두 커밋한다. pnpm은 개발 환경(node_modules 심링크 레이아웃), npm은 소비자 머신의 pi 설치를 담당한다.

## settings.json

머신 로컬로만 관리. repo에 넣지 않는다.

```json
{
  "defaultProvider": "zai-coding-cn",
  "defaultModel": "glm-5.3",
  "defaultThinkingLevel": "max",
  "theme": "tokyo-night"
}
```
