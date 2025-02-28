import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  width: 100%;
  height: 100vh;
  background-color: #0a0a0a;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 32px;
  color: white;
  font-weight: 700;
`;

const Description = styled.p`
  font-size: 16px;
  color: #a0a0a0;
  max-width: 600px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 8px;

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: nowrap;
    gap: 16px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
`;

const Card = styled(motion.div)`
  background-color: #1e1e1e;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
  min-width: 280px;
  text-align: center;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    border-color: #3a3a3a;
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
  }
`;

const CardTitle = styled.h3`
  font-size: 20px;
  color: white;
  font-weight: 600;
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #a0a0a0;
  line-height: 1.5;
`;

const HomePage = () => {
  const navigate = useNavigate(); // <-- Initialize the navigate function

  const cards = [
    {
      id: 1,
      title: "Upload",
      description: "Upload your media securely.",
      path: "/upload",
    },
    {
      id: 2,
      title: "View",
      description: "View your uploaded media easily.",
      path: "/view-media",
    },
  ];

  return (
    <Container>
      <Header>
        <Title>Manage Your Media</Title>
        <Description>
          Seamlessly upload and view your media anytime.
        </Description>
      </Header>
      <Grid>
        {cards.map((card) => (
          <Card
            key={card.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(card.path)} // <-- Use navigate function here
          >
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
