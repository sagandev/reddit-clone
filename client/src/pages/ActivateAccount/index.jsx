import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Flex, Text, Anchor } from "@mantine/core";
import Loading from "../../components/Loading";
import config from "../../config";
export default function ActivateAccountPage() {
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState(false);
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const navigate = useNavigate();
  const cookies = new Cookies();
  useEffect(() => {
    if (
      !searchParams ||
      !searchParams.get("email") ||
      !searchParams.get("code")
    ) {
      navigate("/");
      return;
    }

    const email = searchParams.get("email");
    const code = searchParams.get("code");
    const token = cookies.get("CSRF_TOKEN");
    axios
      .post(
        `${config.apiServer}/users/activate`,
        {
          email: email,
          key: code,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": token,
          },
        }
      )
      .then((res) => {
        setActive(true);
      }).catch(e=>{
        setError(true);
        setErrorContent(e.response.data.message);
      });
  }, []);
  if (active) {
    return (
      <Flex direction="column" justify="center" align="center" style={{height: '100vh'}}>
        <IconCheck />
      </Flex>
    );
  } else if (error) {
    return (<Flex direction="column" justify="center" align="center" style={{height: '100vh', color: 'red', textAlign: "center"}}><IconX/> <Text>Error</Text><Text>{errorContent}</Text><Anchor href="http://localhost:5173">Go back home</Anchor></Flex>);
  } else {
    return <Loading />;
  }
}
