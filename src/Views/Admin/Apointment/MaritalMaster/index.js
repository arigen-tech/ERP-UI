import { useState, useEffect } from "react"
import Popup from "../../../../Components/popup";
import LoadingScreen from "../../../../Components/Loading"
import axios from "axios";
import { API_HOST, MARITAL_STATUS } from "../../../../config/apiConfig";
import { postRequest, putRequest, getRequest } from "../../../../service/apiService"

const MaritalMaster = () => {
  const [maritalData, setMaritalData] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, maritalId: null, newStatus: false });
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    statusCode: "",
    name: "",
  })
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMarital, setEditingMarital] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  const [totalFilteredProducts, setTotalFilteredProducts] = useState(0);
  const [itemsPerPage] = useState(10);
  const [pageInput, setPageInput] = useState(1);

  const NAME_MAX_LENGTH = 30;
  const CODE_MAX_LENGTH = 10;

  useEffect(() => {
    fetchMaritalData(0); 
  }, []);

  const fetchMaritalData = async (flag = 0) => {
    try {
      setLoading(true);
      const response = await getRequest(`${MARITAL_STATUS}/all/${flag}`);
  
      if (response && response.response) {
        const transformedData = response.response.map(marital => ({
          id: marital.id,
          statusCode: marital.statusCode,
          name: marital.name,
          status: marital.status 
        }));
  
        setMaritalData(transformedData);
        setTotalFilteredProducts(transformedData.length);
        setFilteredTotalPages(Math.ceil(transformedData.length / itemsPerPage));
      }
    } catch (err) {
      console.error("Error fetching marital status data:", err);
      showPopup("Failed to load marital status data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredMaritalData = maritalData.filter(marital =>
    marital.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    marital.statusCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaritalData.slice(indexOfFirstItem, indexOfLastItem);

  const handleEdit = (marital) => {
    setEditingMarital(marital);
    setFormData({
      statusCode: marital.statusCode,
      name: marital.name
    });
    setIsFormValid(true);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    try {
      setLoading(true);
      
      if (editingMarital) {
        // Check for duplicates before updating (excluding the current item being edited)
        const isDuplicate = maritalData.some(
          (marital) =>
            marital.id !== editingMarital.id && // Exclude the current item
            (marital.statusCode === formData.statusCode ||
            marital.name === formData.name)
        );
    
        if (isDuplicate) {
          showPopup("Marital status already exists!", "error");
          setLoading(false);
          return;
        }
        
        const response = await putRequest(`${MARITAL_STATUS}/update/${editingMarital.id}`, {
          statusCode: formData.statusCode,
          name: formData.name
        });
        
        if (response && response.response) {
          setMaritalData(maritalData.map(marital =>
            marital.id === editingMarital.id ? response.response : marital
          ));
          showPopup("Marital status updated successfully!", "success");
        }
      } else {
        // Check for duplicates before creating
        const isDuplicate = maritalData.some(
          (marital) =>
            marital.statusCode === formData.statusCode ||
            marital.name === formData.name
        );
    
        if (isDuplicate) {
          showPopup("Marital status already exists!", "error");
          setLoading(false);
          return;
        }
        
        const response = await postRequest(`${MARITAL_STATUS}/create`, {
          statusCode: formData.statusCode,
          name: formData.name
        });
        
        if (response && response.response) {
          setMaritalData([...maritalData, response.response]);
          showPopup("New marital status added successfully!", "success");
        }
      }
      
      setEditingMarital(null);
      setFormData({ statusCode: "", name: "" });
      setShowForm(false);
      fetchMaritalData(); 
    } catch (err) {
      console.error("Error saving marital status data:", err);
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
    setConfirmDialog({ isOpen: true, maritalId: id, newStatus });
  };

  const handleConfirm = async (confirmed) => {
    if (confirmed && confirmDialog.maritalId !== null) {
      try {
        setLoading(true);
        
        const response = await putRequest(
          `${MARITAL_STATUS}/change/${confirmDialog.maritalId}?status=${confirmDialog.newStatus}`
        );
        
        if (response && response.response) {
          setMaritalData((prevData) =>
            prevData.map((marital) =>
              marital.id === confirmDialog.maritalId ? 
                { ...marital, status: confirmDialog.newStatus } : 
                marital
            )
          );
          showPopup(`Marital status ${confirmDialog.newStatus === "y" ? "activated" : "deactivated"} successfully!`, "success");
        }
      } catch (err) {
        console.error("Error updating marital status:", err);
        showPopup(`Failed to update status: ${err.response?.data?.message || err.message}`, "error");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000); 
      }
    }
    setConfirmDialog({ isOpen: false, maritalId: null, newStatus: null });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
    
    // Validate form
    if (id === "name") {
      setIsFormValid(value.trim() !== "" && formData.statusCode.trim() !== "");
    } else if (id === "statusCode") {
      setIsFormValid(value.trim() !== "" && formData.name.trim() !== "");
    }
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchMaritalData();
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
              <h4 className="card-title">Marital Status Master</h4>
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
                          setEditingMarital(null);
                          setFormData({ statusCode: "", name: "" });
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
                        <th>Marital Status Code</th>
                        <th>Marital Status Name</th>
                        <th>Status</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((marital) => (
                          <tr key={marital.id}>
                            <td>{marital.statusCode}</td>
                            <td>{marital.name}</td>
                            <td>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={marital.status === "y"}
                                  onChange={() => handleSwitchChange(marital.id, marital.status === "y" ? "n" : "y")}
                                  id={`switch-${marital.id}`}
                                />
                                <label
                                  className="form-check-label px-0"
                                  htmlFor={`switch-${marital.id}`}
                                >
                                  {marital.status === "y" ? 'Active' : 'Deactivated'}
                                </label>
                              </div>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() => handleEdit(marital)}
                                disabled={marital.status !== "y"}
                              >
                                <i className="fa fa-pencil"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No marital status data found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {filteredMaritalData.length > 0 && (
                     <nav className="d-flex justify-content-between align-items-center mt-3">
                     <div>
                       <span>
                         Page {currentPage} of {filteredTotalPages} | Total Records: {filteredMaritalData.length}
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
                    <label>Marital Status Code <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control mt-1"
                      id="statusCode"
                      name="statusCode"
                      placeholder="Marital Status Code"
                      value={formData.statusCode}
                      onChange={handleInputChange}
                      maxLength={CODE_MAX_LENGTH}
                      required
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Marital Status Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control mt-1"
                      id="name"
                      name="name"
                      placeholder="Marital Status Name"
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
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Marital Status Reports</h1>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <p>Generate reports for marital status data:</p>
                        <div className="list-group">
                          <button type="button" className="list-group-item list-group-item-action">Marital Status Distribution Report</button>
                          <button type="button" className="list-group-item list-group-item-action">Active/Inactive Marital Status Report</button>
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
                          Are you sure you want to {confirmDialog.newStatus === "y" ? 'activate' : 'deactivate'} <strong>{maritalData.find(marital => marital.id === confirmDialog.maritalId)?.name}</strong>?
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
  )
}

export default MaritalMaster;