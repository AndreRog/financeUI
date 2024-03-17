import React, { useState, useEffect } from 'react';
import { BankType, getBankTypes } from '../services/finance.service';



const UploadButton = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [bankOptions, setBankOptions] = useState<BankType[]>([]);

  useEffect(() => {
    fetchBankOptions();
  }, []);

  const fetchBankOptions = async () => {
    console.log((await getBankTypes()));
    setBankOptions(await getBankTypes());
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleBankChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBank(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedBank) {
      console.error('Please select both a file and a bank.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('bankName', selectedBank);

    try {
      const response = await fetch('/finance/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Optionally, reset the selected file and bank state
        setSelectedFile(null);
        setSelectedBank('');
      } else {
        // Handle error
        console.error('Failed to upload file');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={(fileInput) => {
          if (fileInput) fileInput.click();
        }}
      />
      <select value={selectedBank} onChange={handleBankChange}>
        <option value="">Select Bank</option>
        {bankOptions.map((bank) => (
          <option key={bank} value={bank}>
            {bank}
          </option>
        ))}
      </select>
      <button onClick={handleUpload}>{selectedFile ? 'Upload File' : 'Select File'}</button>
    </div>
  );
};

export default UploadButton;
