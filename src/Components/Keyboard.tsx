import { useEffect } from "react";

import "./Keyboard.scss";

type KeyboardProps = {
  attemptNum: number;
  onLetterPress: (key: string) => void;
  checkWord: () => void;
  removeLastChar: () => void;
  correctLetters: string[];
  existingLetters: string[];
  wrongLetters: string[];
};

const keyBoard = [
  { line: 1, keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"] },
  { line: 2, keys: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "⌫"] },
  { line: 3, keys: ["Z", "X", "C", "V", "B", "N", "M", "↩"] },
];

function Keyboard(props: KeyboardProps) {
  useEffect(() => {
    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, [props.attemptNum]);

  const onKeyPress = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();

    if (
      keyBoard[0].keys.includes(key) ||
      keyBoard[1].keys.includes(key) ||
      keyBoard[2].keys.includes(key)
    ) {
      props.onLetterPress(key);
    }

    if (key === "ENTER") {
      props.checkWord();
    }

    if (key === "BACKSPACE") {
      props.removeLastChar();
    }
  };

  return (
    <div className="tf-kbd">
      {keyBoard.map((line) => {
        return (
          <div key={line.line}>
            {line.keys.map((letter) => {
              return (
                <button
                  key={letter}
                  onClick={() => props.onLetterPress(letter)}
                  className={`letter 
                      ${props.correctLetters.includes(letter) ? "right" : ""}
                      ${
                        props.existingLetters.includes(letter) ? "existing" : ""
                      }
                      ${props.wrongLetters.includes(letter) ? "wrong" : ""}`}
                >
                  <span>{letter}</span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Keyboard;
