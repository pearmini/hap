import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Flex, Select } from "antd";
import styled from "styled-components";
import { UndoOutlined, DownloadOutlined } from "@ant-design/icons";
import { algorithms, defaultIndex } from "../algorithms";

const Preview = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

export function FilterAlgorithm({ imageData, options = {}, onFinish = () => {} }) {
  const previewRef = useRef(null);
  const clear = useRef(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[defaultIndex].name);
  const renderAlgorithm = useCallback(
    (image, name) => {
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
    },
    [onFinish, options],
  );

  useEffect(() => {
    if (!imageData) return;
    renderAlgorithm(imageData, selectedAlgorithm);
  }, [imageData, selectedAlgorithm, renderAlgorithm]);

  function onRefresh() {
    renderAlgorithm(imageData, selectedAlgorithm);
  }

  function onSelect(value) {
    setSelectedAlgorithm(value);
  }

  function onDownload() {
    const preview = previewRef.current;
    const canvas = preview.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "hap-avatar.png";
    link.href = canvas.toDataURL();
    link.click();
  }

  return (
    <Flex vertical={true} align="center" gap="large">
      <Preview ref={previewRef} width={options.width} height={options.height} />
      <Flex gap="small">
        <Select
          defaultValue={algorithms[defaultIndex].name}
          onChange={onSelect}
          options={algorithms.map(({ name }) => ({ name, value: name }))}
        />
        <Flex gap="small">
          <Button type="primary" onClick={onRefresh} icon={<UndoOutlined />} shape="circle"></Button>
          <Button type="primary" onClick={onDownload} icon={<DownloadOutlined />} shape="circle"></Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
