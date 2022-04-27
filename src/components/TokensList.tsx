import { Avatar, Box, HStack, Image, SimpleGrid, VStack } from "@chakra-ui/react";
import { Heading, Text } from "rari-components";
import React from "react";
import useAllTokens from "../hooks/useAllTokens";
import { useTokensDataAsMap } from "../hooks/useTokenData";

type FormProps = {
  tokenAddress: string;
  setTokenAddress: (token: string) => void;
};

const TokensList: React.FC<FormProps> = ({ setTokenAddress }) => {
  const tokens = useAllTokens();
  const addresses = tokens?.map((t: any | undefined) => t?.id);
  const tokensData = useTokensDataAsMap(addresses);

  return (
    <>
      <VStack align="start"
      
      overflowY="scroll"
      >
        <HStack>
          <Heading mb={4}>TOKEN LIST</Heading>
        </HStack>

        <SimpleGrid
          h="100vh"
          w="100%"
          overflowY="scroll"
          columns={3}
          spacing={10}
        >
          {tokens?.map((t: any) => {
            return (
              <Box
                h="40px"
                onClick={() => setTokenAddress(t.id)}
                _hover={{ bg: "grey", cursor: "pointer" }}
              >
                <HStack>
                  <Text>{t?.symbol}</Text>
                  <Avatar src={tokensData[t.id]?.logoURL} boxSize="20px" />
                </HStack>
              </Box>
            );
          })}
        </SimpleGrid>
      </VStack>
    </>
  );
};

export default TokensList;
