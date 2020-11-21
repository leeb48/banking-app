import React, { Fragment, useContext, useEffect } from "react";
import { Store } from "../../store/Store";

import CanvasJSReact from "../../canvasjs/canvasjs.react.js";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Spending = () => {
  const { state } = useContext(Store);

  const { spendingsLoading, spendingsData } = state.plaid;

  const options = {
    animationEnabled: true,
    title: {
      text: `${spendingsData.dateInterval}`,
    },
    data: [
      {
        type: "doughnut",
        showInLegend: true,
        indexLabel: "{name}: {y}",
        yValueFormatString: "$###,###,###,###,###,###",
        dataPoints: spendingsData.data,
      },
    ],
  };

  return spendingsLoading ? (
    <h3>Loading...</h3>
  ) : (
    <div style={{ marginTop: "2rem" }}>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default Spending;
