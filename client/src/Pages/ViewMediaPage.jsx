import React, { useState } from "react";
import styled from "styled-components";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 20px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #00ffcc;
  }
`;

const Heading = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  width: 350px;
  padding: 12px;
  font-size: 18px;
  border-radius: 8px;
  border: 2px solid #00ffcc;
  outline: none;
  margin-bottom: 20px;
  background-color: #222;
  color: white;
  text-align: center;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  cursor: pointer;
`;

const MediaList = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-height: 50vh;
  overflow-y: auto;
  padding: 10px;
  border-radius: 10px;
  background-color: #111;
`;

const MediaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #222;
  padding: 17px;
  border-radius: 8px;
  gap: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px; /* Increased gap between buttons */
`;

const Button = styled.button`
  background-color: #00ffcc;
  color: black;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
  &:hover {
    background-color: white;
  }
`;

const AudioPlayer = styled.audio`
  width: 200px;
  margin-left: 10px;
`;

const ViewMediaPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState("audio");
  const navigate = useNavigate();

  const mediaData = [
    { id: 1, name: "Song1.mp3", type: "audio", url: "/downloads/song1.mp3" },
    { id: 2, name: "Document1.pdf", type: "pdf", url: "/downloads/doc1.pdf" },
    { id: 3, name: "Image1.jpg", type: "image", url: "/downloads/img1.jpg" },
    { id: 4, name: "Song2.wav", type: "audio", url: "/downloads/song2.wav" },
  ];

  const filteredMedia = mediaData.filter(
    (item) =>
      item.type === fileType &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <BackButton onClick={() => navigate("/home")}>
        <IoArrowBack />
      </BackButton>
      <Heading>View and Download Media</Heading>

      <SearchBar
        type="text"
        placeholder="Search for a file..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <RadioGroup>
        <RadioLabel>
          <input
            type="radio"
            value="audio"
            checked={fileType === "audio"}
            onChange={() => setFileType("audio")}
          />
          Audio
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            value="pdf"
            checked={fileType === "pdf"}
            onChange={() => setFileType("pdf")}
          />
          PDF
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            value="image"
            checked={fileType === "image"}
            onChange={() => setFileType("image")}
          />
          Image
        </RadioLabel>
      </RadioGroup>

      <MediaList>
        {filteredMedia.length > 0 ? (
          filteredMedia.map((file) => (
            <MediaItem key={file.id}>
              <span>{file.name}</span>
              <ButtonContainer>
                {file.type === "audio" ? (
                  <AudioPlayer controls>
                    <source src={file.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </AudioPlayer>
                ) : (
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <Button>
                      View {file.type === "pdf" ? "PDF" : "Image"}
                    </Button>
                  </a>
                )}
                <a href={file.url} download>
                  <Button>Download</Button>
                </a>
              </ButtonContainer>
            </MediaItem>
          ))
        ) : (
          <p>No files found.</p>
        )}
      </MediaList>
    </Container>
  );
};

export default ViewMediaPage;
