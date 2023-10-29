import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Button,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import { useInterval } from "react-use";
import "./App.css";
import topicsEn from "./topics_en.json";
import topicsFi from "./topics_fi.json";

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [topics, setTopics] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [listOpen, setListOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState("English");
  const cardContainerRef = useRef(null);

  const switchLanguage = () => {
    if (language === "English") {
      return topicsEn.topics;
    } else if (language === "Finnish") {
      return topicsFi.topics;
    }
  };

  const getTranslations = () => {
    if (language === "English") {
      return topicsEn.translations;
    } else if (language === "Finnish") {
      return topicsFi.translations;
    }
  };

  const handleCardClick = (topicName) => {
    if (selectedTopic === topicName) {
      if (listOpen) {
        // Close the card and reset everything if the list is open
        setSelectedTopic(null);
        setListOpen(false);
        const shuffledTopics = shuffleArray(switchLanguage());
        setTopics(shuffledTopics.slice(0, 5));
      } else {
        // If the list isn't open, just open the list
        setListOpen(true);
      }
    } else {
      setSelectedTopic(topicName);
      setTimeLeft(10 * 60);
      setListOpen(false);
    }
  };

  const handleSubtopicClick = (subtopic) => {
    setSelectedSubtopic(subtopic);
  };

  const handleOutsideClick = (event) => {
    if (
      cardContainerRef.current &&
      !cardContainerRef.current.contains(event.target)
    ) {
      cardReset();
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

  const cardReset = () => {
    setSelectedTopic(null);
    setListOpen(false);
    const shuffledTopics = shuffleArray(switchLanguage());
    setTopics(shuffledTopics.slice(0, 5));
  };

  useEffect(() => {
    const shuffledTopics = shuffleArray(switchLanguage());
    setTopics(shuffledTopics.slice(0, 5)); // take the first 5 from the shuffled list
  }, [language]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const translations = getTranslations();

  return (
    <>
      <AppBar position="static" onClick={(e) => e.stopPropagation()}>
        <Toolbar>
          {/* Game Name - Left */}
          <Box display="flex" flexGrow={1}>
            <Typography variant="h6">{translations.title}</Typography>
          </Box>

          {/* Topic - Center */}
          <Box display="flex" flexGrow={1} justifyContent="center">
            <Typography variant="h6">{translations.chooseTopic}</Typography>
          </Box>

          {/* Language Selector - Right */}
          <Box display="flex" flexGrow={1} justifyContent="flex-end">
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              variant="outlined"
              color="inherit"
            >
              {language}
            </Button>
            <Menu
              id="language-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  setLanguage("English");
                  cardReset();
                  setAnchorEl(null);
                }}
              >
                English
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setLanguage("Finnish");
                  cardReset();
                  setAnchorEl(null);
                }}
              >
                Finnish
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h4" gutterBottom>
          {translations.chooseTopic}
        </Typography>
        <div className="container-cards">
          <Grid container spacing={3} ref={cardContainerRef}>
            {topics.map((topic, index) => (
              <Grid item xs={index === 4 ? 12 : 6} md={2} key={index}>
                <Card
                  onClick={() => handleCardClick(topic.name)}
                  className={`topic-card ${
                    selectedTopic === topic.name && timeLeft > 0
                      ? "topic-card-selected"
                      : ""
                  }`}
                  sx={{
                    backgroundColor:
                      selectedTopic === topic.name && timeLeft > 0
                        ? "#87cefa"
                        : "white",
                    border: "1px solid #cfe9f9",
                  }}
                >
                  <CardContent
                    sx={{
                      display:
                        selectedTopic === topic.name && timeLeft > 0
                          ? "block"
                          : "none",
                      padding: 2,
                    }}
                  >
                    <Typography variant="h6" color="black" paddingBottom={3}>
                      {topic.name}
                      <Divider />
                    </Typography>
                    <List
                      className={`list-topics ${
                        selectedTopic === topic.name && timeLeft > 0
                          ? "topic-card-selected"
                          : ""
                      }`}
                      sx={{
                        width: "100%",
                        maxWidth: 360,

                        backgroundColor:
                          selectedTopic === topic.name && timeLeft > 0
                            ? "#87cefa"
                            : "white",
                      }}
                    >
                      {topic.subtopics.map((subtopic, subIndex) => (
                        <ListItem key={subIndex} disablePadding>
                          <ListItemButton
                            onClick={() => handleSubtopicClick(subtopic)}
                            sx={{
                              padding: 0,
                              margin: 0,
                              backgroundColor:
                                subtopic === selectedSubtopic
                                  ? "#4dbafd"
                                  : "transparent",
                            }}
                          >
                            <ListItemText
                              sx={{
                                pl: 1,
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                              }}
                              primary={subtopic}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
        {selectedTopic && timeLeft > 0 && (
          <>
            <Typography variant="h5">
              {translations.selectedTopic}: {selectedTopic}
            </Typography>
            <Typography variant="h5">
              {translations.timeLeft}: {formatTime(timeLeft)}
            </Typography>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
