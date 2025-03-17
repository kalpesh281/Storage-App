import React, { useState } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
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


const Content = styled.div`
  text-align: center;
  padding: 20px;
`;

const Heading = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 18px;
  max-width: 600px;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const CustomFileLabel = styled.label`
  background-color: #222;
  color: #00ffcc;
  padding: 12px 25px;
  border-radius: 8px;
  border: 2px solid #00ffcc;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;

  &:hover {
    background-color: #00ffcc;
    color: #000;
  }
`;

const FileNameDisplay = styled.p`
  font-size: 14px;
  color: #bbb;
  margin-top: 5px;
  font-style: italic;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background-color: green;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
  border: 2px solid green;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00ff00;
    color: black;
    border-color: black;
  }
`;

const UploadPage = () => {
  const [fileType, setFileType] = useState(""); // Default empty
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const backend_url = "http://localhost:5003/api/upload";

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

const handleUpload = async () => {
  if (!fileType) {
    toast.error("Please select a file type before uploading!");
    return;
  }

  if (!selectedFile) {
    toast.error("Please choose a file to upload!");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await axios.post(backend_url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(`"${selectedFile.name}" uploaded successfully!`);
    console.log("File URL:", response.data.fileUrl);
  } catch (error) {
    console.error("Upload error:", error);
    toast.error(error.response?.data?.error || "Upload failed");
  }
};


  return (
    <Container>
      <BackButton onClick={() => navigate("/home")}>
        <IoArrowBack />
      </BackButton>
      <Content>
        <Heading>Upload Your Media</Heading>
        <Description>
          Select the type of file you want to upload and then choose your file.
          Supported formats: MP3, WAV for audio, PDF, DOCX for documents, and
          JPG, PNG for images.
        </Description>

        <UploadSection>
          {/* Custom File Upload */}
          <HiddenFileInput
            type="file"
            accept={
              fileType === "image"
                ? "image/*"
                : fileType === "audio"
                ? "audio/*"
                : fileType === "document"
                ? ".pdf, .docx"
                : ""
            }
            id="fileUpload"
            onChange={handleFileChange}
          />
          <CustomFileLabel htmlFor="fileUpload">
            {selectedFile ? "Change File" : "Choose File"}
          </CustomFileLabel>
          {selectedFile && (
            <FileNameDisplay>Selected: {selectedFile.name}</FileNameDisplay>
          )}

          {/* Radio Button Selection */}
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                value="image"
                checked={fileType === "image"}
                onChange={() => setFileType("image")}
              />
              Image
            </RadioLabel>

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
                value="document"
                checked={fileType === "document"}
                onChange={() => setFileType("document")}
              />
              PDF/Word
            </RadioLabel>
          </RadioGroup>

          {/* Submit Button */}
          <SubmitButton onClick={handleUpload}>Upload</SubmitButton>
        </UploadSection>
      </Content>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </Container>
  );
};

export default UploadPage;
