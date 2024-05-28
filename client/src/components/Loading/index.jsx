import { Container, Loader, Center, Flex } from "@mantine/core";
export default function Loading() {
  return (
    <>
      <Flex direction="column" justify="center" align="center" style={{height: "100vh"}}>
        <Loader color="blue" size="xl" type="bars" />
      </Flex>
    </>
  );
}
