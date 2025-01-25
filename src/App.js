import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import Table from 'react-bootstrap/Table'

const salesData = [
  {
    "id": "electronics",
    "label": "Electronics",
    "value": 1400, //this value needs to be calculated from the children values (800+700)
    "children": [
      {
        "id": "phones",
        "label": "Phones",
        "value": 800
      },
      {
        "id": "laptops",
        "label": "Laptops",
        "value": 700
      }
    ]
  },
  {
    "id": "furniture",
    "label": "Furniture",
    "value": 1000, //this need to be calculated from the children values (300+700)
    "children": [
      {
        "id": "tables",
        "label": "Tables",
        "value": 300
      },
      {
        "id": "chairs",
        "label": "Chairs",
        "value": 700
      }
    ]
  }
];

const App = () => {
  const [dataSales, setSalesData] = useState(salesData);

  const updatePercent = (id, newValue, type) => {
    const updatedData = JSON.parse(JSON.stringify(dataSales));

    const updateRow = (rows) => {
      rows.forEach((row) => {
        if (row.id === id) {
          const variance = ((newValue - row.value) / row.value) * 100;
          row.variance = variance.toFixed(2);
          row.value = newValue;
        }

        if (row.children) {
          updateRow(row.children);
          row.value = row.children.reduce((sum, child) => sum + child.value, 0);
        }
      });
    };

    updateRow(updatedData);
    setSalesData(updatedData);
  };

  const updateValue = (id, newValue, type) => {
    const updatedData = JSON.parse(JSON.stringify(dataSales));
    console.log("Value2", updatedData);
    const updateRow = (rows) => {
      rows.forEach((row) => {
        if (row.id === id) {
          const variance = ( row.value - newValue ) / row.value * 100;
          row.variance = variance.toFixed(2);
          row.value = newValue;
        }
        console.log("Value3", newValue);
      });
    };

    updateRow(updatedData);
    setSalesData(updatedData);
  };

  const distributeValue = (row, newValue) => {
    const total = row.children.reduce((sum, child) => sum + child.value, 0);
    const ratio = newValue / total;
    row.children.forEach((child) => {
      child.value = Math.round(child.value * ratio);
      if (child.children) {
        distributeValue(child, child.value);
      }
    });
  };

  const handleParentUpdate = (id, newValue) => {
    const updatedData = JSON.parse(JSON.stringify(dataSales));

    const updateMainValue = (rows) => {
      rows.forEach((row) => {
        if (row.id === id && row.children) {
          distributeValue(row, newValue);
          row.value = newValue;
        } else if (row.children) {
          updateMainValue(row.children);
        }
      });
    };

    updateMainValue(updatedData);
    setSalesData(updatedData);
  };

  
  const GrandTotal = () => {
    console.log("Total", dataSales);
    return dataSales.reduce((sum, row) => sum + row.value, 0);
  };

  const loadSalesValue = (row, rval = 0) => (
    <>
      <tr>
        <td>{row.label}</td>
        <td>{row.value}</td>
        <td>
          <input
            type="number"
            placeholder="Enter value"
            onChange={(e) => (row.input = e.target.value.replace(/[^0-9]/g, ""))}
          />
        </td>
        <td>
          <button
            onClick={() =>
              updatePercent(
                row.id,
                row.value + (parseFloat(row.input || 0) / 100) * row.value,
                "percentage"
              )
            }
          >
            Button 1 (%)
          </button>
        </td>
        <td>
          <button
            onClick={() => updateValue(
              row.id, row.value, "value"
            )
            }
          >
            Button 2 (Val)
          </button>
        </td>
        <td>{row.variance ? `${row.variance}%` : "0%"}</td>
      </tr>
      {row.children && row.children.map((child) => loadSalesValue(child, rval + 1))}
    </>
  );

  return (
    <>
    <h3>Simple Hierarchical Table Website</h3> 
      <Table stripped bordered hover size="sm"> 
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {dataSales.map((row) => loadSalesValue(row))}
          <tr>
            <td>Grand Total</td>
            <td>{GrandTotal()}</td>
            <td>-</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default App;
