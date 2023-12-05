import { useEffect, useRef, useState } from "react";
import { Button, Flex, Select } from "antd";
import { UndoOutlined } from "@ant-design/icons";
import styled from "styled-components";
import bear from "../assets/bear.png";
import { algorithms, defaultIndex } from "../algorithms";
import { loadImageData } from "../utils/loadImageData";

const Avatar = styled.img`
  margin-right: 4rem;
  width: 300px;
  height: 300px;
`;

const Preview = styled.div`
  width: 300px;
  height: 300px;
`;

const ButtonContainer = styled.div``;

export function Playground() {
  const previewRef = useRef(null);
  const imageRef = useRef(null);
  const clear = useRef(null);
  const [src] = useState(bear);
  const [imageData, setImageData] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    algorithms[defaultIndex].name
  );

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
      renderAlgorithm(imageData, selectedAlgorithm);
    };
  }, [src]);

  function renderAlgorithm(image, name) {
    if (clear.current) clear.current();
    const { render } = algorithms.find((d) => d.name === name);
    const app = render(image, {});
    const node = app.node();
    if (!(node instanceof HTMLElement)) return;
    const preview = previewRef.current;
    preview.innerHTML = "";
    preview.appendChild(node);
    clear.current = () => app.dispose();
  }

  function onClick() {
    renderAlgorithm(imageData, selectedAlgorithm);
  }

  function onSelect(value) {
    setSelectedAlgorithm(value);
    renderAlgorithm(imageData, value);
  }

  return (
    <Flex justify="center">
      <Avatar ref={imageRef} src={src} />
      <Flex vertical={true} align="center" gap="large">
        <Preview ref={previewRef} />
        <Flex gap="small">
          <Select
            defaultValue={algorithms[defaultIndex].name}
            onChange={onSelect}
            options={algorithms.map(({ name }) => ({ name, value: name }))}
          />
          <ButtonContainer>
            <Button
              type="primary"
              onClick={onClick}
              icon={<UndoOutlined />}
              shape="circle"
            ></Button>
          </ButtonContainer>
        </Flex>
      </Flex>
    </Flex>
  );
}
