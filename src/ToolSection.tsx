
import { useState } from 'react';

import 'bootstrap-icons/font/bootstrap-icons.css';

function ToolSection({ 
  beautifyContent, 
  changeIndentation, 
  jsonSchema, 
  setJsonSchema, 
  validateJson, 
  validationResult, 
  convertToCamelCase,
  minifyContent,
  generateJsonSchema
}) {

  const [showValidation, setShowValidation] = useState(false);

  return (
    <div className="col-4 tool-section">
      <div className="tool-box" onClick={beautifyContent}>
        <i className="bi bi-braces-asterisk"></i>
        <span>Beautify</span>
      </div>
      <div className="tool-box" onClick={minifyContent}>
        <i className="bi bi-file-earmark-minus"></i>
        <span>Minify</span>
      </div>
      <div className="tool-box" onClick={() => changeIndentation(4)}>
        <i className="bi bi-text-indent-left"></i>
        <span>Change Identation</span>
      </div>
      <div className="tool-box" onClick={convertToCamelCase}>
        <i className="bi bi-arrow-repeat"></i>
        <span>Convert to CamelCase</span>
      </div>
      <div className="tool-box" onClick={generateJsonSchema}>
        <i className="bi bi-gear"></i>
        <span>Generate JSON Schema</span>
      </div>
      <div className="tool-box" onClick={validateJson}>
        <i className="bi bi-check2-circle"></i>
        <span>Validate JSON (with schema)</span>
      </div>

      {showValidation && (
        <div>
          <textarea
            className="form-control"
            placeholder="Ingrese el esquema JSON aquí"
            value={jsonSchema}
            onChange={(e) => setJsonSchema(e.target.value)}
          />
          <button className="btn btn-primary" onClick={validateJson}>
            Validar
          </button>
          {validationResult && <div>{validationResult}</div>}
        </div>
      )}

    </div>
  );
}

export default ToolSection;
