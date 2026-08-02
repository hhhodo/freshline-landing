# FRESHLINE — F&B·유통 노코드 주문/재고 관리 랜딩페이지

**Live: https://hhhodo.github.io/freshline-landing/**

F&B·유통(식품/외식/유통) 브랜드를 위한 노코드 주문·재고 관리 페이지 빌더의 원페이지 랜딩입니다.
브랜드명(FRESHLINE)은 영어, 본문 콘텐츠는 한글로 작성했으며, 모든 이미지 슬롯은 실사진 대신
`#d9d9d9`(디자인 키트 `--color-placeholder` 그대로) 플레이스홀더로 처리했습니다.

## 레퍼런스 취득 경로

**최초 빌드** 시점에는 Figma MCP(`get_design_context`)가 인증되지 않아 사용할 수 없었습니다(로그인 필요).
그래서 치트시트의 레퍼런스 우선순위(① Figma MCP → ② Screenshot → ③ Website → ④ 기본값)에 따라 2순위인
사용자가 첨부한 **Figma 디자인 스크린샷**을 시각 판정해 그리드를 잡았습니다.

**이후 같은 세션 내에서 Figma MCP 인증이 완료**되어, 원본 URL
(`fileKey=BrVaTxFSnaAlv6IT2ZRvhs`, `node-id=22:3195`)을 `get_design_context`로 **실측 재검증**했습니다.
스크린샷 판정과 실측값이 갈린 두 곳을 실측값 기준으로 수정했습니다:

| 항목 | 1차(스크린샷 판정) | 실측값(get_design_context) | 최종 판정 |
|---|---|---|---|
| 업무효율화(Ops) 섹션 | `5-7`로 추정 | 좌 `575px` : 우 `526px` (1280px 컨테이너 기준, ≈52:48) | `6-6`으로 수정 |
| 케이스 카드(shoeprize) ×3 | `4-8` 계열로 추정, 세로 반복 금지 규칙에 따라 `4-8/5-7/4-8` 교차 | 3행 모두 `flex-[1_0_0]` **완전 균등 분할**, 3행 동일 | `6-6 × 3`으로 수정. 치트시트의 "동일 스플릿 세로 연속 금지" 규칙보다 **실측 그리드 값을 우선**함(그리드 정확성이 최우선 기준) |

아래는 실측 후에도 유지된 판정입니다:

| 항목 | 관찰값 | 판정 |
|---|---|---|
| 히어로 구성 | 중앙 정렬 타이틀+버튼, 하단 풀블리드 3D 아이콘 밴드 | 컬럼 분할 아님 — 중앙정렬 + full-bleed 밴드 |
| "똑똑하게" 섹션 | 중앙 다크 카드(폰 목업) + 좌우 원형 아이콘 2개 | 컬럼 분할 아님 — 중앙 단일 비주얼 |
| 무료 시작(Nocode) 섹션 | 실측: 카드 3장 각 `w-384px`, 컨테이너 `1200px`, 간격 `16px` — 균등 3열 | `4-4-4` |
| FAQ | 아코디언처럼 보이는 리스트, `+` 아이콘 | 치트시트 하드룰(아코디언 금지)에 따라 **접히지 않는 정적 리스트**로 구현(질문+답변 항상 노출) |
| 버튼 | 실측: `rounded-[33554400px]`(완전 필) 다수, 카드/이미지 `16~40px` 라운드 | `button-radius=round`, `image-radius=round`, `card-radius=round` |
| 보더 | 카드 구분이 배경색 차이뿐, 선 거의 없음 | `border=borderless` |
| 색상 | 실측: 원본은 `#3e88ff`/`#0145b3` 계열 파란색을 브랜드 액센트로 적극 사용 | 디자인 키트(`styles.css`)에 브랜드 색 토큰이 없어 **의도적으로 그레이스케일 `color=dominant`로 단순화**했습니다(임의 hex 발명 금지 원칙 우선). 이는 그리드 값과 달리 색상은 우선순위가 낮다는 판단에 따른 것이며, 원본과의 명시적 차이점으로 기록합니다. |

## Variant

```
variant: typo=medium / image=high / color=dominant / image-radius=round /
         card-radius=round / button-radius=round / border=borderless /
         button-style=solid+outline / fw=700/400 / spacing=space-11
```

## 레이아웃 — 그리드 값

```
Header    — full-bleed (sticky nav)
Hero      — full-bleed — 중앙정렬(container--narrow) + full-bleed 이미지 밴드
Showcase  — full-bleed, 중앙 단일 비주얼(컬럼 분할 아님 — 레퍼런스가 3분할이 아닌 중앙 카드+사이드 아이콘 구성이라 아래 Nocode 섹션의 4-4-4와 세로 연속되지 않도록 의도적으로 분리)
Nocode    — 4-4-4 (카드 3장 균등, 실측: 384px×3 / 1200px 컨테이너)
Ops       — 6-6 (실측: 575px:526px ≈ 52:48 — 좌 텍스트+뱃지 / 우 이미지)
Cases     — 6-6 × 3행 (실측: flex-[1_0_0] 완전 균등, 3행 동일 — 아코디언 hidden 규칙과 달리
             "동일 스플릿 세로 연속 금지"는 소프트 가이드이므로 실측 그리드 값을 우선함)
FAQ       — container--narrow, 정적 리스트(아코디언 금지)
Footer    — full-bleed, dark, 중앙 정렬 CTA + 대형 워드마크(컬럼 분할 아님)
```

## 검증

Figma `get_design_context` 실측으로 Ops(`5-7`→`6-6`)와 Cases(`4-8/5-7/4-8`→`6-6×3`) 두 곳의 그리드 판정을
수정했습니다. 수정 후 로컬 미리보기에서 `getComputedStyle`로 재확인한 `grid-column` 값은
Nocode `1/5, 5/9, 9/13`, Ops `1/7, 7/13`, Cases 3행 모두 `1/7, 7/13`로, 선언한 스플릿과 정확히 일치합니다.

로컬 `file://` 미리보기에서는 이 세션 Browser 도구의 알려진 한계로 두 번째 스타일시트(`site.css`)의
스타일이 스크린샷에 반영되지 않는 현상이 있었습니다(참고: 과거 FORGEX 빌드에서도 동일 현상 확인).
`fetch('css/site.css')`로 파일 내용이 정상임을 확인했습니다. 실제 배포 후에는 GitHub Pages(실제 HTTP)에서
정상 렌더링됨을 확인했습니다.
