import React from 'react';
import { Box, Image, Input, Button, Text, useToast, Checkbox, CheckboxGroup } from '@chakra-ui/react';
import supabase from 'config/supabaseClient';

interface JoinWaitlistProps {
  imageUrl: string; // URL of the background image
}

const JoinWaitlistCard: React.FC<JoinWaitlistProps> = ({ imageUrl }) => {
  const [email, setEmail] = React.useState('');
  const [marketingApproval, setMarketingApproval] = React.useState(false);
  const toast = useToast();

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
      console.error('Error inserting user:', error);
      throw error; // Re-throw the error for handling in the calling component
    }
  };

  const handleJoinClick = async () => {
    // Handle join waitlist logic here (e.g., send email to backend)
    console.log('Join waitlist clicked! Email:', email);
    await addToWishlistUser(email);

    toast({
      title: 'Waitlisted.',
      description: "We've added you to our Waitlist.",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })

    // Clear email input after submission (optional)
    setEmail('');
  };

  return (
    <Box // This was previously a class, convert to a functional component
      pos="relative"
      h="300px"
      w="90vw"
      overflow="hidden"
      borderRadius="lg"
    >
      <Image src={imageUrl} alt="Waitlist background image" objectFit="cover" />
      <Box pos="absolute" inset={0} bg="rgba(0, 0, 0, 0.5)" zIndex={1} />
      <Box pos="absolute" inset={0} p={4} display="flex" flexDirection="column" justifyContent="center" alignItems="center" zIndex={2}>
        <Text fontSize="xl" color="white" fontWeight="bold">
          Join our waitlist!
        </Text>
        <Input mt={4} type="email" placeholder="Enter your email address" value={email} onChange={handleEmailChange} width="400px"/>
        <Button mt={4} colorScheme="blue" onClick={handleJoinClick} disabled={marketingApproval}>
          Join Now
        </Button>

        <Checkbox defaultChecked >Yes, I'd like to receive updates about your products and promotions.</Checkbox>

      </Box>
    </Box>
  );
};

export default JoinWaitlistCard;
