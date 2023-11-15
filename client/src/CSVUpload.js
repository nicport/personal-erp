import React from 'react';
import Papa from 'papaparse';


const CSVUpload = ({ onFileLoaded }) => {
  const fileInputRef = React.createRef();
  
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

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <button className="btn-upload" onClick={handleButtonClick}>Upload CSV</button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the actual input field
      />
    </>
  );
};

export default CSVUpload;