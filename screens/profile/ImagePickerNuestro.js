import React, { useState } from 'react';

const ImagePickerNuestro = () => {
  const [base64Image, setBase64Image] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      // Convert the binary data to base64 string
      const base64String = reader.result.split(',')[1];

      // Do something with the base64 string (here we're just logging it)
      console.log('Base64 Image:', base64String);

      // Set the base64 image
      setBase64Image(base64String);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {base64Image && <img src={`data:image/jpeg;base64,${base64Image}`} alt="Selected" />}
    </div>
  );
};

export default ImagePickerNuestro;