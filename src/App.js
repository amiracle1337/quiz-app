import './App.css';
import React, { useState } from 'react';
import Quiz from './components/Quiz.js';


function App() {
	const [gameStarted, setGameStarted] = useState(false);

	return (
		<div className="main">
			{gameStarted ? <Quiz /> : 
            <div className="start-screen">
				<h1>QuizMaster</h1>
				<button onClick={() => {setGameStarted(prevState => !prevState)}}>Start quiz</button>             
			</div>     
			}
		</div>
	);
	}

export default App;
