// Chakra imports
import { Box, Flex, Text, Icon, useColorModeValue, Checkbox } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import IconBox from 'components/icons/IconBox';

// Assets
import { MdCheckBox, MdDragIndicator } from 'react-icons/md';

export default function GoalTracker(props: { [x: string]: any }) {
	const { ...rest } = props;

	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'navy.700');
	const brandColor = useColorModeValue('brand.500', 'brand.400');
	return (
		<Card 
			p='20px' 
			alignItems='center' 
			flexDirection='column' 
			w='100%' 
			{...rest}
			minH ={{ base: 'auto', lg: '365px', '2xl': '365px' }}
			height ="365px"
		>
			<Flex alignItems='center' w='100%' mb='30px'>
				<IconBox
					me='12px'
					w='38px'
					h='38px'
					bg={boxBg}
					icon={<Icon as={MdCheckBox} color={brandColor} w='24px' h='24px' />}
				/>

				<Text color={textColor} fontSize='lg' fontWeight='700'>
					Goal Tracker
				</Text>
				<Menu ms='auto' />
			</Flex>
			<Box px='11px' w='100%'>
				<Flex w='100%' mb='20px'>
					<Checkbox me='16px' defaultChecked colorScheme='brandScheme' />
					<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
						Emergency Fund
					</Text>
					<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
				</Flex>
				<Flex w='100%' mb='20px'>
					<Checkbox me='16px' colorScheme='brandScheme' />
					<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
						Save Weekly
					</Text>
					<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
				</Flex>
				<Flex w='100%' mb='20px'>
					<Checkbox me='16px' colorScheme='brandScheme' />
					<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
						Save Monthly
					</Text>
					<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
				</Flex>
				<Flex w='100%' mb='20px'>
					<Checkbox me='16px' colorScheme='brandScheme' />
					<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
						Dollar Cost Average (Investments)
					</Text>
					<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
				</Flex>
				<Flex w='100%' mb='20px'>
					<Checkbox me='16px' colorScheme='brandScheme' />
					<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
						Achieve Financial Goal 
					</Text>
					<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
				</Flex>
			</Box>
		</Card>
	);
}
