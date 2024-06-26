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

import React, { useEffect, useContext, useState } from 'react';

import { useSmartAccountClient, useAccount, useAuthenticate, useUser } from "@alchemy/aa-alchemy/react";

import {
  ParticleAuthModule,
  ParticleProvider,
} from "@biconomy/particle-auth";
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, BiconomySmartAccountV2Config, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import {
  IPaymaster,
  BiconomyPaymaster,
} from '@biconomy/paymaster';
import Minter from 'components/biconomy/Minter';


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
  
  const [address, setAddress] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false);
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)

  function shortenAddress(address: string): string {
    if (!address) return "";
  
    const prefix = address.slice(0, 6);
    const suffix = address.slice(-4);
  
    return `${prefix}...${suffix}`;
  }

  const particle = new ParticleAuthModule.ParticleNetwork({
    projectId: "bb8d58f8-0d3c-4306-a5f1-6cc7aa73b012",
    clientKey: "c9rwyb2a3pQhHapL1EphoNKYnFsVQkAEHgWP5TRm",
    appId: "bd23aa64-ef27-4054-a823-25aa32d903a4",
    wallet: {
      displayWalletEntry: true,
      defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.BR,
    },
  });

  const bundler: IBundler = new Bundler({
    bundlerUrl: 'https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
    chainId: ChainId.BASE_GOERLI_TESTNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })



  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: 'https://paymaster.biconomy.io/api/v1/84531/m814QNmpW.fce62d8f-41a1-42d8-9f0d-2c65c10abe9a'
  })

  const connect = async () => {
    try {
      setLoading(true)
      const userInfo = await particle.auth.login();
      console.log("Logged in user:", userInfo);
      const particleProvider = new ParticleProvider(particle.auth);
      console.log({particleProvider})
      const web3Provider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
      );
      setProvider(web3Provider)
      const biconomySmartAccountConfig: BiconomySmartAccountV2Config = {
        signer: web3Provider.getSigner(),
        chainId: ChainId.BASE_GOERLI_TESTNET,
        bundler: bundler,
        paymaster: paymaster
      }
      let biconomySmartAccount = new BiconomySmartAccountV2(biconomySmartAccountConfig)
      biconomySmartAccount =  await biconomySmartAccount.init()
      setAddress( await biconomySmartAccount.getSmartAccountAddress())
      setSmartAccount(biconomySmartAccount)
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };
  
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
            : user != null && account != null 
              ? 
                (
                  // <ProfileCard />
                  window.location.href = "/home?email=" + user?.email + "&wallet_address=" + client?.account.address
                ) 
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
