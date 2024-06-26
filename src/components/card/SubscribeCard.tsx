import React, { useState } from "react";
// Chakra imports
import { 
    Flex, Stat, StatLabel, StatNumber, 
    useColorModeValue, Text, Card, CardHeader, 
    CardBody, CardFooter, Image, Stack, Button, Heading,
    FormControl, FormLabel, Input, useToast, Checkbox, CheckboxGroup 
} from '@chakra-ui/react';
import supabase from 'config/supabaseClient';

export default function SubscribeCard(props: {
	name: string;
}) {
	const { name, } = props;
    const [email, setEmail] = React.useState('');
	const textColorSecondary = 'secondaryGray.600';
    const [ waitlistEmail, setWaitliastEmail ] = useState<string>("");
    const onWaitlistEmailChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => setWaitliastEmail(e.target.value),
      []
    );
    const [marketingApproval, setMarketingApproval] = React.useState<boolean>(true);
    const toast = useToast();
  
    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const brandStars = useColorModeValue('brand.500', 'brand.400');
    
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    
    const addToWishlistUser = async (userEmail: string ) => {
        try {
            const { data, error } = await supabase
                .from('waitlist')
                .insert([{email: userEmail}]);
        
            if (error) {
                throw error;
            }
            // data: Object is possibly 'null'.
            // console.log('User inserted successfully:', data?.[0]); // This is for debugging purposes, remove in production
            let proxyData = ["data"]
            if (data)
                proxyData = data;
            return proxyData?.[0]; // Return the inserted user data (optional) 
        } catch (error) {
            console.error('Error inserting email:', error);
            throw error; // Re-throw the error for handling in the calling component
        }
    };

    const handleJoinClick = async () => {
        // Handle join waitlist logic here (e.g., send email to backend)
        console.log('Join waitlist clicked! Email:', waitlistEmail);
        const result = await addToWishlistUser(waitlistEmail);

        toast({
            title: 'Waitlisted.',
            description: "We've added you to our Waitlist.",
            // status: 'success',
            duration: 9000,
            isClosable: true,
        })
    
        // Clear email input after submission (optional)
        setEmail('');
    };

	return (
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            // maxW="9ovw"
        >
        <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '200px' }}
            src='https://images.unsplash.com/photo-1518601794912-1af91724e528?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='Caffe Latte'
        />

        <Stack>
            <CardBody>
            <Heading size='md' paddingBottom="10px">Join our waitlist!</Heading>
            
            <FormControl>
                <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="email"
                    placeholder="save@mail.com"
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
                    onClick={() => {handleJoinClick()}}
                >
                   Join Waitlist
                </Button>

                <Checkbox colorScheme='brand' color="brand" isChecked={marketingApproval} onChange={(e) => setMarketingApproval(e.target.checked)}>
                    Yes, I'd like to receive updates on products and promotions.
                </Checkbox>
            </FormControl>
            </CardBody>
        </Stack>
        </Card>
    )
}