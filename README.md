# pi-kit

개인 pi 설정 패키지. 하나의 repo로 모든 머신에 동일한 pi 환경을 배포·유지한다.

## 구성

| 경로 | 내용 |
| --- | --- |
| `config/AGENTS.md` | 전역 행동 강령 (행동 원칙 + 도구 선호). setup.sh가 `~/.pi/agent/AGENTS.md`로 심볼릭 링크 |
| `prompts/plan.md` | `/plan` — 분석 후 `PLAN.md` 작성 (구현 안 함) |
| `prompts/impl.md` | `/impl` — `PLAN.md` 단계별 실행, 검증마다 체크박스 갱신 |
| `extensions/` `skills/` `themes/` | kit 소유 리소스 (현재 비어 있음) |
| `package.json` | pi 매니페스트 — 확장 7종 번들 |
| `package-lock.json` | 설치 재현성 고정 |
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
- 버전 당기기: repo에서 `npm update <패키지>` 후 lockfile 커밋·push.

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

## 워크플로우

- 수정은 이 repo에서. 반영은 pi에서 `/reload`.
- `~/.pi/agent/git/` 은 pi가 받아 둔 복사본 — 직접 수정 금지.
- 확장 진입점(`node_modules/...`)은 upstream 구조 변경 시 깨질 수 있음 — 매니페스트와 함께 점검.

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
