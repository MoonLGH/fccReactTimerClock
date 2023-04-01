import React, { useState, useRef } from "react";
import "./assets/css/main.css";
import beep from "./assets/media/beep.mp3";

export default function App() {
	const [breakLength, setBreakLength] = useState(5);
	const [sessionLength, setSessionLength] = useState(25);
	const [timerLabel, setTimerLabel] = useState("Session");
	const [timeLeft, setTimeLeft] = useState(sessionLength * 60 * 1000);
	const [isRunning, setIsRunning] = useState(false);
	const timerRef = useRef(null);
	const audioRef = useRef(null);

	const handleBreakDecrement = () => {
		if (breakLength > 1) {
			setBreakLength(breakLength - 1);
		}
	};

	const handleBreakIncrement = () => {
		if (breakLength < 60) {
			setBreakLength(breakLength + 1);
		}
	};

	const handleSessionDecrement = () => {
		if (sessionLength > 1) {
			setSessionLength(sessionLength - 1);
			setTimeLeft((sessionLength - 1) * 60 * 1000);
		}
	};

	const handleSessionIncrement = () => {
		if (sessionLength < 60) {
			setSessionLength(sessionLength + 1);
			setTimeLeft((sessionLength + 1) * 60 * 1000);
		}
	};

	const handleStartStop = () => {
		if (isRunning) {
			clearInterval(timerRef.current);
			setIsRunning(false);
		} else {
			timerRef.current = setInterval(() => {
				setTimeLeft((prevTimeLeft) => {
					if (prevTimeLeft === 0) {
						audioRef.current.play();
						clearInterval(timerRef.current);
						if (timerLabel === "Session") {
							setTimerLabel("Break");
							setTimeLeft(breakLength * 60 * 1000);
						} else {
							setTimerLabel("Session");
							setTimeLeft(sessionLength * 60 * 1000);
						}
            handleStartStop()
					} else {
						return prevTimeLeft - 1000;
					}
				});
			}, 1000);
			setIsRunning(true);
		}
	};

	const handleReset = () => {
		clearInterval(timerRef.current);
		audioRef.current.pause();
		audioRef.current.currentTime = 0;
		setIsRunning(false);
		setBreakLength(5);
		setSessionLength(25);
		setTimerLabel("Session");
		setTimeLeft(25 * 60 * 1000);
	};

	const formatTime = (time) => {
		const minutes = Math.floor(time / 1000 / 60)
			.toString()
			.padStart(2, "0");
		const seconds = Math.floor((time / 1000) % 60)
			.toString()
			.padStart(2, "0");
		return `${minutes}:${seconds}`;
	};

	return (
		<div id="app">
			<div className="length-controls">
				<div id="break-label">Break Length</div>
				<button id="break-decrement" onClick={handleBreakDecrement}>
					-
				</button>
				<div id="break-length">{breakLength}</div>
				<button id="break-increment" onClick={handleBreakIncrement}>
					+
				</button>
			</div>
			<div className="length-controls">
				<div id="session-label">Session Length</div>
				<button id="session-decrement" onClick={handleSessionDecrement}>
					-
				</button>
				<div id="session-length">{sessionLength}</div>
				<button id="session-increment" onClick={handleSessionIncrement}>
					+
				</button>
			</div>
			<div className="time">
				<div id="timer-label">{timerLabel}</div>
				<div id="time-left">{formatTime(timeLeft)}</div>
				<div className="timer-controls">
					<button id="start_stop" onClick={handleStartStop}>
						{isRunning === true ? "Stop" : "Start"}
					</button>
					<button id="reset" onClick={handleReset}>
						Reset
					</button>
				</div>
			</div>
			<audio id="beep" ref={audioRef} src={beep}></audio>
		</div>
	);
}
