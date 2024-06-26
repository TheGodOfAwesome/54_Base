
import React, {useEffect, useState} from 'react';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import supabase from 'config/supabaseClient';

// Custom components
// Assets

// type RowObj = {
//   transaction_type: string;
//   ticker_symbol: string;
//   token_value: number;
// };

type RowObj = {
  name: string[];
  artworks: number;
  rating: number;
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function LatestTransactions(props: { tableData: any }) {
  const { tableData } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<any[]>(null);

  useEffect(() => {

    const fetchUserData = async () => {
      const {data, error} = 
        await supabase
          .from('transactions') // Replace with your table name
          .select('transaction_type, ticker_symbol, token_value') // Select all columns (adjust as needed)
          .order('created_at', { ascending: false }) // Order by created_at descending
          .limit(20) // Limit to 20 rows
      
      if (error) { 
        setFetchError("Couldn't fetch transactions!");
        console.log("Error: ");
        console.log(error);
      }

      if (data) {
        setTransactionData(data);
        setFetchError(null);
        console.log("Data: ");
        console.log(data);
      }
    }
    
    fetchUserData();
  },[])


  let defaultData = tableData;
  const columns = [
    // columnHelper.accessor('action', {
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Action
        </Text>
      ),
      cell: (info: any) => (
        <Flex align="center">
          <Avatar src={info.getValue()[1]} w="30px" h="30px" me="8px" />
          <Text color={textColor} fontSize="sm" fontWeight="600">
            {info.getValue()[0]}
          </Text>
        </Flex>
      ),
    }),
    // columnHelper.accessor('asset', {
    columnHelper.accessor('artworks', {
      id: 'artworks',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Asset
        </Text>
      ),
      cell: (info) => (
        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    // columnHelper.accessor('value', {
    columnHelper.accessor('rating', {
      id: 'rating',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Value
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '15px', lg: '15px' }}
            color="gray.400"
          >
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
  ];
  const [data, setData] = React.useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Flex
      direction="column"
      w="100%"
      height="600px" // Set a fixed height for the table container (adjust as needed)
      overflowY="auto" // Enable vertical scrollbar for body
      overflowX={{ sm: 'scroll', lg: 'hidden' }} // Horizontal scrollbar on small screens
      paddingTop="20px"
    >
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        pb="20px"
        mb="10px"
        boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
        // Fix the header position
        position="sticky"
        top="0"
        zIndex={1} // Ensure the header stays on top during scroll
      >
        <Text color={textColor} fontSize="xl" fontWeight="600">
          Latest Transactions
        </Text>
        <Button variant="action">See all</Button>
      </Flex>
      <Box
        // Apply overflow to the table body (excluding header)
        overflowY="auto"
        height="calc(100% - 40px)" // Adjust height based on header height
      >
        <Table variant="simple" color="gray.500" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    pe="10px"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Flex
                      justifyContent="space-between"
                      align="center"
                      fontSize={{ sm: '10px', lg: '12px' }}
                      color="gray.400"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: '',
                        desc: '',
                      }[header.column.getIsSorted() as string] ?? null}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {/* Show all rows */}
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    fontSize={{ sm: '14px' }}
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    borderColor="transparent"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}
