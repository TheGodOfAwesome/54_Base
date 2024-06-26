'use client';
/* eslint-disable */
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

import React, { useEffect, useContext } from 'react';

import { useSmartAccountClient, useAccount, useAuthenticate, useUser } from "@alchemy/aa-alchemy/react";

// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Progress
} from '@chakra-ui/react';

// Custom components
import { ProfileCard } from 'components/alchemy/ProfileCard';
import { TurnkeyIframe } from 'components/alchemy/TurnkeyIframe';
import { HSeparator } from 'components/separator/Separator';
import DefaultAuthLayout from 'layouts/auth/Default';
// Assets
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

export default function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const googleBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.200');
  const googleText = useColorModeValue('navy.700', 'white');
  const googleHover = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.300' },
  );
  const googleActive = useColorModeValue(
    { bg: 'secondaryGray.300' },
    { bg: 'whiteAlpha.200' },
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [msg, setMsg] = React.useState<string>("Enter your email to sign in or sign up!");
  const [email, setEmail] = React.useState<string>("");
  const onEmailChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const { authenticate, isPending: isAuthenticatingUser } = useAuthenticate();
  const {  account, isLoadingAccount } = useAccount({
    type: "MultiOwnerModularAccount",
    skipCreate: true,
  });
  const user = useUser();

  const { client } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });

  function shortenAddress(address: string): string {
    if (!address) return "";
  
    const prefix = address.slice(0, 6);
    const suffix = address.slice(-4);
  
    return `${prefix}...${suffix}`;
  }
  
  return (
    <DefaultAuthLayout illustrationBackground={'/img/auth/54.png'}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In or Sign Up

            <div className="flex flex-col gap-2">
              <div>Account address</div>
              <div className="text-wrap rounded-lg p-3 dark:bg-[#1F2937] dark:text-[#CBD5E1]">
                {shortenAddress(client?.account.address)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>Email</div>
              <div className="text-wrap rounded-lg p-3 dark:bg-[#1F2937] dark:text-[#CBD5E1]">
                {user?.email}
              </div>
            </div>
          </Heading>

          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            {msg}
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          {
            isLoadingAccount || isAuthenticatingUser
            ? 
              (
                // loading progress bar
                <div className="flex items-center justify-center">
                  <Progress size="sm" isIndeterminate style={{width: "100%"}}/>
                </div>
              ) 
            : user != null && account != null && (
              // Save data to localStorage with optional encryption
              localStorage.setItem(
                'userData',
                JSON.stringify({ email: user?.email, walletAddress: account?.address }),
                // Consider using a secure encryption library for sensitive data
                // { encrypt: true } // Example encryption configuration (replace with actual implementation)
              ),
              // Redirect to home page with query parameters
              window.location.href = `/home?email=${encodeURIComponent(user.email)}&wallet_address=${encodeURIComponent(account.address)}`
            )
              ? 
                window.location.href = "/home?email=" + user?.email + "&wallet_address=" + client?.account.address
              : 
                (
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
                      value={email}
                      onChange={onEmailChange}
                    />
                    <Button
                      fontSize="sm"
                      variant="brand"
                      fontWeight="500"
                      w="100%"
                      h="50"
                      mb="24px"
                      onClick={() => {setMsg("Signing In!"), authenticate({ type: "email", email })}}
                    >
                      Sign In/Sign Up
                    </Button>
                  </FormControl>
                )
          }
          <TurnkeyIframe/>
        </Flex>
      </Flex>
    </DefaultAuthLayout>
  );
}
