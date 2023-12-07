import { useEffect, useRef, useState } from "react";
import { Flex } from "antd";
import styled from "styled-components";
import bear from "../assets/bear.png";
import { getImageData, loadImageData } from "../utils/loadImageData";
import { FilterAlgorithm } from "./FilterAlgorithm";
import { FilterStyle } from "./FilterStyle";

const Avatar = styled.img`
  width: 300px;
  height: 300px;
`;

export function Playground() {
  const width = 300;
  const height = 300;
  const imageRef = useRef(null);
  const [src] = useState(bear);
  const [imageData, setImageData] = useState(null);
  const [imageData2, setImageData2] = useState(null);

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const { clientWidth: width, clientHeight: height } = imageRef.current;
      const imageData = {
        image,
        width,
        height,
        data: loadImageData(image, width, height),
      };
      setImageData(imageData);
    };
  }, [src]);

  function onAlgorithmFinish(node) {
    const { width, height } = node;
    const imageData2 = {
      width,
      height,
      data: getImageData(node.getContext("2d"), width, height),
    };
    setImageData2(imageData2);
  }

  return (
    <Flex justify="center" gap="2.5rem">
      <Avatar ref={imageRef} src={src} />
      <FilterAlgorithm
        imageData={imageData}
        onFinish={onAlgorithmFinish}
        options={{ width, height }}
      />
      <FilterStyle imageData={imageData2} options={{ width, height }} />
    </Flex>
  );
}
