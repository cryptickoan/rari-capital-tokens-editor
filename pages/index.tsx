import { Avatar, Box, Button, Flex, HStack, Input, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useEffect, useMemo, useState } from 'react'
import { Octokit } from "@octokit/rest";
import { uploadToRepo } from '../src/utils'
import { Card, Divider, Text } from "rari-components";
import useDebounce from '../src/hooks/useDebounce';
import {utils} from 'ethers'
import { TokenData, useTokenData } from '../src/hooks/useTokenData';

type StateType = {
  filled: boolean,
  value: string
}

const Home: NextPage = () => {
  const [tokenAddress, setTokenAddress] = useState<string>("")
  const [tokenSymbol, setTokenSymbol] = useState<StateType>({filled: false, value: ""})
  const [tokenName, setTokenName] = useState<StateType>({filled: false, value: ""})
  const [tokenDecimals, setTokenDecimals] = useState<StateType>({filled: false, value: ""})
  const [chainID, setChainID] = useState<StateType>({filled: false, value: ""})

  const [image, setImage] = useState<string | null>(null)

  const debouncedTokenAddress = useDebounce(tokenAddress, 500)

  const isAddressValid = useMemo(() => {
    return utils.isAddress(debouncedTokenAddress)
  }, [debouncedTokenAddress])

  const tokenData = useTokenData(isAddressValid, debouncedTokenAddress, "1")
  

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  const onSubmit = async () => {
    if (!tokenAddress || !tokenSymbol || !tokenName || !tokenDecimals || !chainID) return
    
    const octo = new Octokit({auth: "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"})
    const fileContent = JSON.stringify({
      address: tokenAddress,
      symbol: tokenSymbol.value,
      name: tokenName.value,
      decimals: tokenDecimals.value,
      chainId: chainID.value
    })

    const commitAndPRTitle = `${tokenSymbol.filled ? "Editing" : "Adding"} Token ${tokenSymbol.value}`
    
    await uploadToRepo(
      octo,
      'rari-tokens-list',
      'rari-token-list',
      'main',
      fileContent,
      tokenAddress,
      commitAndPRTitle,
      tokenSymbol.value,
      chainID.value
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
        backgroundColor="black" 
        borderStyle="solid"
        borderColor="#272727"
        borderWidth="1px"
        flexDirection="column" 
        borderRadius="15px" 
        padding="0"
        display="flex" 
        width="50% 10%"
      >
        <Text margin="4%" fontSize="4vh" textAlign="center">Token Editor</Text>
        <Divider width="100%"/>
        <Box
          padding="8"
        >
        { 
          !tokenData ? null :
          <VStack justifyContent="center">
            <Avatar 
              bg='teal.500' 
              borderRadius="70%"
              width="200px"
              height="200px"
              alignSelf="center"
              src={image != null 
                  ? image 
                  : tokenData.logoURL !== "" 
                    ? tokenData.logoURL
                    : '/static/chip.png'
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
            <Flex>
              { !tokenData ? null : <Text>Token Address: </Text>}
            </Flex>
            <Flex>
              <Input
                value={tokenData?.address}
                placeholder='0x000...00'
                onChange={(e) => {setTokenAddress(e.target.value)}}
              />
            </Flex>
          </HStack>
          { 
            !tokenData ? null :
            <>

          <ConfigRow 
            title="Name"
            value={tokenData.name}
            setter={setTokenName}
            stateVariable={tokenName}
          />
          <ConfigRow 
            title="Symbol"
            value={tokenData.symbol}
            setter={setTokenSymbol}
            stateVariable={tokenSymbol}
          />
          <ConfigRow 
            title="Decimals"
            value={tokenData.decimals}
            setter={setTokenDecimals}
            stateVariable={tokenDecimals}
          />
           <ConfigRow 
            title="Chain"
            value={chainID.value}
            setter={setChainID}
            stateVariable={chainID}
          />

          <Button
            onClick={onSubmit}
          >
            Submit
          </Button>
          </>
          }
        </Box>
     </Card>
   </Flex>
  )
}

export default Home

const ConfigRow = ({
  title, 
  value,
  setter,
  stateVariable,
} : {
  title: string, 
  value: string | number,
  setter: (value: StateType) => void,
  stateVariable: StateType,
}) => {
  useEffect(() => {
    if(value !== "" && !stateVariable.filled) {
      setter({filled: true, value: value.toString()})
    }
  })

  return (
    <HStack justifyContent="space-between" width="100%">
      <Flex>
        <Text>{title}</Text>
      </Flex>
      <Flex>
        <Input
          value={stateVariable.value}
          onChange={(e) => setter({...stateVariable, value: e.target.value})}
        />
      </Flex>
    </HStack>
  )
}
