import React from "react";
import BaseMap from "./components/BaseMap";
import BaseSidebar from "./components/BaseSidebar";
import styled from "styled-components";

const AppDiv = styled.div`
	display: flex;
`;

function App() {
	return (
		<AppDiv className="App">
			<BaseMap />
			<BaseSidebar />
		</AppDiv>
	);
}

export default App;
