import { Attempt } from "../Main";

type AttemptBoxProps = {
  attempts: Attempt[];
};

function AttemptBox({ attempts }: AttemptBoxProps) {
  return (
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
  );
}

export default AttemptBox;
