// components/ImageCardGrid.tsx
import React from "react";
import ImageCard from "./ImageCard";
import { Grid, useBreakpointValue, Box } from "@chakra-ui/react";

interface ImageCardGridProps {
  cards: ImageCardProps[];
}

interface ImageCardProps {
  imageUrl: string;
  title: string;
  description?: string;
  clr?: string
}

const ImageCardGrid: React.FC<ImageCardGridProps> = ({ cards }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Grid
      templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
      gap={4}
      position="relative"
    >
      {cards.map((card) => (
        <ImageCard key={card.title} {...card} />
      ))}
      {!isMobile && (
        <Box
          h="100%"
          w="100%"
          position="absolute"
          top="0"
          left="0"
          zIndex="-1"
          bg="linear-gradient(to bottom right, rgba(0, 0, 0, 0.2), transparent)"
        />
      )}
    </Grid>
  );
};

export default ImageCardGrid;