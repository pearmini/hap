import { useEffect, useRef, useState } from "react";
import { Button, Flex, Select } from "antd";
import styled from "styled-components";
import { UndoOutlined } from "@ant-design/icons";
import { algorithms, defaultIndex } from "../algorithms";

const Preview = styled.div`
  width: 300px;
  height: 300px;
`;

const ButtonContainer = styled.div``;

export function FilterAlgorithm({ imageData, options = {}, onFinish = () => {} }) {
  const previewRef = useRef(null);
  const clear = useRef(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[defaultIndex].name);

  useEffect(() => {
    if (!imageData) return;
    renderAlgorithm(imageData, selectedAlgorithm);
  }, [imageData, selectedAlgorithm]);

  function renderAlgorithm(image, name) {
    if (clear.current) clear.current();
    const { render } = algorithms.find((d) => d.name === name);
    const app = render(image, options);
    const node = app.node();
    if (!(node instanceof HTMLElement)) return;
    const preview = previewRef.current;
    preview.innerHTML = "";
    preview.appendChild(node);
    onFinish(node);
    clear.current = () => app.dispose();
  }

  function onClick() {
    renderAlgorithm(imageData, selectedAlgorithm);
  }

  function onSelect(value) {
    setSelectedAlgorithm(value);
  }

  return (
    <Flex vertical={true} align="center" gap="large">
      <Preview ref={previewRef} />
      <Flex gap="small">
        <Select
          defaultValue={algorithms[defaultIndex].name}
          onChange={onSelect}
          options={algorithms.map(({ name }) => ({ name, value: name }))}
        />
        <ButtonContainer>
          <Button type="primary" onClick={onClick} icon={<UndoOutlined />} shape="circle"></Button>
        </ButtonContainer>
      </Flex>
    </Flex>
  );
}
