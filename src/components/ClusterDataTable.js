import {
  Box,
  makeStyles,
  TableCell,
  TableContainer,
  TableRow,
  TableSortLabel,
  withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { CLUSTER_BACKGROUND, FONT_FAMILY } from '../utils/const';
import { LoadingOverlay } from './UI/LoadingOverlay';
import { useSelector } from 'react-redux';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import * as XLSX from 'xlsx';

import $ from 'jquery';
import TableExport from 'tableexport';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 'bolder',
  },
  body: {
    fontSize: 15,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
    },
  },
  sticky: {
    position: 'sticky',
    left: 0,
    background: 'white',
    boxShadow: '2px 2px 2px grey',
    display: 'block',
  },
  rates: {
    fontFamily: FONT_FAMILY,
  },
});

ReactHTMLTableToExcel.format = (s, c) => {
  // console.log(`c: ${JSON.stringify(c)}\n s: ${s}`);
  if (c && c['table']) {
    const tables_html = document.getElementsByTagName('table');
    const html = c.table;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rows = doc.querySelectorAll('tr');

    console.log(`doc: ${new XMLSerializer().serializeToString(tables_html)}`);

    // for (const row of rows) row.removeChild(row.firstChild);

    // c.table = doc.querySelector('table').outerHTML;
  }

  return s.replace(/{(\w+)}/g, (m, p) => c[p]);
};

