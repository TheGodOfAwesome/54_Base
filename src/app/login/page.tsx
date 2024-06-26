"use client"

import { useState } from 'react';

import Head from 'next/head'

import { ParticleAuthModule, ParticleProvider } from '@biconomy/particle-auth';
import { ethers } from 'ethers';

import { IBundler, Bundler } from '@biconomy/bundler';
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster';
import { ChainId } from '@biconomy/core-types';
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account';
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from '@biconomy/modules';

import Counter from 'components/biconomy/Counter';
import Minter from 'components/biconomy/Minter';

const PARTICLE_PROJECT_ID = 'bb8d58f8-0d3c-4306-a5f1-6cc7aa73b012';
const PARTICLE_CLIENT_ID = 'c9rwyb2a3pQhHapL1EphoNKYnFsVQkAEHgWP5TRm';
const PARTICLE_APP_ID = 'bd23aa64-ef27-4054-a823-25aa32d903a4';

const PAYMASTER_URL = 'https://paymaster.biconomy.io/api/v1/421614/ZIDiDcEsK.e3d62d88-325e-4d28-aaef-58931afab512';
const BUNDLER_URL = 'https://bundler.biconomy.io/api/v2/421614/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44';

const particle = new ParticleAuthModule.ParticleNetwork({
  projectId: PARTICLE_PROJECT_ID,
  clientKey: PARTICLE_CLIENT_ID,
  appId: PARTICLE_APP_ID,
  wallet: {
    displayWalletEntry: true,
    // defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.BR,
  },
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: PAYMASTER_URL,
});

const bundler: IBundler = new Bundler({
  chainId: ChainId.ARBITRUM_SEPOLIA,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  bundlerUrl: BUNDLER_URL,
});


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [smartAccount, setSmartAccount] = useState(null);
  const [address, setAddress] = useState('');

  const login = async () => {
    try {
      const userInfo = await particle.auth.login();
      const particleProvider = new ParticleProvider(particle.auth);
      const web3Provider = new ethers.providers.Web3Provider(particleProvider, 'any');

      const validationModule = await ECDSAOwnershipValidationModule.create({
        signer: web3Provider.getSigner(),
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
      });

      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.ARBITRUM_SEPOLIA,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: validationModule,
        activeValidationModule: validationModule,
      });

      const accountAddress = await biconomySmartAccount.getAccountAddress();
      setProvider(web3Provider);
      setSmartAccount(biconomySmartAccount);
      setAddress(accountAddress);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Based Account Abstraction</title>
        <meta name="description" content="Based Account Abstraction" />
      </Head>
      <main>
        <div>
          <h1>Based Account Abstraction</h1>
          <h2>Connect and Mint your AA powered NFT now</h2>
          {!loading && !address && <button onClick={login}>Login</button>}
          {loading && <p>Loading...</p>}
          {address && <h2>Smart Account Address: {address}</h2>}
          <Minter smartAccount={smartAccount} provider={provider} address={address}/>
          <Counter smartAccount={smartAccount} provider={provider}/>
        </div>
      </main>
    </>
  )
}
