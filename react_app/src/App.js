import './App.css';
import * as React from 'react';
import uuid from 'react-uuid';
import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';

import data from "./data";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

function App() {
  const [open, setOpen] = React.useState(false);                  //! modal open & close
  const [name, setName] = React.useState("");                     //! input name
  const [surname, setSurname] = React.useState("");               //! input surname
  const [age, setAge] = React.useState("");                       //! input age
  const [inputs, setInputs] = React.useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);



  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),

    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Surname',
      dataIndex: 'surname',
      key: 'surname',
      width: '20%'
      // ...getColumnSearchProps('surname'),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age
    },
  ];

  function handleOpen() { setOpen(true); }
  function handleClose() { setOpen(false); }


  function nameChan(e) {
    e.preventDefault()
    setName(e.target.value);
    console.log(e.target.value)

  }

  function surnameChan(e) {
    e.preventDefault()
    setSurname(e.target.value);
    console.log(e.target.value)

  }

  function ageChan(e) {
    e.preventDefault()
    setAge(e.target.value);
    console.log(e.target.value)
  }

  function submitFunc(e) {

    e.preventDefault();
    let newObj = {
      id: uuid(),
      name: name,
      surname: surname,
      age: age
    }
    setInputs(data.concat(newObj))
    console.log(inputs)
    console.log(data);
    setOpen(false);
    setName("");
    setSurname("");
    setAge("");
  }

  return (
    <div style={{ position: 'absolute', textAlign: 'center', left: 50, top: 100, width: "80%" }}>

      {/*===========  MODAL start =============*/}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>

          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField value={name} onChange={nameChan} id="outlined-basic" label="Name" variant="outlined" />
          </Box>

          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField value={surname} onChange={surnameChan} id="outlined-basic" label="Surname" variant="outlined" />
          </Box>

          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField value={age} onChange={ageChan} id="outlined-basic" label="Age" variant="outlined" />
          </Box>

          <Button onClick={submitFunc} style={{ fontWeight: 900 }} size="small">Submit</Button>

          {/*===========  MODAL end =============*/}
        </Box>
      </Modal>

      {/*========================== Table ========================== */}
      <Table columns={columns} dataSource={data} />

      {/* =========== add inputs ================ */}

      <Button onClick={handleOpen}>Add Inputs...</Button>
    </div>

  )
}
export default App;
