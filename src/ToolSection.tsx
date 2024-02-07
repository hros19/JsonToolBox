
import 'bootstrap-icons/font/bootstrap-icons.css';

interface ToolSectionProps {
  beautifyContent: () => void;
  changeIndentation: (indentation: number) => void;
  validateJson: () => void;
  convertToCamelCase: () => void;
  minifyContent: () => void;
  generateJsonSchema: () => void;
}

function ToolSection({ 
  beautifyContent, 
  changeIndentation, 
  validateJson, 
  convertToCamelCase,
  minifyContent,
  generateJsonSchema
}: ToolSectionProps) {

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

    </div>
  );
}

export default ToolSection;
