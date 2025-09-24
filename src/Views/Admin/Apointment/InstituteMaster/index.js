import { useState } from "react";

const InstituteMaster = () => {
  const [formData, setFormData] = useState({
    instituteName: "",
    instituteCode: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [editingInstitute, setEditingInstitute] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const [instituteData, setInstituteData] = useState([
    { id: 1, instituteName: "ABC Institute", instituteCode: "ABC", status: "y" },
    { id: 2, instituteName: "XYZ Academy", instituteCode: "XYZ", status: "y" },
    { id: 3, instituteName: "Tech Learning Center", instituteCode: "TLC", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    instituteId: null,
    newStatus: null,
  });

  const filteredInstitutes = instituteData.filter((inst) =>
    inst.instituteName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInstitutes.length / itemsPerPage);

  const currentItems = filteredInstitutes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, instituteId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.instituteId !== null) {
      setInstituteData((prev) =>
        prev.map((inst) =>
          inst.id === confirmDialog.instituteId
            ? { ...inst, status: confirmDialog.newStatus }
            : inst
        )
      );
    }
    setConfirmDialog({ isOpen: false, instituteId: null, newStatus: null });
  };

  const handleEdit = (inst) => {
    setEditingInstitute(inst);
    setFormData({
      instituteName: inst.instituteName,
      instituteCode: inst.instituteCode,
    });
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const { instituteName, instituteCode } = formData;
    if (!instituteName || !instituteCode) return;

    if (editingInstitute) {
      setInstituteData((prev) =>
        prev.map((inst) =>
          inst.id === editingInstitute.id
            ? { ...inst, instituteName, instituteCode }
            : inst
        )
      );
    } else {
      setInstituteData([
        ...instituteData,
        { id: Date.now(), instituteName, instituteCode, status: "y" },
      ]);
    }

    setEditingInstitute(null);
    setShowForm(false);
    setFormData({ instituteName: "", instituteCode: "" });
    setIsFormValid(false);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  const handlePageNavigation = () => {
    const page = parseInt(pageInput);
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      alert("Invalid page number");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Institute Master</h4>
          {!showForm ? (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search Institute"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  setFormData({ instituteName: "", instituteCode: "" });
                  setShowForm(true);
                }}
              >
                <i className="mdi mdi-plus"></i> Add
              </button>
              <button
                className="btn btn-success"
                onClick={() => setShowModal(true)}
              >
                <i className="mdi mdi-file-document"></i> Reports
              </button>
            </div>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
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
                    <th>Institute Name</th>
                    <th>Institute Code</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((inst) => (
                    <tr key={inst.id}>
                      <td>{inst.instituteName}</td>
                      <td>{inst.instituteCode}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={inst.status === "y"}
                            onChange={() =>
                              handleSwitchChange(
                                inst.id,
                                inst.status === "y" ? "n" : "y"
                              )
                            }
                          />
                          <label className="form-check-label">
                            {inst.status === "y" ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(inst)}
                          disabled={inst.status !== "y"}
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
                  Page {currentPage} of {totalPages} | Total Records:{" "}
                  {filteredInstitutes.length}
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
                  <button
                    className="btn btn-primary"
                    onClick={handlePageNavigation}
                  >
                    Go
                  </button>
                </div>
              </nav>
            </>
          ) : (
            <form onSubmit={handleSave} className="row">
              <div className="form-group col-md-4">
                <label>
                  Institute Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.instituteName}
                  onChange={(e) =>
                    setFormData({ ...formData, instituteName: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-4">
                <label>
                  Institute Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.instituteCode}
                  onChange={(e) =>
                    setFormData({ ...formData, instituteCode: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-12 mt-2 d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={!isFormValid}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Reports Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Institute Reports</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Report feature will be implemented...</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmDialog.isOpen && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Change</h5>
                <button
                  className="btn-close"
                  onClick={() => handleConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to{" "}
                  {confirmDialog.newStatus === "y" ? "activate" : "deactivate"}{" "}
                  <strong>
                    {
                      instituteData.find(
                        (i) => i.id === confirmDialog.instituteId
                      )?.instituteName
                    }
                  </strong>
                  ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirm(false)}
                >
                  No
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfirm(true)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteMaster;
