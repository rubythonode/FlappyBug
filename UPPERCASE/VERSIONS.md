1.2.4.2 (2014. 2. 13)
- 기본 커넥션 접속 제한 시간 10초에서 5초로 단축
- LOOP 생성시 하나의 func만 넘어오면 interval로 지정

1.2.4 (2014. 2. 13)
- DOM 메모리 누수 해결
- DOM 제거시 Event 실행 중단
- Database API 변경
- 부팅 로그, 사용자 접속 로그 자동저장 기능 제거 (불필요한 부하)
- 데이터베이스를 사용하지 않을 경우 SERVER_CONFIG.isNotUsingDB = true 설정 추가

1.2.3 (2014. 2. 6)
- SOUND isLoop 추가
- SOUND stop 추가
- word-break 버그 제거
- DOM on 추가
- 모바일에서 mouseover/mouseout 지원

1.2.2 (2014. 1. 30)
- 링크 기본 색상을 #fff로 고정
- LAYER 크기 배율 버그 해결
- 안드로이드 2.x 버젼에서 overflow scroll 문제 해결
- 기본 스타일 변경

1.2.1 (2014. 1. 24)
- Android < 3 에서 overflow scroll 버그 해결 솔루션 제작
- MODEL에서 create시 특정 ROOM으로 broadcast하는 기능 제작
- match view에서 box name을 인식하는 버그 해결
- HD 화면에서 IMG load 이벤트가 두번 발생되는 버그 해결, width 두배로 인식되는 문제 해결
- LAYER_SCREEN 크기 배율 설정 기능 제작 
- DELAY 추가
