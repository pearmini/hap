import { useEffect, useRef, useState } from "react";
import { Button, Flex, Select } from "antd";
import styled from "styled-components";
import { UndoOutlined } from "@ant-design/icons";
import { styles, defaultIndex } from "../styles";

const Preview = styled.div`
  width: 300px;
  height: 300px;
`;

const ButtonContainer = styled.div``;

export function FilterStyle({ imageData }) {
  const previewRef = useRef(null);
  const [selectedStyle, setSelectedStyle] = useState(styles[defaultIndex].name);

  useEffect(() => {
    if (!imageData) return;
    renderStyle(imageData, selectedStyle);
  }, [imageData, selectedStyle]);

  function renderStyle(image, name) {
    console.log(image, name);
  }

  function onClick() {
    renderStyle(imageData, selectedStyle);
  }

  function onSelect(value) {
    setSelectedStyle(value);
  }

  return (
    <Flex vertical={true} align="center" gap="large">
      <Preview ref={previewRef} />
      <Flex gap="small">
        <Select
          defaultValue={styles[defaultIndex].name}
          onChange={onSelect}
          options={styles.map(({ name }) => ({ name, value: name }))}
        />
        <ButtonContainer>
          <Button type="primary" onClick={onClick} icon={<UndoOutlined />} shape="circle"></Button>
        </ButtonContainer>
      </Flex>
    </Flex>
  );
}
