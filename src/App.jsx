import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Container, Grid } from "@mui/material";
import { useInterval } from "react-use";
import "./App.css";
import topicsData from "./topics_fi.json";

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
  const [topics, setTopics] = useState([]);

  const handleCardClick = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null); // Deselect the card if clicked again
      const shuffledTopics = shuffleArray(topicsData.topics);
      setTopics(shuffledTopics.slice(0, 5)); // take the first 5 from the shuffled list
    } else {
      setSelectedTopic(topic);
      setTimeLeft(10 * 60); // 10 minutes in seconds
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

  useEffect(() => {
    const shuffledTopics = shuffleArray(topicsData.topics);
    setTopics(shuffledTopics.slice(0, 5)); // take the first 5 from the shuffled list
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Valitse aihe
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
                sx={{
                  backgroundColor:
                    selectedTopic === topic && timeLeft > 0
                      ? "#87cefa"
                      : "white",
                  border: "1px solid #cfe9f9",
                }}
              >
                <CardContent
                  sx={{
                    display:
                      selectedTopic === topic && timeLeft > 0
                        ? "block"
                        : "none",
                    padding: 2,
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
        <>
          <Typography variant="h5">Valitsit: {selectedTopic}</Typography>
          <Typography variant="h5">
            Aikaa jäljellä: {formatTime(timeLeft)}
          </Typography>
        </>
      )}
    </Container>
  );
}

export default App;
