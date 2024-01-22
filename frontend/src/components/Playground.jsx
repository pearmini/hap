import { useEffect, useRef, useState } from "react";
import { Flex } from "antd";
import styled from "styled-components";
import bear from "../assets/bear.png";
import { loadImageData } from "../utils/image";
import { FilterAlgorithm } from "./FilterAlgorithm";

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

  return (
    <Flex justify="center" gap="2.5rem">
      <Avatar ref={imageRef} src={src} />
      <FilterAlgorithm imageData={imageData} options={{ width, height }} />
    </Flex>
  );
}
