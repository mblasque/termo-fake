import { useEffect, useState } from "react";
import { fiveWords } from "./utils/words";

import "./Main.scss";

type MainObj = {
  attempts: Attempt[];
  wrongChars: string[];
  existingChars: string[];
  rightChars: string[];
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
  fiveWords[Math.floor(Math.random() * 1000)]
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
);

const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "⌫"],
  ["Z", "X", "C", "V", "B", "N", "M", "↩"],
];

function Main() {
  const [attemptNum, setAttemptNum] = useState<number>(0);
  const [obj, setObj] = useState<MainObj>({
    attempts: [{ letters: [] }],
    wrongChars: [],
    existingChars: [],
    rightChars: [],
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
      keys[0].includes(key) ||
      keys[1].includes(key) ||
      keys[2].includes(key)
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
      if (wordArray[i] === att[i].letter) rightChars.push(att[i].letter);

    const handleWrongChar = (char: string) => {
      obj.wrongChars.push(char);
      setObj({ ...obj });
      return "wrong";
    };

    const handleExistingChar = (char: string) => {
      var qtyCharInWord = wordArray.filter((x) => x === char).length;

      if (
        qtyCharInWord ===
        rightChars.filter((x) => x === char).length +
          existingChars.filter((x) => x === char).length
      ) {
        handleWrongChar(char);
      }

      existingChars.push(char);
      obj.existingChars.push(char);
      setObj({ ...obj });
      return "exist";
    };

    const handleRightChar = (char: string) => {
      obj.rightChars.push(char);
      setObj({ ...obj });
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
        {[0, 1, 2, 3, 4, 5].map((attempt) => {
          return (
            <div className="attempt-box">
              {[0, 1, 2, 3, 4].map((letter) => {
                return (
                  <div
                    className={`letter-box ${obj.attempts[attempt]?.letters[letter]?.decision}`}
                  >
                    <span>
                      {obj.attempts[attempt]?.letters[letter]?.letter}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="tf-kbd">
        {keys.map((line) => {
          return (
            <div>
              {line.map((letter) => {
                return (
                  <div
                    onClick={() => onLetterPress(letter)}
                    className={`letter 
                    ${obj.rightChars.includes(letter) ? "right" : ""}
                    ${obj.existingChars.includes(letter) ? "existing" : ""}
                    ${obj.wrongChars.includes(letter) ? "wrong" : ""}`}
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
