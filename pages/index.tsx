import { Avatar, Box, Button, Flex, HStack, Input, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useState } from 'react'
import { Octokit } from "@octokit/rest";
import { uploadToRepo } from '../src/utils'
import { Card, Text } from "rari-components";

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

  const onSubmit = async () => {
    if (!tokenAddress || !tokenSymbol || !tokenName || !tokenDecimals || !chainID) return
    
    const octo = new Octokit({auth: "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"})
    const fileContent = JSON.stringify({
      tokenAddress,
      tokenSymbol,
      tokenName,
      tokenDecimals,
      chainID
    })

    await uploadToRepo(
      octo,
      'cryptickoan',
      'test',
      'main',
      fileContent,
      tokenAddress,
      tokenSymbol
    )
  }

  return (
   <Flex 
      width="100%" 
      height="100vh" 
      justifyContent="center" 
      alignItems="center"
      bgColor="black"
    >
     <Card 
        backgroundColor="grey" 
        flexDirection="column" 
        borderRadius="15px" 
        display="flex" 
        padding="30px"
        width="30%"
      >
        <Text fontSize="6vh" textAlign="center">Rari Capital Token Editor</Text>
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
     </Card>
   </Flex>
  )
}

export default Home
