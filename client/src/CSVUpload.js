import React, { useRef, useState } from "react";
import Papa from "papaparse";

const UploadCSV = () => {
  const [csvFile, setCsvFile] = useState();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      complete: async function (results) {
        // send the parsed data to the backend
        const parsedData = results.data.slice(1); // Remove header
        await fetch("http://localhost:3001/api/transactions/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactions: parsedData }),
        });
      },
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {/* Visible UI */}
      <button onClick={triggerFileInput}>Choose CSV File</button>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadCSV;