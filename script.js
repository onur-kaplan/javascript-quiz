"use stict";
let choisesAnsData = [];
let quizItemTemplate = "";
let answersTemplate = "";
let quizItemContainer =  document.querySelector('.quiz-item-container');
let quizChoicesContainer =  document.querySelector('.answer-choices-box');
let  allQuestionsData = [
  {
    questionID: 1,
    question: "Türkiye\'nin Başkenti Neresidir?",
    answers:[
        {opC: "a", opT: "Ordu"},
        {opC: "b", opT: "Ankara"},
        {opC: "c", opT: "İstanbul"},
        {opC: "d", opT: "Mersin"}
    ]
  },
  {
    questionID: 2,
    question: "Ani Harabeleri Hangi İlimizdedir?",
    answers:[
        {opC: "a", opT: "Zonguldak"},
        {opC: "b", opT: "Manisa"},
        {opC: "c", opT: "Nevşehir"},
        {opC: "d", opT: "Kars"}
    ]
  },
  {
    questionID: 3,
    question: "Peri Bacaları Hangi İlimizdedir?",
    answers:[
        {opC: "a", opT: "Erzurum"},
        {opC: "b", opT: "Edirne"},
        {opC: "c", opT: "Kırklareli"},
        {opC: "d", opT: "Nevşehir"}
    ]
  },
  {
    questionID: 4,
    question: "Topkapı Sarayı Nerededir?",
    answers:[
        {opC: "a", opT: "İstanbul"},
        {opC: "b", opT: "Antalya"},
        {opC: "c", opT: "Burdur"},
        {opC: "d", opT: "Bursa"}
    ]
  }
];

let rightAnswers = [
  {
    questionID: 1,
    right: "b"
  },
  {
    questionID: 2,
    right: "d"
  },
  {
    questionID: 3,
    right: "d"
  },
  {
    questionID: 4,
    answers: "d"
  }
];


allQuestionsData.map(questions => {
  quizItemTemplate += `<div class="card answer-item-box">
  <button class="btn btn-dark btn-lg btn-block mb-1 rounded-0 text-left" type="button" data-toggle="collapse" data-target="#q-${questions.questionID}">
    <span class="badge badge-light mr-2">${questions.questionID} </span> ${questions.question}
  </button>
  <div id="q-${questions.questionID}" class="collapse" data-parent="#accordionExample">
    <div class="card-body answer-choices-box">
        ${
          questions.answers.map(items => 
            `
            <div class="d-flex align-items-center mb-3">
              <input type="radio" id="op-${questions.questionID}-${items.opC}" name="customRadio" class="mr-3">
              <label class="mb-0 w-100 alert alert-secondary" for="op-${questions.questionID}-${items.opC}">${items.opT}</label>
            </div>
            `
          ).join("")
        }
    </div>
  </div>
  </div>`
});

quizItemContainer.innerHTML = quizItemTemplate;



