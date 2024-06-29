'use client';
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useEffect, useState } from 'react';

import { useSearchParams, redirect } from 'next/navigation';

import supabase from 'config/supabaseClient';

import { useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";

import { TurnkeyIframe } from 'components/alchemy/TurnkeyIframe';

import { createThirdwebClient, defineChain, getContract, toEther } from 'thirdweb';
import { ConnectButton, useActiveWalletConnectionStatus, useConnectModal, useActiveAccount, useSwitchActiveWalletChain, useReadContract, TransactionButton } from "thirdweb/react";
import {sepolia, baseSepolia, arbitrumSepolia} from "thirdweb/chains";
import { smartWallet } from "thirdweb/wallets";
import { claimTo as claimERC20, balanceOf as balanceOfERC20 } from "thirdweb/extensions/erc20";

// Chakra imports

import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Icon,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
  AspectRatio,
  
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,

  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,

  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,

  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,

  Theme,
  useToast,
  Link,
  Grid,
  useEditable,
} from '@chakra-ui/react';

// Custom components
import CheckTable from 'views/admin/default/components/CheckTable';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import PieCard from 'views/admin/default/components/PieCard';
import Tasks from 'views/admin/default/components/Tasks';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import tableDataCheck from 'views/admin/default/variables/tableDataCheck';
import tableDataComplex from 'views/admin/default/variables/tableDataComplex';
import { UserProfileCard } from 'components/alchemy/UserProfileCard';

import HistoryItem from 'views/admin/marketplace/components/HistoryItem';
import NFT from 'components/card/NFT';
import Card from 'components/card/Card';
import tableDataTopCreators from 'views/admin/marketplace/variables/tableDataTopCreators';
import LatestTransactions from 'views/admin/marketplace/components/LatestTransactions';
import PieChart from 'views/admin/default/components/AssetPieChart';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import AdminLayout from 'layouts/admin';
import TotalSaved from 'views/admin/default/components/TotalSaved';
import BuyStocks from 'components/card/BuyStocks';
import BuyETFs from 'components/card/BuyETFs';
import BuyCrypto from 'components/card/BuyCrypto';
import SellAssets from 'components/card/SellAssets';
import DepositFunds from 'components/card/DepositFunds';
import WithdrawFunds from 'components/card/WithdrawFunds';

import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdPayment,
  MdRedeem,
} from 'react-icons/md';

// Assets
import Usa from 'img/dashboards/usa.png';
import goal1 from '/public/img/goals/1.jpg';
import goal2 from '/public/img/goals/2.jpg';
import goal3 from '/public/img/goals/3.jpg';
import goal4 from '/public/img/goals/4.jpg';
import goal5 from '/public/img/goals/5.jpg';
import goal6 from '/public/img/goals/6.jpg';
import loading from '/public/img/loading.gif';

import Nft1 from 'img/nfts/Nft1.png';
import Nft2 from 'img/nfts/Nft2.png';
import Nft3 from 'img/nfts/Nft3.png';

import ARKB from 'img/etfs/ark.jpg';
import BITB from 'img/etfs/bitwise.jpg';
import EZBC from 'img/etfs/franklin.jpg';
import DEFI from 'img/etfs/hashdex.jpg';
import BTCO from 'img/etfs/invesco.jpg';
import PHO from 'img/etfs/invesco.jpg';
import WOOD from 'img/etfs/ishares.jpg';
import SPY from 'img/etfs/spdr.jpg';
import SLX from 'img/etfs/vaneck.jpg';

import AAPL from 'img/stocks/AAPL.png';
import AMZN from 'img/stocks/AMZN.png';
import COIN from 'img/stocks/COIN.png';
import DIS from 'img/stocks/DIS.png';
import GOOGL from 'img/stocks/GOOGL.png';
import NFLX from 'img/stocks/NFLX.png';
import NVDA from 'img/stocks/NVDA.png';
import MSFT from 'img/stocks/MSFT.png';
import PYPL from 'img/stocks/PYPL.png';

import BTC from 'img/crypto/btc.png';
import ETH from 'img/crypto/eth.png';
import USDC from 'img/crypto/usdc.png';

import stocks from 'img/products/stocks.jpg';
import sandp from 'img/stocks/SANDP.png';

