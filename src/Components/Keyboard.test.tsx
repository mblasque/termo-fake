import { render, screen } from "@testing-library/react";
import Keyboard from "./Keyboard";
import userEvent from "@testing-library/user-event";

const renderPage = ({
  attemptNum = 0,
  checkWord = () => {},
  onLetterPress = () => {},
  removeLastChar = () => {},
  correctLetters = [],
  existingLetters = [],
  wrongLetters = [],
}) => {
  return render(
    <Keyboard
      attemptNum={attemptNum}
      checkWord={checkWord}
      onLetterPress={onLetterPress}
      removeLastChar={removeLastChar}
      correctLetters={correctLetters}
      existingLetters={existingLetters}
      wrongLetters={wrongLetters}
    />
  );
};

describe("Keyboard Component", () => {
  const keys = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "⌫",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "↩",
  ];

  describe("Functions", () => {
    keys.forEach((key) => {
      test(`Should fire onLetterPress when ${key} is clicked`, () => {
        let mockOnLetterPress = jest.fn();
        let mockCheckWord = jest.fn();
        let mockRemoveLastChar = jest.fn();

        const { getByRole } = renderPage({
          onLetterPress: mockOnLetterPress,
          checkWord: mockCheckWord,
          removeLastChar: mockRemoveLastChar,
        });

        let letterButton = getByRole("button", { name: key });

        expect(letterButton).toBeInTheDocument();

        userEvent.click(letterButton);

        expect(mockOnLetterPress).toBeCalledTimes(1);
        expect(mockCheckWord).toBeCalledTimes(0);
        expect(mockRemoveLastChar).toBeCalledTimes(0);
      });
    });
  });
});
