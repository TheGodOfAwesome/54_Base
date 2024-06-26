// components/ImageCard.tsx
import React, { useState } from "react";
import {
    Input,
    Button,
    Box,
    Image,
    Heading,
    Text,
    useBreakpointValue,
    useDisclosure,
    FormControl,
    FormLabel,
    useColorModeValue,
} from "@chakra-ui/react";

interface ImageCardProps {
  imageUrl: string;
  title: string;
  description?: string;
  clr?: string
}

const WaitlistCard: React.FC<ImageCardProps> = ({ imageUrl, title, description, clr }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [ waitlistEmail, setWaitliastEmail ] = useState<string>("");
  const onWaitlistEmailChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setWaitliastEmail(e.target.value),
    []
  );

  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="lg"
      minHeight="150"
      onClick={onToggle}
      maxW="90vw"
      height="300px"
    >
      <Image 
        src={imageUrl} 
        alt={title} 
        objectFit="cover" 
        height="300px"
      />
      <Box
        height="300px"
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
            <FormControl>
                <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                >
                    Email<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="email"
                    placeholder="mail@gmail.com"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    value={waitlistEmail}
                    onChange={onWaitlistEmailChange}
                />
                <Button
                    fontSize="sm"
                    variant="brand"
                    fontWeight="500"
                    w="100%"
                    h="50"
                    mb="24px"
                    onClick={() => {alert("Test")}}
                >
                   Join Waitlist
                </Button>
            </FormControl>
      </Box>
    </Box>
  );
};

export default WaitlistCard;