export default function ClusterDataTable({
  cluster,
  stars,
  selectedDate,
  type,
}) {
  const classes = useStyles();

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, reqHotel } = getClusterDataSet;

  const [load, setLoad] = useState(true);

  const [rateStrength, setRateStrength] = useState([]);

  const tablesToExcel = function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
      tmplWorkbookXML =
        '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
        '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>' +
        '<Styles>' +
        '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>' +
        '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>' +
        '</Styles>' +
        '{worksheets}</Workbook>',
      tmplWorksheetXML =
        '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>',
      tmplCellXML =
        '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>',
      base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      },
      format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      };
    return function (wsnames, wbname, appname) {
      var ctx = '';
      var workbookXML = '';
      var worksheetsXML = '';
      var rowsXML = '';
      var tables = $('table');
      for (var i = 0; i < tables.length; i++) {
        for (var j = 0; j < tables[i].rows.length; j++) {
          rowsXML += '<Row>';
          for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
            var dataType = tables[i].rows[j].cells[k].getAttribute('data-type');
            var dataStyle =
              tables[i].rows[j].cells[k].getAttribute('data-style');
            var dataValue =
              tables[i].rows[j].cells[k].getAttribute('data-value');
            dataValue = dataValue
              ? dataValue
              : tables[i].rows[j].cells[k].innerHTML;
            var dataFormula =
              tables[i].rows[j].cells[k].getAttribute('data-formula');
            dataFormula = dataFormula
              ? dataFormula
              : appname == 'Calc' && dataType == 'DateTime'
              ? dataValue
              : null;
            ctx = {
              attributeStyleID:
                dataStyle == 'Currency' || dataStyle == 'Date'
                  ? ' ss:StyleID="' + dataStyle + '"'
                  : '',
              nameType:
                dataType == 'Number' ||
                dataType == 'DateTime' ||
                dataType == 'Boolean' ||
                dataType == 'Error'
                  ? dataType
                  : 'String',
              data: dataFormula ? '' : dataValue.replace('<br>', ''),
              attributeFormula: dataFormula
                ? ' ss:Formula="' + dataFormula + '"'
                : '',
            };
            rowsXML += format(tmplCellXML, ctx);
          }
          rowsXML += '</Row>';
        }
        ctx = { rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i };
        worksheetsXML += format(tmplWorksheetXML, ctx);
        rowsXML = '';
      }

      ctx = { created: new Date().getTime(), worksheets: worksheetsXML };
      workbookXML = format(tmplWorkbookXML, ctx);

      console.log(workbookXML);

      var link = document.createElement('A');
      link.href = uri + base64(workbookXML);
      link.download = wbname || 'Workbook.xls';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  useEffect(() => {
    //setStars((cluster.index += 2));
    setLoad(true);
    //console.log(`no of Hotels length : ${noOfHotels.length} => ${noOfHotels}`);

    function getStandardDeviation(array) {
      if (array.length === 0) {
        return 0;
      }
      const n = array.length;
      const mean = array.reduce((a, b) => a + b) / n;
      return Math.sqrt(
        array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
      );
    }

    const rateStrengthHandler = () => {
      let midAvgArr = [];
      cluster.map((e) => {
        if (e.midAVG != 'NaN') {
          midAvgArr.push(Math.round(e.midAVG));
        }
      });
      const sd = getStandardDeviation(midAvgArr);

      const avg = midAvgArr.reduce((a, b) => a + b) / midAvgArr.length;

      let _rateStrength = [];

      cluster.map((e, index) => {
        if (e.mean >= avg + 2 * sd) {
          e.rateStrength = 'Very High';
          _rateStrength.push('Very High');
        }
        if (e.mean >= avg + 1 * sd && e.mean < avg + 2 * sd) {
          e.rateStrength = 'High';
          _rateStrength.push('High');
        }
        if (e.mean >= avg - 1 * sd && e.mean < avg + 1 * sd) {
          e.rateStrength = '';
          _rateStrength.push('');
        }
        if (e.mean >= avg - 2 * sd && e.mean < avg - 1 * sd) {
          e.rateStrength = 'Low';
          _rateStrength.push('Low');
        }
        if (e.mean <= avg - 2 * sd) {
          e.rateStrength = 'Very Low';
          _rateStrength.push('Very Low');
        }
      });

      // console.log(`Bucket: ${stars} star sd: ${sd}, avg: ${avg},`);

      // console.log(
      //   `_rateStrength: ${_rateStrength}, sd: ${sd}, avg: ${avg}, midAvgArr.length: ${midAvgArr.length}, midAvgArr: ${midAvgArr}`
      // );

      console.log(
        `${type} => lowest sd: ${avg - 1 * sd}, highest sd: ${avg + 1 * sd}`
      );

      setRateStrength(_rateStrength);
    };

    if (cluster.length > 0 && reqHotel.length > 0) {
      rateStrengthHandler();
    }

    setLoad(false);
  }, [cluster]);

  const getReportName = () => {
    let name = null;
    if (reqHotel.length > 0) {
      reqHotel.map((e, index) => {
        if (e.name !== null) {
          name = e.name;
          return;
        }
      });
    }

    return `${name}-Rate_Buckets-Cluster-${stars}-${moment(selectedDate).format(
      'YYYY-MM-DD'
    )}`;
  };

  const tbOptions = {
    headers: true,
    formats: ['xlsx'], // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
    bootstrap: true, // (Boolean), style buttons using bootstrap, (default: true)
    exportButtons: false, // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
    position: 'bottom', // (top, bottom), position of the caption element relative to table, (default: 'bottom')
  };
  const DowlandExcel = (key) => {
    const table = TableExport(document.getElementById(key), tbOptions);
    var exportData = table.getExportData();
    var xlsxData = exportData[key].xlsx;
    console.log(xlsxData); // Replace with the kind of file you want from the exportData
    table.export2file(
      xlsxData.data,
      xlsxData.mimeType,
      xlsxData.filename,
      xlsxData.fileExtension,
      xlsxData.merges,
      xlsxData.RTL,
      xlsxData.sheetname
    );
  };

  const DowlandExcelMultiTable = (keys) => {
    const tables = [];
    const xlsxDatas = [];
    keys.forEach((key) => {
      const selector = document.getElementById(key);
      if (selector) {
        const table = TableExport(selector, tbOptions);
        tables.push(table);
        xlsxDatas.push(table.getExportData()[key].xlsx);
      }
    });

    const mergeXlsxData = {
      RTL: false,
      data: [],
      fileExtension: '.xlsx',
      filename: 'rapor',
      merges: [],
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      sheetname: 'Rapor',
    };
    for (let i = 0; i < xlsxDatas.length; i++) {
      const xlsxData = xlsxDatas[i];
      mergeXlsxData.data.push(...xlsxData.data);

      xlsxData.merges = xlsxData.merges.map((merge) => {
        const diff = mergeXlsxData.data.length - xlsxData.data.length;

        merge.e.r += diff;
        merge.s.r += diff;

        return merge;
      });
      mergeXlsxData.merges.push(...xlsxData.merges);
      mergeXlsxData.data.push([null]);
    }
    console.log(mergeXlsxData);
    tables[0].export2file(
      mergeXlsxData.data,
      mergeXlsxData.mimeType,
      mergeXlsxData.filename,
      mergeXlsxData.fileExtension,
      mergeXlsxData.merges,
      mergeXlsxData.RTL,
      mergeXlsxData.sheetname
    );
  };

  return (
    <>
      {!load && cluster.length > 0 ? (
        <TableContainer component={Paper} className="my-5">
          {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ReactHTMLTableToExcel
              className="btn btn-success download-table-xls-button"
              table={`clusters-${stars}-to-xls`}
              filename={getReportName()}
              sheet={getReportName()}
              buttonText="Export to XLS"
            />
            <button
              className="btn btn-success"
              onClick={() =>
                DowlandExcelMultiTable([
                  `clusters-2-to-xls`,
                  `clusters-3-to-xls`,
                  `clusters-4-to-xls`,
                ])
              }
            >
              Export Report
            </button>
          </div> */}
          <Box width={100}>
            <Table
              id={`clusters-${stars}-to-xls`}
              className={classes.table}
              size="medium"
              aria-label="customized table"
              bodyStyle={{ overflow: 'visible' }}
              stickyHeader
            >
              <TableHead>
                <StyledTableCell
                  style={{
                    backgroundColor: CLUSTER_BACKGROUND[stars - 2],
                    width: '250px',
                    zIndex: 100,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  <TableSortLabel disabled>
                    {' '}
                    {`${stars} Star Bucket Matrix`}
                  </TableSortLabel>{' '}
                  <hr />
                  <TableSortLabel disabled>Days Out</TableSortLabel>
                </StyledTableCell>
                {cluster.map((e, index) =>
                  (() => {
                    let _date = moment(e.date);
                    let daysOut = _date.diff(selectedDate, 'days');
                    let date = _date.format('dddd').substring(0, 3);
                    return (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={
                          date === 'Sat' || date === 'Fri'
                            ? 'bg-secondary text-light text-center'
                            : 'text-center'
                        }
                        style={{ fontSize: '12px' }}
                      >
                        {`${
                          date === 'Sat' || date === 'Fri' ? 'WEND' : 'WDAY'
                        }\n${date.toUpperCase()}\n${moment(e.date).format(
                          'MM/DD'
                        )}`}{' '}
                        <hr />
                        {daysOut}
                      </StyledTableCell>
                    );
                  })()
                )}
              </TableHead>
              <TableBody>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky + ' p-2'}
                    style={{ fontSize: '15px', width: '250px' }}
                  >
                    <span className="font-italic font-weight-bold">
                      Rate Strength Exception
                    </span>
                  </StyledTableCell>

                  {/* {rateStrength.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      style={{ fontSize: '10px' }}
                    >
                      <span className="">{e}</span>
                    </StyledTableCell>
                  ))} */}
                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      style={{ fontSize: '10px' }}
                    >
                      {e.rateStrength ? (
                        <span className="">{e.rateStrength}</span>
                      ) : (
                        ''
                      )}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Average Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.mean !== 'NaN' && e.items > 0
                        ? Math.round(e.mean)
                        : e.mean !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Most Repeated rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.mod !== 'NaN' && e.items > 0
                        ? Math.round(e.mod)
                        : e.mod !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Middle Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.median !== 'NaN' && e.items > 0
                        ? Math.round(e.median)
                        : e.median !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;Highest Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.max !== 'NaN' && e.items > 0
                        ? Math.round(e.max)
                        : e.max !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{
                      fontWeight: 'bold',
                      width: '250px',
                      borderTop: '2px solid grey',
                    }}
                  >
                    &emsp;&emsp;Average of Highest Rates
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                      style={{
                        borderTop: '3px solid grey',
                      }}
                    >
                      {e.highAVG !== 'NaN' && e.items > 0
                        ? Math.round(e.highAVG)
                        : e.highAVG !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;&emsp;Average of Middle Rates
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.midAVG !== 'NaN' && e.items > 0
                        ? Math.round(e.midAVG)
                        : e.midAVG !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{
                      fontWeight: 'bold',
                      width: '250px',
                      borderBottom: '3px solid grey',
                    }}
                  >
                    &emsp;&emsp;Average of Lowest Rates
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                      style={{
                        borderBottom: '3px solid grey',
                      }}
                    >
                      {e.lowAVG !== 'NaN' && e.items > 0
                        ? Math.round(e.lowAVG)
                        : e.lowAVG !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;Lowest Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.min !== 'NaN' && e.items > 0
                        ? Math.round(e.min)
                        : e.min !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableBody>
            </Table>
            <br />
          </Box>
        </TableContainer>
      ) : (
        // <LoadingOverlay show={load} />
        <></>
      )}
    </>
  );
}
