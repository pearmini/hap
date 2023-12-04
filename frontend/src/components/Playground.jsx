import { useRef } from "react";
import { Button, Flex } from "antd";
import styled from "styled-components";
import bear from "../assets/bear.png";
import { randomUniform } from "../algorithms/randomUniform";

const Avatar = styled.img``;

const Preview = styled.div``;

const ButtonContainer = styled.div``;

export function Playground() {
  const previewRef = useRef(null);
  const imageRef = useRef(null);

  function onClick() {
    const image = new Image();
    image.src = bear;
    image.onload = () => {
      const { clientWidth: width, clientHeight: height } = imageRef.current;
      const node = randomUniform(image, { width, height });
      if (!(node instanceof HTMLElement)) return;
      const preview = previewRef.current;
      preview.innerHTML = "";
      preview.style.marginLeft = "4rem";
      preview.appendChild(node);
    };
  }

  return (
    <Flex vertical={true} gap="large" align="center">
      <Flex justify="center">
        <Avatar ref={imageRef} src={bear} width={300} />
        <Preview ref={previewRef} />
      </Flex>
      <ButtonContainer>
        <Button type="primary" onClick={onClick}>
          Generate
        </Button>
      </ButtonContainer>
    </Flex>
  );
}
