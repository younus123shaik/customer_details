import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  BsFillTrashFill,
  BsFillPencilFill,
  BsArrowDownUp,
  BsSdCard,
} from "react-icons/bs";
import axios from "axios";
const Table = () => {
  const [customer, setCustomer] = useState({
    sno: 0,
    customer_name: "",
    age: null,
    phone: null,
    location: "",
    created_at: "",
    about: "",
  });

  const [customerdetail, setCustomerdetail] = useState([]);
  const [index, setIndex] = useState(-1);
  let edit = true;
  const [customerde, setCustomerde] = useState([]);
  const [order, setOrder] = useState(false);
  const limit = 20;
  var pre = 0;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [change, setChange] = useState(false);
  var [search, setSearch] = useState("");
  const [searching, setSearching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useLayoutEffect(() => {
    const CustomerFetch = async () => {
      await axios
        .get(`http://localhost:5000/customers`)
        .then((res) => {
          setCustomerde(res.data.rows);
          console.log(res.data);
          setTotal(res.data.rowCount);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    CustomerFetch();
  }, [change]);

  useEffect(() => {
    pre = (page - 1) * limit;
    setCustomerdetail(customerde.slice(pre, pre + limit));
    console.log(customerdetail);
  }, [page, customerde]);

  const handleDelete = async (sno) => {
    await axios.delete(`http://localhost:5000/customers/delete?sno=${sno}`);
    setChange(!change);
  };

  useEffect(() => {
    const searchFetch = async () => {
      await axios
        .get(`http://localhost:5000/customers/searchs?search=${search}`)
        .then((res) => {
          setCustomerde(res.data);
          setPage(1);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    searchFetch();
    if (search == "") {
      setSearching(true);
    } else {
      setSearching(false);
    }
  }, [search]);

  const handleChange = async (e) => {
    setSearch(e.target.value);
  };
  const handleOrder = async () => {
    if (order)
      await axios
        .get(`http://localhost:5000/customers/time?order=ASC`)
        .then((res) => {
          setCustomerde(res.data);
        });
    else
      await axios
        .get(`http://localhost:5000/customers/time?order=DESC`)

        .then((res) => {
          setCustomerde(res.data);
        });
    setOrder(!order);
  };
  const handleEdit = (cust, ind) => {
    setIndex(ind);
    setCustomer(cust);
  };
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setCustomer((customer) => ({
      ...customer,
      [name]: value,
    }));
  };
  console.log(customer);
  const submitEdit = async () => {
    await axios.put("http://localhost:5000/customers/update", customer);
    setChange(!change);
    setCustomer({});
    setIndex(-1);
  };
  const handleSubmit = async () => {
    customer.created_at = getCurrentDateTime();
    await axios.post("http://localhost:5000/customers/create", customer);
    setChange(!change);
  };

  function getCurrentDateTime() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");

    const dateTimeString = `${day}-${month}-${year} ${hours}:${minutes}`;

    return dateTimeString;
  }

  return (
    <div className="wapper">
      <div className="title">Customer Details</div>
      <div className="tool-bar">
        <button className="add" onClick={() => setShowModal(true)}>
          Add Customer
        </button>{" "}
        <div className="search">
          Search :{" "}
          <input
            type="text"
            placeholder="Name or Location"
            onChange={handleChange}
            className="input"
          />{" "}
        </div>{" "}
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <form onSubmit={handleSubmit}>
              <label>Customer Name:</label>
              <input
                type="text"
                name="customer_name"
                value={customer.customer_name}
                onChange={handleEditChange}
                required
              />
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={customer.age}
                onChange={handleEditChange}
                required
              />
              <label>Phone:</label>
              <input
                type="number"
                name="phone"
                value={customer.phone}
                onChange={handleEditChange}
                required
              />
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={customer.location}
                onChange={handleEditChange}
                required
              />
              <label>About:</label>
              <input
                type="text"
                name="about"
                value={customer.about}
                onChange={handleEditChange}
                required
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th
                style={{ width: "5%", cursor: "pointer" }}
                onClick={() => setChange(!change)}
              >
                Sno <BsArrowDownUp />
              </th>
              <th className="medium">Customer_name</th>
              <th>Age</th>
              <th style={{ width: "7%" }}>Phone</th>
              <th style={{ width: "7%" }}>Location</th>
              <th
                style={{
                  width: "82%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span onClick={handleOrder} style={{ cursor: "pointer" }}>
                  Created_at <BsArrowDownUp />
                  {order ? " (ASC)" : " (DESC)"}
                </span>
                <div className="flexx">
                  <span style={{ marginLeft: "5px" }}>Date</span>
                  <span>Time</span>
                </div>
              </th>
              <th className="expand">About</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {customerdetail && customerdetail.length > 0 ? (
              customerdetail.map((cust, ind) => (
                <tr key={ind}>
                  {ind === index ? (edit = false) : () => (edit = true)}

                  <td style={{ width: "5%" }}>{cust.sno + 1}</td>
                  <td className="medium">
                    {edit ? (
                      cust.customer_name
                    ) : (
                      <input
                        type="text"
                        value={customer.customer_name}
                        onChange={handleEditChange}
                        name="customer_name"
                      />
                    )}
                  </td>
                  <td>
                    {edit ? (
                      cust.age
                    ) : (
                      <input
                        type="number"
                        value={customer.age}
                        onChange={handleEditChange}
                        name="age"
                      />
                    )}
                  </td>
                  <td style={{ width: "7%" }}>
                    {edit ? (
                      cust.phone
                    ) : (
                      <input
                        type="number"
                        value={customer.phone}
                        onChange={handleEditChange}
                        name="phone"
                      />
                    )}
                  </td>
                  <td style={{ width: "7%" }}>
                    {edit ? (
                      cust.location
                    ) : (
                      <input
                        type="text"
                        value={customer.location}
                        onChange={handleEditChange}
                        name="location"
                      />
                    )}
                  </td>
                  <td style={{ width: "13%" }}>
                    <div className="flexx">
                      <span>{cust.created_at.slice(0, 10)}</span>
                      <span>{cust.created_at.slice(11, 16)}</span>
                    </div>
                  </td>
                  <td className="expand">
                    {edit ? (
                      cust.about
                    ) : (
                      <input
                        type="text"
                        value={customer.about}
                        onChange={handleEditChange}
                        name="about"
                      />
                    )}
                  </td>
                  <td>
                    {edit ? (
                      <BsFillPencilFill
                        className="edit-btn"
                        onClick={() => handleEdit(cust, ind)}
                      />
                    ) : (
                      <BsSdCard className="edit-btn" onClick={submitEdit} />
                    )}
                    <BsFillTrashFill
                      className="delete-btn"
                      onClick={() => handleDelete(cust.sno)}
                    />
                  </td>
                  {ind === index ? (edit = true) : null}
                </tr>
              ))
            ) : (
              <tr>No Data Found</tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bottom-page">
        <p className="entries">
          Showing{" "}
          {searching ? (
            <span>
              {(page - 1 + pre) * limit + 1} to{" "}
              {(page - 1 + pre) * limit + limit < total
                ? (page - 1 + pre) * limit + limit
                : total}
            </span>
          ) : (
            <span>{customerdetail?.length}</span>
          )}{" "}
          of {total} entries
        </p>
        <div className="change">
          <button
            className="btn-order"
            onClick={() => setPage(page - 1)}
            disabled={page == 1 ? true : false}
          >
            Previous
          </button>
          <button className={`btn-order active`}>{page}</button>
          <button
            className="btn-order"
            onClick={() => setPage(page + 1)}
            disabled={
              customerdetail &&
              customerdetail[customerdetail.length - 1]?.sno < total - 1
                ? false
                : true
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
