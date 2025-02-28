import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


// Keyframes for floating animation
const floatingAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ gradient }) => gradient};
  color: white;
  padding: 1.5rem;
  transition: background 1s ease-in-out;
`;

const Title = styled(motion.h1)`
  font-size: 3.75rem;
  font-weight: 900;
  background: linear-gradient(to right, #a855f7, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
  text-align: center;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #cbd5e1;
  margin-top: 1rem;
  text-align: center;
  max-width: 40rem;
`;

const Button = styled(motion.button)`
  margin-top: 2rem;
  padding: 0.75rem 2.5rem;
  border-radius: 9999px;
  background-color: #3b82f6;
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
  box-shadow: 0px 4px 10px rgba(59, 130, 246, 0.5);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    background-color: #2563eb;
    transform: scale(1.08);
    box-shadow: 0px 8px 20px rgba(59, 130, 246, 0.7);
  }
`;

const FloatingText = styled(motion.div)`
  position: absolute;
  bottom: 2.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  animation: ${floatingAnimation} 5s infinite ease-in-out;
`;

const WelcomeAnimation = () => {
  const [gradient, setGradient] = useState(
    "linear-gradient(to bottom, #0a0a0a, #161616)"
  );

const navigate = useNavigate(); // Initialize navigate function

const handleGetStarted = () => {
  navigate("/home"); // Navigate to the homepage
};

  useEffect(() => {
    const gradientColors = [
      "linear-gradient(to bottom, #0a0a0a, #161616)",
      "linear-gradient(to bottom, #161616, #252525)",
      "linear-gradient(to bottom, #0a0a0a, #2c2c2c)",
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % gradientColors.length;
      setGradient(gradientColors[index]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container gradient={gradient}>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        MediaHub
      </Title>

      <Subtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Upload, Manage & Share Your Media Seamlessly.
      </Subtitle>

      <Button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onClick={handleGetStarted}
      >
        Get Started
      </Button>

      <FloatingText>Powered by KS</FloatingText>
    </Container>
  );
};

export default WelcomeAnimation;
