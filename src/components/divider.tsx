import { Box } from "@chakra-ui/react";

export const Divider = ({ ...others }: { [key: string]: any }) => {
    return <Box h="1px" width="100%" flexShrink={0} bg="#272727" {...others} />;
  };
  