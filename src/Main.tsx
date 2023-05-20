import { useState } from "react";
import { get5LettersWord } from "./utils/words";
import Keyboard from "./Components/Keyboard";
import AttemptBox from "./Components/AttemptsBox";

import "./Main.scss";

export type Attempt = {
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

export function Main() {
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
    var aux = [...attempts];

    aux[attemptNum].letters.splice(aux[attemptNum].letters.length - 1, 1);

    setAttempts(aux);
  };

  const checkWord = () => {
    var rightChars = [] as String[];
    var existingChars = [] as String[];

    var att = attempts[attemptNum].letters;

    const checkCorrectPlacedLetters = () => {
      for (let i = 0; i < att.length; i++)
        if (wordArray[i] === att[i].letter) rightChars.push(att[i].letter);
    };

    const handleWrongChar = (char: string) => {
      setWrongLetters((prevState) => [...prevState, char]);
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
      setExistingLetters((prevState) => [...prevState, char]);
      return "exist";
    };

    const handleRightChar = (char: string) => {
      setCorrectLetters([...correctLetters, char]);
      return "right";
    };

    const getDecision = (i: number) => {
      return wordArray[i] === att[i].letter
        ? handleRightChar(att[i].letter)
        : wordArray.includes(att[i].letter)
        ? handleExistingChar(att[i].letter)
        : handleWrongChar(att[i].letter);
    };

    if (att.length < 5) return;

    checkCorrectPlacedLetters();

    for (let i = 0; i < att.length; i++) att[i].decision = getDecision(i);

    if (attemptNum === 5) {
      alert(word);
      return;
    }

    setAttempts([...attempts, { letters: [] }]);
    setAttemptNum(attemptNum + 1);
  };

  return (
    <>
      <AttemptBox attempts={attempts} />
      <Keyboard
        attemptNum={attemptNum}
        checkWord={checkWord}
        onLetterPress={onLetterPress}
        removeLastChar={removeLastChar}
        correctLetters={correctLetters}
        existingLetters={existingLetters}
        wrongLetters={wrongLetters}
      />
    </>
  );
}
