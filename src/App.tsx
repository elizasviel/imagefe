import { useState, FormEvent } from "react";

interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  steps: number;
  cfgScale: number;
  width: number;
  height: number;
}

const App = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<GenerationParams>({
    prompt: "",
    negativePrompt: "",
    steps: 25,
    cfgScale: 7,
    width: 1024,
    height: 1024,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        "https://imagebe-b46ae61373e6.herokuapp.com/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ params }),
        }
      );

      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Image Generator</h1>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="prompt">Prompt:</label>
          <textarea
            id="prompt"
            value={params.prompt}
            onChange={(e) => setParams({ ...params, prompt: e.target.value })}
            placeholder="Describe what you want to generate..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="negativePrompt">Negative Prompt:</label>
          <textarea
            id="negativePrompt"
            value={params.negativePrompt}
            onChange={(e) =>
              setParams({ ...params, negativePrompt: e.target.value })
            }
            placeholder="What you don't want in the image..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="steps">Steps:</label>
            <input
              type="number"
              id="steps"
              value={params.steps}
              onChange={(e) =>
                setParams({ ...params, steps: Number(e.target.value) })
              }
              min="1"
              max="50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cfgScale">CFG Scale:</label>
            <input
              type="number"
              id="cfgScale"
              value={params.cfgScale}
              onChange={(e) =>
                setParams({ ...params, cfgScale: Number(e.target.value) })
              }
              min="1"
              max="20"
              step="0.5"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="width">Width:</label>
            <input
              type="number"
              id="width"
              value={params.width}
              onChange={(e) =>
                setParams({ ...params, width: Number(e.target.value) })
              }
              min="512"
              max="1024"
              step="64"
            />
          </div>

          <div className="form-group">
            <label htmlFor="height">Height:</label>
            <input
              type="number"
              id="height"
              value={params.height}
              onChange={(e) =>
                setParams({ ...params, height: Number(e.target.value) })
              }
              min="512"
              max="1024"
              step="64"
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      <div className="generation-status">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Generating image...</p>
          </div>
        )}

        {imageUrl && (
          <div className="result">
            <h2>Generated Image</h2>
            <div className="image-container">
              <img src={imageUrl} alt="AI Generated" />
              <a
                href={imageUrl}
                download="generated-image.png"
                target="_blank"
                rel="noopener noreferrer"
                className="download-button"
              >
                Download Image
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .form {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-row {
          display: flex;
          gap: 20px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        textarea {
          width: 100%;
          min-height: 80px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
        }

        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        button {
          background: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }

        button:disabled {
          background: #ccc;
        }

        .loading {
          text-align: center;
          margin: 20px 0;
          color: #666;
        }

        .result {
          text-align: center;
        }

        .result img {
          max-width: 100%;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .generation-status {
          margin-top: 30px;
        }

        .loading-container {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin: 20px 0;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 15px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .result {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .result h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .image-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .result img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .result img:hover {
          transform: scale(1.02);
        }

        .download-button {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }

        .download-button:hover {
          background: #218838;
        }

        @media (max-width: 600px) {
          .form-row {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
