import { useState, useEffect } from 'react';
import xmlFormatter from 'xml-formatter';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToolSection from './ToolSection';
import JsonSection from './JsonSection';
import Ajv from 'ajv';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [content, setContent] = useState('');
  const [format, setFormat] = useState('json'); // 'json' o 'xml'
  const [indentation, setIndentation] = useState(2);

  const [jsonSchema, setJsonSchema] = useState('');
  const [validationResult, setValidationResult] = useState('');

  useEffect(() => {
    determineFormat(content);
  }, [content]);

  const validateJson = () => {
    const ajv = new Ajv();
    let valid;
    let validate;
    try {
      const schema = JSON.parse(jsonSchema);
      validate = ajv.compile(schema);
      const data = JSON.parse(content);
      valid = validate(data);
    } catch (error: any) {
      setValidationResult(`Error on validation: ${error.message}`);
      return;
    }

    if (!valid) {
      console.log(validate.errors);
      setValidationResult(`Invalid JSON: ${ajv.errorsText(validate.errors)}`);
      toast.error('Invalid JSON');
    }
    else {
      setValidationResult('Valid JSON');
      toast.success('Valid JSON');
    }
  };

  const determineFormat = (content: string) => {
    try {
      JSON.parse(content);
      setFormat('json');
    } catch {
      setFormat('xml');
    }
  };

  const beautifyContent = () => {
    try {
      if (format === 'json') {
        const parsedJson = JSON.parse(content);
        setContent(JSON.stringify(parsedJson, null, indentation));
      } else if (format === 'xml') {

        const formattedXmlContent = xmlFormatter(content, { indentation: ' '.repeat(indentation) });

        setContent(formattedXmlContent);
      }
    } catch (error) {
      console.error('Error formatting content:', error);

      // Toast de error
      toast.error('Error formatting content');
    }
  };

  const changeIndentation = () => {
    const newIndentation = indentation === 2 ? 4 : 2;
    setIndentation(newIndentation);
    beautifyContent();
  };
  
  const toCamelCase = (str: string) => {
    return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
  };
  
  const convertKeysToCamelCase: any = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      return obj.map((v) => convertKeysToCamelCase(v));
    }
  
    return Object.keys(obj).reduce((result: any, key) => {
      const camelCaseKey = toCamelCase(key);
      result[camelCaseKey] = convertKeysToCamelCase(obj[key]);
      return result;
    }, {});
  };
  
  const convertToCamelCase = () => {
    try {
      const parsedJson = JSON.parse(content);
      const camelCaseJson = convertKeysToCamelCase(parsedJson);
      setContent(JSON.stringify(camelCaseJson, null, indentation));
    } catch (error) {
      console.error('Error converting to camelCase:', error);

      toast.error('Error converting to camelCase');
    }
  };

  const minifyContent = () => {
    try {
      if (format === 'json') {
        const parsedJson = JSON.parse(content);
        setContent(JSON.stringify(parsedJson));
      } else if (format === 'xml') {
        const formattedXmlContent = xmlFormatter(content, { collapseContent: true });
        setContent(formattedXmlContent);
      }
    } catch (error) {
      console.error('Error minifying content:', error);

      // Toast de error
      toast.error('Error minifying content');
    }
  };

  const generateJsonSchema = () => {
    const generateSchema = (obj: any, existingSchema: any = null): any => {
      if (Array.isArray(obj)) {
        let combinedItemType = existingSchema ? existingSchema.items : null;
        obj.forEach(item => {
          combinedItemType = generateSchema(item, combinedItemType);
        });
        return { type: "array", items: combinedItemType || {} };
      } else if (typeof obj === 'object') {
        if (obj === null) {
          return existingSchema ? { ...existingSchema, type: [...new Set([...existingSchema.type, "null"])] } : { type: ["null"] };
        }
        const properties: any = existingSchema ? { ...existingSchema.properties } : {};
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          properties[key] = generateSchema(value, properties[key]);
        });
        return { type: ["object"], properties };
      } else {
        const newType = typeof obj;
        if (existingSchema) {
          return { ...existingSchema, type: [...new Set([...existingSchema.type, newType])] };
        }
        return { type: [newType] };
      }
    };
  
    try {
      const parsedJson = JSON.parse(content);
      const schema = generateSchema(parsedJson);
      setJsonSchema(JSON.stringify(schema, null, 2));
    } catch (error: any) {
      console.error('Error generating JSON schema:', error.message);
      toast.error('Error generating JSON schema');
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <h1 className="text-center my-4">JsonXmlToolBox</h1>
      <div className="row">
        <ToolSection 
          beautifyContent={beautifyContent} 
          changeIndentation={changeIndentation}
          validateJson={validateJson}
          convertToCamelCase={convertToCamelCase}
          minifyContent={minifyContent}
          generateJsonSchema={generateJsonSchema}
        />
        <JsonSection 
          content={content} 
          setContent={setContent} 
          determineFormat={determineFormat}
        />
      </div>
      <div className="col-12 mt-4">
          <h2>JSON Schema</h2>
          <textarea
            className="form-control"
            value={jsonSchema}
            onChange={(e) => setJsonSchema(e.target.value)}
            style={{ height: '200px' }}
          />
          {validationResult && <div>{validationResult}</div>} 
      </div>
    </div>
  );
}

export default App;
