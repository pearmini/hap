import { useEffect, useRef, useState } from "react";
import { Flex, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import styled from "styled-components";
import exampleLink from "../assets/example.jpeg";
import { getImageColor, getImageData, loadImage } from "../utils/image";
import { FilterAlgorithm } from "./FilterAlgorithm";

const Avatar = styled.img`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function Playground() {
  const width = 400;
  const height = 400;
  const imageRef = useRef(null);
  const [src, setSrc] = useState(exampleLink);
  const [imageData, setImageData] = useState(null);
  const [background, setBackground] = useState("#000");
  const [rendering, setRendering] = useState(false);

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

  async function onUploadImage({ file }) {
    const base64 = await getBase64(file.originFileObj);
    setSrc(base64);
  }

  return (
    <Flex justify="center" gap="4rem">
      <Flex vertical gap="large" align="center">
        <Avatar ref={imageRef} src={src} width={width} height={height} />
        <Upload showUploadList={false} onChange={onUploadImage} disabled={rendering}>
          <Button icon={<UploadOutlined />} disabled={rendering}>
            Update Avatar
          </Button>
        </Upload>
      </Flex>
      <FilterAlgorithm
        imageData={imageData}
        options={{ width, height, background }}
        disabled={rendering}
        setRendering={setRendering}
      />
    </Flex>
  );
}
