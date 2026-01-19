import React, { useEffect, useState } from 'react';
import { useListView } from '../../core/ListViewProvider'
import request, { gql } from 'graphql-request';
import { ExportToCsv } from 'export-to-csv';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import BASEURL from '../../../../../../config/baseurl';

const LIST_FILES = gql`
query listFiles(
  $projectid: String!,
  $contracttype: String!,
  $filestatus: String!
){
  listFiles(
    projectid:$projectid,
    contracttype: $contracttype,
    filestatus: $filestatus
  ){
    project{
      id
      projectName
    }
    contractType{
      contractTypeName
    }
    fileStatus
    fileName
    id
  }
}`

const Fields = gql`
query DataviewById($fileId: String!){
  dataviewById(fileId: $fileId){
    edges{
      node{
        id
        fieldName
        fieldValue
      }
    }
  }
}`

const Contract_Fields = gql`
query GetContractFields($fileId: String!){
  getContractFields(fileId: $fileId){
    edges{
      node{
        fieldName 
      }
    }
  }
}`


const UsersListGrouping = () => {
  const { selected, clearSelected, projectid, docType } = useListView()

  console.log("export data variable projectId, doctype", projectid, docType);

  const [data, setData] = useState<any[]>([])
  useEffect(() => {
    if (projectid != "") {
      request(`${BASEURL}graphql/`, LIST_FILES, { projectid: projectid, contracttype: docType, filestatus: "Review Completed" }, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
        console.log("response in export data handlechange1", res.listFiles);
        setData(res.listFiles)
      })
    }
  }, [projectid, docType])

  console.log("export page data -->", data);
  console.log("selected values for export", selected);

  const handleExportData = () => {
    const option: any[] = [];
    Promise.all(
      selected.map((fileId) => {
        const element = data.find((item) => item.id === fileId);
        if (element) {
          const fieldsPromise = request(`${BASEURL}graphql/`, Fields, { fileId }, {Authorization: `Bearer ${localStorage.getItem('Token')}`});
          const contractFieldsPromise = request(`${BASEURL}graphql/`, Contract_Fields, { fileId }, {Authorization: `Bearer ${localStorage.getItem('Token')}`});

          return Promise.all([fieldsPromise, contractFieldsPromise]).then(([fieldsResponse, contractFieldsResponse]: any) => {
            const fieldsData = fieldsResponse.dataviewById.edges;
            const contractFieldsData = contractFieldsResponse.getContractFields.edges;

            // Filter and map the fieldsData into the structure you need
            const additionalData = fieldsData.map((field: any) => ({
              fieldName: field.node.fieldName,
              fieldValue: field.node.fieldValue,
            }));

            // Add contractFieldsData to additionalData if not already present
            contractFieldsData.forEach((contractField: any) => {
              const existsInAdditionalData = additionalData.some((item: any) => item.fieldName === contractField.node.fieldName);
              if (!existsInAdditionalData) {
                additionalData.push({
                  fieldName: contractField.node.fieldName,
                  fieldValue: null, // You can set a default value here if needed
                });
              }
            });

            // Add element data to the option array with additionalData
            option.push({
              ...element,
              additionalData: additionalData,
            });
            console.log("Export Option", option);

          });
        }
        return Promise.resolve(); // Resolve an empty promise if element not found
      })
    )
      .then(() => {
        console.log("export csv option", option);
        const groupedOptions: any = {};

        option.forEach((item) => {
          const doctype = item?.contractType?.contractTypeName;

          if (!groupedOptions[doctype]) {
            groupedOptions[doctype] = [];
          }
          groupedOptions[doctype].push(item);
        });

        console.log("export groupedOption", groupedOptions);
        Object.keys(groupedOptions).forEach((doctype: string) => {
          const group = groupedOptions[doctype];
          const zip = new JSZip();

          const pdfPromises = group.map((item: any) => {
            const schema_name = localStorage.getItem('Schema') 
            const projectName = item.project.projectName;
            const fileName = item.fileName;
            const pdfURL = `/${schema_name}/${projectName}/${fileName}.pdf`;
            console.log("pdf url zip", pdfURL)

            return fetch(pdfURL)
              .then((response) => response.blob())
              .then((pdfBlob) => {
                // Add only the PDF files for the current contractType to the ZIP archive
                zip.file(`${fileName}.pdf`, pdfBlob);
              })
              .catch((error) => {
                console.error('Error fetching PDF:', error);
              });
          });

          // Prepare data for the group
          const csvData: any[] = [];
          const allHeaders: Set<string> = new Set();
          group.forEach((item: any) => {
            // Collect all unique headers from additionalData of each item
            item.additionalData.forEach((obj: any) => allHeaders.add(obj.fieldName));
          });

          console.log("export header", allHeaders);

          const newHeaders = ['projectName', 'ContractType', 'FileName', 'Status', ...allHeaders];
          let projectname: any;
          let filename: any;
          group.forEach((item: any) => {
            const projectName = item.project.projectName;
            const fileName = item.fileName;
            projectname = projectName
            filename = fileName
            const doctype = item?.contractType?.contractTypeName;
            const fileStatus = item.fileStatus;
            const additionalDataMap = new Map();
            item.additionalData.forEach((obj: any) => additionalDataMap.set(obj.fieldName, obj.fieldValue));

            const rowData = newHeaders.map((header) => {
              if (header === 'projectName') return projectName;
              if (header === 'ContractType') return doctype;
              if (header === 'FileName') return fileName;
              if (header === 'Status') return fileStatus;

              return additionalDataMap.get(header) || '';
            });
            csvData.push(rowData);
          });

          csvData.unshift(newHeaders);

          console.log("export data csvData", csvData);
          if (docType === "All") {
            Promise.all(pdfPromises).then(() => {
              // Generate the ZIP file for the current document type
              zip.generateAsync({ type: 'blob' }).then((content) => {
                // Use the document type as part of the ZIP file name
                const zipFileName = `${projectname}-${doctype}.zip`;
                saveAs(content, zipFileName);
              });
            });
          } else {
            Promise.all(pdfPromises).then(() => {
              // Generate the ZIP file for the current document type
              zip.generateAsync({ type: 'blob' }).then((content) => {
                // Use the document type as part of the ZIP file name
                const zipFileName = `${doctype}-${filename}.zip`;
                saveAs(content, zipFileName);
              });
            });
          }

          let options;

          if (docType === "All") {
            const newFileName = `${projectname}-${doctype}`;
            options = {
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalSeparator: '.',
              showLabels: true,
              showTitle: false,
              title: `${docType} Data`,
              useTextFile: false,
              useBom: true,
              useKeysAsHeaders: false,
              filename: newFileName,
            };
          } else {
            const newFileName = `${doctype}-${filename}`;
            options = {
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalSeparator: '.',
              showLabels: true,
              showTitle: false,
              title: `${docType} Data`,
              useTextFile: false,
              useBom: true,
              useKeysAsHeaders: false,
              filename: newFileName,
            };
          }

          const csvExporter = new ExportToCsv(options);
          csvExporter.generateCsv(csvData);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const colorv = localStorage.getItem("themeColor")
  const themec = colorv != null ? colorv + " " + 'btn' : 'p-3 bg-primary text-white btn'

  return (
    <div className='d-flex justify-content-end align-items-center'>
      <div className='fw-bolder me-5'>
        <span className='me-2'>{selected.length}</span> Selected
      </div>

      <button
        type='button'
        onClick={handleExportData}
        className={themec}
      >
        Export
      </button>
    </div>
  )
}

export { UsersListGrouping }
