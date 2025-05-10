import React, { useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";

const GameButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
  color: "#fff",
  padding: "12px 24px",
  fontSize: "1rem",
  fontWeight: "bold",
  borderRadius: "12px",
  margin: "0.5rem",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  transition: "0.3s ease",
  "&:hover": {
    transform: "scale(1.08)",
    background: "linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)",
  },
}));

const Coin = ({ flipping }) => (
  <motion.div
    animate={{ rotateY: flipping ? 360 : 0 }}
    transition={{ repeat: flipping ? Infinity : 0, duration: 1, ease: "linear" }}
    style={{
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      background: "gold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.2rem",
      fontWeight: "bold",
      margin: "1rem auto",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    }}
  >
    🪙
  </motion.div>
);

const AnimatedScoreCard = ({ label, score, wickets }) => (
  <motion.div
    initial={{ opacity: 0.8, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    style={{
      background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
      borderRadius: "16px",
      padding: "1rem 1.5rem",
      margin: "1rem 0",
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
      width: "100%",
      textAlign: "center",
    }}
  >
    <Typography variant="h6" style={{ fontWeight: "bold", color: "#00796b" }}>
      {label}
    </Typography>
    <AnimatePresence mode="wait">
      <motion.div
        key={`${score}-${wickets}`}
        initial={{ y: -10, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1.1 }}
        exit={{ y: 10, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
      >
        <Typography variant="h4" style={{ fontWeight: "bold", color: score >= 30 ? "#d32f2f" : "#388e3c" }}>
          {score}/{wickets}
        </Typography>
      </motion.div>
    </AnimatePresence>
  </motion.div>
);

export default function HandCricketGame() {
  const [phase, setPhase] = useState("rules");
  const [batFirst, setBatFirst] = useState("");
  const [innings, setInnings] = useState(1);
  const [userScore, setUserScore] = useState(0);
  const [compScore, setCompScore] = useState(0);
  const [userWickets, setUserWickets] = useState(0);
  const [compWickets, setCompWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [gameLog, setGameLog] = useState([]);
  const [result, setResult] = useState("");
  const [flipping, setFlipping] = useState(false);

  const handleToss = (choice) => {
    setFlipping(true);
    setTimeout(() => {
      setFlipping(false);
      const random = Math.random() < 0.5 ? "heads" : "tails";
      if (choice === random) {
        setPhase("choose");
      } else {
        const compDecision = Math.random() < 0.5 ? "bat" : "ball";
        setBatFirst(compDecision === "bat" ? "Computer" : "You");
        setPhase("play");
      }
    }, 2000);
  };

  const chooseBatOrBall = (choice) => {
    setBatFirst(choice === "bat" ? "You" : "Computer");
    setPhase("play");
  };

  const handlePlay = (userChoice) => {
    if (userChoice < 1 || userChoice > 6) return;
    const compChoice = Math.floor(Math.random() * 6) + 1;
    let log = `You: ${userChoice} | Computer: ${compChoice}`;

    // Batting phase logic
    if ((innings === 1 && batFirst === "You") || (innings === 2 && batFirst === "Computer")) {
      if (userChoice === compChoice) {
        setUserWickets((w) => w + 1);
        log += " - WICKET!";
      } else {
        setUserScore((r) => r + userChoice);
      }
    } 
    // Bowling phase logic
    else {
      if (userChoice === compChoice) {
        setCompWickets((w) => w + 1);
        log += " - WICKET!";
      } else {
        setCompScore((r) => r + compChoice);
      }
    }

    setBalls((b) => b + 1);
    setGameLog((l) => [...l, log]);

    // Check if innings should switch
    if (balls + 1 === 12 || userWickets === 2 || compWickets === 2) {
      if (innings === 1) {
        setInnings(2);
        setBalls(0);
        setGameLog([]);
      } else {
        finishGame();
      }
    }
  };

  const finishGame = () => {
    setPhase("result");
    if (userScore > compScore) setResult("🏆 You Win!");
    else if (compScore > userScore) setResult("💻 Computer Wins!");
    else setResult("🤝 It's a Tie!");
  };

  const restartGame = () => {
    setPhase("rules");
    setBatFirst("");
    setInnings(1);
    setUserScore(0);
    setCompScore(0);
    setUserWickets(0);
    setCompWickets(0);
    setBalls(0);
    setGameLog([]);
    setResult("");
  };

  const printRules = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          RULES OF HAND CRICKET GAME
        </Typography>
        <Typography variant="body1" paragraph>
          1. Choose toss: Head or Tails
        </Typography>
        <Typography variant="body1" paragraph>
          2. You need to select a score between 1 and 6, and the computer plays automatically.
        </Typography>
        <Typography variant="body1" paragraph>
          3. Only scores between 1 and 6 are valid. Any number greater than 6 will not add any runs to the scoreboard and will prompt you to play again.
        </Typography>
        <Typography variant="body1" paragraph>
          4. If you are batting first, and the number you select is different from the computer's number, your score will increase by that number. If both numbers are the same, you will lose a wicket.
        </Typography>
        <Typography variant="body1" paragraph>
          5. If you are bowling first, and the number you select is different from the computer's number, you add runs to the scoreboard. If both numbers are the same, you will lose a wicket.
        </Typography>
        <Typography variant="body1" paragraph>
          6. Each player has 2 wickets and 2 overs (12 balls) to bat and bowl.
        </Typography>
        <Typography variant="body1" paragraph>
          7. The innings ends after losing 2 wickets or completing 2 overs (12 balls).
        </Typography>
        <Typography variant="body1" paragraph>
          8. The player with the maximum runs wins the game.
        </Typography>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <GameButton onClick={() => setPhase("toss")}>Start Game</GameButton>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        🏏 Hand Cricket Game
      </Typography>

      {phase === "rules" && printRules()}

      {phase === "toss" && (
        <Card>
          <CardContent>
            <Typography variant="h6">Choose Toss:</Typography>
            <Coin flipping={flipping} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton onClick={() => handleToss("heads")}>Heads</GameButton>
              <GameButton onClick={() => handleToss("tails")}>Tails</GameButton>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "choose" && (
        <Card>
          <CardContent>
            <Typography variant="h6">You won the toss! Choose to:</Typography>
            <GameButton onClick={() => chooseBatOrBall("bat")}>🏏 Bat</GameButton>
            <GameButton onClick={() => chooseBatOrBall("ball")}>🎯 Ball</GameButton>
          </CardContent>
        </Card>
      )}

      {phase === "play" && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {innings === 1 ? "1st Innings" : "2nd Innings"} - {((batFirst === "You" && innings === 1) || (batFirst === "Computer" && innings === 2)) ? "You Bat" : "You Bowl"}
            </Typography>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <GameButton key={num} onClick={() => handlePlay(num)}>
                  {num}
                </GameButton>
              ))}
            </div>

            <AnimatedScoreCard label="You" score={userScore} wickets={userWickets} />
            <AnimatedScoreCard label="Computer" score={compScore} wickets={compWickets} />

            <Typography variant="body2">Balls: {balls}/12</Typography>

            <ul style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
              {gameLog.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {phase === "result" && (
        <Card>
          <CardContent>
            <Typography variant="h5" align="center">{result}</Typography>
            <Typography variant="body1">Your Score: {userScore}/{userWickets}</Typography>
            <Typography variant="body1">Computer Score: {compScore}/{compWickets}</Typography>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <GameButton onClick={restartGame}>🔁 Restart Game</GameButton>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
