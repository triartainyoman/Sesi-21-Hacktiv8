import { SSRProvider } from "@react-aria/ssr";
import {
  NativeBaseProvider,
  Stack,
  VStack,
  HStack,
  Box,
  Item,
  Text,
  Heading,
  FlatList,
  Button,
  Icon,
  IconButton,
  Input,
  AddIcon,
  CloseIcon,
  Modal,
  FormControl,
} from "native-base";
import { useEffect, useState } from "react";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalId, setModalId] = useState("");
  const [modalIndex, setModalIndex] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");

  const fetchData = async () => {
    const res = await fetch("http://192.168.0.102:4000/posts");
    const json = await res.json();
    setPosts(json);
  };

  const addPost = () => {
    fetch("http://192.168.0.102:4000/posts", {
      method: "POST",
      headers: {
        "Content-type": "application/json; chartset=UTF-8",
      },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => res.json())
      .then((data) => setPosts([...posts, data]))
      .catch((err) => console.log(err));
    setTitle("");
    setDescription("");
  };

  const deletePost = async (id, index) => {
    await fetch(`http://192.168.0.102:4000/posts/${id}`, {
      method: "DELETE",
    })
      .then(() => deleteFromState(index))
      .catch((err) => console.log(err));
  };

  const deleteFromState = (id) => {
    let tmp = [...posts];
    tmp.splice(id, 1);
    setPosts(tmp);
  };

  const updateDataModal = (id, idx) => {
    setModalId(id);
    setModalIndex(idx);
    setModalTitle(posts[idx].title);
    setModalDesc(posts[idx].description);
    setShowModal(true);
  };

  const updateFromState = () => {
    let tmp = [...posts];
    tmp[modalIndex].id = modalId;
    tmp[modalIndex].title = modalTitle;
    tmp[modalIndex].description = modalDesc;
    setPosts(tmp);
  };

  const updateDataJson = () => {
    fetch(`http://192.168.0.102:4000/posts/${modalId}`, {
      method: "PUT",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        id: `${modalId}`,
        title: `${modalTitle}`,
        description: `${modalDesc}`,
      }),
    })
      .then(() => updateFromState())
      .catch((err) => console.log(err));
    setShowModal(false);
  };

  useEffect(() => {
    fetchData();
  }, [posts]);

  return (
    <SSRProvider>
      <NativeBaseProvider>
        <VStack bg={"primary.300"} flex={1} p={2}>
          <Heading paddingTop={10} paddingBottom={5}>
            All Posts
          </Heading>
          <Box alignItems="center">
            <Input
              mx="5"
              marginBottom={3}
              placeholder="Title"
              placeholderTextColor={"grey"}
              size={"xl"}
              shadow={1}
              bg={"white"}
              w="100%"
              onChangeText={(text) => setTitle(text)}
              defaultValue={title}
            />
            <Input
              mx="3"
              marginBottom={5}
              placeholder="Description"
              placeholderTextColor={"grey"}
              size={"xl"}
              shadow={1}
              bg={"white"}
              w="100%"
              onChangeText={(text) => setDescription(text)}
              defaultValue={description}
            />
            <Box width="100%">
              <Button colorScheme="success" marginBottom={5} onPress={addPost}>
                Tambahkan
              </Button>
            </Box>
          </Box>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <HStack
                bg={"white"}
                rounded={"sm"}
                p={4}
                shadow={1}
                marginBottom={3}
              >
                <VStack flex={1} justifyContent={"center"}>
                  <Text fontWeight={"bold"} fontSize={20}>
                    {item.title}
                  </Text>
                  <Text>{item.description}</Text>
                </VStack>
                <VStack>
                  <Button
                    colorScheme="success"
                    size={"xs"}
                    marginBottom={1}
                    onPress={() => updateDataModal(item.id, index)}
                  >
                    <AddIcon size="3" />
                  </Button>
                  <Button
                    colorScheme="danger"
                    size={"xs"}
                    onPress={() => deletePost(item.id, index)}
                  >
                    <CloseIcon size="3" />
                  </Button>
                </VStack>
              </HStack>
            )}
          />
          {/* Modal */}
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Update Post</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label>Title</FormControl.Label>
                  <Input
                    value={modalTitle}
                    onChangeText={(text) => setModalTitle(text)}
                  />
                </FormControl>
                <FormControl mt="3">
                  <FormControl.Label>Description</FormControl.Label>
                  <Input
                    value={modalDesc}
                    onChangeText={(text) => setModalDesc(text)}
                  />
                </FormControl>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => {
                      updateDataJson();
                    }}
                  >
                    Save
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </VStack>
      </NativeBaseProvider>
    </SSRProvider>
  );
}
