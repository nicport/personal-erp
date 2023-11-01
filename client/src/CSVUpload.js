import React from 'react';
import Papa from 'papaparse';


const CSVUpload = ({ onFileLoaded }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      Papa.parse(evt.target.result, {
        header: true,
        complete: (result) => {
          onFileLoaded(result.data);
        },
      });
    };
    reader.readAsText(file);
  };

  return (
    <input type="file" accept=".csv" onChange={handleFileChange} />
  );
};

export default CSVUpload;