export default function NftMarketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [fetchError, setFetchError] = useState(null);
  const [userData, setUserData] = useState(null);

  const user = useUser();
  const { client } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });

  const client3rdWeb = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  });


  const searchParams = useSearchParams();
  
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const [showModal, setShowModal] = useState(false);
  const [sellAssets, setSellAssets] = useState(false);
  const [depositFunds, setDepositFunds] = useState(false);
  const [withdrawFunds, setWithdrawFunds] = useState(false);
  const [claimTokens, setClaimTokens] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState(18);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [saved, setSaved] = useState(false);

  const [goalOne, setGoalOne] = useState(false);
  const [goalTwo, setGoalTwo] = useState(false);
  const [goalThree, setGoalThree] = useState(false);
  const [goalFour, setGoalFour] = useState(false);
  const [goalFive, setGoalFive] = useState(false);
  const [goalSix, setGoalSix] = useState(false);

  const toast = useToast();

  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const TOKEN_CONTRACT = "0xC92575734B437DF10bc44505D96Ac9a555D1740A";
  const DROP_CONTRACT = "0xfbE5435Eb4ffD7AFe60A289dAE2101539feD80F8";
  const DEX_CONTRACT = "0xbe3770d65275aF5f0c56ee4dde13747D4B15c7d1";

  // const { contract: tokenContract } = useContract

  const switchChain = useSwitchActiveWalletChain();
  // const sdk = useSDK();
  // const blnc = 

  const {data: blncOfERC20} = useReadContract(
    balanceOfERC20,
    {
      contract: getContract({
        client: client3rdWeb,
        chain: defineChain(baseSepolia),
        address: DROP_CONTRACT
      }),
      address: walletAddress as `0x${string}` || ""  as `0x${string}`
    }
  );

  const tokenContractSPY = getContract(
    {
      client: client3rdWeb,
      chain: defineChain(baseSepolia),
      address: DROP_CONTRACT
    }
  );

  const steps = [
    { title: '1', description: 'Info' },
    { title: '2', description: 'Goals' },
    { title: '3', description: 'Finish' },
  ]
  
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  })

  function removeEmptyStrings(arr: string[]): string[] {
    return arr.filter((element) => element.trim() !== "");
  }
  
  type User = {
    // Define the properties of your user object here
    name : string; 
    surname : string; 
    email: string;
    age:  number;
    phone_number : string; 
    home_address : string; 
    city : string; 
    country : string;
    wallet_address : string;
    saving_objectives : string;
  };

  const insertUser = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user]);
  
      if (error) {
        throw error;
      }
      // data: Object is possibly 'null'.
      // console.log('User inserted successfully:', data?.[0]); // This is for debugging purposes, remove in production
      setSaved(true);
      let proxyData = ["data"]
      if (data)
        proxyData = data;
      return proxyData?.[0]; // Return the inserted user data (optional) 
    } catch (error) {
      console.error('Error inserting user:', error);
      setSaved(true);
      throw error; // Re-throw the error for handling in the calling component
    }
  };

  const handleInsertUser = async () => {    
    const goals = `[\'Emergency Fund\'${(goalTwo == true) ? ", \'Electornics\'" : ""}${(goalThree == true) ? ", \'Car\'" : ""}${(goalFour == true) ? ", \'House\'" : ""}${(goalFive == true) ? ", \'Retirement\'" : ""}${(goalSix == true) ? ", \'Financial Freedom\'" : ""}]`;

    setSaved(false);

    const newUser: User = {
      name: firstName,
      surname: lastName,
      email: searchParams.get("email"),
      age:  age,
      phone_number : phoneNumber, 
      home_address : address, 
      city : city, 
      country : country,
      wallet_address : searchParams.get("wallet_address"),
      saving_objectives : goals,
    };

    try {
      const insertedUser = await insertUser(newUser);
      console.log('User created:', insertedUser); // Optional
      // Handle successful insertion here (e.g., display a success message)
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error here (e.g., display an error message to the user)
    }
  };

  useEffect(() => {

    switchChain(baseSepolia)

    const email = searchParams.get("email");
    const wallet_address = searchParams.get("wallet_address");

    const fetchUserData = async () => {
      const acc_address = await client?.account.address;
      const user_email = await user?.email;

      const {data, error} = await supabase.from('users').select().eq('email', email);
      if (error) { 
        setFetchError("Couldn't fetch user!");
        console.log("Error: ");
        console.log(error);
      }

      if (data) {
        const userProfile = data?.[0];

        localStorage.setItem(
          'userProfile',
          JSON.stringify(userProfile),
        )

        setUserData(data);
        setFetchError(null);
        console.log("Data: ");
        console.log(data);
        if (data.length == 0) {
          setShowModal(true);
        }
      }
    }
    
    if (email && wallet_address) {
      fetchUserData();
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      // alert(JSON.stringify(userData));
    } else {
      // redirect('/');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      // alert(JSON.stringify(userData));
    }
  },[])

  return (
    <>
      <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
            gap="20px"
            mb="20px"
          >
            <MiniStatistics growth="+23%" name="Total Balance" value="$574.34" />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
                  }
                />
              }
              name="Token Balance"
              value={"$" + walletAddress && blncOfERC20 ? toEther(blncOfERC20) : "0"} 
              // value="$0" 
            />
            {/* <Link
              onClick={()=>{alert("Buy")}}
            >
              <MiniStatistics
                startContent={
                  <IconBox
                    w="56px"
                    h="56px"
                    bg={boxBg}
                    icon={
                      <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                    }
                  />
                }
                name="Buy Stocks, ETFs & Crypto"
                value="Buy Assets"
              />
            </Link> */}
            <Link
              onClick={()=>{setClaimTokens(!claimTokens)}}
            >
              <MiniStatistics
                startContent={
                  <IconBox
                    w="56px"
                    h="56px"
                    bg={boxBg}
                    icon={
                      <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                    }
                  />
                }
                name="Auto Invests in S&P500 stocks."
                value="Quick Invest"
              />
            </Link>
            <Link
              onClick={()=>{setSellAssets(!sellAssets)}}
            >
              <MiniStatistics
                startContent={
                  <IconBox
                    w="56px"
                    h="56px"
                    bg={boxBg}
                    icon={
                      <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                    }
                  />
                }
                name="Sell Stocks, ETFs & Crypto"
                value="Sell Assets"
              />
            </Link>
            <Link
              onClick={()=>{setDepositFunds(!depositFunds)}}
            >
              <MiniStatistics
                startContent={
                  <IconBox
                    w="65px"
                    h="65px"
                    bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                    icon={<Icon w="32px" h="32px" as={MdPayment} color="white" />}
                  />
                }
                name="Deposit Cash Funds"
                value="Deposit"
              />
            </Link>
            <Link
              onClick={()=>{setWithdrawFunds(!withdrawFunds)}}
            >
              <MiniStatistics
                startContent={
                  <IconBox
                    w="65px"
                    h="65px"
                    bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                    icon={<Icon w="32px" h="32px" as={MdRedeem} color="white" />}
                  />
                }
                name="Withdraw Cash Funds"
                value="Withdraw"
              />
            </Link>
          </SimpleGrid>

        {/* Main Fields */}
        <Grid
          mb="20px"
          gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
          gap={{ base: '20px', xl: '20px' }}
          display={{ base: 'block', xl: 'grid' }}
        >
          <Flex
            flexDirection="column"
            gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}
          >
            {/* <Banner /> */}
            <Flex direction="column">
              <Flex
                mt="45px"
                mb="20px"
                justifyContent="space-between"
                direction={{ base: 'column', md: 'row' }}
                align={{ base: 'start', md: 'center' }}
              >
                <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                  Growth Chart
                </Text>
                {/* <Flex
                  align="center"
                  me="20px"
                  ms={{ base: '24px', md: '0px' }}
                  mt={{ base: '20px', md: '0px' }}
                >
                  <Link
                    href="#art"
                    color={textColorBrand}
                    fontWeight="500"
                    me={{ base: '34px', md: '44px' }}
                  >
                    Art
                  </Link>
                  <Link
                    href="#music"
                    color={textColorBrand}
                    fontWeight="500"
                    me={{ base: '34px', md: '44px' }}
                  >
                    Music
                  </Link>
                  <Link
                    href="#collectibles"
                    color={textColorBrand}
                    fontWeight="500"
                    me={{ base: '34px', md: '44px' }}
                  >
                    Collectibles
                  </Link>
                  <Link href="#sports" color={textColorBrand} fontWeight="500">
                    Sports
                  </Link>
                </Flex> */}
              </Flex>
              <SimpleGrid columns={{ base: 1 }} gap="20px">
                <TotalSaved/>
              </SimpleGrid>
              <Text
                mt="45px"
                mb="36px"
                color={textColor}
                fontSize="2xl"
                ms="24px"
                fontWeight="700"
              >
                Buy ETFs, Stocks and Cryptos
              </Text>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
                <BuyETFs
                  name="Exchange Traded Funds"
                  author="US ETFs"
                  bidders={[
                    ARKB,
                    BITB,
                    EZBC,
                    DEFI,
                    PHO,
                    WOOD,
                    SPY,
                    SLX,
                  ]}
                  image={Nft1}
                  currentbid="0"
                  download="#"
                />
                <BuyStocks
                  name="Stocks"
                  author="US Stocks"
                  bidders={[
                    AAPL,
                    AMZN,
                    COIN,
                    DIS,
                    GOOGL,
                    NFLX,
                    NVDA,
                    MSFT,
                    PYPL,
                  ]}
                  image={Nft2}
                  currentbid="0"
                  download="#"
                />
                <BuyCrypto
                  name="Cryptocurrencies"
                  author="Coming Soon"
                  bidders={[
                    BTC,
                    ETH,
                    USDC,
                  ]}
                  image={Nft3}
                  currentbid="0"
                  download="#"
                />
              </SimpleGrid>
            </Flex>
          </Flex>
          <Flex
            flexDirection="column"
            gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
          >
            <Card px="0px" mb="20px">
              <PieChart/>
            </Card>
            <Card p="0px">            
              <LatestTransactions tableData={tableDataTopCreators} />
            </Card>
          </Flex>
        </Grid>
      </Box>

      {
        showModal 
        &&
        <Modal size="lg" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
            {(activeStep == 1) && <ModalHeader>Personal Details</ModalHeader>}
            {(activeStep == 2) && <ModalHeader>Select your top financial goals</ModalHeader>}
            <ModalCloseButton />
            <ModalBody>
              { 
                (activeStep == 1)
                &&
                <>
                  <SimpleGrid columns={2} spacing={10}>
                    <FormControl isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input placeholder='First Name' value={firstName} onChange={(event)=>{setFirstName(event.target.value)}}/>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input placeholder='Last Name' value={lastName} onChange={(event)=>{setLastName(event.target.value)}}/>
                    </FormControl>
                  </SimpleGrid>
                  <SimpleGrid columns={2} spacing={10}>
                    <FormControl isRequired>
                      <FormLabel>Age</FormLabel>
                      <NumberInput defaultValue={18} min={1} max={100}  value={age} onChange={(event)=>{setAge(Number(event))}}>
                        <NumberInputField/>
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input placeholder='Phone Number' type="tel" value={phoneNumber} onChange={(event)=>{setPhoneNumber(event.target.value)}}/>
                    </FormControl>
                  </SimpleGrid>              
                  <div style={{paddingTop:"10px"}}>
                    <FormControl isRequired>
                      <FormLabel>Address</FormLabel>
                      <Input placeholder='Address'  value={address} onChange={(event)=>{setAddress(event.target.value)}}/>
                    </FormControl>
                  </div>
                  <SimpleGrid columns={2} spacing={10} paddingBottom="20px" paddingTop="10px">
                    <FormControl isRequired>
                      <FormLabel>City</FormLabel>
                      <Input placeholder='City'  value={city} onChange={(event)=>{setCity(event.target.value)}}/>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Country</FormLabel>
                      <Input placeholder='Zimbabwe' value={country} onChange={(event)=>{setCountry(event.target.value)}}/>
                    </FormControl>
                  </SimpleGrid>
                </>
              }
              {
                (activeStep == 2)
                &&
                <SimpleGrid columns={2} spacing={3} paddingBottom="10px">
                  <Box position="relative" cursor="pointer">
                    <Image src={goal1.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalOne) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalOne(!goalOne)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Emergency <br/> Fund
                      </Text>
                    </Box>
                  </Box>
                  <Box position="relative" cursor="pointer">
                    <Image src={goal2.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalTwo) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalTwo(!goalTwo)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Electornics
                      </Text>
                    </Box>
                  </Box>
                  <Box position="relative" cursor="pointer">
                    <Image src={goal3.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalThree) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalThree(!goalThree)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Car
                      </Text>
                    </Box>
                  </Box>
                  <Box position="relative" cursor="pointer">
                    <Image src={goal4.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalFour) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalFour(!goalFour)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Home
                      </Text>
                    </Box>
                  </Box>
                  <Box position="relative" cursor="pointer">
                    <Image src={goal5.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalFive) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalFive(!goalFive)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Retirement
                      </Text>
                    </Box>
                  </Box>
                  <Box position="relative" cursor="pointer">
                    <Image src={goal6.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalSix) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalSix(!goalSix)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Financial <br/> Freedom
                      </Text>
                    </Box>
                  </Box>
                </SimpleGrid>
              }
              {
                (activeStep == 3)
                &&
                <Box display="flex" justifyContent="center" alignItems="center" width="full" height="full">
                  <Image src={loading.src}  borderRadius="20px" alt="" />
                </Box>
              }
              { 
                (activeStep == 1) && 
                (
                  (firstName == "" || lastName == "" || phoneNumber == "" || address == "" || city == "" || country == "")
                  ?
                    <Button
                      fontSize="sm"
                      variant="brand"
                      fontWeight="500"
                      w="100%"
                      h="50"
                      onClick={() =>
                        toast({
                          title: 'Personal Details.',
                          description: "Please fill in all of your details!",
                          status: 'error',
                          duration: 9000,
                          isClosable: true,
                        })
                      }
                    >
                      Next
                    </Button>
                  :
                    <Button
                      fontSize="sm"
                      variant="brand"
                      fontWeight="500"
                      w="100%"
                      h="50"
                      onClick={()=>{ setActiveStep(activeStep + 1)}}
                    >
                      Next
                    </Button>
                )
              }
              {
                (activeStep == 2)
                &&
                <Button
                  fontSize="sm"
                  variant="brand"
                  fontWeight="500"
                  w="100%"
                  h="50"
                  onClick={()=>{ setActiveStep(activeStep + 1), handleInsertUser()}}
                >
                  Next
                </Button>
              }
              {
                (activeStep == 3)
                &&
                (
                  (saved)
                  ?
                    <Button
                      fontSize="sm"
                      variant="brand"
                      fontWeight="500"
                      w="100%"
                      h="50"
                      onClick={onClose}
                    >
                      Finish
                    </Button>
                  :
                    <Button
                      fontSize="sm"
                      variant="brand"
                      fontWeight="500"
                      w="100%"
                      h="50"
                    >
                      Processing
                    </Button>
                )
              }
            </ModalBody>
            <ModalFooter>
              <Stepper index={activeStep} style={{width:"100%"}} colorScheme='brand' >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink='0'>
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }
      <Modal size="lg" isOpen={sellAssets} onClose={()=>setSellAssets(false)}>
        <ModalOverlay />
        <ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
          <ModalHeader>Sell Stocks, Assets and ETFs</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SellAssets image={undefined} name={''} author={''} bidders={[]} download={''} currentbid={''}/>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal size="lg" isOpen={depositFunds} onClose={()=>setDepositFunds(false)}>
        <ModalOverlay />
        <ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
          <ModalHeader>Deposit Funds into your Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DepositFunds image={undefined} name={''} author={''} bidders={[]} download={''} currentbid={''}/>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal size="lg" isOpen={withdrawFunds} onClose={()=>setWithdrawFunds(false)}>
        <ModalOverlay />
        <ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
          <ModalHeader>Withdraw Funds from your Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <WithdrawFunds image={undefined} name={''} author={''} bidders={[]} download={''} currentbid={''}/>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal size="lg" isOpen={claimTokens} onClose={()=>setClaimTokens(false)}>
        <ModalOverlay />
        <ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
          <ModalHeader>Auto Invest</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Auto Invest in S&P 500 index</p>
            <AspectRatio ratio={7 / 5}>
              <Image src={sandp.src} w={'100%'} borderRadius="20px" alt="" />
            </AspectRatio>
            <br/>
            <TransactionButton
              style={{
                width:"100%", 
                color:"white",
                backgroundColor: "#4326ff"
              }}
              transaction={()=> claimERC20({
                contract: tokenContractSPY,
                to:  walletAddress as `0x${string}` || ""  as `0x${string}`,
                quantity: "10"
              })}
              onError={async (e) => {
                alert("Auto Invest Error" + JSON.stringify(e.message))
              }}
              onTransactionSent={async () => {
                alert("Auto Invest Started")
              }}
              onTransactionConfirmed={async (res) => {
                alert("Auto Invest Completed at " + res.transactionHash + " to see more visit " + "https://sepolia.basescan.org/tx/" + res.transactionHash)
              }}

            > 
              Auto Invest 
            </TransactionButton>
            <br/>
          </ModalBody>
        </ModalContent>
      </Modal>
      <TurnkeyIframe/>
    </>
  );
}
