import React, { useEffect, useRef } from 'react';
import {decode} from 'html-entities';

export default function Quiz() {
    const [quizQuestions, setQuizQuestions] = React.useState([]);
	const [selectedAnswers, setSelectedAnswers] = React.useState([]);
	const [correctAnswers, setCorrectAnswers] = React.useState(true);
	const [playAgain, setPlayAgain] = React.useState([]);

    useEffect(() => {
      fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(response => response.json())
        .then(data => {
			const shuffledQuestions = data.results.map(question => {
				const concatonatedAnswers = [...question.incorrect_answers, question.correct_answer]
				const decodedAnswers = decode(concatonatedAnswers, {level: "html5"})
				return {
					...question,
					shuffledAnswers: shuffleArray(decodedAnswers)
				}
			})
			setQuizQuestions(shuffledQuestions)
		})
        .catch(error => {
          console.error("Error fetching quiz questions:", error);
        });
    }, [playAgain]);

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	const getButtonStyle = (question, answer, indexOfAnswer, indexOfQuestion) => {
		if (correctAnswers) { 
			return indexOfAnswer === selectedAnswers[indexOfQuestion] ?  {backgroundColor: "#D6DBF5"} : {};
		} else { 
			if (answer === question.correct_answer) {
				return {backgroundColor: "#94D7A2"};
			} else if (indexOfAnswer === selectedAnswers[indexOfQuestion]) {
				return {backgroundColor: "#F8BCBC", color: "grey"};
			} else {
				return {color: "grey"};
			}
		}
	};

    const QuestionsAndAnswers = quizQuestions.map((question, indexOfQuestion) => {
		return (
			<div className='quiz-container' key={indexOfQuestion}>
			<h4 className='quiz-question'>
				{question.question}
			</h4>
			{question.shuffledAnswers.map((answer, indexOfAnswer) => {

				const style = getButtonStyle(question, answer, indexOfAnswer, indexOfQuestion);
				
				return <button style={style} onClick={() => handleAnswerSelection(indexOfQuestion, indexOfAnswer)} className="answers-btn" key={indexOfAnswer}>{answer}</button>
			})}
			<hr />
			</div>
			
		)
    })
	
	const handleAnswerSelection = (indexOfQuestion, indexOfAnswer) => {
		let newResults = [...selectedAnswers];
		newResults[indexOfQuestion] = indexOfAnswer;
		setSelectedAnswers(newResults);
	};

	const getCorrectAnswerCount = () => {
		let count = 0;
		for (let i = 0; i < quizQuestions.length; i++) {
			if (quizQuestions[i].shuffledAnswers[selectedAnswers[i]] === quizQuestions[i].correct_answer) {
				count++;
			}
		}
		return count;
	}
	
	const restartGame = () => {
		setSelectedAnswers([]);
		setCorrectAnswers(prevState => !prevState);
		setQuizQuestions([]);
		setPlayAgain(Date.now());
	}
    
    return (
      <div className='app-container'>
        {QuestionsAndAnswers}
		{ correctAnswers ? <button onClick={() => setCorrectAnswers(prevState => !prevState)} className='check-answers'>Correct answers</button>
		: 
		<div className='play-again-container'>
			<p>You had {getCorrectAnswerCount()}/5 correct answers</p>

			<button className='play-again-btn' onClick={restartGame}>Play Again</button>
		</div>
		}
      </div>
    );
  }
