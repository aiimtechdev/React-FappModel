import React from 'react';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const ControlsSearch = ({ tableInstance, onChange }) => {
  const {
    state: { globalFilter, pageSize },
    gotoPage, setPageSize, searchBy
  } = tableInstance;
  const srchPlceHldr = "Search" + (searchBy ? (' by ' + searchBy) : '')
  const [value, setValue] = React.useState(globalFilter);
  console.log('value',value)

  return (
    <>
      <input
        className="form-control datatable-search"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
          gotoPage(0)
          setPageSize(pageSize)
        }}
        placeholder={srchPlceHldr}
      />
      {value && value.length > 0 ? (
        <span
          className="search-delete-icon"
          onClick={() => {
            setValue('');
            onChange('');
          }}
        >
          <CsLineIcons icon="close" />
        </span>
      ) : (
        <span className="search-magnifier-icon pe-none">
          <CsLineIcons icon="search" />
        </span>
      )}
    </>
  );
};

export default ControlsSearch;
