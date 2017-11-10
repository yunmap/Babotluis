## Microsoft Student Partner, team "BABOT"
### 2차 세미나 실습 먼저 진행해보기.

0. 한국어를 적용하기 위해 bot을 만들 때 basic 모델을 선택해야 한다. (language understanding 선택하면 안됨. LU는 영어로 자동 설정되어 있어서 충돌이 발생한다.)
1. node js install
2. npm init
3. package 설치 (botbuilder, restify, request, dotenv-extended)
```
npm install --save ***
```
4. LUIS publish key를 등록
5. node app.js 로 local에서 실행
6. Bot emulator 이용하여 local에서 test
7. 만약 online code editor 이용중이면 online shell에 3번 과정 꼭 실행해야함.
8. online code editor엔 AppID, PW 등록해야한다. (local에선 null)