import { useState } from 'react';
import { fiveWords } from './utils/words';

import './Main.scss';

type Attempt = {
    letters: Letter[]
}

type Letter = {
    letter: string,
    decision: string
}

var word = Array.from(fiveWords[Math.floor(Math.random() * 1000)].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""));

function Main() {
    const [attemptNum, setAttemptNum] = useState<number>(0);
    const [attempts] = useState<Attempt[]>([] as Attempt[]);

    const checkWord = () => {
        const typedStr = (document.getElementById("try") as HTMLInputElement).value.toUpperCase();

        if (typedStr.length < 5) return;

        var rightChars = [] as String[];
        var existingChars = [] as String[];

        for (let i = 0; i <= typedStr.length; i++)
            if (word[i] === typedStr[i])
                rightChars.push(typedStr[i])

        const handleExistingChar = (char: string) => {
            var qtyCharInWord = word.filter(x => x === char).length;

            if (qtyCharInWord === rightChars.filter(x => x === char).length + existingChars.filter(x => x === char).length)
                return "wrong";

            existingChars.push(char)
            return "exist";
        }

        const getDecision = (i: number) => {
            return word[i] === typedStr[i]
                ? "right"
                : word.includes(typedStr[i])
                    ? handleExistingChar(typedStr[i])
                    : "wrong"
        }

        var letters = [] as Letter[];

        for (let i = 0; i <= typedStr.length; i++) {
            letters.push({
                letter: typedStr[i],
                decision: getDecision(i)
            });
        }

        attempts.push({ letters: letters } as Attempt);
        setAttemptNum(attemptNum + 1);
        (document.getElementById("try") as HTMLInputElement).value = "";
    }

    return (<>
        <div className='main-box'>
            {[0, 1, 2, 3, 4, 5].map(attempt => {
                return (
                    <div className="attempt-box">
                        {[0, 1, 2, 3, 4].map(letter => {
                            return (
                                <div className={`letter-box ${attempts[attempt]?.letters[letter].decision}`}>
                                    <span>
                                        {attempts[attempt]?.letters[letter].letter}
                                    </span>
                                </div>
                            )
                        })}
                    </div>)
            })}
        </div>
        {attempts.length === 6 && <span>{word}</span>}
        <div className='form'>
            <form onSubmit={(e) => { e.preventDefault(); checkWord(); }}>
                <input id="try" maxLength={5}></input>
                <button>
                    Check
                </button>
            </form>
        </div>
    </>);
}

export default Main;