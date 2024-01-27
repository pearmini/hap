import { useEffect, useRef, useState } from "react";
import { Button, Flex, Select } from "antd";
import styled from "styled-components";
import { UndoOutlined, DownloadOutlined } from "@ant-design/icons";
import { algorithms, defaultIndex } from "../algorithms";
import { promise } from "../utils/promise";

const Preview = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

export function FilterAlgorithm({ imageData, setRendering, disabled = false, options = {} }) {
  const previewRef = useRef(null);
  const clear = useRef(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[defaultIndex].name);

  useEffect(() => {
    if (!imageData) return;
    renderAlgorithm(imageData, selectedAlgorithm);
  }, [imageData, selectedAlgorithm]);

  async function renderAlgorithm(image, name) {
    if (clear.current) clear.current();
    const { render } = algorithms.find((d) => d.name === name);

    const [finished, resolve] = promise();
    finished.then(() => setRendering(false));
    setRendering(true);

    const app = await render(image, { ...options, resolve });
    const node = app.node();
    if (!(node instanceof HTMLElement)) return;
    const preview = previewRef.current;
    preview.innerHTML = "";
    preview.appendChild(node);
    clear.current = () => app.dispose();
  }

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
          disabled={disabled}
        />
        <Flex gap="small">
          <Button onClick={onRefresh} icon={<UndoOutlined />} shape="circle" disabled={disabled}></Button>
          <Button onClick={onDownload} icon={<DownloadOutlined />} shape="circle" disabled={disabled}></Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
