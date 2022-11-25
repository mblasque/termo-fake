import { useEffect, useState } from "react";
import { fiveWords } from "./utils/words";

import "./Main.scss";

type MainObj = {
  attempts: Attempt[];
};

type Attempt = {
  letters: Letter[];
};

type Letter = {
  letter: string;
  decision: string;
};


var word = fiveWords[Math.floor(Math.random() * 1000)].toUpperCase();

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

  const [obj, setObj] = useState<MainObj>({
    attempts: [{ letters: [] }]
  });

  const onLetterPress = (key: string) => {
    if (key === "↩") {
      checkWord();
      return;
    }

    if (key === "⌫") {
      removeLastChar();
      return;
    }

    var attempts = obj.attempts;

    if (!attempts[attemptNum]) attempts.push({ letters: [] });

    if (attempts[attemptNum].letters.length === 5) return;

    attempts[attemptNum].letters.push({
      letter: key,
      decision: "",
    } as Letter);

    setObj({ ...obj });
  };

  const removeLastChar = () => {
    obj.attempts[attemptNum].letters.splice(
      obj.attempts[attemptNum].letters.length - 1,
      1
    );
    setObj({ ...obj });
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

    var att = obj.attempts[attemptNum].letters;

    if (att.length < 5) return;

    for (let i = 0; i < att.length; i++) 
      if (wordArray[i] === att[i].letter)  
        rightChars.push(att[i].letter);

    const handleWrongChar = (char: string) => {
      setWrongLetters([...wrongLetters, char]);;
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

      setExistingLetters([...existingLetters, char]);
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

    for (let i = 0; i < att.length; i++) att[i].decision = getDecision(i);

    if (attemptNum === 5) {
      alert(word);
      return;
    }

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
                    className={`letter-box ${obj.attempts[attemptIndex]?.letters[letterIndex]?.decision}`}
                  >
                    <span>
                      {obj.attempts[attemptIndex]?.letters[letterIndex]?.letter}
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
                  <div
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
