import { useEffect, useState } from "react";
import { get5LettersWord } from "./utils/words";

import "./Main.scss";

type Attempt = {
  letters: Letter[];
};

type Letter = {
  letter: string;
  decision: string;
};

var word = get5LettersWord();

var wordArray = Array.from(
  word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
);

const keyBoard = [
  { line: 1, keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"] },
  { line: 2, keys: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "⌫"] },
  { line: 3, keys: ["Z", "X", "C", "V", "B", "N", "M", "↩"] },
];

function Main() {
  const [attemptNum, setAttemptNum] = useState<number>(0);

  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [existingLetters, setExistingLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);

  const [attempts, setAttempts] = useState<Attempt[]>([{ letters: [] }]);

  const onLetterPress = (key: string) => {
    if (key === "↩") {
      checkWord();
      return;
    }

    if (key === "⌫") {
      removeLastChar();
      return;
    }

    var letters = [...attempts[attemptNum].letters];

    if (letters.length === 5) return;

    letters.push({
      letter: key,
      decision: "",
    } as Letter);

    attempts[attemptNum].letters = letters;

    setAttempts([...attempts]);
  };

  const removeLastChar = () => {
    var aux = [...attempts]

    aux[attemptNum].letters.splice(
      aux[attemptNum].letters.length - 1,
      1
    );

    setAttempts(aux);
  };

  const onKeyPress = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();

    if (
      keyBoard[0].keys.includes(key) ||
      keyBoard[1].keys.includes(key) ||
      keyBoard[2].keys.includes(key)
    ) {
      onLetterPress(key);
    }

    if (key === "ENTER") {
      checkWord();
    }

    if (key === "BACKSPACE") {
      removeLastChar();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, [attemptNum]);

  const checkWord = () => {
    var rightChars = [] as String[];
    var existingChars = [] as String[];

    var att = attempts[attemptNum].letters;
    
    const checkCorrectPlacedLetters = () => {
      for (let i = 0; i < att.length; i++)
        if (wordArray[i] === att[i].letter)
          rightChars.push(att[i].letter);
    }

    const handleWrongChar = (char: string) => {
      setWrongLetters(prevState => [...prevState, char]);
      return "wrong";
    };

    const handleExistingChar = (char: string) => {
      var qtyCharInWord = wordArray.filter((x) => x === char).length;

      if (
        qtyCharInWord ===
        rightChars.filter((x) => x === char).length +
        existingChars.filter((x) => x === char).length
      ) {
        return handleWrongChar(char);
      }

      existingChars.push(char);
      setExistingLetters(prevState => [...prevState, char]);
      return "exist";
    };

    const handleRightChar = (char: string) => {
      setCorrectLetters([...correctLetters, char]);
      return "right";
    }

    const getDecision = (i: number) => {
      return wordArray[i] === att[i].letter
        ? handleRightChar(att[i].letter)
        : wordArray.includes(att[i].letter)
          ? handleExistingChar(att[i].letter)
          : handleWrongChar(att[i].letter);
    };

    if (att.length < 5) return;

    checkCorrectPlacedLetters();

    for (let i = 0; i < att.length; i++) 
      att[i].decision = getDecision(i);

    if (attemptNum === 5) {
      alert(word);
      return;
    }

    setAttempts([...attempts, { letters: [] }]);
    setAttemptNum(attemptNum + 1);
  };

  return (
    <>
      <div className="main-box">
        {[0, 1, 2, 3, 4, 5].map((attemptIndex) => {
          return (
            <div key={attemptIndex} className="attempt-box">
              {[0, 1, 2, 3, 4].map((letterIndex) => {
                return (
                  <div
                    key={letterIndex}
                    className={`letter-box ${attempts[attemptIndex]?.letters[letterIndex]?.decision}`}
                  >
                    <span>
                      {attempts[attemptIndex]?.letters[letterIndex]?.letter}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="tf-kbd">
        {keyBoard.map((line) => {
          return (
            <div key={line.line}>
              {line.keys.map((letter) => {
                return (
                  <div key={letter}
                    onClick={() => onLetterPress(letter)}
                    className={`letter 
                    ${correctLetters.includes(letter) ? "right" : ""}
                    ${existingLetters.includes(letter) ? "existing" : ""}
                    ${wrongLetters.includes(letter) ? "wrong" : ""}`}
                  >
                    <span>{letter}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Main;
