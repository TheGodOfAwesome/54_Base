'use client';
// Chakra Imports
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,

  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

import { useRouter } from 'next/navigation';

// Assets
import navImage from '/public/img/layout/Navbar.png';
import { FaEthereum } from 'react-icons/fa';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { MdInfoOutline, MdNotificationsNone } from 'react-icons/md';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import routes from 'routes';
import SubscribeCard from 'components/card/SubscribeCard';

import { createThirdwebClient, defineChain } from 'thirdweb';
import { ConnectButton, useActiveWalletConnectionStatus, useConnectModal} from "thirdweb/react";
import {sepolia, baseSepolia, arbitrumSepolia} from "thirdweb/chains";
import { inAppWallet, smartWallet } from "thirdweb/wallets";

export default function HeaderLinks(props: {
  secondary: boolean;
  onOpen: boolean | any;
  fixed: boolean | any;
}) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { push } = useRouter();

  const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  })

  const { connect, isConnecting } = useConnectModal();

  async function handleConnect() {
    const wallet = await connect({ 
      client, 
      accountAbstraction: {
        chain: defineChain(baseSepolia),
        sponsorGas: true
      },
      wallets:[ inAppWallet()]  
    }); // opens the connect modal
    
    console.log('connected to', wallet);
    // const status = useActiveWalletConnectionStatus();
    // console.log(status);
    // alert(status);
    push('/home');
  }

  return (
    <>
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
     
      {/* <Button
        fontSize="sm"
        variant="brand"
        fontWeight="500"
        w="80%"
        h="35"
        onClick={onOpen}
      >
        Join the Waitlist
      </Button> */}
     
      <Button
        fontSize="sm"
        variant="brand"
        fontWeight="500"
        w="80%"
        h="35"
        onClick={handleConnect}
      >
        Connect
      </Button>

      {/* 
      <ConnectButton 
        client={client}
      /> */}

      {/* <Button
        fontSize="sm"
        variant="brand"
        fontWeight="500"
        w="80%"
        h="35"
        onClick={()=>location.href='./auth'}
      >
        Sign Up For Free
      </Button> */}

      <FontAwesomeIcon icon={faXTwitter} style={{paddingLeft:"8px", paddingRight:"8px"}} color={navbarIcon} size="1x" className="twitter-icon" onClick={()=>window.open("https://twitter.com/fiftyfourco", "_blank")}/>
      
      <Link href="mailto:kmuvezwa@gmail.com">
        <Menu>
          <MenuButton p="0px">
            <Icon
              mt="6px"
              as={MdInfoOutline}
              color={navbarIcon}
              w="18px"
              h="18px"
              me="10px"
            />
          </MenuButton>
        </Menu>
      </Link>

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
    </Flex>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
          <SubscribeCard name="Test"/>
      </ModalContent>
    </Modal>

    </>
  );
}
