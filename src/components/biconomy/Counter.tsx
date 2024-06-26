'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { PaymasterMode } from '@biconomy/paymaster';
import abi from '../../utils/counter_abi.json'

const CONTRACT_ADDRESS = '0xa0f89f8fd88c9718bb359d972ff8d6cb26160624';

export default function Counter({ smartAccount, provider }) {
    const [number, setNumber] = useState(0);
    const [contract, setContract] = useState<ethers.Contract>();

    useEffect(() => {
        const counterContract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
        setContract(counterContract);
    }, []);

    const getNumber = async () => {
        const currentNumber = await contract?.number();
        setNumber(currentNumber.toNumber());
    };

    const increment = async () => {
        const incrementTx = new ethers.utils.Interface(['function increment()']);
        const data = incrementTx.encodeFunctionData('increment');

        const transaction = {
            to: CONTRACT_ADDRESS,
            data: data,
        };

        try {
        const userOp = await smartAccount.buildUserOp([transaction], {
            paymasterServiceData: {
            mode: PaymasterMode.SPONSORED,
            // mode: PaymasterMode.ERC20,
            },
        });
        const userOpResponse = await smartAccount.sendUserOp(userOp);
        const transactionDetails = await userOpResponse.wait();
        console.log('Transaction details:', transactionDetails);
        console.log('Transaction hash:', transactionDetails.receipt.transactionHash);
        } catch (e) {
        console.error('Error executing transaction:', e);
        }
    };

    return (
        <>
            <div>Current number: {number}</div>
            <button onClick={() => increment()}>Increment</button>
        </>
    );
}