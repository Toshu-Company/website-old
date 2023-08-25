import { styled } from "styled-components";
import { useState } from "react";

type Props = {
  label: string;
  checked?: boolean;
  onChange?: (isOn: boolean) => void;
};

export default function Toggle({ label, checked, onChange }: Props) {
  const [isOn, setIsOn] = useState(checked ?? false);

  const handleToggle = () => {
    setIsOn(!isOn);
    onChange?.(!isOn);
  };

  return (
    <>
      <ToggleWrapper>
        <ToggleLabel>{label}</ToggleLabel>
        <ToggleSwitch onClick={handleToggle}>
          <SwitchInput type="checkbox" checked={isOn} />
          <SwitchSlider />
        </ToggleSwitch>
      </ToggleWrapper>
    </>
  );
}

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ToggleLabel = styled.div`
  margin-right: 16px;
  font-size: 28px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  ${SwitchInput}:checked + & {
    background-color: #2196f3;
  }

  ${SwitchInput}:checked + &:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 34px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
