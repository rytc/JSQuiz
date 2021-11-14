const LIST_ITEM_CLASS_DEFAULT = "choice list-group-item list-group-item-action";
const QUIZ_TIME = 60
let current_question = 0;

// These are const because the object shouldn't change
// but we can still update the members
const timer = {
    handle: null,
    time: QUIZ_TIME
};

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

const on_choice_selected = (event) => {
    
    if(event.target.dataset.index != questions[current_question].answer) {
        timer.time -= 10;
        timer.time = Math.max(timer.time, 0); // Stop the timer from going negative

        if(timer.time <= 0) {
            end_quiz();
        }

        document.getElementById('timer').innerHTML = "Time: " + timer.time;
        set_feedback('wrong');
        return;
    } 

    set_feedback('correct');    

    current_question += 1;
    if(current_question >= questions.length) {
        end_quiz(); 
        return;
    }

    populate_question();
}

//
// Populates the quiz div with the question and choices
//
const populate_question = () => {
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
        choice_list_item.addEventListener('click', on_choice_selected);
    });
}

const display_hs_entry = () => {
    document.getElementById('quiz').style = "display:none";
    document.getElementById('score_at_finish').innerHTML = "Score: " + timer.time;
    document.getElementById('hs_entry').style = "";
}

const display_highscores = () => {
    document.getElementById('highscores').innerHTML = '';

    let scores = JSON.parse(localStorage.getItem('highscore'));
    scores.sort((a, b) => {
        if(a.score < b.score) { 
            return 1; 
        } else if(a.score > b.score) { 
            return -1; 
        }
        return 0 
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

const end_quiz = () => {
    clearInterval(timer.handle);
    document.getElementById('quiz').style.display = "none";

    if(timer.time > 0) {
        if(!localStorage.highscore) {
            localStorage.highscore = "[]";
        }

        display_hs_entry();
    } else {
        display_highscores();
    }
}

const set_feedback = (type) => {
    let feedback = document.getElementById('feedback');
    if(type === "wrong") {
        feedback.innerHTML = "Wrong answer! -10s";
        feedback.style = "color: red";
    } else if(type == "correct") {
        feedback.innerHTML = "Correct!";
        feedback.style = "color: green";
    } else {
        feedback.style = "display: none";
    }
}

document.getElementById('start_quiz').addEventListener('click', () => {
    if(timer.handle !== null) {
        clearInterval(timer.handle);
    }

    timer.time = QUIZ_TIME;

    timer.handle = setInterval(() => {
        timer.time -= 1;
        document.getElementById('timer').innerHTML = "Time: " + timer.time;
        if(timer.time <= 0) {
            end_quiz();
        }
    }, 1000);

    document.getElementById('quiz').style.display = "";
    document.getElementById('timer').innerHTML = "Time: " + timer.time;
    document.getElementById('feedback').innerHTML = "";
    document.getElementById('highscore_board').style.display = "none";

    current_question = 0;
    populate_question();
});

document.getElementById('show_hsboard').addEventListener('click', () => {
    clearInterval(timer.handle);
    document.getElementById('timer').innerHTML = "";
    document.getElementById('quiz').style.display = "none";
    display_highscores();
});

document.getElementById('save_score').addEventListener('click', () => {
    let initials = document.getElementById('initials').value;
    let highscores = JSON.parse(localStorage.highscore);
    let hs = {
        initials: initials,
        score: timer.time
    };
    highscores.push(hs);
    localStorage.highscore = JSON.stringify(highscores);
    document.getElementById('hs_entry').style = "display:none";
    display_highscores();
})