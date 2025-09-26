import { useState, useEffect } from "react";
import Popup from "../../../../Components/popup";
import LoadingScreen from "../../../../Components/Loading";
import axios from "axios";
import { API_HOST, CASTE_STATUS } from "../../../../config/apiConfig";
import { postRequest, putRequest, getRequest } from "../../../../service/apiService";

const CasteMaster = () => {
  const [casteData, setCasteData] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, casteId: null, newStatus: false });
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCaste, setEditingCaste] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  const [totalFilteredCastes, setTotalFilteredCastes] = useState(0);
  const [itemsPerPage] = useState(10);
  const [pageInput, setPageInput] = useState(1);

  const NAME_MAX_LENGTH = 100;
  const CODE_MAX_LENGTH = 15;

  useEffect(() => {
    fetchCasteData(0);
  }, []);

  const fetchCasteData = async (flag = 0) => {
    try {
      setLoading(true);
      const response = await getRequest(`${CASTE_STATUS}/all/${flag}`);

      if (response && response.response) {
        const transformedData = response.response.map(caste => ({
          id: caste.id,
          code: caste.code,
          name: caste.name,
          status: caste.status
        }));

        setCasteData(transformedData);
        setTotalFilteredCastes(transformedData.length);
        setFilteredTotalPages(Math.ceil(transformedData.length / itemsPerPage));
      }
    } catch (err) {
      console.error("Error fetching caste data:", err);
      showPopup("Failed to load caste data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredCasteData = casteData.filter(caste =>
    caste.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caste.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCasteData.slice(indexOfFirstItem, indexOfLastItem);

  const handleEdit = (caste) => {
    setEditingCaste(caste);
    setFormData({
      code: caste.code,
      name: caste.name
    });
    setIsFormValid(true);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);

      if (editingCaste) {
        // Check for duplicates before updating (excluding the current item being edited)
        const isDuplicate = casteData.some(
          (caste) =>
            caste.id !== editingCaste.id && // Exclude the current item
            (caste.code === formData.code ||
            caste.name === formData.name)
        );

        if (isDuplicate) {
          showPopup("Caste already exists!", "error");
          setLoading(false);
          return;
        }

        const response = await putRequest(`${CASTE_STATUS}/update/${editingCaste.id}`, {
          code: formData.code,
          name: formData.name
        });

        if (response && response.response) {
          setCasteData(casteData.map(caste =>
            caste.id === editingCaste.id ? response.response : caste
          ));
          showPopup("Caste updated successfully!", "success");
        }
      } else {
        // Check for duplicates before creating
        const isDuplicate = casteData.some(
          (caste) =>
            caste.code === formData.code ||
            caste.name === formData.name
        );

        if (isDuplicate) {
          showPopup("Caste already exists!", "error");
          setLoading(false);
          return;
        }

        const response = await postRequest(`${CASTE_STATUS}/create`, {
          code: formData.code,
          name: formData.name
        });

        if (response && response.response) {
          setCasteData([...casteData, response.response]);
          showPopup("New caste added successfully!", "success");
        }
      }

      setEditingCaste(null);
      setFormData({ code: "", name: "" });
      setShowForm(false);
      fetchCasteData();
    } catch (err) {
      console.error("Error saving caste data:", err);
      showPopup(`Failed to save changes: ${err.response?.data?.message || err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message, type = 'info') => {
    setPopupMessage({
      message,
      type,
      onClose: () => {
        setPopupMessage(null);
      }
    });
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, casteId: id, newStatus });
  };

  const handleConfirm = async (confirmed) => {
    if (confirmed && confirmDialog.casteId !== null) {
      try {
        setLoading(true);

        const response = await putRequest(
          `${CASTE_STATUS}/change/${confirmDialog.casteId}?status=${confirmDialog.newStatus}`
        );

        if (response && response.response) {
          setCasteData((prevData) =>
            prevData.map((caste) =>
              caste.id === confirmDialog.casteId ?
                { ...caste, status: confirmDialog.newStatus } :
                caste
            )
          );
          showPopup(`Caste ${confirmDialog.newStatus === "y" ? "activated" : "deactivated"} successfully!`, "success");
        }
      } catch (err) {
        console.error("Error updating caste status:", err);
        showPopup(`Failed to update status: ${err.response?.data?.message || err.message}`, "error");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
    setConfirmDialog({ isOpen: false, casteId: null, newStatus: null });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));

    // Validate form
    if (id === "name") {
      setIsFormValid(value.trim() !== "" && formData.code.trim() !== "");
    } else if (id === "code") {
      setIsFormValid(value.trim() !== "" && formData.name.trim() !== "");
    }
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchCasteData();
  };

  const handlePageNavigation = () => {
    const pageNumber = Number(pageInput);
    if (pageNumber >= 1 && pageNumber <= filteredTotalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(filteredTotalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < filteredTotalPages) {
      if (endPage < filteredTotalPages - 1) pageNumbers.push("...");
      pageNumbers.push(filteredTotalPages);
    }

    return pageNumbers.map((number, index) => (
      <li key={index} className={`page-item ${number === currentPage ? "active" : ""}`}>
        {typeof number === "number" ? (
          <button className="page-link" onClick={() => setCurrentPage(number)}>
            {number}
          </button>
        ) : (
          <span className="page-link disabled">{number}</span>
        )}
      </li>
    ));
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card form-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title">Caste Master</h4>
              <div className="d-flex justify-content-between align-items-center">
                <form className="d-inline-block searchform me-4" role="search">
                  <div className="input-group searchinput">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search"
                      aria-label="Search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <span className="input-group-text" id="search-icon">
                      <i className="fa fa-search"></i>
                    </span>
                  </div>
                </form>

                <div className="d-flex align-items-center">
                  {!showForm ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-success me-2"
                        onClick={() => {
                          setEditingCaste(null);
                          setFormData({ code: "", name: "" });
                          setIsFormValid(false);
                          setShowForm(true);
                        }}
                      >
                        <i className="mdi mdi-plus"></i> Add
                      </button>
                      <button
                        type="button"
                        className="btn btn-success me-2 flex-shrink-0"
                        onClick={handleRefresh}
                      >
                        <i className="mdi mdi-refresh"></i> Show All
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                      <i className="mdi mdi-arrow-left"></i> Back
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <LoadingScreen />
              ) : !showForm ? (
                <div className="table-responsive packagelist">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Caste Code</th>
                        <th>Caste Name</th>
                        <th>Status</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((caste) => (
                          <tr key={caste.id}>
                            <td>{caste.code}</td>
                            <td>{caste.name}</td>
                            <td>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={caste.status === "y"}
                                  onChange={() => handleSwitchChange(caste.id, caste.status === "y" ? "n" : "y")}
                                  id={`switch-${caste.id}`}
                                />
                                <label
                                  className="form-check-label px-0"
                                  htmlFor={`switch-${caste.id}`}
                                >
                                  {caste.status === "y" ? 'Active' : 'Deactivated'}
                                </label>
                              </div>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() => handleEdit(caste)}
                                disabled={caste.status !== "y"}
                              >
                                <i className="fa fa-pencil"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No caste data found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {filteredCasteData.length > 0 && (
                    <nav className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span>
                          Page {currentPage} of {filteredTotalPages} | Total Records: {filteredCasteData.length}
                        </span>
                      </div>
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            &laquo; Previous
                          </button>
                        </li>
                        {renderPagination()}
                        <li className={`page-item ${currentPage === filteredTotalPages ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === filteredTotalPages}
                          >
                            Next &raquo;
                          </button>
                        </li>
                      </ul>
                      <div className="d-flex align-items-center">
                        <input
                          type="number"
                          min="1"
                          max={filteredTotalPages}
                          value={pageInput}
                          onChange={(e) => setPageInput(e.target.value)}
                          placeholder="Go to page"
                          className="form-control me-2"
                        />
                        <button
                          className="btn btn-primary"
                          onClick={handlePageNavigation}
                        >
                          Go
                        </button>
                      </div>
                    </nav>
                  )}
                </div>
              ) : (
                <form className="forms row" onSubmit={handleSave}>
                  <div className="form-group col-md-4">
                    <label>Caste Code <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control mt-1"
                      id="code"
                      name="code"
                      placeholder="Caste Code"
                      value={formData.code}
                      onChange={handleInputChange}
                      maxLength={CODE_MAX_LENGTH}
                      required
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Caste Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control mt-1"
                      id="name"
                      name="name"
                      placeholder="Caste Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      maxLength={NAME_MAX_LENGTH}
                      required
                    />
                  </div>
                  <div className="form-group col-md-12 d-flex justify-content-end mt-2">
                    <button type="submit" className="btn btn-primary me-2" disabled={!isFormValid}>
                      Save
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Caste Reports</h1>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <p>Generate reports for caste data:</p>
                        <div className="list-group">
                          <button type="button" className="list-group-item list-group-item-action">Caste Distribution Report</button>
                          <button type="button" className="list-group-item list-group-item-action">Active/Inactive Caste Report</button>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        <button type="button" className="btn btn-primary">Generate Report</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {popupMessage && (
                <Popup
                  message={popupMessage.message}
                  type={popupMessage.type}
                  onClose={popupMessage.onClose}
                />
              )}
              {confirmDialog.isOpen && (
                <div className="modal d-block" tabIndex="-1" role="dialog">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Confirm Status Change</h5>
                        <button type="button" className="close" onClick={() => handleConfirm(false)}>
                          <span>&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Are you sure you want to {confirmDialog.newStatus === "y" ? 'activate' : 'deactivate'} <strong>{casteData.find(caste => caste.id === confirmDialog.casteId)?.name}</strong>?
                        </p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => handleConfirm(false)}>No</button>
                        <button type="button" className="btn btn-primary" onClick={() => handleConfirm(true)}>Yes</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasteMaster;