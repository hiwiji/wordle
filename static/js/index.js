let index = 0;
// let은 수정 가능한 변수
let attempts = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    // css 클래스 추가
    div.classList.add("gameoverBox");
    // div.style =
    //    "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:40vh; width: 200px; background-color:white;";
    document.body.appendChild(div);
  };

  const nextLine = () => {
    if (attempts === 6) return gameover();
    attempts += 1;
    index = 0;
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;

    // 서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    // await : 서버에서 서버로 요청을 보낸다음에 그거로 응답이 올 때까지 기다리는 구문
    // await 안넣으면 요청보내고 응답을 아직 안왔는데 다음코드가 실행됨

    const 정답 = await 응답.json();
    // json : javascript object notation 자바스크립트에 맞는 포맷으로 바꿔준다
    // json으로 바꾸는데 시간이 조금 걸리기 때문에 여기도 await을 쓴다

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      );

      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];

      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.backgroundColor = "#6AAA64";
        block.style.borderblockstyle = "1px solid black";
      } else if (정답.includes(입력한_글자))
        block.style.backgroundColor = "#C9B458";
      else block.style.backgroundColor = "#787C7E";

      block.style.color = "white";
    }

    if (맞은_갯수 === 5) gameover();
    else nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
      // 이전블럭 지우기
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handleKeydown = (event) => {
    // 값을 반환하고 함수 밖으로 나온다. 밑에 함수가 실행이 안됨.

    const key = event.key.toUpperCase(); // 키 입력시 대문자로 입력
    const keyCode = event.keyCode;

    //thisBlock 파라미터화 하기
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );

    //글자 지우기 backspace 기능
    if (event.key === "Backspace") handleBackspace();
    // 글자 채우면 다음줄로 넘어가기 (엔터)
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
      // 키보드 abcde를 아스키코드화 하기
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index++;
      // 모두 같은 표현이라 볼 수 있음
      //index += 1;
      //index = index + 1;
    }
  };

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분}:${초}`;
    }

    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", handleKeydown);
}

appStart();
