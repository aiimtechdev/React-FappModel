/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Tooltip, Row, Col, Button, OverlayTrigger, Form } from 'react-bootstrap';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import 'regenerator-runtime/runtime';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import Table from 'components/DataGrid/Components/Table';
import TablePagination from 'components/DataGrid/Components/TablePagination';
import ControlsAdd from 'components/DataGrid/Components/ControlsAdd';
import ControlsDelete from 'components/DataGrid/Components/ControlsDelete';
import ControlsPageSize from 'components/DataGrid/Components/ControlsPageSize';
import ControlsDvceFilter from 'components/DataGrid/Components/ControlsDvceFilter';
import ButtonsCheckAll from 'components/DataGrid/Components/ButtonsCheckAll';
import ControlsSearch from 'components/DataGrid/Components/ControlsSearch';
import ControlsDynaModal from './Components/ControlsDynaModal';
import { apiRequest } from "utils/request";

const SiteDataGrid = ({ editModal: EditModal, check, colCnfg, title, element, elements, endPoint, defaults, actions, viewPage, keyCol, searchBy = '', listFilter = '', minWidth = '', noDataMsg='' }) => { 
  const ActionAnchor = ({ action, row }) => {
    switch(action) {
      case 'Edit':
        return (
          <Button variant="foreground-alternate" className='p-0' onClick={() => setIsOpenAddEditModal(true)}>
            <CsLineIcons icon="edit" className="text-primary mx-1" size="17" />
          </Button>
        );
      case 'Delete':
        return (
          <Button variant='foreground-alternate' className='p-0' onClick={() => setIsOpenDeleteConfirmModal(true)}>
            <CsLineIcons icon="bin" className="text-primary mx-1" size="17" />
          </Button>
        );
      case 'View':
        if(element == 'Test Function Data')
        return (
          <Button variant='foreground-alternate' className='p-0' onClick={() => setIsOpenDynConfirmModal(true)}>
            <CsLineIcons icon="eye" className="text-primary mx-1" size="18" />
          </Button>
        );
        else
        return (
          <Link to={{pathname: (element == 'Device') ? viewPage+'/'+row.original.dvceReg.replace('#', '')  :(element == 'Customer') ? viewPage+'/'+row.original.custId :viewPage , target:"_blank", state:{row:row.original}}}>
            <CsLineIcons icon="eye" className="text-primary mx-1" size="18" />
          </Link>
        );
      default:
        return (<></>);
    }
  }

  const columns = React.useMemo(() => {
    if(check === true){
      return [
        {
          Header:() => <ButtonsCheckAll tableInstance={tableInstance} />,
          id: 'select',
          sortable: true,
          headerClassName: 'empty text-muted text-small text-uppercase w-1',
          Cell: ({ row }) => {
            const { checked, onChange } = row.getToggleRowSelectedProps();
            return <Form.Check className="fform-check d-flex mt-1 ms-3" type="checkbox" checked={checked} onChange={onChange} />;
          },
        },
         ...colCnfg, {
          Header: 'Actions', accessor: 'edit', sortable: false, headerStyles: {minWidth: '100px', width: '12.1%'},
          headerClassName: 'text-muted text-small text-uppercase', Cell: ({ row }) => {
            return(
              actions.map((act, ind) => (
                <OverlayTrigger key={ind} placement="top" overlay={<Tooltip id="tooltip-top">{act}</Tooltip>}>
                  <span><ActionAnchor action={act} row={row} viewPage={viewPage} /></span>
                </OverlayTrigger>
              ))
            );
          },
        },
      ];
    } else {
      return [
         ...colCnfg, {
          Header: 'Actions', accessor: 'edit', sortable: false, headerStyles: {minWidth: '100px', width: '12.1%'},
          headerClassName: 'text-muted text-small text-uppercase', Cell: ({ row }) => {
            return(
              actions.map((act, ind) => (
                <OverlayTrigger key={ind} placement="top" overlay={<Tooltip id="tooltip-top">{act}</Tooltip>}>
                  <span><ActionAnchor action={act} row={row} viewPage={viewPage} /></span>
                </OverlayTrigger>
              ))
            );
          },
        },
      ];
    }
  }, []);

  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [totRecords, setTotRecords] = React.useState(0);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] = useState(false);
  const [isOpenDynConfirmModal, setIsOpenDynConfirmModal] = useState(false);
  const [term, setTerm] = useState('');
  const [dvceFilterType, setDvceFilterType] = React.useState(defaults.dvceFilterType ? defaults.dvceFilterType : "All");
  // const [dvceFilterType, setDvceFilterType] = React.useState("All");

  const tableInstance = useTable(
    {
      columns,
      term,
      setTerm,
      data,
      setData,
      searchBy,
      title,
      defaults,
      element,
      noDataMsg,
      elements,
      isOpenAddEditModal,
      setIsOpenAddEditModal,
      isOpenDeleteConfirmModal,
      setIsOpenDeleteConfirmModal,
      setIsOpenDynConfirmModal,
      isOpenDynConfirmModal,
      manualPagination: true,
      manualFilters: true,
      manualSortBy: true,
      autoResetPage: false,
      pageCount,
      totRecords,
      dvceFilterType,
      setDvceFilterType,
      initialState: {
        pageIndex: 0,
        sortBy: [defaults.sort || {}],
        pageSize: defaults.pageSize || 10,
        hiddenColumns: ['d']
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useRowState
  );
  const {
    state: { pageIndex, pageSize, sortBy }
  } = tableInstance;

  const fetchData = React.useCallback(async () => {
    document.body.classList.add('spinner');
    let sortQry = '';
    let dvceFilter = '';
    if(sortBy.length) {
      let srtOrd = sortBy[0].desc ? 'desc' : 'asc';
      sortQry = `&sort_by=${sortBy[0].id}&sort_order=${srtOrd}`
    } else {
      let srtOrd = defaults.sort.desc ? 'desc' : 'asc';
      sortQry = `&sort_by=${defaults.sort.id}&sort_order=${srtOrd}`
    }
    if(element == 'Device' && dvceFilterType != '') {
      dvceFilter = dvceFilterType;
    }
    console.log('term',term)
    const encodedSearchTerm = encodeURIComponent(term);
    let reqUrl = `${endPoint}?per_page=${pageSize}&page_no=${(pageIndex + 1) + sortQry}` + (encodedSearchTerm ? ('&term=' + encodedSearchTerm) : '') + (listFilter ? listFilter  : '') + (dvceFilter != '' ? ('&dvce_filter=' + dvceFilter) : '');
    const resp = await apiRequest(reqUrl, 'GET', undefined, localStorage.getItem("token"));
    if(resp.status === 'success' && resp.data.status === 'success') {
      setData(resp.data.data);
      setPageCount(resp.data.total_pages);
      setTotRecords(resp.data.total_records);
    }
    document.body.classList.remove('spinner');
  },  [sortBy, pageIndex, pageSize, term, dvceFilterType]);

  const saveItem = React.useCallback(async ({ item, isAdd: isAdd }, closeModal) => {                  // Need to check is this proper for default argument.
    let method = isAdd ? 'POST': 'PATCH';
    let alrtModeMsg = isAdd ? ' Created': ' Updated';
    document.body.classList.add('spinner');
    //const resp = await apiRequest(endPoint, method, item, localStorage.getItem("token"));
    closeModal()
    setIsOpenAddEditModal(false)
    const message = ((element === 'Customer') && isAdd) ? 'Customer and Admin user were successfully created. Admin user login credentials sent to associated email.' : (element === 'user' && isAdd) ? 'User created successfully. Login credentials sent to associated email.' : element + alrtModeMsg + " successfully"
    toast.success(message, {
      hideProgressBar: false,
      closeOnClick: true,
    });
    // if(resp.status === 'success' && resp.data.status === 'success') {
    //   closeModal()
    //   setIsOpenAddEditModal(false)
    //   const message = ((element === 'Customer') && isAdd) ? 'Customer and Admin user were successfully created. Admin user login credentials sent to associated email.' : (element === 'user' && isAdd) ? 'User created successfully. Login credentials sent to associated email.' : element + alrtModeMsg + " successfully"
      
    //   // if(isAdd && typeof resp.data.data != 'undefined' && typeof resp.data.data.email != 'undefined') {                           // This is a Temporary Work around for sending credential shout be removed after implementing email setup.
    //   //   toast.info(`${element} Credentials: \nEmail: ${resp.data.data.email}\nPassword: ${resp.data.data.password}`, {
    //   //     autoClose: false,
    //   //     closeOnClick: false,
    //   //   });
    //   // }
    //   fetchData();
    // } else setIsOpenAddEditModal(true)
    fetchData()
    document.body.classList.remove('spinner');
  },  [sortBy, pageIndex, pageSize,term, dvceFilterType]);

  const deleteItems = React.useCallback(
    async ({ ids }) => {
      setIsOpenDeleteConfirmModal(false);
      document.body.classList.add('spinner');
      const body = { ids : ids };
      const token = localStorage.getItem("token");
    //  const resp = await apiRequest(endPoint, 'DELETE', body, token);
      // if(resp.status === 'success' && resp.data.status === 'success') {
      //   toast.info(element + "(s) Deleted successfully", {
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //   });
      //   fetchData();
      // }
      toast.info(element + "(s) Deleted successfully", {
        hideProgressBar: false,
        closeOnClick: true,
      });
      fetchData();
      document.body.classList.remove('spinner');
    },
    [sortBy, pageIndex, pageSize,term, dvceFilterType]
  );

  const searchItem = useAsyncDebounce((val) => setTerm(val || ''));

  useEffect(() => {
    fetchData();
  }, [sortBy, pageIndex, pageSize, term, dvceFilterType]);

  return (
    <div>
      <Row className="mb-3">
        {
          !defaults.hiddenControls.includes('Title') && (
            <Col xl="12" className="mb-2 me-auto text-primary">
              <h3 className="mb-0 pb-0 text-primary">{title}</h3>
            </Col>
          )
        }
        <Col sm="8" md="4" lg="4" xxl="4">
          {
            !defaults.hiddenControls.includes('Search') && (
              <div
                className="d-inline-block float-md-start me-1 mb-1 mb-md-0 search-input-container shadow bg-foreground"
                style={{width: '60%', minWidth: '250px'}}
              >
                <ControlsSearch tableInstance={tableInstance} onChange={searchItem} />
              </div>
            )
          }
        </Col>
        <Col sm="8" md="8" lg="8" xxl="8" className="text-end">
          <div className="d-inline-block me-sm-3 float-start float-md-none">
            {(element == 'Device') &&
              <div className='me-3 d-inline-block'>
                <ControlsDvceFilter tableInstance={tableInstance} />
              </div>
            }
            {
              !defaults.hiddenControls.includes('Delete') && (
                <div className='me-3 d-inline-block'>
                  <ControlsDelete tableInstance={tableInstance} deleteItems={deleteItems} delElm={element} delElms={elements} keyCol={keyCol} />
                </div>
              )
            }
                <div className='me-3 d-inline-block'>
                  <ControlsDynaModal tableInstance={tableInstance}  Elm={element} Elms={elements} keyCol={keyCol} />
                </div>
            {
              !defaults.hiddenControls.includes('Add') && (
                <div className='me-3 d-inline-block'>
                  <ControlsAdd tableInstance={tableInstance} /> 
                </div>
              )
            }
            { !defaults.hiddenControls.includes('PageSize') && (
              <ControlsPageSize tableInstance={tableInstance} />
            )}
          </div>
        </Col>
      </Row>
      <Row className='table-responsive'>
          <Table className="react-table rows mb-3" tableInstance={tableInstance} style={{minWidth: minWidth}} />
          { !defaults.hiddenControls.includes('Pagination') && (
            <TablePagination tableInstance={tableInstance} />
          )}
      </Row>
      { !defaults.hiddenControls.includes('Edit') && (
      <EditModal tableInstance={tableInstance} saveItem={saveItem} />
      )}
    </div>
  );
};

export default SiteDataGrid;
