import { type CSSProperties, type ChangeEvent, type SyntheticEvent, useState } from "react";

function App() {
  const [message, setMessage] = useState("대기 중...");
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  const callBackend = async () => {
    setMessage("호출 중...");
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/hello`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      setMessage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setMessage("호출 실패");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setMessage("업로드 중...");
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed! status: ${response.status}`);
      }

      const result = await response.text();
      setMessage(result);
      setUploadedFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setMessage("업로드 실패");
    }
  };

  const handlePreviewError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = "none";
    setMessage("미리보기를 불러올 수 없습니다. 이미지 파일이 아닐 수 있습니다.");
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>AWS S3 File Integration CI/CD Test</h1>
        <p style={descriptionStyle}>
          백엔드를 통해 S3에 파일을 업로드하고 미리볼 수 있습니다.
        </p>
      </header>

      <main style={mainStyle}>
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Backend Connection</h2>
          <button type="button" onClick={callBackend} style={buttonStyle}>
            백엔드 API 호출
          </button>
          <div style={resultBoxStyle}>
            <p style={{ ...resultTextStyle, color: error ? "#d9534f" : "#2f855a" }}>
              {error ? `에러: ${error}` : message}
            </p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>S3 File Upload</h2>
          <input type="file" onChange={handleFileChange} style={fileInputStyle} />
          <button
            type="button"
            onClick={handleUpload}
            style={{ ...buttonStyle, backgroundColor: "#007bff" }}
          >
            S3 업로드
          </button>
        </section>
      </main>

      {uploadedFileName && (
        <section style={previewSectionStyle}>
          <h2 style={sectionTitleStyle}>S3 File Preview</h2>
          <p>
            백엔드 프록시를 통해 가져온 파일입니다. <code>{uploadedFileName}</code>
          </p>
          <div style={previewBoxStyle}>
            <img
              src={`${apiBaseUrl}/api/preview/${uploadedFileName}`}
              alt="Uploaded file preview"
              style={previewImageStyle}
              onError={handlePreviewError}
            />
          </div>
          <p style={urlStyle}>URL: {`${apiBaseUrl}/api/preview/${uploadedFileName}`}</p>
        </section>
      )}
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "50px 20px",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#f7f8fb",
};

const headerStyle: CSSProperties = {
  marginBottom: "40px",
};

const titleStyle: CSSProperties = {
  color: "#232f3e",
  margin: "0 0 12px",
};

const descriptionStyle: CSSProperties = {
  color: "#666",
  margin: 0,
};

const mainStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  flexWrap: "wrap",
};

const sectionStyle: CSSProperties = {
  padding: "20px",
  border: "1px solid #eee",
  borderRadius: "8px",
  minWidth: "320px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  backgroundColor: "white",
};

const sectionTitleStyle: CSSProperties = {
  marginTop: 0,
  color: "#1f2937",
  fontSize: "1.15rem",
};

const buttonStyle: CSSProperties = {
  padding: "10px 20px",
  fontSize: "15px",
  backgroundColor: "#ff9900",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const fileInputStyle: CSSProperties = {
  display: "block",
  margin: "0 auto 14px",
};

const resultBoxStyle: CSSProperties = {
  marginTop: "15px",
  padding: "10px",
  border: "1px solid #f0f0f0",
  borderRadius: "6px",
  backgroundColor: "#fafafa",
  minHeight: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const resultTextStyle: CSSProperties = {
  margin: 0,
  fontWeight: "bold",
};

const previewSectionStyle: CSSProperties = {
  ...sectionStyle,
  width: "80%",
  maxWidth: "800px",
  margin: "40px auto 0",
};

const previewBoxStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "10px",
  backgroundColor: "#f9f9f9",
};

const previewImageStyle: CSSProperties = {
  maxWidth: "100%",
  maxHeight: "400px",
  borderRadius: "4px",
};

const urlStyle: CSSProperties = {
  fontSize: "0.9rem",
  color: "#666",
  marginTop: "10px",
};

export default App;
