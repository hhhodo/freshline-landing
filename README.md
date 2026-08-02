# FRESHLINE — F&B·유통 노코드 주문/재고 관리 랜딩페이지

**Live: https://hhhodo.github.io/freshline-landing/**

F&B·유통(식품/외식/유통) 브랜드를 위한 노코드 주문·재고 관리 페이지 빌더의 원페이지 랜딩입니다.
브랜드명(FRESHLINE)은 영어, 본문 콘텐츠는 한글로 작성했으며, 모든 이미지 슬롯은 실사진 대신
`#d9d9d9`(디자인 키트 `--color-placeholder` 그대로) 플레이스홀더로 처리했습니다.

## 레퍼런스 취득 경로

이번 세션에서는 Figma MCP(`get_design_context`)가 인증되지 않아 사용할 수 없었습니다(로그인 필요).
치트시트의 레퍼런스 우선순위(① Figma MCP → ② Screenshot → ③ Website → ④ 기본값)에 따라, 사용자가
채팅에 직접 첨부한 **Figma 디자인 스크린샷**(코딩 교육 SaaS 원페이지)을 2순위 레퍼런스로 실측·분석해
그리드·비율·구성을 그대로 이식하고, 브랜드명·카피·업종만 F&B·유통 테마로 교체했습니다.

| 항목 | 스크린샷 관찰값 | 판정 |
|---|---|---|
| 히어로 구성 | 중앙 정렬 타이틀+버튼, 하단 풀블리드 3D 아이콘 밴드(좌우 노트/링크 카드) | 컬럼 분할 아님 — 중앙정렬 + full-bleed 밴드 |
| "똑똑하게" 섹션 | 중앙 다크 카드(폰 목업) + 좌우 원형 아이콘 2개, 3열 그리드 아님 | 컬럼 분할 아님 — 중앙 단일 비주얼 |
| 무료 시작 섹션 | 3장 카드(링크추가 / 0원 / 만들고 끝이 아니에요), 균등 3열 | `4-4-4` |
| 업무효율화 섹션 | 좌측 텍스트+뱃지 리스트, 우측 체크리스트 앱 목업 | `5-7` |
| 케이스 카드(shoeprize) ×3 | 좌 정사각 이미지 + 우 뱃지·헤딩·본문·버튼, 3회 반복 | `4-8` 계열 — 동일 스플릿 세로 연속 금지 규칙에 따라 `4-8 / 5-7 / 4-8`로 교차 |
| FAQ | 아코디언처럼 보이는 리스트, `+` 아이콘 | 치트시트 하드룰(아코디언 금지)에 따라 **접히지 않는 정적 리스트**로 구현(질문+답변 항상 노출) |
| 버튼 | 알약형 솔리드(진한 배경) | `button-radius=round`, `button-style=solid+outline` |
| 카드/이미지 코너 | 전반적으로 큰 라운드 | `image-radius=round`, `card-radius=round` |
| 보더 | 카드 구분이 배경색 차이뿐, 선 없음 | `border=borderless` |
| 색상 | 그레이스케일 + 진한 다크 블록(푸터 CTA) | `color=dominant`(디자인 키트 그레이스케일 토큰만 사용, 브랜드 원색 없음) |

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
Nocode    — 4-4-4 (카드 3장 균등)
Ops       — 5-7 (좌 텍스트+뱃지 / 우 체크리스트 목업)
Cases     — 4-8 / 5-7 / 4-8 (동일 스플릿 세로 연속 금지 규칙에 맞춰 3개 케이스 로우를 교차)
FAQ       — container--narrow, 정적 리스트(아코디언 금지)
Footer    — full-bleed, dark, 중앙 정렬 CTA + 대형 워드마크(컬럼 분할 아님)
```

동일한 스플릿이 연속 섹션에서 반복되지 않도록 배치했습니다(Nocode의 `4-4-4`는 앞뒤로 컬럼 분할이 아닌
Showcase/Ops와 인접해 있고, Cases 내부의 `4-8/5-7/4-8`도 서로 연속 반복되지 않습니다).

## 검증

로컬 `file://` 미리보기에서는 이 세션 Browser 도구의 알려진 한계로 두 번째 스타일시트(`site.css`)의
스타일이 스크린샷에 반영되지 않는 현상이 있었습니다(참고: 과거 FORGEX 빌드에서도 동일 현상 확인).
`fetch('css/site.css')`로 파일 내용이 정상임을 확인했고, `getComputedStyle`로 각 섹션의
`grid-column` 값이 선언한 스플릿과 정확히 일치함(`1/5,5/9,9/13`, `1/6,6/13`, `1/5,5/13`·`1/6,6/13`·`1/5,5/13`)을
DOM 레벨에서 확인했습니다. 실제 배포 후에는 GitHub Pages(실제 HTTP)에서 정상 렌더링됩니다.
