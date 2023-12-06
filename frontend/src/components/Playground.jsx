import { useEffect, useRef, useState } from "react";
import { Flex } from "antd";
import styled from "styled-components";
import bear from "../assets/bear.png";
import { loadImageData } from "../utils/loadImageData";
import { FilterAlgorithm } from "./FilterAlgorithm";
import { FilterStyle } from "./FilterStyle";

const Avatar = styled.img`
  width: 300px;
  height: 300px;
`;

export function Playground() {
  const imageRef = useRef(null);
  const [src] = useState(bear);
  const [imageData, setImageData] = useState(null);

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
    console.log(node);
  }

  return (
    <Flex justify="center" gap="2.5rem">
      <Avatar ref={imageRef} src={src} />
      <FilterAlgorithm imageData={imageData} onFinish={onAlgorithmFinish} />
      <FilterStyle imageData={imageData} onFinish={onAlgorithmFinish} />
    </Flex>
  );
}
