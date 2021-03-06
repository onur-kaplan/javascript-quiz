"use stict";
let choisesAnsData,
  quizItemTemplate = "",
  quizItemContainer = document.querySelector('.quiz-item-container'),
  quizChoicesContainer = document.querySelector('.answer-choices-box'),
  selectedAnswerResult = document.querySelector('.selected-answer-result'),
  questionTitle = document.querySelector('.question-title'),
  startQuiz = document.querySelector('.start-to-quiz'),
  userPointBox = document.querySelector('.user-point'),
  resultModal = document.querySelector('#resultModal'),
  showResult = document.querySelector('#show-result'),
  showResultContainer = document.querySelector('.result-container'),
  timerBox = document.querySelector("#count-down");

let allQuestionsData = [
  {
    questionID: 1,
    question: "Türkiye\'nin Başkenti Neresidir?",
    answers: [
      { opC: "a", opT: "Ordu" },
      { opC: "b", opT: "Ankara" },
      { opC: "c", opT: "İstanbul" },
      { opC: "d", opT: "Mersin" }
    ]
  },
  {
    questionID: 2,
    question: "Ani Harabeleri Hangi İlimizdedir?",
    answers: [
      { opC: "a", opT: "Zonguldak" },
      { opC: "b", opT: "Manisa" },
      { opC: "c", opT: "Nevşehir" },
      { opC: "d", opT: "Kars" }
    ]
  },
  {
    questionID: 3,
    question: "Peri Bacaları Hangi İlimizdedir?",
    answers: [
      { opC: "a", opT: "Erzurum" },
      { opC: "b", opT: "Edirne" },
      { opC: "c", opT: "Kırklareli" },
      { opC: "d", opT: "Nevşehir" }
    ]
  },
  {
    questionID: 4,
    question: "Topkapı Sarayı Nerededir?",
    answers: [
      { opC: "a", opT: "İstanbul" },
      { opC: "b", opT: "Antalya" },
      { opC: "c", opT: "Burdur" },
      { opC: "d", opT: "Bursa" }
    ]
  },
  {
    questionID: 5,
    question: "Türkiye Cumhuriyeti'nin Kurucusus Kimdir?",
    answers: [
      { opC: "a", opT: "Kazim Karabekir" },
      { opC: "b", opT: "İsmet İnönü" },
      { opC: "c", opT: "Mustafa Kemal Atatürk" },
      { opC: "d", opT: "Mehmet Akif Ersoy" }
    ]
  }
];

let correctAnswers = [
  {
    questionID: 1,
    correctAnswer: "b"
  },
  {
    questionID: 2,
    correctAnswer: "d"
  },
  {
    questionID: 3,
    correctAnswer: "d"
  },
  {
    questionID: 4,
    correctAnswer: "d"
  },
  {
    questionID: 5,
    correctAnswer: "c"
  }
];

let selectedData = [];

let unitePoint = 100 / allQuestionsData.length;

function renderToData() {
  allQuestionsData.map(questions => {
    quizItemTemplate += `<div class="card answer-item-box ">
    <button style="animation-delay:${questions.questionID / 10}s" class="question-item-btn btn btn-dark btn-lg btn-block mb-1 rounded-0 text-left flipInX" type="button" data-toggle="collapse" data-target="#q-${questions.questionID}">
      <span class="badge badge-light mr-2">${questions.questionID} </span> ${questions.question}
    </button>
    <div id="q-${questions.questionID}" class="collapse" data-parent="#accordionExample">
      <div class="card-body answer-choices-box">
          ${
      questions.answers.map(items =>
        `
        <div class="d-flex align-items-center mb-3">
          <input type="radio" id="op-${questions.questionID}-${items.opC}" name="customRadio" class="mr-3" 
          onchange="setAnswer('${questions.questionID}', '${items.opC}', '${items.opT}')">
          <label class="mb-0 w-100 alert alert-secondary" for="op-${questions.questionID}-${items.opC}">
          <span class="badge badge-light mr-2">${items.opC} </span>
          ${items.opT}</label>
        </div>
        `
      ).join("")
      }
      </div>
    </div>
    </div>`;
  });
  quizItemContainer.innerHTML = quizItemTemplate;
}

startQuiz.addEventListener("click", function () {
  this.classList.toggle("d-none");
  questionTitle.style.display = "block";
  renderToData();
  timer(1, 30);
});

function setAnswer(id, sign, name) {
  let newObj = { answerID: parseInt(id), answerSign: sign, answerName: name, correctSign: false };
  if (selectedData.filter(item => item.answerID === parseInt(id)).length === 0) {
    selectedData.push(newObj);
  }
  else {
    let answerValues = selectedData.filter(item => item.answerID === newObj.answerID)[0];
    answerValues.answerSign = sign;
    answerValues.answerName = name;
    answerValues.correctSign = false;
  }

  correctAnswers.filter(item => item.questionID === parseInt(id))
    .filter(fin => {
      if (fin.correctAnswer === sign) {
        selectedData.filter(item => item.answerID === newObj.answerID)[0].correctSign = true;
      }
    });

  // All questions are solved controler
  selectedData.length === allQuestionsData.length ? showResultContainer.style.display = "block" : "none";

}

// Show ressult fire
showResult.addEventListener("click", function () {
  let selectedAnswersTemplate = "";
  selectedData.sort(function (a, b) {
    return a.answerID - b.answerID;
  });

  selectedData.map(item => {
    selectedAnswersTemplate += `
        <div class="alert alert-${item.correctSign === true ? "success" : "danger"}">
          <span class="badge badge-light mr-2">${item.answerID}. Question - ${item.answerSign.toUpperCase()} </span> 
          ${item.correctSign === true ? "<span class='badge badge-success'>True</span>" : "<span class='badge badge-danger'>False</span>"}
          ${item.answerName}
        </div>
    `;
  });
  
  selectedAnswerResult.innerHTML = selectedAnswersTemplate;

  let totapPoint = selectedData.filter(trueVal => trueVal.correctSign === true).reduce((calc) => {
    return calc + unitePoint;
  }, 0);

  userPointBox.innerHTML = totapPoint;

  setQuestionsDisabled();
  clearInterval(timerFire);
  hideAllCollapse();
});



// Timer
let timerFire;
function timer(minute, second) {
  timerFire = setInterval(contDown, 1000);
  function contDown() {
    second--;
    let currentTime = minute + ":" + (second < 10 ? "0" : "") + second;
    timerBox.innerHTML = currentTime;
    if (second === 0) {
      if (minute > 0 && second === 0) {
        minute--;
        second = 60;
      } else {
        clearInterval(timerFire);
        setQuestionsDisabled();
        showResult.click();
        hideAllCollapse();
      }
    }
  }
}

// If the time is over all question items are disabled
function setQuestionsDisabled() {
  let questionItemBtn = document.querySelectorAll('.question-item-btn');
  questionItemBtn.forEach(function (item) {
    item.setAttribute("disabled", "true");
  });
}

// When finish quiz, hide all collapse
function hideAllCollapse() {
  let allCollapse = document.querySelectorAll('.collapse');
  allCollapse.forEach(function (item) {
    item.classList.remove("show");
  });
}














