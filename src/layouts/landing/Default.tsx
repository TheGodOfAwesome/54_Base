
import { PropsWithChildren, useEffect, useState } from 'react';
// Chakra imports
import { Portal, useDisclosure, useBreakpointValue, Box, Flex, Icon, useColorModeValue, Text, Image, Button, Stack, SimpleGrid, Heading } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
// import NFTcard from 'views/admin/marketplace/components/HistoryItem';
// import NFTcard from 'components/card/NFT';
// Assets
import Navbar from 'components/navbar/NavbarLanding';
import Footer from 'components/footer/FooterAuth';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';
import ImageCard from 'components/card/ImageCard';
import ImageCardGrid from 'components/card/ImageCardGrid';
import GrowthSlider from 'components/slider/GrowthSlider';
// Assets
import { ReactNode } from 'react';
import {
  getActiveNavbar,
  getActiveNavbarText,
  getActiveRoute,
} from 'utils/navigation';
import routes from 'routes';

import bg from '/public/img/landing/bg4.jpg';
import wait from '/public/img/landing/wait.jpg';
import features from '/public/img/landing/features.jpg';
import feature1 from '/public/img/landing/features1.png';
import feature2 from '/public/img/landing/features2.png';
import feature3 from '/public/img/landing/features3.png';
import feature4 from '/public/img/landing/features4.png';
import NFT from 'views/admin/marketplace/components/HistoryItem';
import JoinWaitlistCard from 'components/card/JoinWaitlistCard';
import WaitlistCard from 'components/card/WaitlistCard';
import SubscribeCard from 'components/card/SubscribeCard';


function AuthIllustration(props: {
  children: ReactNode;
  illustrationBackground: string;
}) {
  const authBg = useColorModeValue('white', 'navy.900');
  const { children, illustrationBackground, ...rest } = props;
  const { onOpen } = useDisclosure();
  const { isOpen, onToggle } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [fixed] = useState(false);

  const image = bg;  
  
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const brandColor = useColorModeValue('brand.500', 'white');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset'
  )

  const cards = [
    {
      imageUrl: feature1.src,
      title: "Save Securely in USD",
      description: "Win rewards for depositing savings",
      clr: "White",
    },
    {
      imageUrl: feature2.src,
      title: "Invest in US Stocks",
      description: "Buy stocks from US companies!",
      clr: "Black",
    },
    {
      imageUrl: feature3.src,
      title: "Buy Cryptocurrencies",
      description: "Coming Soon!",
      clr: "Black",
    },
    {
      imageUrl: feature4.src,
      title: "Access Financial Services",
      description: "Coming Soon!",
      clr: "White",
    },
  ];


  return (
    <>

      <Image
        style={{width:"110vw"}}
        src={bg.src} 
      />

      <Flex  
        h="max-content"
        minH="100vh" 
        w="100%" 
        minW="100vw" 
        bg={authBg} 
        position="relative" 
        justifyContent="center" 
        paddingBottom="90px" 
        paddingTop="90px"
        paddingLeft={isMobile ? "20px" : "80px"}
        paddingRight={isMobile ? "20px" : "80px"}
      >
        <ImageCardGrid cards={cards} />
      </Flex>

      <Flex 
        bg={authBg} 
        minH="80vh" 
        justifyContent="center"
        paddingBottom="90px" 
        paddingTop="90px"
      >
        <GrowthSlider/>
      </Flex>

      <Flex minW="100vw" w="100%" bg={authBg} position="relative" h="max-content">
        <Portal>
          <Box >
            <Navbar
              onOpen={onOpen}
              logoText={'54'}
              brandText={getActiveRoute(routes)}
              secondary={getActiveNavbar(routes)}
              message={getActiveNavbarText(routes)}
              fixed={true}
              // style={{float:"left"}}
              {...rest}
            />
          </Box>
        </Portal>
        <Flex
          h={{
            sm: 'initial',
            md: 'unset',
            lg: '100vh',
            xl: '100vh',
          }}
          w={{ base: '100vw', md: '100%' }}
          maxW={{ md: '66%', lg: '1313px' }}
          mx={{ md: 'auto' }}
          pt={{ sm: '50px', md: '0px' }}
          px={{ lg: '30px', xl: '0px' }}
          ps={{ xl: '70px' }}
          justifyContent="start"
          direction="column"
        >
          {children}
          <Box
            display={{ base: 'none', md: 'block' }}
            h="100%"
            minH="100vh"
            w={{ lg: '50vw', '2xl': '44vw' }}
            position="absolute"
            right="0px"
          >
            <Flex
              style={{ backgroundImage: `url(${illustrationBackground})` }}
              justify="center"
              align="end"
              w="100%"
              h="100%"
              bgSize="cover"
              bgPosition="50%"
              position="absolute"
              borderBottomLeftRadius={{ lg: '120px', xl: '200px' }}
            />
          </Box>
          <Footer mb={{ xl: '3vh' }} />
        </Flex>
        <FixedPlugin />
      </Flex>
    </>
  );
}

export default AuthIllustration;
