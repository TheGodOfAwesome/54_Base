"use client"

import Head from 'next/head'
import {
ParticleAuthModule,
ParticleProvider,
} from "@biconomy/particle-auth";
import { useState } from 'react';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, BiconomySmartAccountV2Config, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import {
IPaymaster,
BiconomyPaymaster,
} from '@biconomy/paymaster'
import Minter from 'components/biconomy/Minter';

export default function Home() {
const [address, setAddress] = useState<string>("")
const [loading, setLoading] = useState<boolean>(false);
const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)

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
  bundlerUrl: 'https://bundler.biconomy.io/api/v2/421614/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
  // bundlerUrl: 'https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
  // bundlerUrl: 'https://bundler.biconomy.io/api/v2/{chain-id-here}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
  // chainId: ChainId.BASE_GOERLI_TESTNET,
  chainId: 421614,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: 'https://paymaster.biconomy.io/api/v1/84531/m814QNmpW.fce62d8f-41a1-42d8-9f0d-2c65c10abe9a'
})

const connect = async () => {
  // try {
  //   setLoading(true)
  //   const userInfo = await particle.auth.login();
  //   console.log("Logged in user:", userInfo);
  //   const particleProvider = new ParticleProvider(particle.auth);
  //   console.log({particleProvider})
  //   const web3Provider = new ethers.providers.Web3Provider(
  //     particleProvider,
  //     "any"
  //   );
  //   setProvider(web3Provider)
  //   const biconomySmartAccountConfig: BiconomySmartAccountV2Config = {
  //     signer: web3Provider.getSigner(),
  //     // chainId: ChainId.BASE_GOERLI_TESTNET,
  //     // chainId: 421614,
  //     bundler: bundler,
  //     paymaster: paymaster
  //   }
  //   let biconomySmartAccount = new BiconomySmartAccountV2(biconomySmartAccountConfig)
  //   // let biconomySmartAccount = 
  //   biconomySmartAccount =  await biconomySmartAccount.init()
  //   setAddress( await biconomySmartAccount.getSmartAccountAddress())
  //   setSmartAccount(biconomySmartAccount)
  //   setLoading(false)
  // } catch (error) {
  //   console.error(error);
  // }
};

async function login() {
  console.log("hello from login")
  // try {
  //   setLoading(true)
  //   const userInfo = await particle.auth.login();
  //   console.log("Logged in user:", userInfo);
  //   const particleProvider = new ParticleProvider(particle.auth);
  //   console.log({particleProvider})
  //   const web3Provider = new ethers.providers.Web3Provider(
  //     particleProvider,
  //     "any"
  //   );

  //   const validationModule = await ECDSAOwnershipValidationModule.create({
  //     signer: web3Provider.getSigner(),
  //     moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
  //   });

  //   setProvider(web3Provider)
  //   let biconomySmartAccount = await BiconomySmartAccountV2.create({
  //         provider: provider,
  //         chainId: ChainId.POLYGON_MAINNET,
  //         bundler: bundler,
  //         paymaster: paymaster,
  //         entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  //         defaultValidationModule: validationModule,
  //         activeValidationModule: validationModule
  //   })
  //   const address = await biconomySmartAccount.getAccountAddress()
  //   console.log({ address })
  //   setAddress( address )
  //   setSmartAccount(biconomySmartAccount)
  //   setLoading(false)
  // } catch (error) {
  //   console.error(error);
  // }
}

return (
  <>
    <Head>
      <title>Based Account Abstraction</title>
      <meta name="description" content="Based Account Abstraction" />
    </Head>
    <main>
      <h1>Based Account Abstraction</h1>
      <h2>Connect and Mint your AA powered NFT now</h2>
      {!loading && !address && <button onClick={connect} >Connect to Based Web3</button>}
      {!loading && !address && <button onClick={login} >Login to Based Web3</button>}
      {loading && <p>Loading Smart Account...</p>}
      {address && <h2>Smart Account: {address}</h2>}
      {smartAccount && provider && <Minter smartAccount={smartAccount} address={address} provider={provider} />}
      <p>address: {address}</p>
      {/* <p>provider: {JSON.stringify(provider)}</p> */}
      {/* <p>smartAccount: {JSON.stringify(smartAccount)}</p> */}
    </main>
  </>
)
}
