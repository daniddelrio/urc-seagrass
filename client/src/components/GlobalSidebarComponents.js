import styled from "styled-components";
import { Field } from "formik";

export const SidebarSubheader = styled.h1`
  font-size: 14px;
  line-height: 198.18%;
  color: #9f9f9f;
`;

export const ParentButton = styled.button`
  padding: 0.5rem;

  border-radius: 15.5px;
  box-sizing: border-box;

  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
`;

export const FilledButton = styled(ParentButton)`
  flex: 1;
  background: #c4c4c4;
  border: 0.7px solid #c4c4c4;

  color: #474747;
`;

export const GrayButton = styled(ParentButton)`
  background: #585858;
  border-radius: 12.5px;
  border: 0.7px solid #585858;

  color: #8D8D8D;
`;

export const EmptyButton = styled(ParentButton)`
  flex: ${(props) => props.noFlex ? 0 : 1};
  background: #474747;
  border: 0.7px solid #c4c4c4;
  margin-left: ${(props) => props.marginLeft || 0};

  color: #c4c4c4;
`;

export const AdminTextField = styled(Field)`
  flex: 1;

  background: #4F4F4F;
  border: 0.7px solid #9A9A9A;
  box-sizing: border-box;
  border-radius: 4px;

  font-size: 13px;
  line-height: 15px;
  color: ${({ inputType }) => inputType == "password" ? "#D0D0D0" : "#808080"};

  padding: 0.6rem;
  margin-bottom: 1rem;
`;

export const CustomErrorMessage = styled.div`
  padding: 0.5rem 0.7rem;
  margin-bottom: 1rem;
  background: #ac7474;
  border: 1px solid #e76e6e;
  box-sizing: border-box;
  border-radius: 4px;

  font-family: Open Sans;
  font-size: 0.75em;
  line-height: 14px;
  display: flex;
  align-items: center;

  color: #ffd3d3;
`;
