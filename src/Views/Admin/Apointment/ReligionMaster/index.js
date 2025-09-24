import { useState } from "react";

const ReligionMaster = () => {
  const [formData, setFormData] = useState({ religionName: "" });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [editingReligion, setEditingReligion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const [religionData, setReligionData] = useState([
    { id: 1, religionName: "Hinduism", status: "y" },
    { id: 2, religionName: "Islam", status: "y" },
    { id: 3, religionName: "Christianity", status: "y" },
    { id: 4, religionName: "Sikhism", status: "y" },
    { id: 5, religionName: "Buddhism", status: "y" },
    { id: 6, religionName: "Jainism", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, religionId: null, newStatus: null });

  const filteredReligion = religionData.filter((religion) =>
    religion.religionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTotalPages = Math.ceil(filteredReligion.length / itemsPerPage);

  const currentItems = filteredReligion.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, religionId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.religionId !== null) {
      setReligionData((prevData) =>
        prevData.map((religion) =>
          religion.id === confirmDialog.religionId ? { ...religion, status: confirmDialog.newStatus } : religion
        )
      );
    }
    setConfirmDialog({ isOpen: false, religionId: null, newStatus: null });
  };

  const handleEdit = (religion) => {
    setEditingReligion(religion);
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const religionName = e.target.elements.religionName.value;
    if (!religionName) return;

    if (editingReligion) {
      setReligionData((prevData) =>
        prevData.map((religion) =>
          religion.id === editingReligion.id ? { ...religion, religionName } : religion
        )
      );
    } else {
      setReligionData([
        ...religionData,
        { id: Date.now(), religionName, status: "y" },
      ]);
    }

    setEditingReligion(null);
    setShowForm(false);
    setFormData({ religionName: "" });
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= filteredTotalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === currentPage ? "active" : ""}`}>
          <button className="page-link" onClick={() => setCurrentPage(i)}>{i}</button>
        </li>
      );
    }
    return pages;
  };

  const handlePageNavigation = () => {
    const page = parseInt(pageInput);
    if (page > 0 && page <= filteredTotalPages) {
      setCurrentPage(page);
    } else {
      alert("Invalid page number");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Religion Master</h4>
          {!showForm && (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search Religion"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button className="btn btn-success" onClick={() => setShowForm(true)}>
                <i className="mdi mdi-plus"></i> Add
              </button>
              <button className="btn btn-success" onClick={() => setShowModal(true)}>
                <i className="mdi mdi-file-document"></i> Reports
              </button>
            </div>
          )}
          {showForm && (
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              <i className="mdi mdi-arrow-left"></i> Back
            </button>
          )}
        </div>
        <div className="card-body">
          {!showForm ? (
            <>
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Religion</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((religion) => (
                    <tr key={religion.id}>
                      <td>{religion.religionName}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={religion.status === "y"}
                            onChange={() => handleSwitchChange(religion.id, religion.status === "y" ? "n" : "y")}
                          />
                          <label className="form-check-label">
                            {religion.status === "y" ? "Active" : "Deactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(religion)}
                          disabled={religion.status !== "y"}
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <nav className="d-flex justify-content-between align-items-center mt-3">
                <span>
                  Page {currentPage} of {filteredTotalPages} | Total Records: {filteredReligion.length}
                </span>
                <ul className="pagination mb-0">{renderPagination()}</ul>
                <div className="d-flex">
                  <input
                    type="number"
                    className="form-control me-2"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    placeholder="Go to page"
                  />
                  <button className="btn btn-primary" onClick={handlePageNavigation}>Go</button>
                </div>
              </nav>
            </>
          ) : (
            <form onSubmit={handleSave} className="row">
              <div className="form-group col-md-4">
                <label>Religion Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="religionName"
                  name="religionName"
                  className="form-control"
                  defaultValue={editingReligion?.religionName || ""}
                  onChange={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-12 mt-2 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary me-2" disabled={!isFormValid}>Save</button>
                <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Religion Reports</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Report will be implemented...</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Change</h5>
                <button className="btn-close" onClick={() => handleConfirm(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to {confirmDialog.newStatus === "y" ? "activate" : "deactivate"}{" "}
                  <strong>
                    {religionData.find((r) => r.id === confirmDialog.religionId)?.religionName}
                  </strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => handleConfirm(false)}>No</button>
                <button className="btn btn-primary" onClick={() => handleConfirm(true)}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReligionMaster;
