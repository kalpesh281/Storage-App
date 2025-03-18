import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure axios is installed

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

// Loading indicator
const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 255, 204, 0.3);
  border-radius: 50%;
  border-top: 4px solid #00ffcc;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Error message
const ErrorMessage = styled.div`
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
  text-align: center;
`;

const ViewMediaPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState("audio");
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrls, setAudioUrls] = useState({});
  const navigate = useNavigate();

  // API base URL - store in one place for easy changes
  const API_BASE_URL = "http://localhost:5003/api/media";

  // Fetch media data based on selected type and search term
  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);

      try {
        let url;

        if (searchTerm) {
          url = `${API_BASE_URL}/search?query=${encodeURIComponent(
            searchTerm
          )}&type=${fileType}`;
        } else {
          url = `${API_BASE_URL}/type/${fileType}`;
        }

        const response = await axios.get(url);
        const media = response.data.media || [];
        setMediaData(media);

        // Pre-fetch audio URLs if needed
        if (fileType === "audio" && media.length > 0) {
          // Create a new object to store the URLs
          const urls = {};

          // For each audio file, get a pre-signed URL
          for (const file of media) {
            try {
              const urlResponse = await axios.get(
                `${API_BASE_URL}/download/${encodeURIComponent(file.name)}`
              );
              urls[file.name] = urlResponse.data.downloadUrl;
            } catch (err) {
              console.error(`Failed to get URL for ${file.name}:`, err);
            }
          }

          setAudioUrls(urls);
        }
      } catch (err) {
        console.error("Error fetching media:", err);
        setError("Failed to load media. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce function to prevent excessive API calls during typing
    const debounce = setTimeout(() => {
      fetchMedia();
    }, 500);

    return () => clearTimeout(debounce);
  }, [fileType, searchTerm]);

  // Handle file download
  const handleDownload = async (file) => {
    try {
      // If we already have a URL for this file, use it
      if (audioUrls[file.name]) {
        const link = document.createElement("a");
        link.href = audioUrls[file.name];
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Otherwise get a new URL
      const response = await axios.get(
        `${API_BASE_URL}/download/${encodeURIComponent(file.name)}`
      );

      const link = document.createElement("a");
      link.href = response.data.downloadUrl;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download file. Please try again.");
    }
  };

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

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <MediaList>
        {loading ? (
          <LoadingSpinner />
        ) : mediaData.length > 0 ? (
          mediaData.map((file) => (
            <MediaItem key={file.id}>
              <span>{file.name}</span>
              <ButtonContainer>
                {file.type === "audio" ? (
                  <AudioPlayer controls>
                    {/* Use pre-signed URL for audio player if available */}
                    <source
                      src={
                        audioUrls[file.name] ||
                        `${API_BASE_URL}/stream/${encodeURIComponent(
                          file.name
                        )}`
                      }
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </AudioPlayer>
                ) : (
                  <Button
                    onClick={() =>
                      window.open(
                        `${API_BASE_URL}/stream/${encodeURIComponent(
                          file.name
                        )}`,
                        "_blank"
                      )
                    }
                  >
                    View {file.type === "pdf" ? "PDF" : "Image"}
                  </Button>
                )}
                <Button onClick={() => handleDownload(file)}>Download</Button>
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