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


import { useState, useEffect, useRef, useMemo, useContext } from 'react';

import { useSearchParams, redirect } from 'next/navigation';

import supabase from 'config/supabaseClient';

import { useSmartAccountClient, useUser } from "@alchemy/aa-alchemy/react";

import { 
  AlchemySigner,
  AlchemySignerClient,
  AlchemySignerParams,
  User, 
} from "@alchemy/aa-alchemy";

import { TurnkeyIframe } from 'components/alchemy/TurnkeyIframe';

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
} from '@chakra-ui/react';

// Custom components
// import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from 'react-icons/md';
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

// Assets
import Usa from 'img/dashboards/usa.png';
import goal1 from '/public/img/goals/1.jpg';
import goal2 from '/public/img/goals/2.jpg';
import goal3 from '/public/img/goals/3.jpg';
import goal4 from '/public/img/goals/4.jpg';
import goal5 from '/public/img/goals/5.jpg';
import goal6 from '/public/img/goals/6.jpg';
import loading from '/public/img/loading.gif';

export default function Default() {
  // Chakra Color Mode
  const brandColor = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [fetchError, setFetchError] = useState(null);
  const [userData, setUserData] = useState(null);

  const user = useUser();
  const { client } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });

  const searchParams = useSearchParams();
  
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const [showModal, setShowModal] = useState(false);

  
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
    } else {
      redirect('/');
    }
  },[])

  return (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
          gap="20px"
          mb="20px"
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
            name="Earnings"
            value="$350.4"
          />
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
            name="Spend this month"
            value="$642.39"
          />
          <MiniStatistics growth="+23%" name="Sales" value="$574.34" />
          <MiniStatistics
            endContent={
              <Flex me="-16px" mt="10px">
                <FormLabel htmlFor="balance">
                  <Box boxSize={'12'}>
                    <Image alt="" src={Usa.src} w={'100%'} h={'100%'} />
                  </Box>
                </FormLabel>
                <Select
                  id="balance"
                  variant="mini"
                  mt="5px"
                  me="0px"
                  defaultValue="usd"
                >
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="gba">GBA</option>
                </Select>
              </Flex>
            }
            name="Your balance"
            value="$1,000"
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
              />
            }
            name="New Tasks"
            value="154"
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
                }
              />
            }
            name="Total Projects"
            value="2935"
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
          <TotalSpent />
          <PieCard />
        </SimpleGrid>

        {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
          <TotalSpent />
          <WeeklyRevenue />
          <UserProfileCard/>
        </SimpleGrid> */}
        
       

        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
          <TotalSpent />
          {/* <WeeklyRevenue /> */}
          <UserProfileCard/>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
          <CheckTable tableData={tableDataCheck} />
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
            <DailyTraffic />
            <PieCard />
          </SimpleGrid>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
          <ComplexTable tableData={tableDataComplex} />
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
            <Tasks />
            {/* <MiniCalendar h="100%" minW="100%" selectRange={false} /> */}
          </SimpleGrid>
        </SimpleGrid>
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
      <TurnkeyIframe/>
    </>
  );
}
