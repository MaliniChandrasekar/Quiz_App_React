import { useEffect, useState } from 'react';
import './App.css'; // You may want to keep this for any custom styles
import questionData from "./questions.json";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  const [currentQues, setCurrentQues] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [timer, setTimer] = useState(10);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false); // State to manage quiz start

  const getRandomQuestions = (data, count) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    // Initialize questions on mount
    const randomQuestions = getRandomQuestions(questionData, 5);
    setSelectedQuestions(randomQuestions);
    resetQuiz(); // Reset quiz state
  }, []);

  const resetQuiz = () => {
    setCurrentQues(0);
    setScore(0);
    setShowScore(false);
    setTimer(10);
    setWrongQuestions([]);
  };

  const startQuiz = () => {
    resetQuiz(); 
    setQuizStarted(true); 
  };

  const handleAnswer = (selectedOption) => {
    if (selectedQuestions[currentQues]) {
      if (selectedOption === selectedQuestions[currentQues].correctOption) {
        setScore((prevScore) => prevScore + 1);
      } else {
        setWrongQuestions((prevWrongQuestions) => [
          ...prevWrongQuestions,
          { ...selectedQuestions[currentQues], questionNumber: currentQues + 1 },
        ]);
      }

      if (currentQues < selectedQuestions.length - 1) {
        setCurrentQues((prevQuestion) => prevQuestion + 1);
        setTimer(10);
      } else {
        setShowScore(true);
      }
    }
  };

  const handleRestart = () => {
    setQuizStarted(false);
    const randomQuestions = getRandomQuestions(questionData, 5);
    setSelectedQuestions(randomQuestions);
    resetQuiz(); // Reset quiz state
  };

  useEffect(() => {
    let interval;
    if (timer > 0 && !showScore) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !showScore) {
      handleAnswer(null);
    }

    return () => clearInterval(interval);
  }, [timer, showScore]);

  return (
    <div className="container text-center">
      <div className='quiz-app'>
      {quizStarted && <div className='timeout text-danger'>{timer === 0 ? "TIME OUT!" : ""}</div>}
        {!quizStarted ? ( 
          <div>
          <p className='text-danger'>
            Welcome to the Quiz App! Here are some quick instructions to get started:
          </p>
          <ul className='text-danger  text-muted text-left instructions-list font-weight-bold'>
            <li>There are 5 questions in this quiz.</li>
            <li>Each question has a 10-second timer.</li>
            <li>Select the correct option for each question.</li>
            <li>After completing all questions, your score will be displayed.</li>
          </ul>
          <p className='text-primary font-weight-bold'>Good luck!</p>
          <button className='btn btn-primary mt-3' onClick={startQuiz}>Start Now</button>
        </div>
        ) : showScore ? (
          <div className='score-section'>
            <h2>Your score: {score} / 5</h2>
            {wrongQuestions.length > 0 ? (
              wrongQuestions.map((question, index) => (
                <div key={index} className='wrong p-3 border border-danger rounded my-2'>
                  <p className='font-weight-bold'>Question {question.questionNumber}: {question.question}</p>
                  <span className='correct'>Correct Answer: {question.correctOption}</span>
                </div>
              ))
            ) : (
              <p className="text-success">Great job! All answers were correct!</p>
            )}
            <button className='btn btn-danger mt-3' onClick={handleRestart}>Restart</button>
          </div>
        ) : (
          <div className='question-section'>
            {selectedQuestions[currentQues] ? (
              <>
                <h2>Question {currentQues + 1}</h2>
                <p>{selectedQuestions[currentQues].question}</p>
                <div className='options'>
                  {selectedQuestions[currentQues].options.map((option, index) => (
                    <button key={index} className='m-1 ' onClick={() => handleAnswer(option)}>
                      {option}
                    </button>
                  ))}
                </div>
                <div className='timer mt-3'>
                  Time Left: <span className='font-weight-bold'>{timer}s</span>
                </div>
              </>
            ) : (
              <p>Loading question...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
