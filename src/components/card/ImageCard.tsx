// components/ImageCard.tsx
import React from "react";
import {
  Box,
  Image,
  Heading,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";

interface ImageCardProps {
  imageUrl: string;
  title: string;
  description?: string;
  clr?: string
}

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, title, description, clr }) => {
  const { isOpen, onToggle } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="lg"
      minHeight="150"
    //   boxShadow="md"
    //   maxHeight="400px"
    //   maxWidth="600px"
    //   h={isMobile ? "200px" : "100px"}
    //   w={isMobile ? "200px" : "400px"}
      onClick={onToggle}
    >
      <Image 
        src={imageUrl} 
        alt={title} 
        objectFit="cover" 
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)"
        opacity={isOpen ? 1 : 0}
        transition="opacity 0.2s ease-in-out"
        zIndex={1}
      />
      <Box position="absolute" bottom="30%" pb={4} px={4} zIndex={2}>
        <Heading 
          // fontSize={isMobile ? "lg" : "xl"} 
          fontSize="30px" 
          color={clr} 
          noOfLines={1}
        >
          <b>{title}</b>
        </Heading>
        {description && (
          <Text color={clr} fontSize={isMobile ? "sm" : "md"} mt={2}>
            {description}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default ImageCard;