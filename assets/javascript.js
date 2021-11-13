
const questions = [
    { // 1
        question: "Are semicolons required in Javascript?",
        choices: ["Yes", "No"],
        answer: 1
    },
    { // 2
        question: "What is the correct way to declare an immutable variable?",
        choices: [
            "let isOxygenRequired", 
            "const bool isOxygenRequired;", 
            "const isOxygenRequired",
            "var isOxygenRequired", 
            ],
        answer: 2
    },
    { // 3
        question: "Javascript is a strictly typed language",
        choices: [
            "True",
            "False"
        ],
        answer: 1
    },
    { // 4
        question: "Which ones of this is not a primitive data type?",
        choices: [
            "number",
            "string",
            "null",
            "date",
            "object"
        ],
        answer: 3,
    },
    { // 5
        question: "The operator '+=' is equivelant to what?",
        choices: [
            "a + b = a",
            "a += 1",
            "a = a + b",
            "if(a === a + b)"

        ],
        answer: 2
    },
    { // 6
        question: "An array is what kind of datastructure?",
        choices: [
            "tree",
            "list",
            "linked-list"
        ],
        answer: 1
    },
    { // 7
        question: "What is DOM?",
        choices: [
            "Mispelling of doom",
            "DOMinator",
            "Document Object Model",
            "Dog of the Month"
        ],
        answer: 2
    }, 
    { // 8
        question: "What is a function",
        choices: [
            "A feature of Javascript",
            "Math operation",
            "A self-contained unit of code",
        ],
        answer: 2
    },
    { // 9
        question: "Javascript was invented by Netscape, who is now known as",
        choices: [
            "Google",
            "Mozilla",
            "Apple",
            "Microsoft"
        ],
        answer: 1 
    },
    { // 10
        question: "What is the difference between 'let' and 'var'?",
        choices: [
            "'let' is the modern way, we shouldn't question it",
            "'let' has more strict scoping rules than 'var'",
            "'let' sounds better than 'var'",
            "They're both the same"
        ],
        answer: 1
    }
];

const LIST_ITEM_CLASS_DEFAULT = "choice list-group-item list-group-item-action";
const QUIZ_TIME = 60

let current_question = 0;
let selected_choice = -1;
let timer = null;
let time = QUIZ_TIME;

//
// Populates the quiz div with the question and choices
//
const render_question = () => {
    let current_q = questions[current_question];
    let choice_list = document.getElementById('choices');

    document.getElementById('question').innerHTML = current_q.question;

    choice_list.innerHTML = ""; 

    current_q.choices.forEach( (choice, i) => {
        let choice_list_item = document.createElement('li');
        choice_list_item.classList = LIST_ITEM_CLASS_DEFAULT; 
        choice_list_item.style = "cursor: pointer;"
        choice_list_item.dataset.index = i;
        choice_list_item.innerHTML = choice;
        choice_list.append(choice_list_item);
    });
}

const render_highscores = () => {
    document.getElementById('highscores').innerHTML = '';

    let scores = JSON.parse(localStorage.getItem('highscore'));
    scores.sort( (a, b) => {
        if(a.score < b.score) { return 1; }
        else if(a.score > b.score) { return -1; }
        else { return 0 };
    });

    let highscore_list = document.getElementById('highscores');

    for(let i = 0; i < scores.length; i++) {
        let hs_entry = document.createElement('li');
        hs_entry.className = "list-group-item";
        hs_entry.innerHTML = "<strong>#" + (i+1) + "</strong> " + scores[i].initials + " - " + scores[i].score;
        highscore_list.append(hs_entry);
    }

    document.getElementById('highscore_board').style.display = "";
}

document.getElementById('next').addEventListener('click', (event) => {
    if(current_question < questions.length) {
        let selected_answer = 0;

        if(selected_choice != questions[current_question].answer) {
            time -= 10;
            document.getElementById('timer').innerHTML = "Time: " + time;
            let error = document.getElementById('error');
            error.innerHTML = "Wrong answer! -10s";
            error.style = "color: red";
            return;
        } else {
            let error = document.getElementById('error');
            error.innerHTML = "Correct!";
            error.style = "color: green";

        }

        current_question += 1;
        if(current_question >= questions.length) {
            alert("Congrats you finished!");
            document.getElementById('quiz').style.display = "none";
            clearInterval(timer);

            let initials = prompt("Enter your initials to save your high score: ");

            if(!localStorage.highscore) {
                localStorage.highscore = "[]";
            }

            let highscores = JSON.parse(localStorage.highscore);
            let hs = {
                initials: initials,
                score: time
            };
            highscores.push(hs);
            localStorage.highscore = JSON.stringify(highscores);
            render_highscores();

            return;
        }

        render_question();
    }
});

document.addEventListener('click', (event) => {
    if(event.target.className.split(' ').includes('choice')) {
        let choice_list = document.getElementById('choices');
        choice_list.childNodes.forEach((node, i) => {
            node.classList = LIST_ITEM_CLASS_DEFAULT; 
        });
        selected_choice = event.target.dataset.index;
        event.target.classList += " active";
        document.getElementById('error').innerHTML = "";
    }
});

document.getElementById('start_quiz').addEventListener('click', () => {
    document.getElementById('quiz').style.display = "";
    document.getElementById('timer').innerHTML = "Time: " + time;
    document.getElementById('error').innerHTML = "";
    document.getElementById('highscore_board').style.display = "none";
    if(timer !== null) {
        clearInterval(timer);
    }
    time = QUIZ_TIME;
    timer = setInterval(() => {
        time -= 1;
        document.getElementById('timer').innerHTML = "Time: " + time;
        if(time <= 0) {
            alert("Time is up! Game over");
            document.getElementById('quiz').style.display = "none";
            document.getElementById('timer').innerHTML = "";
            clearInterval(timer);
        }
    }, 1000);


    current_question = 0;
    render_question();
});

document.getElementById('show_hsboard').addEventListener('click', () => {
    clearInterval(timer);
    document.getElementById('timer').innerHTML = "";
    document.getElementById('quiz').style.display = "none";
    render_highscores();
});