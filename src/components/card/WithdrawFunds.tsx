// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  AspectRatio,

  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,

  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,

  useToast,
} from '@chakra-ui/react';

import axios from 'axios';

import supabase from 'config/supabaseClient';

// Custom components
import Card from './Card';
// Assets
import { useState } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { RiStockFill, RiStockLine } from "react-icons/ri";
import { AiOutlineStock } from "react-icons/ai"
import React from 'react';

import etfs from 'img/products/etfs.jpg';

import ARKB from 'img/etfs/ARKB.jpg';
import BITB from 'img/etfs/BITB.jpg';
import BTCO from 'img/etfs/BTCO.jpg';
import DEFI from 'img/etfs/DEFI.jpg';
import EZBC from 'img/etfs/EZBC.jpg';
import PHO from 'img/etfs/PHO.jpg';
import SLX from 'img/etfs/SLX.jpg';
import SPY from 'img/etfs/SPY.jpg';
import WOOD from 'img/etfs/WOOD.jpg';


export default function WithdrawFunds(props: {
  image: string | any;
  name: string;
  author: string;
  bidders: string[] | any[];
  download: string;
  currentbid: string | number;
}) {
  const { image, name, author, bidders, download, currentbid } = props;
  const [like, setLike] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [stockTicker, setStockTicker] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [stockUnits, setStockUnits] = useState(0);
  const [stockPrice, setStockPrice] = useState(0);
  const [orderPrice, setOrderPrice] = useState(0);
  const [inactivePaymentInput, setInactivePaymentInput] = useState(true);
  const [processed, setProcessed] = useState(false);
  const [errorAmount, setErrorAmount] = useState("");
  const [errorAmountState, setErrorAmountState] = useState(false);

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorBid = useColorModeValue('brand.500', 'white');
  const apiKey = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY
  const toast = useToast();

  const roundUp: (numberToRoundUp: number, decimals?: number) => number = (numberToRoundUp, decimals = 2) => {
    const multiplier = Math.pow(10, decimals || 0);
    return Math.ceil(numberToRoundUp * multiplier) / multiplier;
  };

  const setETF = async (etf: any) => {
    setSelectedValue(etf);
    const etfSymbol = etf.slice(0, -2);
    setStockTicker(etfSymbol);
    getStockPrice(etfSymbol, apiKey);
    setInactivePaymentInput(false);
  }

  const api = axios.create({
    baseURL: 'https://www.alphavantage.co/query?', // Alpha Vantage API base URL
  });

  const getStockPrice = async (symbol: string, apiKey: string) => {
    const response = await api.get('', {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval: '1min',
        // outputsize: 'compact',
        apikey: apiKey,
      },
    });
  
    const timeSeriesData = response.data['Time Series (1min)'];
    const latestTimestamp = Object.keys(timeSeriesData)[Object.keys(timeSeriesData).length - 1]; // Get the last key (latest timestamp)
    const latestClosePrice = timeSeriesData[latestTimestamp]['4. close'];

    setStockPrice(Number(latestClosePrice));
    return latestClosePrice;
  };

  const calculateOrder = async (payment: number) => {
    setPaymentAmount(payment);

    // Check for invalid inputs (non-positive values)
    if (payment < 3) {
      setErrorAmount("Your minimum order should be $3");
      setErrorAmountState(true);
    } else {
      setErrorAmount("");
      setErrorAmountState(false)
    }

    // Calculate the number of shares
    const shares = payment / stockPrice;

    // Return the number of shares (rounded down to avoid fractional shares)
    setStockUnits(Number(shares.toFixed(2)));
    return Math.floor(shares);
  }

  const processOrder = async () => {
    if (stockPrice > 0 && stockUnits > 0 && paymentAmount >= 3 && selectedValue != "" && stockTicker != "")  {
      
      toast({
        title: "Processing your order!",
        status: "success",
        isClosable: true,
      })

      const today = new Date();
      const formattedDate = today.toLocaleDateString();
      const orderDetails = 
        "Buy " + 
        stockTicker + 
        " at $" + 
        stockPrice + 
        " paying $" + 
        paymentAmount + 
        " on " + 
        formattedDate +
        " to receive " +
        stockUnits +
        " " +
        selectedValue;

      const newOrder: Order = {
        user_id: 1234,
        user_number: "",
        wallet_address: "",
        order_type: "Buy ETF",
        order_details: orderDetails,
        order_time: formattedDate,
        order_amount: paymentAmount,
        token: selectedValue,
        token_value: stockUnits,
        token_recipient: "me",
        order_symbol: selectedValue,
        order_asset_price: stockPrice,
        order_asset_units: stockUnits,
        token_symbol: selectedValue,
        order_asset_symbol: stockTicker,
        order_blockchain: "Arbitrum"
      }

      await insertOrder(newOrder);

      const newTransaction: Transaction = {
        // Define the properties of your user object here
        user_id: 1234,
        user_number: "",
        wallet_address: "",
        transaction_type: "Buy",
        transaction_details: orderDetails,
        transaction_time: formattedDate,
        transaction_amount: paymentAmount,
        token: selectedValue,
        token_value: stockUnits,
        token_recipient: "me",
        ticker_symbol: stockTicker
      }; 

      await insertTransaction(newTransaction);
      
      toast({
        title: "Your order has been placed!",
        status: "success",
        isClosable: true,
      })

    } else {
      
      toast({
        title: "Please select an ETF. Input how much you want to spend and place your order!",
        status: "warning",
        isClosable: true,
      })
    } 
  }
  
  type Order = {
    user_id: number;
    user_number: string;
    wallet_address: string;
    order_type: string;
    order_details: string;
    order_time: string;
    order_amount: number;
    token: string;
    token_value: number;
    token_recipient: string;
    order_symbol: string;
    order_asset_price: number;
    order_asset_units: number;
    token_symbol: string;
    order_asset_symbol: string;
    order_blockchain: string;
  };

  const insertOrder = async (order: Order) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([order]);
  
      if (error) {
        throw error;
      }
      // data: Object is possibly 'null'.
      // console.log('Order inserted successfully:', data?.[0]); // This is for debugging purposes, remove in production
      setProcessed(true);
      let proxyData = ["data"]
      if (data)
        proxyData = data;
      return proxyData?.[0]; // Return the inserted user data (optional) 
    } catch (error) {
      console.error('Error inserting order:', error);
      setProcessed(true);
      throw error; // Re-throw the error for handling in the calling component
    }
  };
  
  type Transaction = {
    // Define the properties of your user object here
    user_id: number;
    user_number: string;
    wallet_address: string;
    transaction_type: string;
    transaction_details: string;
    transaction_time: string;
    transaction_amount: number;
    token: string;
    token_value: number;
    token_recipient: string;
    ticker_symbol: string;
  };

  const insertTransaction = async (transaction: Transaction) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction]);
  
      if (error) {
        throw error;
      }
      // data: Object is possibly 'null'.
      // console.log('Transaction inserted successfully:', data?.[0]); // This is for debugging purposes, remove in production
      setProcessed(true);
      let proxyData = ["data"]
      if (data)
        proxyData = data;
      return proxyData?.[0]; // Return the inserted transactions data (optional) 
    } catch (error) {
      console.error('Error inserting transaction:', error);
      setProcessed(true);
      throw error; // Re-throw the error for handling in the calling component
    }
  };

  return (
    <Card p="20px">
      <Flex direction={{ base: 'column' }} justify="center">
        <Box mb={{ base: '20px', '2xl': '20px' }} position="relative">
          <AspectRatio ratio={7 / 5}>
            <Image 
              src={
                etfs.src
              } 
              w={'100%'} 
              borderRadius="20px" 
              alt="" 
            />
          </AspectRatio>
          <Button
            position="absolute"
            bg="white"
            _hover={{ bg: 'whiteAlpha.900' }}
            _active={{ bg: 'white' }}
            _focus={{ bg: 'white' }}
            p="0px !important"
            top="14px"
            right="14px"
            borderRadius="50%"
            minW="36px"
            h="36px"
            onClick={() => {
              setLike(!like);
            }}
          >
            <Icon
              transition="0.2s linear"
              w="20px"
              h="20px"
              as={AiOutlineStock}
              color="brand.500"
            />
          </Button>
        </Box>
        <Flex flexDirection="column" justify="space-between" h="100%">
          <Flex
            justify="space-between"
            direction={{
              base: 'row',
              md: 'column',
              lg: 'row',
              xl: 'column',
              '2xl': 'row',
            }}
            mb="auto"
          >
            <Flex direction="column">
              <Text
                color={textColor}
                fontSize={{
                  base: 'xl',
                  md: 'lg',
                  lg: 'lg',
                  xl: 'lg',
                  '2xl': 'md',
                  '3xl': 'lg',
                }}
                mb="5px"
                fontWeight="bold"
                me="14px"
              >
                {name}
              </Text>
              <Text
                color="secondaryGray.600"
                fontSize={{
                  base: 'sm',
                }}
                fontWeight="400"
                me="14px"
              >
                {author}
              </Text>
            </Flex>
            <AvatarGroup
              max={3}
              color={textColorBid}
              size="sm"
              mt={{
                base: '0px',
                md: '10px',
                lg: '0px',
                xl: '10px',
                '2xl': '0px',
              }}
              fontSize="12px"
            >
              {bidders.map((avt, key) => (
                <Avatar key={key} h={'32px'} w={'32px'} src={avt.src} />
              ))}
            </AvatarGroup>
          </Flex>
          <Flex
            align={{
              base: 'center',
              md: 'start',
              lg: 'center',
              xl: 'start',
              '2xl': 'center',
            }}
            justify="space-between"
            direction={{
              base: 'row',
              md: 'column',
              lg: 'row',
              xl: 'column',
              '2xl': 'row',
            }}
            mt="25px"
          >
              <FormControl>
                <FormLabel>You Receive: {stockUnits} {stockTicker}</FormLabel>
                  <Select placeholder='Select ETF' value={selectedValue} onChange={(event) => {setETF(event.target.value)}}>
                    <option value='SPY.d'>SPDR S&P 500 ETF Trust - SPY</option>
                    <option value='SLX.d'>VanEck Steel ETF - SLX</option>
                    <option value='WOOD.d'>iShares Global Timber & Forestry ETF - WOOD</option>
                    <option value='PHO.d'>Invesco Water Resources ETF - PHO</option>
                    <option value='BTCO.d'>Invesco Galaxy Bitcoin ETF - BTCO</option>
                    <option value='ARKB.d'>ARK 21Shares Bitcoin ETF - ARKB</option>
                    <option value='BITB.d'>Bitwise Bitcoin ETF - BITB</option>
                    <option value='EZBC.d'>Franklin Bitcoin ETF - EZBC</option>
                    <option value='DEFI.d'>Hashdex Bitcoin Futures ETF - DEFI</option>
                  </Select>
              </FormControl>
          </Flex>
          <Flex
            align={{
              base: 'center',
              md: 'start',
              lg: 'center',
              xl: 'start',
              '2xl': 'center',
            }}
            justify="space-between"
            direction={{
              base: 'row',
              md: 'column',
              lg: 'row',
              xl: 'column',
              '2xl': 'row',
            }}
            mt="25px"
          >
            <FormControl isInvalid={errorAmountState}>
              <FormLabel>You Pay: USD$ {paymentAmount}</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
                  $
                </InputLeftElement>
                <Input placeholder='Enter amount' isDisabled={inactivePaymentInput} onChange={(event) => {calculateOrder(Number(event.target.value))}}/>
              </InputGroup>
              <FormErrorMessage>{errorAmount}</FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex
            align={{
              base: 'center',
              md: 'start',
              lg: 'center',
              xl: 'start',
              '2xl': 'center',
            }}
            justify="space-between"
            direction={{
              base: 'row',
              md: 'column',
              lg: 'row',
              xl: 'column',
              '2xl': 'row',
            }}
            mt="25px"
          >
            <Text fontWeight="700" fontSize="sm" color={textColorBid}>
              Current Order: {(paymentAmount > 3) ? "$" : ""} {paymentAmount}
            </Text>
            <Button
              onClick={() => {processOrder()}}
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
            >
              Place Order
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
