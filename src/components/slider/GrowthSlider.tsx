import {
	Box,
	Heading,
	Flex,
	VStack,
	Text,

	RangeSlider,
	RangeSliderTrack,
	RangeSliderFilledTrack,
	RangeSliderThumb,
	
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
	Button,

	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	StatGroup,

	Icon,
	Image,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,

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
} from "@chakra-ui/react";
import { useState, useEffect } from 'react'
import { MdGraphicEq, MdInfoOutline } from "react-icons/md";
// Assets
import navImage from '/public/img/layout/Navbar.png';
import SubscribeCard from "components/card/SubscribeCard";


const GrowthSlider = (props: any) => {
    const { chartData, chartOptions } = props;
	const [rangeValue, setRangeValue] = useState<Number[]>([1,1]);
	const [sliderValue, setSliderValue] = useState(1);

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const navbarIcon = useColorModeValue('gray.400', 'white');
	let menuBg = useColorModeValue('white', 'navy.800');
	const shadow = useColorModeValue(
	  '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
	  '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
	);
	const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
	const { isOpen, onOpen, onClose } = useDisclosure();


	// type: number -> Payment at the end of the period (common for annual compounding): type = 0
	function futureValue(interestRate: number, noOfYears: number, payment: number, startingBalance: number, type: number) {
		var pow = Math.pow(1 + interestRate, noOfYears),
		futureValue;
		
		futureValue = (payment * ( 1 + interestRate * type) * (1 - pow)/interestRate) - startingBalance * pow;
		
		return (futureValue * -1).toFixed(2);
	}

	return (
		<>
		<Flex>
            <Box p={8} maxW="98vh" mx="auto">
				<Heading mb={4} textAlign="center">
					How much you can grow your <b style={{color:"blue"}}>Savings</b>
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
						<MenuList
							boxShadow={shadow}
							p="20px"
							me={{ base: '30px', md: 'unset' }}
							borderRadius="20px"
							bg={menuBg}
							border="none"
							mt="22px"
							minW={{ base: 'unset' }}
							maxW={{ base: '360px', md: 'unset' }}
						>
						<Flex flexDirection="column">
							<Text  fontSize='md' maxW="200px">
								The 10% growth rate is estimated based on the historical performance and 
								average returns of the S&P 500 from 1957 through December 31, 2023.
								The S&P 500 can be purchased through the site. 
								<br />
								<br />
								"Remember, past performance does not guarantee future results."
							</Text>
							<Link
								w="100%"
								href="https://www.investopedia.com/ask/answers/042415/what-average-annual-return-sp-500.asp"
							>
								<Button
									w="100%"
									h="44px"
									variant="no-hover"
									color={textColor}
									bg="transparent"
								>
									Read More
								</Button>
							</Link>
						</Flex>
						</MenuList>
					</Menu>
				</Heading>
				<VStack spacing={4} mb={8}>
					<Heading size="md">
						${sliderValue.toString()}/week
					</Heading>
					<Slider 
						aria-label='slider-ex-4' 
						defaultValue={1}
						onChange={(value)=>{setSliderValue(value)}}
					>
						<SliderTrack bg='brand.100' boxSize={1.5}>
							<SliderFilledTrack />
						</SliderTrack>
						<SliderThumb boxSize={8} zIndex="0">
							<Box color='brand' as={MdGraphicEq} />
						</SliderThumb>
					</Slider>
					<Flex justify="space-between" w="full">
						<Text>$1</Text>
						<Text>$100</Text>
					</Flex>
				</VStack>

				<StatGroup>
					<Stat>
						<StatLabel>1 year</StatLabel>
						<StatNumber>
							${futureValue(0.1, 1, (sliderValue.valueOf() * 4 * 12), 0, 0)}
						</StatNumber>
						<StatHelpText>
						<StatArrow type="increase" />
							10%
						</StatHelpText>
					</Stat>
					<Stat></Stat>
					<Stat>
						<StatLabel>5 years</StatLabel>
						<StatNumber>
							${futureValue(0.1, 5, (sliderValue.valueOf() * 4 * 12), 0, 0)}
						</StatNumber>
						<StatHelpText>
						<StatArrow type="increase" />
							10%
						</StatHelpText>
					</Stat>
					<Stat></Stat>
					<Stat>
						<StatLabel>10 years</StatLabel>
						<StatNumber>
							${futureValue(0.1, 10, (sliderValue.valueOf() * 4 * 12), 0, 0)}
						</StatNumber>
						<StatHelpText>
						<StatArrow type="increase" />
							10%
						</StatHelpText>
					</Stat>
				</StatGroup>
				<div style={{paddingTop:"50px"}}>
					{/* <Button
						fontSize="sm"
						variant="brand"
						fontWeight="500"
						w="100%"
						h="50"
						mb="24px"
						onClick={()=>location.href='./auth'}
					>
						Sign In/Sign Up
					</Button> */}
					<Button
						fontSize="sm"
						variant="brand"
						fontWeight="500"
						w="100%"
						h="50"
						mb="24px"
						onClick={onOpen}
					>
						Join Our Waitlist
					</Button>
				</div>
            </Box>
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
};

export default GrowthSlider;


