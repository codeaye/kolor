import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { invoke } from "@tauri-apps/api";
import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Progress,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import convert from "rgb2hex";

function App() {
  const [color, setColor] = useState("#000000");
  const [gradient, setGradient] = useState([]);
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    if (!didMount) {
      invoke("generate_gradient", { r: 0, g: 0, b: 0 }).then((grad) =>
        setGradient(grad)
      );
      setDidMount(true);
    }
  });

  const copyToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
    return toast({
      title: "Copied Hex Code",
      description: `Copied the hex code ${text}`,
      status: "success",
      duration: 1000,
      isClosable: true,
    });
  };
  const onColorChange = (color) => {
    setColor(color);
    invoke("generate_gradient", color.rgb).then((grad) => setGradient(grad));
  };

  const toast = useToast();

  return (
    <>
      <Progress colorScheme="green" size="sm" value={100} />
      <Grid
        h="200px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(1, 1fr)"
        gap={4}
      >
        <GridItem>
          <Center>
            <Heading m={4} as="h1" size="2xl">
              Kolor
            </Heading>
          </Center>
        </GridItem>
        <Divider />
        <GridItem>
          <Flex h="100%">
            <Center w="full">
              <SketchPicker
                color={color}
                onChange={(color, event) => onColorChange(color)}
                className="place-items-center"
              />
            </Center>
            <Center height="100%">
              <Divider orientation="vertical" />
            </Center>
            <Center w="full">
              <Box
                w="100%"
                h="fit-content"
                m={10}
                bg="gray.100"
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
              >
                <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                  {gradient.map((c) => {
                    const text = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
                    const converted = convert(text).hex;
                    return (
                      <Tooltip label={converted}>
                        <GridItem
                          w="100%"
                          h="10"
                          bg={text}
                          borderWidth="1px"
                          borderRadius="lg"
                          onClick={() => copyToClipboard(converted)}
                        />
                      </Tooltip>
                    );
                  })}
                </Grid>
              </Box>
            </Center>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
