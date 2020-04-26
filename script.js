let allQuestionsData = [
    {
        questionID: 1,
        question: "Türkiye\'nin Başkenti Neresidir?",
        answers: [
            {opC: "a", opT: "Ordu"},
            {opC: "b", opT: "Ankara"},
            {opC: "c", opT: "İstanbul"},
            {opC: "d", opT: "Mersin"}
        ]
    },
    {
        questionID: 2,
        question: "Ani Harabeleri Hangi İlimizdedir?",
        answers: [
            {opC: "a", opT: "Zonguldak"},
            {opC: "b", opT: "Manisa"},
            {opC: "c", opT: "Nevşehir"},
            {opC: "d", opT: "Kars"}
        ]
    },
    {
        questionID: 3,
        question: "Peri Bacaları Hangi İlimizdedir?",
        answers: [
            {opC: "a", opT: "Erzurum"},
            {opC: "b", opT: "Edirne"},
            {opC: "c", opT: "Kırklareli"},
            {opC: "d", opT: "Nevşehir"}
        ]
    },
    {
        questionID: 4,
        question: "Topkapı Sarayı Nerededir?",
        answers: [
            {opC: "a", opT: "İstanbul"},
            {opC: "b", opT: "Antalya"},
            {opC: "c", opT: "Burdur"},
            {opC: "d", opT: "Bursa"}
        ]
    },
    {
        questionID: 5,
        question: "Türkiye Cumhuriyeti'nin Kurucusus Kimdir?",
        answers: [
            {opC: "a", opT: "Kazim Karabekir"},
            {opC: "b", opT: "İsmet İnönü"},
            {opC: "c", opT: "Mustafa Kemal Atatürk"},
            {opC: "d", opT: "Mehmet Akif Ersoy"}
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

(function (allQuestionsData, correctAnswers) {
    "use stict";
    let quizItemContainer,
        quizChoicesContainer,
        selectedAnswerResult,
        questionTitle,
        userPointBox,
        resultModal,
        showResult,
        showResultContainer,
        timerBox;

    let selectedData = [];
    let unitePoint = 100 / allQuestionsData.length;

    function init() {
        // insert main conent
        document.querySelector('#main-container').innerHTML = document.querySelector('#mainBodyTemplate').innerHTML;

        quizItemContainer = document.querySelector('.quiz-item-container');
        quizChoicesContainer = document.querySelector('.answer-choices-box');
        selectedAnswerResult = document.querySelector('.selected-answer-result');
        questionTitle = document.querySelector('.question-title');
        userPointBox = document.querySelector('.user-point');
        resultModal = document.querySelector('#resultModal');
        showResult = document.querySelector('#show-result');
        showResultContainer = document.querySelector('.result-container');
        timerBox = document.querySelector("#count-down");

        // start quiz button
        document.querySelector('.start-to-quiz').addEventListener("click", function () {
            this.classList.toggle("d-none");
            questionTitle.style.display = "block";
            renderToData();
            timer(1, 30);
        });
    }

    function renderToData() {
        var questionTemplate = document.querySelector('#questionTemplate').innerHTML;
        var answerTemplate = document.querySelector('#answerTemplate').innerHTML;
        var str = '';
        allQuestionsData.forEach(function (question) {
            var questionElements = '';
            question.answers.forEach(function (answer) {
                questionElements += answerTemplate
                    .replace(/__QUESTION_ID__/g, question.questionID)
                    .replace(/__opC__/g, answer.opC)
                    .replace(/__opT__/g, answer.opT);
            });
            str += questionTemplate
                .replace(/__QUESTION_ID__/g, question.questionID)
                .replace(/__QUESTION_ANIMATION_DELAY__/g, parseInt(question.questionID) / 10)
                .replace(/__QUESTION_NAME__/g, question.question)
                .replace(/__ANSWERS__/g, questionElements);
        });

        quizItemContainer.innerHTML = str;
        // event listener
        eventListeners();
    }

    function eventListeners() {
        // radio i puts
        document.querySelectorAll('input[type=radio][name="customRadio"]')
            .forEach(radio => radio.addEventListener('change', () => {
                setAnswer(
                    radio.getAttribute('data-questionID'),
                    radio.getAttribute('data-opC'),
                    radio.getAttribute('data-opT')
                );
            }));

        // Show ressult fire
        showResult.addEventListener("click", function () {
            let selectedAnswersTemplate = document.querySelector('#results').innerHTML;
            selectedData.sort(function (a, b) {
                return a.answerID - b.answerID;
            });
            selectedAnswerResult.innerHTML = selectedData.reduce(function (carry, item) {
                return carry + selectedAnswersTemplate
                    .replace(/__correctSign__/g, item.correctSign === true ? "success" : "danger")
                    .replace(/__answerID__/g, item.answerID)
                    .replace(/__answerSign__/g, item.answerSign.toUpperCase())
                    .replace(/__correctSignBadge__/g, item.correctSign === true ? "<span class='badge badge-success'>True</span>" : "<span class='badge badge-danger'>False</span>")
                    .replace(/__answerName__/g, item.answerName);
            }, '');

            userPointBox.innerHTML = selectedData
                .filter(trueVal => trueVal.correctSign === true)
                .reduce((calc) => {
                    return calc + unitePoint;
                }, 0);

            setQuestionsDisabled();
            clearInterval(timerFire);
            hideAllCollapse();
        });
    }

    function setAnswer(id, sign, name) {
        let newObj = {answerID: parseInt(id), answerSign: sign, answerName: name, correctSign: false};
        if (selectedData.filter(item => item.answerID === parseInt(id)).length === 0) {
            selectedData.push(newObj);
        } else {
            let answerValues = selectedData.filter(item => item.answerID === newObj.answerID)[0];
            answerValues.answerSign = sign;
            answerValues.answerName = name;
            answerValues.correctSign = false;
        }

        correctAnswers
            .filter(item => item.questionID === parseInt(id))
            .filter(fin => {
                if (fin.correctAnswer === sign) {
                    selectedData.filter(item => item.answerID === newObj.answerID)[0].correctSign = true;
                }
            });

        // All questions are solved controler
        selectedData.length === allQuestionsData.length ? showResultContainer.style.display = "block" : "none";
    }

// Timer
    let timerFire;

    function timer(minute, second) {
        timerFire = setInterval(contDown, 1000);

        function contDown() {
            second--;
            timerBox.innerHTML = minute + ":" + (second < 10 ? "0" : "") + second;
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

//
    init();
})(allQuestionsData, correctAnswers)

