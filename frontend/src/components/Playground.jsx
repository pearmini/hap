import { useEffect, useRef, useState } from "react";
import { Flex } from "antd";
import styled from "styled-components";
import bear from "../assets/bear.png";
import { getImageColor, getImageData, loadImage } from "../utils/image";
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
  const [background, setBackground] = useState("#000");

  async function prepareImage(src) {
    const image = await loadImage(src);
    const color = getImageColor(image);
    const { clientWidth: width, clientHeight: height } = imageRef.current;
    const imageData = {
      image,
      width,
      height,
      data: getImageData(image, width, height),
    };
    setImageData(imageData);
    setBackground(color);
  }

  useEffect(() => {
    prepareImage(src);
  }, [src]);

  return (
    <Flex justify="center" gap="2.5rem">
      <Avatar ref={imageRef} src={src} />
      <FilterAlgorithm imageData={imageData} options={{ width, height, background }} />
    </Flex>
  );
}
