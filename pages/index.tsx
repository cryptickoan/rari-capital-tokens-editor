import { Box, Flex } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useState } from 'react'

import Form from '../src/components/Form';
import TokensList from '../src/components/TokensList';


const Home: NextPage = () => {
  const [tokenAddress, setTokenAddress] = useState<string>("")

  return (
    <Flex
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      bgColor="black"
      px={20}
    >
      <Flex
        w="50%"
        h="100%"
        justifyContent={"flex-start"}
        align="flex-start">
        <TokensList
          tokenAddress={tokenAddress}
          setTokenAddress={setTokenAddress} />
      </Flex>
      <Flex
        w="50%"
        h="100%"
        justifyContent={"center"}
        align="center">
        <Form
          tokenAddress={tokenAddress}
          setTokenAddress={setTokenAddress}
        />
      </Flex>

    </Flex>
  )
}

export default Home