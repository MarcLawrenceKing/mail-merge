// utility to convert file to Base64
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString();
      if (!result) return reject("Failed to read file");
      resolve(result.split(",")[1]); // remove data:mime;base64,
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default fileToBase64;
