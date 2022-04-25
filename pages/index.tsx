import { Avatar, Box, Button, Flex, HStack, Input, Text, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import { Octokit } from "@octokit/core";

const Home: NextPage = () => {
  const [tokenAddress, setTokenAddress] = useState<null | string>(null)
  const [tokenSymbol, setTokenSymbol] = useState<null | string>(null)
  const [tokenName, setTokenName] = useState<null | string>(null)
  const [tokenDecimals, setTokenDecimals] = useState<null | string>(null)
  const [chainID, setChainID] = useState<null | string>(null)

  const [image, setImage] = useState<string | null>(null)

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  }

const octokit = new Octokit({ auth: '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' }),
        owner = 'test-user',
         repo = 'test-repo',
        title = 'My Test Pull Request',
        body  = 'This pull request is a test!',
        head  = 'my-feature-branch',
        base  = 'main';



  const onSubmit = async () => {
    // console.log({tokenAddress, tokenSymbol, tokenName, tokenDecimals, chainID})
    // if (!tokenAddress || !tokenSymbol || !tokenName || !tokenDecimals || !chainID) return

    // const data = JSON.stringify({
    //   tokenAddress,
    //   tokenSymbol,
    //   tokenName,
    //   tokenDecimals,
    //   chainID
    // })

    // const encoded = Buffer.from(data).toString('base64')
    const response = await octokit.request(
      `POST /repos/cryptickoan/test/pulls`, { owner, repo, title, body, head, base }
  );

  console.log({response})
  }

  return (
   <Flex 
      width="100%" 
      height="100vh" 
      justifyContent="center" 
      alignItems="center"
    >
     <Box 
        backgroundColor="grey" 
        flexDirection="column" 
        borderRadius="15px" 
        display="flex" 
        padding="30px"
        width="30%"
      >
        <Text textAlign="center">Rari Tokens</Text>
       { 
        !tokenAddress ? null :
        <VStack justifyContent="center">
          <Avatar 
            bg='teal.500' 
            borderRadius="70%"
            width="200px"
            height="200px"
            alignSelf="center"
            src={image != null 
                ? image 
                :'/static/chip.png'
            }
          />
          <Input 
              type="file"
              accept="image/png, image/jpeg"
              onChange={onImageChange} 
          />
        </VStack>
        }
        <HStack justifyContent={!tokenAddress ? "center": "space-between"} width="100%">
          { !tokenAddress ? null : <Text>Token Address: </Text>}
          <Input
            onChange={(e) => {setTokenAddress(e.target.value)}}
          />
        </HStack>
        { 
          !tokenAddress ? null :
          <>
        <HStack justifyContent="space-between" width="100%">
          { tokenAddress === "" ? null : <Text>ChainID: </Text>}
          <Input
            type="number"
            onChange={(e) => {setChainID(e.target.value)}}
          />
        </HStack>
        <HStack justifyContent="space-between" width="100%">
          { tokenAddress === "" ? null : <Text>Token Names: </Text>}
          <Input
            onChange={(e) => {setTokenName(e.target.value)}}
          />
        </HStack>
        <HStack justifyContent="space-between" width="100%">
          { tokenAddress === "" ? null : <Text>Token Symbol: </Text>}
          <Input
            onChange={(e) => {setTokenSymbol(e.target.value)}}
          />
        </HStack>
        <HStack justifyContent="space-between" width="100%">
          { tokenAddress === "" ? null : <Text>Token Decimals: </Text>}
          <Input
            onChange={(e) => {setTokenDecimals(e.target.value)}}
          />
        </HStack>
        <Button
          onClick={onSubmit}
        >
          Submit
        </Button>
        </>
        }
     </Box>
   </Flex>
  )
}

export default Home
