import { useState } from "react";
import { Card, CardContent, Typography, Container, Grid } from "@mui/material";
import { useInterval } from "react-use";
import "./App.css";

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function App() {
  // const initialTopics = ["Space", "Geography", "Art", "Music", "Travel"];
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [topics, setTopics] = useState([
    "Space",
    "Geography",
    "Art",
    "History",
    "Science",
  ]);

  const handleCardClick = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null); // Deselect the card if clicked again
      const shuffledTopics = shuffleArray(topics);
      setTopics(shuffledTopics);
    } else {
      setSelectedTopic(topic);
      setTimeLeft(1 * 6); // 10 minutes in seconds
    }
  };

  useInterval(
    () => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        setSelectedTopic(null);
      }
    },
    timeLeft > 0 ? 1000 : null
  );

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Choose a Topic
      </Typography>
      <div className="container-cards">
        <Grid container spacing={3}>
          {topics.map((topic, index) => (
            <Grid
              item
              xs={index === 4 ? 12 : 6} // For the last card on small screens, make it full width
              md={2} // On bigger screens, all cards are 2 out of 12 columns
              key={index}
            >
              <Card
                onClick={() => handleCardClick(topic)}
                className={`topic-card ${
                  selectedTopic === topic && timeLeft > 0
                    ? "topic-card-selected"
                    : ""
                }`}
              >
                <CardContent
                  sx={{
                    display:
                      selectedTopic === topic && timeLeft > 0
                        ? "block"
                        : "none",
                  }}
                >
                  <Typography variant="h6" color="black">
                    {topic}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      {selectedTopic && timeLeft > 0 && (
        <Typography variant="h5">You selected: {selectedTopic}</Typography>
      )}
      {timeLeft > 0 && (
        <Typography variant="h5">Time Left: {formatTime(timeLeft)}</Typography>
      )}
    </Container>
  );
}

export default App;
