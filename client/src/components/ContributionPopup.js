import React, { Component } from "react";
import styled from "styled-components";
import { ParentButton } from "./GlobalSidebarComponents";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import api from "../services/contrib-services";
import ReactLoading from "react-loading";

const ContribLoading = styled.div`
  position: absolute;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  span {
    margin-top: 1rem;
    color: #bababa;
  }
`;

const BaseFrame = styled(Modal)`
  font-family: Open Sans;
  font-style: normal;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 6px;

  &.special-modal-content .modal-content {
    width: 100%;
    background: #5a5a5a;
    padding: 1.5rem;
  }
`;

const Header = styled(Modal.Header)`
  font-size: 1.3em;
  color: ${(props) => (props.isApprove ? "#85B790" : "#EC7E7E")};
  border-bottom: none;

  .close {
    color: #8e8e8e;
  }
`;

const Contributions = styled.ul`
  overflow-y: hidden;
  font-size: 0.8em;
  color: #bababa;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ApproveButton = styled(ParentButton)`
  background: #5e8968;
  border: 0.7px solid #85b790;
  box-sizing: border-box;
  border-radius: 14px;

  color: #b4d9bc;
`;

const DenyButton = styled(ParentButton)`
  background: #8a5555;
  border: 0.7px solid #c28a8a;
  box-sizing: border-box;
  border-radius: 14px;

  color: #e38787;
`;

class ContributionPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  handleClick = async () => {
    try {
      this.setState({ isLoading: true });
      const updateAllData = async () => {
        const finalData = [];
        for (const contrib of Object.values(this.props.data)) {
          const curr = await api.updateContribution(contrib._id, {
            ...contrib,
            isApproved: this.props.isApprove,
          });
          finalData.push(curr);
        }
        return finalData;
      };
      const updatedData = await updateAllData();
      if (updatedData) {
        this.setState({ isLoading: false });
        window.location.reload();
      }
    } catch (err) {
      this.setState({ isLoading: false });
      console.log("An error has just occured!");
      console.log(err);
    }
  };

  render() {
    return (
      <React.Fragment>
        <BaseFrame
          show={this.props.show}
          onHide={this.props.closeModal}
          className="special-modal-content"
        >
          <Header
            isApprove={this.props.isApprove}
            closeButton
          >{`Are you sure to ${
            this.props.isApprove ? "approve" : "deny"
          }...`}</Header>
          <Modal.Body>
            <Contributions>
              {Object.entries(this.props.data).map(([key, value]) => (
                <li>{this.props.summarizeContrib(value)}</li>
              ))}
            </Contributions>
          </Modal.Body>
          <ButtonGroup>
            {this.props.isApprove ? (
              <ApproveButton
                onClick={async () => {
                  await this.handleClick();
                }}
              >
                Approve
              </ApproveButton>
            ) : (
              <DenyButton
                onClick={async () => {
                  await this.handleClick();
                }}
              >
                Deny
              </DenyButton>
            )}
            {this.state.isLoading && (
              <ContribLoading>
                <ReactLoading type="spin" />
                <span>{`${
                  this.props.isApprove ? "Approv" : "Reject"
                }ing contributions. Please do not refresh.`}</span>
              </ContribLoading>
            )}
          </ButtonGroup>
        </BaseFrame>
      </React.Fragment>
    );
  }
}

export default ContributionPopup;
